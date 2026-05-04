# Briko Services Dispatch Board V2

Modern React dashboard for Briko Services, a home-service dispatch platform.

## Run

Use Node.js from the workspace runtime or any installed Node 20+:

```powershell
node server.js
```

Then open:

```text
http://localhost:4173
```

## UI Scope

- React ES-module frontend.
- Tailwind CDN utility styling.
- Lucide React icons.
- Static mock dispatch data in `src/mockData.js`.
- Component structure:
  - `Sidebar`
  - `TopBar`
  - `DispatchBoard`
  - `DispatchColumn`
  - `JobCard`
  - `JobDetailPanel`
  - `KpiBar`
  - `StrategyPanel`
  - `ColorSwatch`

## Current Features

- Premium dark-green Briko Services sidebar.
- Supplied Briko Services logo asset in `public/assets/briko-services-logo.png`.
- Searchable dispatch board.
- Five kanban columns: New, Contacted, Quoted, Scheduled, In progress.
- Clickable job cards that update the right-side detail panel.
- Urgency color states for emergency, today, scheduled, normal, and in progress.
- Bottom KPI cards.
- Compact strategy, design decisions, and color system panels.
- Responsive layout that stacks the detail panel under the board on smaller screens.

## Supabase Typed API Layer Scaffold

Created fetch-safe typed API modules for a Plantinel MVP scaffold:

- `src/lib/supabase/types.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/api/plants.ts`
- `src/lib/api/remedies.ts`
- `src/lib/api/cards.ts`
- `src/lib/api/collections.ts`
- `src/lib/api/journal.ts`
- `src/lib/api/community.ts`
- `src/lib/api/marketplace.ts`
- `src/lib/api/ai-runs.ts`

Each API module exports CRUD helpers returning `{ data, error }` and catches runtime errors.

The Plantinel mock UI is available at `/plantinel/` when the local server is running.

TODOs are included where real dependency installation and exact SQL-derived table types should be applied.
