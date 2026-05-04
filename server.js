import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const dataDir = join(root, "data");
const dataFile = join(dataDir, "briko-data.json");
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png"
};

async function ensureDataFile() {
  if (!existsSync(dataDir)) await mkdir(dataDir, { recursive: true });
  if (!existsSync(dataFile)) {
    await writeFile(dataFile, JSON.stringify({ artisans: [], jobs: [], sequence: 1043 }, null, 2));
  }
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  if (!body) return {};
  return JSON.parse(body);
}

function sendJson(response, status, value) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(value, null, 2));
}

function sendError(response, status, message) {
  sendJson(response, status, { error: message });
}

async function handleApi(request, response) {
  await ensureDataFile();

  if (request.url === "/api/health") {
    sendJson(response, 200, { ok: true, name: "Briko Service OS" });
    return;
  }

  if (request.url === "/api/state" && request.method === "GET") {
    const data = await readFile(dataFile, "utf8");
    sendJson(response, 200, JSON.parse(data));
    return;
  }

  if (request.url === "/api/state" && request.method === "PUT") {
    const data = await readJsonBody(request);
    if (!Array.isArray(data.jobs) || !Array.isArray(data.artisans)) {
      sendError(response, 400, "State must include jobs and artisans arrays.");
      return;
    }
    await writeFile(dataFile, JSON.stringify(data, null, 2));
    sendJson(response, 200, { ok: true });
    return;
  }

  sendError(response, 404, "API route not found.");
}

async function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  const staticPath =
    url.pathname === "/plantinel/"
      ? "/public/plantinel/index.html"
      : url.pathname.startsWith("/plantinel/")
        ? `/public${url.pathname}`
        : url.pathname;
  const pathname = decodeURIComponent(staticPath === "/" ? "/index.html" : staticPath);
  const requested = normalize(join(root, pathname));

  if (!requested.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(requested);
    const type = contentTypes[extname(requested)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  try {
    if ((request.url || "").startsWith("/api/")) {
      await handleApi(request, response);
      return;
    }
    await serveStatic(request, response);
  } catch (error) {
    sendError(response, 500, error instanceof Error ? error.message : "Unknown server error");
  }
});

server.listen(port, () => {
  console.log(`Briko Service OS running at http://localhost:${port}`);
});
