const express = require('express');
const { Order, Product, Inventory } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

function genCode() {
  return 'ZB-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 4).toUpperCase();
}

async function deductInventory(order) {
  for (const line of order.items) {
    if (!line.productId) continue;
    const prod = await Product.findById(line.productId);
    if (!prod || !prod.stockDeduct?.length) continue;
    for (const d of prod.stockDeduct) {
      const inv = await Inventory.findOne({ key: d.ingredientKey });
      if (!inv) continue;
      let dec = d.amount * line.qty;
      if (d.unit === 'g' || d.unit === 'ml') dec = dec / 1000;
      inv.stock = Math.max(0, inv.stock - dec);
      await inv.save();
    }
  }
}

router.post('/', async (req, res) => {
  try {
    const io = req.app.get('io');
    const body = req.body;
    const subtotal = (body.items || []).reduce((s, i) => s + i.price * i.qty, 0);
    const servicePct = Number(body.servicePct || 0);
    const serviceCharge = Math.round(subtotal * (servicePct / 100));
    const total = subtotal + serviceCharge;

    const order = new Order({
      code: genCode(),
      source: body.source || 'pos',
      channel: body.channel || 'local',
      deliveryPersonId: body.deliveryPersonId || null,
      deliveryStaffName: body.deliveryStaffName || '',
      customerName: body.customerName || '',
      customerPhone: body.customerPhone || '',
      address: body.address || '',
      notes: body.notes || '',
      paymentMethod: body.paymentMethod || 'Efectivo',
      items: body.items || [],
      subtotal,
      serviceCharge,
      total,
      status: body.status || 'confirmed',
      createdBy: body.createdBy || 'Web',
    });
    await order.save();
    await deductInventory(order);

    if (io) io.emit('order:new', { order: order.toObject() });

    res.status(201).json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/', auth, async (req, res) => {
  const { from, to, limit = 200 } = req.query;
  const q = {};
  if (from || to) {
    q.createdAt = {};
    if (from) q.createdAt.$gte = new Date(from);
    if (to) q.createdAt.$lte = new Date(to);
  }
  const orders = await Order.find(q).sort({ createdAt: -1 }).limit(Number(limit));
  res.json(orders);
});

router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  const status = req.body.status;
  const allowed = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Estado inválido' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  const io = req.app.get('io');
  if (io && order) io.emit('order:update', { order });
  res.json(order);
});

module.exports = router;
