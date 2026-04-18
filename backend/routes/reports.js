const express = require('express');
const { Order, Expense, Product, Partner, Inventory } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

function startEnd(period) {
  const now = new Date();
  let start;
  let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  if (period === 'day') {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  } else if (period === 'week') {
    start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }
  return { start, end };
}

router.get('/sales', auth, async (req, res) => {
  const period = req.query.period || 'month';
  const { start, end } = startEnd(period);
  const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });
  const income = orders.reduce((s, o) => s + (o.total || 0), 0);

  let costOfSales = 0;
  const products = await Product.find();
  const invList = await Inventory.find();
  const costByKey = Object.fromEntries(invList.map((i) => [i.key, Number(i.costPerUnit) || 0]));
  const priceMap = Object.fromEntries(products.map((p) => [p._id.toString(), p]));

  for (const o of orders) {
    for (const line of o.items || []) {
      const pid = line.productId?.toString();
      const prod = pid ? priceMap[pid] : null;
      if (prod && prod.stockDeduct?.length) {
        for (const d of prod.stockDeduct) {
          let dec = d.amount * line.qty;
          if (d.unit === 'g' || d.unit === 'ml') dec = dec / 1000;
          const cpu = costByKey[d.ingredientKey] || 0;
          costOfSales += dec * cpu;
        }
      }
    }
  }

  const expenses = await Expense.find({ date: { $gte: start, $lte: end } });
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  res.json({
    period,
    start,
    end,
    orderCount: orders.length,
    income,
    estimatedCost: Math.round(costOfSales),
    expenses: totalExpenses,
    net: income - totalExpenses,
  });
});

router.get('/whatsapp', (_req, res) => {
  res.json({
    cocina: process.env.WHATSAPP_COCINA || '',
    caja: process.env.WHATSAPP_CAJA || '',
    admin: process.env.WHATSAPP_ADMIN || '',
  });
});

router.get('/partners', auth, async (req, res) => {
  const period = req.query.period || 'month';
  const { start, end } = startEnd(period);
  const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });
  const income = orders.reduce((s, o) => s + (o.total || 0), 0);
  const expenses = await Expense.find({ date: { $gte: start, $lte: end } });
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const net = income - totalExpenses;
  const partners = await Partner.find().sort({ sortOrder: 1 });
  const distribution = partners.map((p) => ({
    name: p.name,
    percentage: p.percentage,
    amount: net > 0 ? Math.round((net * p.percentage) / 100) : 0,
  }));
  res.json({ period, income, expenses: totalExpenses, net, distribution });
});

module.exports = router;
