const express = require('express');
const { DeliveryPerson, Order } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/persons', auth, async (_req, res) => {
  res.json(await DeliveryPerson.find().sort({ name: 1 }));
});

router.post('/persons', auth, adminOnly, async (req, res) => {
  const p = await DeliveryPerson.create({
    name: req.body.name,
    phone: req.body.phone || '',
  });
  res.status(201).json(p);
});

router.delete('/persons/:id', auth, adminOnly, async (req, res) => {
  await DeliveryPerson.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

router.get('/stats', auth, async (req, res) => {
  const { period = 'month' } = req.query;
  const now = new Date();
  let start = new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === 'day') start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === 'week') {
    start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
  }

  const orders = await Order.find({ createdAt: { $gte: start } });

  const byChannel = {};
  const byPerson = {};
  for (const o of orders) {
    const ch = o.channel || 'local';
    byChannel[ch] = (byChannel[ch] || 0) + (o.total || 0);
    if (o.deliveryPersonId) {
      const id = o.deliveryPersonId.toString();
      byPerson[id] = (byPerson[id] || 0) + (o.total || 0);
    } else if (o.deliveryStaffName) {
      const k = 'name:' + o.deliveryStaffName;
      byPerson[k] = (byPerson[k] || 0) + (o.total || 0);
    }
  }

  const persons = await DeliveryPerson.find();
  const personNames = Object.fromEntries(persons.map((p) => [p._id.toString(), p.name]));

  res.json({
    period,
    from: start,
    byChannel,
    byPerson: Object.entries(byPerson).map(([id, total]) => ({
      id,
      name: id.startsWith('name:') ? id.slice(5) : personNames[id] || id,
      total,
    })),
  });
});

module.exports = router;
