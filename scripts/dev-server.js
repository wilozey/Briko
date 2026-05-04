import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 3000);
const root = fileURLToPath(new URL("..", import.meta.url));

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function send(response, code, body, type = "text/plain; charset=utf-8") {
  response.writeHead(code, { "Content-Type": type });
  response.end(body);
}

createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  const pathname =
    url.pathname === "/" || url.pathname === "/plantinel/"
      ? "/public/plantinel/index.html"
      : url.pathname.startsWith("/plantinel/")
        ? `/public${url.pathname}`
        : url.pathname;
  const filePath = normalize(join(root, pathname));

  if (!filePath.startsWith(root)) {
    send(response, 403, "Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    send(response, 200, body, mime[extname(filePath)] || "application/octet-stream");
  } catch {
    send(response, 404, "Not found");
  }
}).listen(port, () => {
  console.log(`Plantinel MVP dev server running at http://localhost:${port}`);
});
