# QR Time-Tracking

Minimal QR-based time-tracking service (Spring Boot backend + React frontend).

Quick run (dev, H2):

1. Set QR secret and optional expiry (example PowerShell):

   $env:QR_SECRET = "replace_with_secret"; $env:QR_EXPIRATION_SECONDS = "300"

2. Start backend (from `backend/`):

   mvn -f backend/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev

3. Start frontend (from `frontend/`):

   cd frontend; npm install; npm run dev

Endpoints (backend):
- POST /api/qrcode/in — body: { "userId": "alice" } → returns { payload, signature, qrImage }
- POST /api/qrcode/out — same as /in but action=OUT
- POST /api/scan — body: { "payload": "...", "signature": "..." } → validates signature and expiry, persists time log

Docker Compose (production with Postgres):
- Provide env vars in `.env` or environment: QR_SECRET, QR_EXPIRATION_SECONDS, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB.
- Run: docker-compose up --build

Tests:
- Backend: mvn -f backend/pom.xml test

Environment vars required:
- QR_SECRET (required)
- QR_EXPIRATION_SECONDS (optional, default 300)
- For Postgres in compose: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB

