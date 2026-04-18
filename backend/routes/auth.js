const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

router.post('/login', async (req, res) => {
  const user = (req.body.username || '').trim().toLowerCase();
  const pass = req.body.password || '';
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'zonabreak123';

  if (user === adminUser && pass === adminPass) {
    const token = jwt.sign(
      { sub: 'admin', role: 'admin', name: 'Admin' },
      process.env.JWT_SECRET || 'dev',
      { expiresIn: '7d' }
    );
    return res.json({ token, user: { username: adminUser, role: 'admin', name: 'Administrador' } });
  }

  const posUsers = {
    marlon: { pass: 'marlon123', name: 'Marlon' },
    jesus: { pass: 'jesus123', name: 'Jesús' },
    didier: { pass: 'didier123', name: 'Didier' },
  };
  const pu = posUsers[user];
  if (pu && pu.pass === pass) {
    const token = jwt.sign(
      { sub: user, role: 'pos', name: pu.name },
      process.env.JWT_SECRET || 'dev',
      { expiresIn: '7d' }
    );
    return res.json({ token, user: { username: user, role: 'pos', name: pu.name } });
  }

  res.status(401).json({ error: 'Credenciales incorrectas' });
});

module.exports = router;
