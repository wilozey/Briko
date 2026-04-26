# Briko Service OS

Local operations-first MVP for Briko.

## Run

Use Node.js from the workspace runtime or any installed Node 20+:

```powershell
node server.js
```

Then open:

```text
http://localhost:4173
```

## What It Includes

- Static frontend served by `server.js`.
- Health check at `/api/health`.
- State API at `/api/state`.
- JSON persistence in `data/briko-data.json`.
- Browser fallback when opened directly from `index.html`.

