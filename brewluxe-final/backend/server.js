const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simple in-memory store (non-persistent)
const orders = new Map();

function estimateReadyMinutes() {
  // simple estimator: 10 - 25 minutes
  return Math.floor(Math.random() * 16) + 10;
}

function getOrderStatus(createdAt, etaMinutes) {
  const elapsed = (Date.now() - new Date(createdAt).getTime()) / 1000 / 60; // minutes
  const totalTime = etaMinutes;
  const progress = elapsed / totalTime;

  if (progress < 0.25) return 'received';
  if (progress < 0.55) return 'preparing';
  if (progress < 0.85) return 'quality_check';
  return 'ready';
}

app.post('/api/orders', (req, res) => {
  try {
    const payload = req.body || {};
    const id = String(Date.now());
    const eta = estimateReadyMinutes();
    const order = {
      id,
      createdAt: new Date().toISOString(),
      etaMinutes: eta,
      status: 'received',
      payload
    };

    orders.set(id, order);

    // return minimal order confirmation
    res.json({ ok: true, id, etaMinutes: eta });
  } catch (err) {
    console.error('Failed to create order', err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  const id = req.params.id;
  if (!orders.has(id)) return res.status(404).json({ ok: false, error: 'Order not found' });
  
  const order = orders.get(id);
  const status = getOrderStatus(order.createdAt, order.etaMinutes);
  const elapsed = (Date.now() - new Date(order.createdAt).getTime()) / 1000 / 60;
  const remaining = Math.max(1, Math.ceil(order.etaMinutes - elapsed));

  res.json({ ok: true, order: {
    id: order.id,
    status,
    etaMinutes: remaining,
    createdAt: order.createdAt,
    progress: Math.min(100, Math.round((elapsed / order.etaMinutes) * 100))
  }});
});

app.get('/api/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));

app.listen(PORT, () => {
  console.log(`Brewluxe backend running on http://localhost:${PORT}`);
});
