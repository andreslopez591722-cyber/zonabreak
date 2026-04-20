const express = require('express');
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const router = express.Router();

// ── SCHEMAS ─────────────────────────────────────────────────
const costIngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchasePrice: { type: Number, default: 0 },
  purchaseQty: { type: Number, default: 1 },
  unit: { type: String, default: 'unid' },
  costPerUnit: { type: Number, default: 0 },
}, { timestamps: true });

const costPlateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: '' },
  salePrice: { type: Number, default: 0 },
  totalCost: { type: Number, default: 0 },
  recipe: [{
    ingredientId: String,
    name: String,
    qty: Number,
    unit: String,
    costPerUnit: Number,
    lineCost: Number,
  }],
}, { timestamps: true });

const CostIngredient = mongoose.models.CostIngredient || mongoose.model('CostIngredient', costIngredientSchema);
const CostPlate = mongoose.models.CostPlate || mongoose.model('CostPlate', costPlateSchema);

// ── INGREDIENTS ─────────────────────────────────────────────
router.get('/ingredients', auth, async (_req, res) => {
  res.json(await CostIngredient.find().sort({ name: 1 }));
});
router.post('/ingredients', auth, async (req, res) => {
  const item = await CostIngredient.create(req.body);
  res.status(201).json(item);
});
router.delete('/ingredients/:id', auth, async (req, res) => {
  await CostIngredient.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// ── PLATES ──────────────────────────────────────────────────
router.get('/plates', auth, async (_req, res) => {
  res.json(await CostPlate.find().sort({ name: 1 }));
});
router.post('/plates', auth, async (req, res) => {
  const plate = await CostPlate.create(req.body);
  res.status(201).json(plate);
});
router.put('/plates/:id', auth, async (req, res) => {
  const plate = await CostPlate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(plate);
});
router.delete('/plates/:id', auth, async (req, res) => {
  await CostPlate.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
