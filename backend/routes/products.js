const express = require('express');
const { Product } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (_req, res) => {
  const products = await Product.find({ active: true }).sort({ category: 1, name: 1 });
  res.json(products);
});

router.get('/all', auth, adminOnly, async (_req, res) => {
  const products = await Product.find().sort({ category: 1, name: 1 });
  res.json(products);
});

router.post('/', auth, adminOnly, async (req, res) => {
  const p = new Product(req.body);
  await p.save();
  res.status(201).json(p);
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { active: false });
  res.json({ ok: true });
});

module.exports = router;
