# Briko Product Blueprint

## Built MVP In This Folder

Open `index.html` to use the current local Briko Service OS build. It runs without a server and stores demo changes in browser local storage.

For the backend-backed version, run the local server and open `http://localhost:4173`. The server stores data in `data/briko-data.json` through `/api/state`.

Current working features:

- Command center with live metrics, attention jobs, and supply gaps.
- Customer intake form that creates traceable job cards.
- Dispatch board with status columns and editable job assignment.
- Artisan directory with filters, add-artisan form, activation, and verification controls.
- Trust queue for imported artisans, disputes, and unassigned jobs.
- Analytics for request funnel and category coverage.
- Strategy screen with naming options and build roadmap.
- Local Node backend with health check and state persistence API.

This is intentionally built as an operations-first MVP. It does not yet include real accounts, payments, SMS, WhatsApp sending, or production database storage.

## Reviewed Direction

Briko should launch first as a reliable service routing platform for Abidjan, then grow into a full marketplace. The strongest risk in the existing materials is not visual design. It is promising marketplace features before the operational loop is dependable.

The first dependable loop should be:

1. Customer submits a structured request.
2. Briko creates a traceable job card.
3. Staff or matching logic shortlists verified artisans.
4. Customer gets a clear next step through phone, WhatsApp, or dashboard.
5. Job outcome, quote, completion proof, review, and dispute state are recorded.

## Core MVP

- Customer request intake with service, problem, urgency, commune, contact, and optional photos.
- Admin request board with statuses: New, Contacted, Quoted, Scheduled, In progress, Done, Dispute, Closed.
- Artisan admin CRUD: add, edit, deactivate, verify, suspend, import CSV, merge duplicates.
- Directory filters by category, commune, rating, verification state, response time, and availability.
- Manual assignment when automatic matching is weak.
- No-results fallback: callback request instead of an empty result.
- Verified-job reviews only.
- Trust pages connected to real workflows: verification, guarantee, disputes, privacy, terms, review policy.

## Claims To Tighten Before Launch

- Use "estimated range" instead of "instant quote" until quote data is real.
- Use "available now" only when availability is recently confirmed.
- Use "Briko Guarantee" only for jobs booked and tracked through the platform.
- Do not show review counts unless every review is tied to a completed job.
- Hide unsupported service categories until supply exists.

## Better Design Principles

- Make the first screen operational, not marketing-heavy.
- Prioritize status, next action, owner, and trust state over decorative UI.
- Keep the customer path guided: service -> problem -> urgency -> location -> match -> confirmation.
- Give staff a fast manual fallback for weak matches.
- Show trust proof close to decisions: verification, jobs completed, response time, dispute record, service zones.

## Recommended Build Order

1. Fix broken pages, unsupported claims, and request confirmation.
2. Build request board, job cards, and admin ownership.
3. Build artisan CRUD, verification states, and CSV import.
4. Add filters, no-results fallback, and manual assignment.
5. Add real review/dispute workflows.
6. Add monitoring, backups, rate limits, and audit logs.
7. Add mobile money escrow or pre-authorization after job tracking is stable.
8. Add AI diagnosis and matching only as assisted, logged workflows with a kill switch.

## Naming Options

- Briko: strong working name; short, memorable, construction-adjacent.
- MainPro: clearer French-market signal around skilled hands and professionals.
- FixiCI: more modern, repair-led, locally anchored to Cote d'Ivoire.
- ProxiMains: warmer trust-led name, focused on nearby skilled help.

My recommendation is to keep Briko for now while testing demand. Rename only if customer interviews show confusion or weak trust.

## Initial Success Metrics

- Request completion rate.
- Time from request to first human response.
- Request-to-match success rate.
- Artisan response rate.
- Jobs completed through Briko.
- Verified review percentage.
- Dispute rate and resolution time.
- Coverage gaps by commune and category.
