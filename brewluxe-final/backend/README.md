# Brewluxe Backend (Minimal)

This folder contains a minimal Node/Express backend for Brewluxe with a simple in-memory orders API.

Quick start (PowerShell):

```powershell
cd backend
npm install
npm start
```

API endpoints:
- `POST /api/orders` — create an order. Body: JSON object (cart, customer info, total, type). Returns `{ ok: true, id, etaMinutes }`.
- `GET /api/orders/:id` — fetch order status.
- `GET /api/health` — health check.

Notes:
- This backend uses an in-memory Map and is not persistent. Use a database (MongoDB or PostgreSQL) for production.
- Port: default 3000. Set `PORT` env var to change.
