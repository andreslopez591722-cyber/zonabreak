const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const defaults = require('./catalog-defaults.cjs');

const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'zonabreak.db');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function defaultInventario() {
  const def = {};
  Object.keys(defaults.DEFAULT_COSTOS).forEach((k) => {
    if (k !== 'costosFijos') def[k] = { stock: 0, unidad: defaults.DEFAULT_COSTOS[k].unidad };
  });
  return def;
}

function initDb() {
  ensureDataDir();
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      display_name TEXT
    );
    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      percentage REAL NOT NULL,
      sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS delivery_channels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS delivery_staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS kv (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      fecha TEXT,
      channel_slug TEXT,
      delivery_staff_id INTEGER,
      tipo TEXT,
      total REAL,
      fuente TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_sales_fecha ON sales(fecha);
    CREATE INDEX IF NOT EXISTS idx_sales_channel ON sales(channel_slug);
    CREATE INDEX IF NOT EXISTS idx_sales_staff ON sales(delivery_staff_id);
  `);

  seedUsers(db);
  seedPartners(db);
  seedDelivery(db);
  seedKv(db);

  return db;
}

function seedUsers(db) {
  const row = db.prepare('SELECT COUNT(*) AS c FROM users').get();
  if (row.c > 0) return;

  const ins = db.prepare(
    'INSERT INTO users (username, password_hash, role, display_name) VALUES (?,?,?,?)'
  );
  const users = [
    ['admin', 'zonabreak123', 'admin', 'Admin'],
    ['marlon', 'marlon123', 'pos', 'Marlon'],
    ['jesus', 'jesus123', 'pos', 'Jesús'],
    ['didier', 'didier123', 'pos', 'Didier'],
  ];
  for (const [u, pass, role, name] of users) {
    ins.run(u, bcrypt.hashSync(pass, 10), role, name);
  }
}

function seedPartners(db) {
  const row = db.prepare('SELECT COUNT(*) AS c FROM partners').get();
  if (row.c > 0) return;
  const ins = db.prepare(
    'INSERT INTO partners (name, percentage, sort_order) VALUES (?,?,?)'
  );
  defaults.DEFAULT_SOCIOS.forEach((p, i) => {
    ins.run(p.nombre, p.porcentaje, i);
  });
}

function seedDelivery(db) {
  const ch = db.prepare('SELECT COUNT(*) AS c FROM delivery_channels').get();
  if (ch.c === 0) {
    const ins = db.prepare(
      'INSERT INTO delivery_channels (name, slug, active, sort_order) VALUES (?,?,1,?)'
    );
    [
      ['Local / Mostrador', 'local', 0],
      ['Rappi', 'rappi', 1],
      ['Domicilio propio', 'domicilio_interno', 2],
      ['Menú web / WhatsApp', 'menu_online', 3],
    ].forEach(([name, slug, order]) => ins.run(name, slug, order));
  }
  const st = db.prepare('SELECT COUNT(*) AS c FROM delivery_staff').get();
  if (st.c === 0) {
    db.prepare(
      'INSERT INTO delivery_staff (name, phone, active, sort_order) VALUES (?,?,1,?)'
    ).run('Repartidor interno 1', '', 0);
  }
}

function seedKv(db) {
  const has = db.prepare('SELECT key FROM kv WHERE key = ?').get('zb_recetas');
  if (has) return;

  const put = db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)');
  put.run('zb_recetas', JSON.stringify(defaults.DEFAULT_RECETAS));
  put.run('zb_costos', JSON.stringify(defaults.DEFAULT_COSTOS));
  put.run('zb_inventario', JSON.stringify(defaultInventario()));
  put.run('zb_gastos', JSON.stringify([]));
  put.run('zb_impuestos', JSON.stringify(defaults.CONFIG_IMPUESTOS));
  put.run('zb_email_config', JSON.stringify({}));
}

function getKv(db, key, fallback) {
  const r = db.prepare('SELECT value FROM kv WHERE key = ?').get(key);
  if (!r) return fallback;
  try {
    return JSON.parse(r.value);
  } catch {
    return fallback;
  }
}

function setKv(db, key, obj) {
  db.prepare('INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)').run(
    key,
    JSON.stringify(obj)
  );
}

module.exports = {
  initDb,
  dbPath,
  getKv,
  setKv,
  defaultInventario,
  defaults,
};
