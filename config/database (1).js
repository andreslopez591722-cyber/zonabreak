/**
 * Configuración y acceso a PostgreSQL via Supabase (Zona Break).
 */
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const defaults = require('./catalog-defaults.cjs');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yxtstxekcshtpnarzjni.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

let supabase;

function getClient() {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabase;
}

function defaultInventario() {
  const def = {};
  Object.keys(defaults.DEFAULT_COSTOS).forEach((k) => {
    if (k !== 'costosFijos') def[k] = { stock: 0, unidad: defaults.DEFAULT_COSTOS[k].unidad };
  });
  return def;
}

async function initDb() {
  const db = getClient();
  await seedUsers(db);
  await seedPartners(db);
  await seedDelivery(db);
  await seedKv(db);
  return db;
}

async function seedUsers(db) {
  const { data } = await db.from('users').select('id').limit(1);
  if (data && data.length > 0) return;

  const users = [
    { username: 'admin', password_hash: bcrypt.hashSync('zonabreak123', 10), role: 'admin', display_name: 'Admin' },
    { username: 'marlon', password_hash: bcrypt.hashSync('marlon123', 10), role: 'pos', display_name: 'Marlon' },
    { username: 'jesus', password_hash: bcrypt.hashSync('jesus123', 10), role: 'pos', display_name: 'Jesús' },
    { username: 'didier', password_hash: bcrypt.hashSync('didier123', 10), role: 'pos', display_name: 'Didier' },
  ];
  await db.from('users').insert(users);
}

async function seedPartners(db) {
  const { data } = await db.from('partners').select('id').limit(1);
  if (data && data.length > 0) return;

  const partners = defaults.DEFAULT_SOCIOS.map((p, i) => ({
    name: p.nombre,
    percentage: p.porcentaje,
    sort_order: i,
  }));
  await db.from('partners').insert(partners);
}

async function seedDelivery(db) {
  const { data: ch } = await db.from('delivery_channels').select('id').limit(1);
  if (!ch || ch.length === 0) {
    await db.from('delivery_channels').insert([
      { name: 'Local / Mostrador', slug: 'local', active: true, sort_order: 0 },
      { name: 'Rappi', slug: 'rappi', active: true, sort_order: 1 },
      { name: 'Domicilio propio', slug: 'domicilio_interno', active: true, sort_order: 2 },
      { name: 'Menú web / WhatsApp', slug: 'menu_online', active: true, sort_order: 3 },
    ]);
  }

  const { data: st } = await db.from('delivery_staff').select('id').limit(1);
  if (!st || st.length === 0) {
    await db.from('delivery_staff').insert([
      { name: 'Repartidor interno 1', phone: '', active: true, sort_order: 0 },
    ]);
  }
}

async function seedKv(db) {
  const { data } = await db.from('kv').select('key').eq('key', 'zb_recetas').limit(1);
  if (data && data.length > 0) return;

  const rows = [
    { key: 'zb_recetas', value: JSON.stringify(defaults.DEFAULT_RECETAS) },
    { key: 'zb_costos', value: JSON.stringify(defaults.DEFAULT_COSTOS) },
    { key: 'zb_inventario', value: JSON.stringify(defaultInventario()) },
    { key: 'zb_gastos', value: JSON.stringify([]) },
    { key: 'zb_impuestos', value: JSON.stringify(defaults.CONFIG_IMPUESTOS) },
    { key: 'zb_email_config', value: JSON.stringify({}) },
  ];
  await db.from('kv').insert(rows);
}

async function getKv(db, key, fallback) {
  const { data } = await db.from('kv').select('value').eq('key', key).single();
  if (!data) return fallback;
  try {
    return JSON.parse(data.value);
  } catch {
    return fallback;
  }
}

async function setKv(db, key, obj) {
  await db.from('kv').upsert({ key, value: JSON.stringify(obj) });
}

module.exports = {
  initDb,
  getKv,
  setKv,
  defaultInventario,
  defaults,
  getClient,
};
