# QR Time-Tracking

Minimal QR-based time-tracking service: Spring Boot backend + React frontend.

This README explains how to run the app locally (Docker Compose), how to simulate scanning the generated QR codes (no camera required), how to connect an IDE to the Postgres database, and useful developer commands.

Checklist
- [x] Run the app with Docker Compose (Postgres, backend, frontend)
- [x] Generate QR codes from the frontend
- [x] Simulate a scan without a physical scanner
- [x] Inspect persisted time logs in the database and from the frontend

Prerequisites
- Docker & Docker Compose installed
- (Optional) Java/Maven and Node if you want to run services locally without Docker

Ports used by docker-compose
- Frontend (nginx): http://localhost:3000
- Backend (Spring Boot): http://localhost:8080
- Postgres (container) → exposed on host port 5433 to avoid conflicts with any local Postgres: 127.0.0.1:5433

Quick start (recommended: Docker Compose)
1. Copy or set required env vars (you can create a `.env` next to `docker-compose.yml`):

   ```env
   QR_SECRET=replace_with_a_strong_secret
   QR_EXPIRATION_SECONDS=300
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=qrcode
   ```

   Note: The project currently exposes the DB on host port 5433 so it won't conflict with a host Postgres.

2. Start everything:

   ```powershell
   docker-compose up --build -d
   ```

3. Open the frontend: http://localhost:3000

Local development (no Docker)
- Backend: from `backend/` run
  ```bash
  mvn -f backend/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev
  ```
- Frontend: from `frontend/` run
  ```bash
  npm install
  npm run dev
  ```

What the frontend does
- Clicking "Einstempeln" or "Ausstempeln" requests a QR from the backend and displays the QR image.
- The backend response includes the raw `payload` and `signature` along with `qrImage`.
- A new "Simuliere Scan" button lets you simulate a separate device scanning that QR: it POSTs `{ payload, signature }` to `/api/scan` and the backend will validate and persist a `time_logs` entry.

Simulate a scan manually (curl / Postman)
1. Generate QR (frontend or curl):
   ```bash
   curl -s -X POST "http://localhost:8080/api/qrcode/in" -H "Content-Type: application/json" -d '{"userId":"alice"}'
   ```
   Save the returned `payload` and `signature`.

2. Simulate the scanner POST:
   ```bash
   curl -X POST "http://localhost:8080/api/scan" -H "Content-Type: application/json" -d '{"payload":"<payload>","signature":"<signature>"}'
   ```

3. Verify the log (API):
   ```bash
   curl -s "http://localhost:8080/api/timelogs?userId=alice"
   ```

Verify persisted rows in Postgres (via Docker)
- List databases and tables, and query `time_logs`:
  ```powershell
  docker-compose exec db psql -U postgres -c "\l"
  docker-compose exec db psql -U postgres -d qrcode -c "\dt"
  docker-compose exec db psql -U postgres -d qrcode -c "select id, user_id, action, timestamp from time_logs order by id desc;"
  ```

IDE (DataGrip / IntelliJ) connection settings
- Host: 127.0.0.1
- Port: 5433
- User: postgres
- Password: postgres
- Database: qrcode
- JDBC URL example: `jdbc:postgresql://127.0.0.1:5433/qrcode`

Troubleshooting
- If your IDE reports "database 'qrcode' does not exist":
  - Check that you're connecting to the container Postgres (port 5433) and not a different local Postgres on port 5432.
  - Run `docker-compose ps` to confirm containers are running.
  - List DBs from the container: `docker-compose exec db psql -U postgres -c "\l"`.
- If the backend fails on startup complaining about `QR_SECRET`: make sure `QR_SECRET` is set in your environment or `.env` and restart the stack.
- If frontend requests return 404 from nginx: ensure nginx proxy is configured (the provided `frontend/nginx.conf` proxies `/api` to the backend service) and that the backend container is running and healthy.

Developer notes
- Backend endpoints:
  - POST /api/qrcode/in — body: { "userId": "alice" } → returns { payload, signature, qrImage }
  - POST /api/qrcode/out — same as /in but action=OUT
  - POST /api/scan — body: { "payload": "..", "signature": ".." } → validates and persists a `time_logs` entry
  - GET /api/timelogs?userId=alice — list persisted logs for a user (used by the frontend to display logs)
- Database migrations are applied automatically by Flyway at startup (look in `backend/src/main/resources/db/migration`).

Running tests
- Backend unit tests:
  ```bash
  mvn -f backend/pom.xml test
  ```

Next steps / suggestions
- Add authentication and roles for scanning to avoid misuse.
- Improve log listing UI (filtering, date formatting, table view).
- Add e2e tests that generate a QR, simulate scan and verify DB rows.

If you want, I can add a small convenience script that:
- Generates a QR, extracts payload/signature and automatically posts to `/api/scan`, then prints the latest DB row — one command to validate end-to-end without a camera.
