const express = require('express');
const { Partner } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (_req, res) => {
  const list = await Partner.find().sort({ sortOrder: 1 });
  res.json(list);
});

router.put('/', auth, adminOnly, async (req, res) => {
  const list = req.body;
  if (!Array.isArray(list)) return res.status(400).json({ error: 'Array requerido' });
  const sum = list.reduce((s, p) => s + Number(p.percentage), 0);
  if (Math.abs(sum - 100) > 0.01) {
    return res.status(400).json({ error: 'La suma de porcentajes debe ser 100%' });
  }
  await Partner.deleteMany({});
  for (let i = 0; i < list.length; i++) {
    await Partner.create({
      name: list[i].name,
      percentage: list[i].percentage,
      sortOrder: i,
    });
  }
  const out = await Partner.find().sort({ sortOrder: 1 });
  res.json(out);
});

router.post('/', auth, adminOnly, async (req, res) => {
  const n = await Partner.countDocuments();
  const p = await Partner.create({
    name: req.body.name || 'Socio',
    percentage: Number(req.body.percentage) || 0,
    sortOrder: n,
  });
  res.status(201).json(p);
});

module.exports = router;
