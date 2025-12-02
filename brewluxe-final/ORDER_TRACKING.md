# Real-Time Order Tracking

## Overview
The BREWLUXE frontend now includes real-time order tracking that displays order status updates as they progress through the preparation pipeline.

## Features

### Order Confirmation Screen
After placing an order, users see:
- Order ID
- Current status (Received → Preparing → QA Check → Ready)
- Progress bar (10% → 40% → 70% → 100%)
- Estimated pickup time
- "View Details" button to open full tracking modal

### Full Tracking Modal
Click the 📍 icon or "View Details" to open the tracking modal:
- Order ID and current status
- 4-stage progress visualization (📋 → 👨‍🍳 → ✔️ → ✅)
- Live ETA countdown
- Update log showing timeline of status changes

### How It Works

#### With Backend Running
1. Order is submitted to `POST http://localhost:3000/api/orders`
2. Backend returns order ID and ETA
3. Frontend polls `GET http://localhost:3000/api/orders/:id` every 5 seconds
4. Status updates are reflected in real-time (live backend data)
5. Polling stops after order is complete or 45 minutes elapse

#### Without Backend (Offline Mode)
1. Order is created locally with a simulated ID (`sim-<timestamp>`)
2. Status progression is simulated every 8 seconds
3. Stages automatically advance: received → preparing → quality_check → ready
4. ETA countdown decreases as stages progress
5. Update log records all status changes with timestamps

## Tracking Statuses

| Status | Icon | Progress |
|--------|------|----------|
| received | ✓ | 10% |
| preparing | 👨‍🍳 | 40% |
| quality_check | ✔️ | 70% |
| ready | ✅ | 100% |

## Backend Integration

### API Endpoint
```
GET /api/orders/:id
Response: { ok: true, order: { id, status, etaMinutes } }
```

### Status Values
- `received` — Order received and queued
- `preparing` — Being prepared by barista
- `quality_check` — QA verification
- `ready` — Ready for pickup/delivery

## Testing Locally

1. **With Backend:**
   ```powershell
   cd backend
   npm install
   npm start
   ```
   Then place an order and watch real-time updates.

2. **Without Backend:**
   Just place an order. The app will simulate status progression automatically every 8 seconds.

## Implementation Notes

- Tracking data is stored in `localStorage` so users can check status later
- Polling stops after 45 minutes or when order reaches "ready" status
- Multiple active orders can be tracked (each gets its own polling interval)
- If backend is unavailable, local simulation ensures smooth UX
