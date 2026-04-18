/**
 * Backend Zona Break — Express + API REST + archivos estáticos (public/)
 */
const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDb, getKv, setKv } = require('../config/database');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'zb-dev-secret-change-in-production';
const db = initDb();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

const publicDir = path.join(__dirname, '..', 'public');

function signToken(user) {
  return jwt.sign(
    { sub: user.id, u: user.username, role: user.role, name: user.display_name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    req.user = jwt.verify(h.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

app.post('/api/auth/login', (req, res) => {
  const rawUser = (req.body.username || '').trim();
  const username = rawUser.toLowerCase();
  const password = req.body.password || '';
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }
  const token = signToken(row);
  res.json({
    token,
    user: {
      username: row.username,
      role: row.role,
      displayName: row.display_name,
    },
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/public/menu', (_req, res) => {
  const recetas = getKv(db, 'zb_recetas', {});
  res.json({ recetas });
});

app.get('/api/bootstrap', authMiddleware, (_req, res) => {
  const ventasRows = db
    .prepare(`SELECT payload FROM sales ORDER BY created_at DESC LIMIT 5000`)
    .all()
    .map((r) => JSON.parse(r.payload));

  const partners = db
    .prepare(
      `SELECT id, name AS nombre, percentage AS porcentaje, sort_order FROM partners ORDER BY sort_order, id`
    )
    .all();

  const deliveryChannels = db
    .prepare(
      `SELECT id, name, slug, active, sort_order FROM delivery_channels ORDER BY sort_order, id`
    )
    .all();

  const deliveryStaff = db
    .prepare(
      `SELECT id, name, phone, active, sort_order FROM delivery_staff ORDER BY sort_order, id`
    )
    .all();

  res.json({
    recetas: getKv(db, 'zb_recetas', {}),
    costos: getKv(db, 'zb_costos', {}),
    inventario: getKv(db, 'zb_inventario', {}),
    ventas: ventasRows,
    gastos: getKv(db, 'zb_gastos', []),
    impuestos: getKv(db, 'zb_impuestos', {}),
    emailConfig: getKv(db, 'zb_email_config', {}),
    partnersFromDb: partners,
    deliveryChannels,
    deliveryStaff,
  });
});

app.put('/api/kv/:key', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administrador' });
  }
  const allowed = new Set([
    'zb_recetas',
    'zb_costos',
    'zb_inventario',
    'zb_gastos',
    'zb_impuestos',
    'zb_email_config',
  ]);
  if (!allowed.has(req.params.key)) {
    return res.status(400).json({ error: 'Clave no permitida' });
  }
  setKv(db, req.params.key, req.body);
  res.json({ ok: true });
});

app.post('/api/sales', authMiddleware, (req, res) => {
  const v = req.body;
  if (!v || !v.id) {
    return res.status(400).json({ error: 'Venta inválida' });
  }
  const created = Date.now();
  const channelSlug =
    v.deliveryChannel ||
    (v.tipo === 'rappi'
      ? 'rappi'
      : v.tipo === 'domicilio'
        ? 'domicilio_interno'
        : v.tipo === 'local' || !v.tipo
          ? 'local'
          : 'local');

  db.prepare(
    `INSERT OR REPLACE INTO sales (id, payload, created_at, fecha, channel_slug, delivery_staff_id, tipo, total, fuente)
     VALUES (?,?,?,?,?,?,?,?,?)`
  ).run(
    v.id,
    JSON.stringify(v),
    v.timestamp || created,
    v.fecha || '',
    channelSlug,
    v.deliveryStaffId != null ? Number(v.deliveryStaffId) : null,
    v.tipo || 'local',
    v.total != null ? Number(v.total) : 0,
    v.fuente || 'pos'
  );

  res.json({ ok: true });
});

app.put('/api/sales/sync', authMiddleware, (req, res) => {
  const list = Array.isArray(req.body) ? req.body : req.body.ventas;
  if (!Array.isArray(list)) {
    return res.status(400).json({ error: 'Se esperaba un array de ventas' });
  }
  const del = db.prepare('DELETE FROM sales');
  const ins = db.prepare(
    `INSERT INTO sales (id, payload, created_at, fecha, channel_slug, delivery_staff_id, tipo, total, fuente)
     VALUES (@id, @payload, @created_at, @fecha, @channel_slug, @delivery_staff_id, @tipo, @total, @fuente)`
  );
  const run = db.transaction((rows) => {
    del.run();
    for (const v of rows.slice(0, 5000)) {
      const channelSlug =
        v.deliveryChannel ||
        (v.tipo === 'rappi'
          ? 'rappi'
          : v.tipo === 'domicilio'
            ? 'domicilio_interno'
            : 'local');
      ins.run({
        id: v.id,
        payload: JSON.stringify(v),
        created_at: v.timestamp || Date.now(),
        fecha: v.fecha || '',
        channel_slug: channelSlug,
        delivery_staff_id: v.deliveryStaffId != null ? Number(v.deliveryStaffId) : null,
        tipo: v.tipo || 'local',
        total: v.total != null ? Number(v.total) : 0,
        fuente: v.fuente || 'pos',
      });
    }
  });
  run(list);
  res.json({ ok: true, count: list.length });
});

app.get('/api/partners', authMiddleware, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT id, name AS nombre, percentage AS porcentaje, sort_order FROM partners ORDER BY sort_order, id`
    )
    .all();
  res.json(rows);
});

app.put('/api/partners', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administrador' });
  }
  const list = req.body;
  if (!Array.isArray(list)) {
    return res.status(400).json({ error: 'Array requerido' });
  }
  const total = list.reduce((s, p) => s + Number(p.porcentaje || p.percentage || 0), 0);
  if (Math.abs(total - 100) > 0.01) {
    return res.status(400).json({ error: `La suma de porcentajes debe ser 100%. Actual: ${total}%` });
  }
  const run = db.transaction(() => {
    db.prepare('DELETE FROM partners').run();
    const ins = db.prepare(
      'INSERT INTO partners (name, percentage, sort_order) VALUES (?,?,?)'
    );
    list.forEach((p, i) => {
      ins.run(
        p.nombre || p.name || 'Socio',
        Number(p.porcentaje || p.percentage),
        p.sort_order != null ? p.sort_order : i
      );
    });
  });
  run();
  res.json({ ok: true });
});

app.post('/api/partners', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administrador' });
  }
  const { nombre, name, porcentaje, percentage } = req.body;
  const r = db
    .prepare(
      'INSERT INTO partners (name, percentage, sort_order) VALUES (?,?, (SELECT IFNULL(MAX(sort_order),-1)+1 FROM partners))'
    )
    .run(nombre || name || 'Nuevo socio', Number(porcentaje != null ? porcentaje : percentage));
  res.json({ id: r.lastInsertRowid });
});

app.delete('/api/partners/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administrador' });
  }
  db.prepare('DELETE FROM partners WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/delivery/channels', authMiddleware, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT id, name, slug, active, sort_order FROM delivery_channels ORDER BY sort_order, id`
    )
    .all();
  res.json(rows);
});

app.put('/api/delivery/channels', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administrador' });
  }
  const list = req.body;
  if (!Array.isArray(list)) {
    return res.status(400).json({ error: 'Array requerido' });
  }
  const run = db.transaction(() => {
    db.prepare('DELETE FROM delivery_channels').run();
    const ins = db.prepare(
      'INSERT INTO delivery_channels (name, slug, active, sort_order) VALUES (?,?,?,?)'
    );
    list.forEach((c, i) => {
      ins.run(c.name, c.slug, c.active === false ? 0 : 1, c.sort_order != null ? c.sort_order : i);
    });
  });
  run();
  res.json({ ok: true });
});

app.get('/api/delivery/staff', authMiddleware, (_req, res) => {
  const rows = db
    .prepare(
      `SELECT id, name, phone, active, sort_order FROM delivery_staff ORDER BY sort_order, id`
    )
    .all();
  res.json(rows);
});

app.post('/api/delivery/staff', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administrador' });
  }
  const { name, phone } = req.body;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Nombre requerido' });
  }
  const r = db
    .prepare(
      `INSERT INTO delivery_staff (name, phone, active, sort_order) VALUES (?,?,1, (SELECT IFNULL(MAX(sort_order),-1)+1 FROM delivery_staff))`
    )
    .run(String(name).trim(), phone || '');
  res.json({ id: r.lastInsertRowid });
});

app.delete('/api/delivery/staff/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo administrador' });
  }
  db.prepare('DELETE FROM delivery_staff WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/reports/delivery', authMiddleware, (req, res) => {
  const periodo = req.query.period || 'mes';
  const now = new Date();
  const hoyStr = now.toLocaleDateString('es-CO');
  const mesStr = `${now.getMonth() + 1}/${now.getFullYear()}`;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const semanaStr = weekStart.toLocaleDateString('es-CO');

  const all = db
    .prepare(`SELECT payload FROM sales ORDER BY created_at DESC`)
    .all()
    .map((r) => JSON.parse(r.payload));

  let fil = all;
  if (periodo === 'dia') {
    fil = all.filter((v) => v.fecha === hoyStr);
  } else if (periodo === 'semana') {
    fil = all.filter((v) => v.semana === semanaStr);
  } else {
    fil = all.filter((v) => v.mes === mesStr);
  }

  const byChannel = {};
  const byStaff = {};
  for (const v of fil) {
    const ch =
      v.deliveryChannel ||
      (v.tipo === 'rappi' ? 'rappi' : v.tipo === 'domicilio' ? 'domicilio_interno' : 'local');
    byChannel[ch] = (byChannel[ch] || 0) + (v.total || 0);
    if (v.deliveryStaffId != null && v.deliveryStaffName) {
      const key = `${v.deliveryStaffId}:${v.deliveryStaffName}`;
      byStaff[key] = (byStaff[key] || 0) + (v.total || 0);
    }
  }

  res.json({
    periodo,
    totalVentas: fil.reduce((s, v) => s + (v.total || 0), 0),
    count: fil.length,
    byChannel,
    byStaff,
  });
});

app.use(express.static(publicDir));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno' });
});

app.listen(PORT, () => {
  console.log(`Zona Break — http://localhost:${PORT}`);
  console.log(`  Menú cliente:  /`);
  console.log(`  POS:           /pos.html`);
  console.log(`  Admin:         /admin.html`);
});
