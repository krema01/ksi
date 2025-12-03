# HISTORY — How this project was created (AI-assisted)

Date: 2025-12-03

This document summarizes how we progressed from an empty task to the working QR Time-Tracker product you have in the repository. It records decisions, edits, troubleshooting steps, commands used, and the feedback loop during development. The work was done by the AI assistant in collaboration with the human reviewer (you), incorporating your environment details and live feedback.

---

Summary

- Goal: Build a minimal QR-based time-tracking application (Spring Boot backend + React frontend), run it locally with Postgres in Docker, and provide a way to exercise the full scanning → persistence flow without a separate camera device.
- Outcome: A working Docker Compose stack (Postgres, backend, frontend) with a styled React frontend that can generate QR payloads, a backend that signs and validates QR payloads, a simulated-scan workflow, and developer documentation and tools to verify persistence.

---

High-level timeline & major milestones

1) Initial inspection
   - The project skeleton (backend and frontend) existed in the workspace. I inspected key files (`docker-compose.yml`, `backend/src/.../QrController.java`, `frontend/Dockerfile`, `frontend/vite.config.js` and main React components).

2) Debugging network 404s (frontend → backend)
   - Problem: When the built frontend (served by nginx in Docker) attempted to call `/api/...`, nginx returned 404 because the static server had no proxy set for `/api`.
   - Decision: Add an `nginx.conf` to proxy `/api` requests to the `backend` service inside Docker Compose, so the frontend can remain same-origin and avoid CORS.
   - Files added/changed:
     - `frontend/nginx.conf` (new) — reverse-proxy `/api` → `http://backend:8080`
     - `frontend/Dockerfile` — copy the new nginx conf into the nginx image
     - `frontend/vite.config.js` — set dev proxy to `http://localhost:8080` (was pointing to 8081)

3) Misc housekeeping
   - Added `.gitignore` at the repository root to ignore typical Java/Maven and Node artifacts.

4) Environment variable issue: backend crashed on startup
   - Symptom: backend logs contained `IllegalStateException: QR_SECRET env var must be set`.
   - Fix: Set a `QR_SECRET` value so the backend's HMAC initialization succeeds. This was supplied in `docker-compose.yml` (or `.env` can be used); the quick fix was to set `QR_SECRET` in the compose environment for the `backend` service.
   - Note: For production, the secret should be provided securely (not committed to the repo) — use environment files, Vault, or Docker secrets.

5) Database wiring (Postgres) and developer IDE connectivity
   - The Compose stack included a `db` service (Postgres 15). Initially, attempts to connect to the DB in the IDE showed a mismatch — the IDE was targeting the host's own Postgres on port 5432 and reported `database "qrcode" does not exist`.
   - To avoid conflict with any host Postgres, I remapped the container to host port `5433` in `docker-compose.yml` (`ports: - "5433:5432"`). That made it straightforward to connect the IDE to `127.0.0.1:5433` and see the `qrcode` DB and `time_logs` table (created by Flyway migration in the backend).
   - Commands used to inspect the DB:
     - `docker-compose exec db psql -U postgres -c "\l"`
     - `docker-compose exec db psql -U postgres -d qrcode -c "\dt"`
     - `docker-compose exec db psql -U postgres -d qrcode -c "select id, user_id, action, timestamp from time_logs;"`

6) Enable testable scan/persistence without a camera
   - Goal: Clicking the frontend buttons should only *generate* QR data. A separate device/scan should trigger the actual persistence.
   - Implementation steps:
     - The backend already returned `payload` and `signature` along with `qrImage` in `QrResponse`.
     - I added a GET endpoint `GET /api/timelogs?userId=...` to allow listing persisted logs.
     - I updated the frontend (`frontend/src/App.jsx`) to:
       - Store the returned `payload` and `signature` when generating a QR.
       - Add a `Simuliere Scan` button to POST `{ payload, signature }` to `/api/scan` (this simulates the separate scanner device).
       - Add a `Lade Logs` button to fetch `/api/timelogs` and display persisted logs.
     - Frontend styling: added `App.css`, updated `index.css`, and reorganized styling for a more inviting UI.

7) Rebuilds and validation
   - After each change to frontend or backend, I rebuilt the images and restarted the stack with:
     - `docker-compose up --build -d` (or `docker-compose build --no-cache frontend` when forcing frontend rebuilds)
   - I validated endpoints with curl (or running curl inside Docker network if host curl had quoting/alias issues):
     - `curl -X POST http://localhost:8080/api/qrcode/in -H "Content-Type: application/json" -d '{"userId":"alice"}'`
     - `curl -X POST http://localhost:8080/api/scan -H "Content-Type: application/json" -d '{"payload":"...","signature":"..."}'`
     - `curl http://localhost:8080/api/timelogs?userId=alice`
   - Verified persistence by querying Postgres (see commands above).

8) Documentation and convenience
   - I updated `README.md` with full run instructions, simulation steps, and IDE connection details.
   - I added a `HISTORY.md` to summarize the process (this file).

9) Frontend: nicer formatting and paging for time-log list
   - Motivation: The previous log display was a simple list; you asked for a nicer, paginated, and more readable presentation so you can browse time logs easily.
   - Implementation:
     - Converted the simple list into a compact table with columns (Timestamp, User, Action).
     - Added client-side paging with a page-size selector (5/10/20) and Prev/Next controls.
     - Added formatted timestamps (localized) and a refresh control.
     - Files changed:
       - `frontend/src/App.jsx` — updated to fetch logs into a sorted array, compute pagination, format timestamps, and render a table + pagination controls.
       - `frontend/src/App.css` — added styles for `.logs-table`, `.pagination`, and related controls to match the app theme.
     - UX notes: The refresh action resets to page 1 and preserves a compact card layout; tables use alternating row backgrounds and clear headers for readability.

---

Files added and main edits (snapshot)

- Added:
  - `frontend/nginx.conf` — nginx reverse-proxy for `/api`
  - `frontend/src/App.css` (initial) and updated `frontend/src/index.css` — improved styling
  - `frontend/src/App.jsx` (initial UI changes) — UI changes: payload/signature capture, simulate scan, show logs
  - `.gitignore` — repo ignores
  - `README.md` — extended run / debug docs
  - `HISTORY.md` — this file

- Modified:
  - `frontend/Dockerfile` — copy `nginx.conf` into nginx image
  - `frontend/vite.config.js` — dev proxy -> `http://localhost:8080`
  - `docker-compose.yml` — set `QR_SECRET` (for convenience in compose) and map Postgres host port to `5433`
  - `backend/src/main/java/com/example/qrcode/controller/QrController.java` — injected `TimeLogRepository` and added `GET /api/timelogs`
  - `frontend/src/App.jsx` — updated again to add table view and client-side pagination for logs
  - `frontend/src/App.css` — updated again to add table and pagination styles

---

Decisions & rationale

- Proxy vs CORS: I added an nginx reverse-proxy for `/api` to keep the built frontend same-origin and avoid CORS complexity. For local dev, `vite` proxy configuration was fixed to point at the backend.

- Exposing Postgres on 5433: This avoids clashing with a host Postgres instance (typical on development machines), and makes IDE configuration explicit (127.0.0.1:5433).

- Simulation endpoint / UI: Keeping the generation and scan steps separated matches the real-world flow (one device generates a QR, another device scans it) and allows testing via a simulated scanner.

---

Commands & quick snippets (useful cheatsheet)

Start the stack:

```powershell
docker-compose up --build -d
```

Generate QR (returns payload + signature):

```bash
curl -s -X POST "http://localhost:8080/api/qrcode/in" -H "Content-Type: application/json" -d '{"userId":"alice"}'
```

Simulate scanner POST:

```bash
curl -X POST "http://localhost:8080/api/scan" -H "Content-Type: application/json" -d '{"payload":"<payload>","signature":"<signature>"}'
```

List persisted logs (API):

```bash
curl -s "http://localhost:8080/api/timelogs?userId=alice"
```

Inspect Postgres directly (via docker-compose):

```powershell
docker-compose exec db psql -U postgres -c "\l"
docker-compose exec db psql -U postgres -d qrcode -c "\dt"
docker-compose exec db psql -U postgres -d qrcode -c "select id, user_id, action, timestamp from time_logs order by id desc;"
```

IDE (DataGrip / IntelliJ) connection example

- Host: `127.0.0.1`
- Port: `5433`
- User: `postgres`
- Password: `postgres`
- Database: `qrcode`
- JDBC URL: `jdbc:postgresql://127.0.0.1:5433/qrcode`

---

Lessons learned & suggestions

- Keep runtime secrets (like `QR_SECRET`) out of committed compose files. Use a `.env` file excluded via `.gitignore`, or use a secret manager.
- When frontend is served by a static server (nginx), local dev proxies (Vite) won't help the built production bundle — add an nginx proxy or a runtime reverse-proxy for the containerized build.
- Map container ports carefully during development to avoid colliding with host services (Postgres on 5432 is common).
- Small convenience UI helpers (like "Simulate Scan") accelerate testing and verification.
- Consider adding automated e2e tests that generate a QR, simulate a scan, and verify DB persistence. This would catch regressions and prove the full integration.

---

Acknowledgements

This repository was implemented and iterated by an AI assistant with continuous feedback from the human reviewer. The HISTORY above documents choices made during that collaborative workflow and includes the primary commands and file edits needed to reproduce the final running system.

If you want, I can:
- Add the one-command convenience script that automates generate→scan→verify,
- Add nicer formatting and paging for the frontend time-log list,
- Extract secrets to an `.env.example` and add run scripts.
