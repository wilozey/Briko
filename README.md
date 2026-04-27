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
- Searchable dispatch board.
- Five kanban columns: New, Contacted, Quoted, Scheduled, In progress.
- Clickable job cards that update the right-side detail panel.
- Urgency color states for emergency, today, scheduled, normal, and in progress.
- Bottom KPI cards.
- Compact strategy, design decisions, and color system panels.
- Responsive layout that stacks the detail panel under the board on smaller screens.

