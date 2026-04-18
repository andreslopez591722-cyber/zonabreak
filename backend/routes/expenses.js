const express = require('express');
const { Expense } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const { from, to } = req.query;
  const q = {};
  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = new Date(from);
    if (to) q.date.$lte = new Date(to);
  }
  const list = await Expense.find(q).sort({ date: -1 }).limit(500);
  res.json(list);
});

router.post('/', auth, adminOnly, async (req, res) => {
  const e = await Expense.create(req.body);
  res.status(201).json(e);
});

module.exports = router;
