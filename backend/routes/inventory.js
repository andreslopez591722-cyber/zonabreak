const express = require('express');
const { Inventory } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (_req, res) => {
  const list = await Inventory.find().sort({ name: 1 });
  res.json(list);
});

router.post('/', auth, adminOnly, async (req, res) => {
  const key = String(req.body.key || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
  if (!key) return res.status(400).json({ error: 'key requerido' });
  const exists = await Inventory.findOne({ key });
  if (exists) return res.status(409).json({ error: 'Ya existe ese código' });
  const inv = await Inventory.create({
    key,
    name: req.body.name || key,
    unit: req.body.unit || 'kg',
    stock: Number(req.body.stock) || 0,
    minStock: Number(req.body.minStock) || 0,
    costPerUnit: Number(req.body.costPerUnit) || 0,
  });
  res.status(201).json(inv);
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  const inv = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(inv);
});

router.post('/adjust', auth, adminOnly, async (req, res) => {
  const { key, op, amount } = req.body;
  const inv = await Inventory.findOne({ key });
  if (!inv) return res.status(404).json({ error: 'No encontrado' });
  const n = Number(amount);
  if (op === 'add') inv.stock += n;
  else if (op === 'set') inv.stock = n;
  else if (op === 'sub') inv.stock = Math.max(0, inv.stock - n);
  await inv.save();
  res.json(inv);
});

module.exports = router;
