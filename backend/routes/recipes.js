const express = require('express');
const { Product, Inventory } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/recipes
 * Devuelve todos los productos activos que tienen ingredientes (recetas).
 * Enriquece cada producto con el costo calculado de sus ingredientes.
 */
router.get('/', auth, async (_req, res) => {
  try {
    const products = await Product.find({ active: true }).sort({ category: 1, name: 1 });
    const inventory = await Inventory.find();
    const costByKey = Object.fromEntries(
      inventory.map(i => [i.key, { costPerUnit: Number(i.costPerUnit) || 0, unit: i.unit, name: i.name }])
    );

    const recipes = products
      .filter(p => p.stockDeduct && p.stockDeduct.length > 0)
      .map(p => {
        let totalCost = 0;
        const ingredients = (p.stockDeduct || []).map(d => {
          const inv = costByKey[d.ingredientKey];
          let amount = d.amount;
          let costUnit = inv ? inv.costPerUnit : 0;
          // Convertir g→kg y ml→litro para el cálculo de costo
          if (d.unit === 'g') { amount = d.amount / 1000; costUnit = inv ? inv.costPerUnit : 0; }
          if (d.unit === 'ml') { amount = d.amount / 1000; costUnit = inv ? inv.costPerUnit : 0; }
          const lineCost = amount * costUnit;
          totalCost += lineCost;
          return {
            key: d.ingredientKey,
            name: inv ? inv.name : d.ingredientKey,
            amount: d.amount,
            unit: d.unit,
            costPerUnit: inv ? inv.costPerUnit : 0,
            lineCost: Math.round(lineCost),
          };
        });
        const margin = p.price > 0 ? Math.round(((p.price - totalCost) / p.price) * 100) : 0;
        return {
          _id: p._id,
          name: p.name,
          category: p.category,
          price: p.price,
          emoji: p.emoji,
          ingredients,
          totalCost: Math.round(totalCost),
          grossProfit: Math.round(p.price - totalCost),
          margin,
        };
      });

    res.json(recipes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/recipes/:productId
 * Receta detallada de un producto específico.
 */
router.get('/:productId', auth, async (req, res) => {
  try {
    const p = await Product.findById(req.params.productId);
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });

    const inventory = await Inventory.find();
    const costByKey = Object.fromEntries(
      inventory.map(i => [i.key, { costPerUnit: Number(i.costPerUnit) || 0, unit: i.unit, name: i.name, stock: i.stock }])
    );

    let totalCost = 0;
    const ingredients = (p.stockDeduct || []).map(d => {
      const inv = costByKey[d.ingredientKey];
      let amount = d.amount;
      if (d.unit === 'g') amount = d.amount / 1000;
      if (d.unit === 'ml') amount = d.amount / 1000;
      const costUnit = inv ? inv.costPerUnit : 0;
      const lineCost = amount * costUnit;
      totalCost += lineCost;
      return {
        key: d.ingredientKey,
        name: inv ? inv.name : d.ingredientKey,
        amount: d.amount,
        unit: d.unit,
        costPerUnit: costUnit,
        lineCost: Math.round(lineCost),
        currentStock: inv ? inv.stock : null,
      };
    });

    res.json({
      _id: p._id,
      name: p.name,
      category: p.category,
      price: p.price,
      emoji: p.emoji,
      description: p.description,
      imageUrl: p.imageUrl,
      ingredients,
      totalCost: Math.round(totalCost),
      grossProfit: Math.round(p.price - totalCost),
      margin: p.price > 0 ? Math.round(((p.price - totalCost) / p.price) * 100) : 0,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * PUT /api/recipes/:productId
 * Actualiza los ingredientes (stockDeduct) de un producto.
 * Body: { stockDeduct: [ { ingredientKey, amount, unit } ] }
 */
router.put('/:productId', auth, adminOnly, async (req, res) => {
  try {
    const { stockDeduct } = req.body;
    if (!Array.isArray(stockDeduct)) {
      return res.status(400).json({ error: 'stockDeduct debe ser un array' });
    }
    const p = await Product.findByIdAndUpdate(
      req.params.productId,
      { stockDeduct },
      { new: true }
    );
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ ok: true, product: p });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
