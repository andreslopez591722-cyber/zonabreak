const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let core = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

const zbBlock = `
// ═══ API servidor (sesión) ═══════════════════════════════════
var zbToken = null;
var zbApiBase = '';
function zbHeaders() {
  var h = { 'Content-Type': 'application/json' };
  if (zbToken) h['Authorization'] = 'Bearer ' + zbToken;
  return h;
}
function zbUrl(p) { return (zbApiBase || '') + p; }
async function zbLogin(username, password) {
  var r = await fetch(zbUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password }),
  });
  if (!r.ok) throw new Error('login');
  var d = await r.json();
  zbToken = d.token;
  sessionStorage.setItem('zb_token', zbToken);
  return d.user;
}
async function zbBootstrap() {
  var r = await fetch(zbUrl('/api/bootstrap'), { headers: zbHeaders() });
  if (!r.ok) throw new Error('bootstrap');
  var d = await r.json();
  LSS('zb_recetas', d.recetas);
  LSS('zb_costos', d.costos);
  LSS('zb_inventario', d.inventario);
  LSS('zb_ventas', d.ventas);
  LSS('zb_gastos', d.gastos);
  LSS('zb_impuestos', d.impuestos);
  if (d.emailConfig) LSS('zb_email_config', d.emailConfig);
  if (d.partnersFromDb && d.partnersFromDb.length) {
    LSS('zb_socios', d.partnersFromDb.map(function (p) { return { nombre: p.nombre, porcentaje: p.porcentaje }; }));
  }
  window.__ZB_DELIVERY_CHANNELS__ = d.deliveryChannels || [];
  window.__ZB_DELIVERY_STAFF__ = d.deliveryStaff || [];
}
async function zbPutKv(key, obj) {
  await fetch(zbUrl('/api/kv/' + key), { method: 'PUT', headers: zbHeaders(), body: JSON.stringify(obj) });
}
async function zbPutPartners(arr) {
  await fetch(zbUrl('/api/partners'), { method: 'PUT', headers: zbHeaders(), body: JSON.stringify(arr) });
}
async function zbPostStaff(name, phone) {
  await fetch(zbUrl('/api/delivery/staff'), { method: 'POST', headers: zbHeaders(), body: JSON.stringify({ name: name, phone: phone || '' }) });
}
async function zbDeleteStaff(id) {
  await fetch(zbUrl('/api/delivery/staff/' + id), { method: 'DELETE', headers: zbHeaders() });
}
function zbTryRestoreToken() {
  zbToken = sessionStorage.getItem('zb_token');
}
`;

core = core.replace(
  /function saveVenta\(v\)\s*\{\s*const a=getVentas\(\);\s*a\.unshift\(v\);\s*LSS\('zb_ventas',a\.slice\(0,5000\)\);\s*\}/,
  `function saveVenta(v) {
  const a=getVentas(); a.unshift(v); LSS('zb_ventas',a.slice(0,5000));
  if (zbToken) {
    fetch(zbUrl('/api/sales'), { method: 'POST', headers: zbHeaders(), body: JSON.stringify(v) }).catch(function(){});
  }
}`
);

core = core.replace(
  'function saveConfigImp(d)  { LSS(\'zb_impuestos\', d); }',
  `function saveConfigImp(d)  { LSS('zb_impuestos', d); if (zbToken) zbPutKv('zb_impuestos', d).catch(function(){}); }`
);

core = core.replace(
  /function saveSocios\(d\)\s*\{\s*LSS\('zb_socios', d\);\s*\}/,
  `function saveSocios(d)  {
  LSS('zb_socios', d);
  if (zbToken) {
    var payload = d.map(function(s, i) { return { nombre: s.nombre, porcentaje: s.porcentaje, sort_order: i }; });
    zbPutPartners(payload).catch(function(){});
  }
}`
);

core = core.replace(
  /function saveRecetas\(d\) \{ LSS\('zb_recetas', d\); \}/,
  `function saveRecetas(d) { LSS('zb_recetas', d); if (zbToken) zbPutKv('zb_recetas', d).catch(function(){}); }`
);

core = core.replace(
  /function saveCostos\(d\)  \{ LSS\('zb_costos', d\); \}/,
  `function saveCostos(d)  { LSS('zb_costos', d); if (zbToken) zbPutKv('zb_costos', d).catch(function(){}); }`
);

core = core.replace(
  /function saveInventario\(d\) \{ LSS\('zb_inventario',d\); \}/,
  `function saveInventario(d) { LSS('zb_inventario',d); if (zbToken) zbPutKv('zb_inventario', d).catch(function(){}); }`
);

core = core.replace(
  /function saveGasto\(g\)      \{ const a=getGastos\(\); a\.unshift\(g\); LSS\('zb_gastos',a\); \}/,
  `function saveGasto(g) {
  const a=getGastos(); a.unshift(g); LSS('zb_gastos',a);
  if (zbToken) zbPutKv('zb_gastos', a).catch(function(){});
}`
);

const insertPoint = '// ── CÁLCULO COSTO POR PRODUCTO ────────────────────────────';
core = core.replace(insertPoint, zbBlock + '\n' + insertPoint);

const html = fs.readFileSync(path.join(root, 'pos.html'), 'utf8');
const start = html.indexOf('// ── USUARIOS ─────────────────────────────────────────────');
const end = html.indexOf('</script>', html.indexOf('<!-- TOAST -->'));
if (start === -1 || end === -1) throw new Error('Script block not found in pos.html');
let ui = html.slice(start, end);

ui = ui.replace(/\$\{SOCIOS\.map/g, '${getSocios().map');

const OLD_LOGIN = `function doLogin() {
  const u = document.getElementById('loginUser').value.trim().toLowerCase();
  const p = document.getElementById('loginPass').value;
  const user = USUARIOS[u];
  if (!user || user.pass !== p) {
    document.getElementById('loginErr').style.display = 'block'; return;
  }
  if (modoLogin === 'admin' && user.rol !== 'admin') {
    document.getElementById('loginErr').style.display = 'block';
    document.getElementById('loginErr').textContent = 'No tienes acceso admin';
    return;
  }
  usuarioActual = { ...user, user: u };
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appScreen').style.display   = 'flex';
  document.getElementById('topbarUser').textContent     = user.nombre;
  document.getElementById('topbarModo').textContent     = modoLogin === 'admin' ? '🔒 ADMIN' : '⚡ POS';
  // Mostrar tabs correctos
  document.getElementById('tabsPOS').style.display   = modoLogin === 'pos'   ? 'flex' : 'none';
  document.getElementById('tabsAdmin').style.display = modoLogin === 'admin' ? 'flex' : 'none';
  document.querySelectorAll('.pg').forEach(p => p.classList.remove('active'));
  if (modoLogin === 'pos') {
    document.getElementById('pg-vender').classList.add('active');
    renderPosProductos();
  } else {
    document.getElementById('pg-contabilidad').classList.add('active');
    renderContabilidad();
  }
}`;

const NEW_LOGIN = `async function doLogin() {
  const u = document.getElementById('loginUser').value.trim().toLowerCase();
  const p = document.getElementById('loginPass').value;
  document.getElementById('loginErr').style.display = 'none';
  try {
    await zbLogin(u, p);
    const r = await fetch(zbUrl('/api/auth/me'), { headers: zbHeaders() });
    const me = await r.json();
    const role = me.user.role;
    if (typeof window.ZB_PAGE_ROLE === 'string') {
      if (window.ZB_PAGE_ROLE === 'admin' && role !== 'admin') {
        document.getElementById('loginErr').textContent = 'Solo administradores';
        document.getElementById('loginErr').style.display = 'block';
        zbToken = null;
        sessionStorage.removeItem('zb_token');
        return;
      }
      if (window.ZB_PAGE_ROLE === 'pos' && role !== 'pos') {
        document.getElementById('loginErr').textContent = 'Usa usuario de caja (marlon, jesus, didier)';
        document.getElementById('loginErr').style.display = 'block';
        zbToken = null;
        sessionStorage.removeItem('zb_token');
        return;
      }
    }
    await zbBootstrap();
    const userRow = { marlon: { nombre: 'Marlon', rol: 'pos' }, jesus: { nombre: 'Jesús', rol: 'pos' }, didier: { nombre: 'Didier', rol: 'pos' }, admin: { nombre: 'Admin', rol: 'admin' } };
    const user = userRow[u] || { nombre: me.user.name || u, rol: role };
    usuarioActual = { ...user, user: u, rol: role };
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'flex';
    document.getElementById('topbarUser').textContent = user.nombre;
    document.getElementById('topbarModo').textContent = role === 'admin' ? '🔒 ADMIN' : '⚡ POS';
    document.getElementById('tabsPOS').style.display = role === 'pos' ? 'flex' : 'none';
    document.getElementById('tabsAdmin').style.display = role === 'admin' ? 'flex' : 'none';
    document.querySelectorAll('.pg').forEach(p => p.classList.remove('active'));
    if (role === 'pos') {
      document.getElementById('pg-vender').classList.add('active');
      document.querySelectorAll('#tabsPOS .tab').forEach((t, i) => t.classList.toggle('active', i === 0));
      renderPosProductos();
    } else {
      document.getElementById('pg-contabilidad').classList.add('active');
      document.querySelectorAll('#tabsAdmin .tab').forEach((t, i) => t.classList.toggle('active', i === 0));
      renderContabilidad();
    }
    if (typeof checkAutoEmail === 'function') checkAutoEmail();
  } catch (e) {
    document.getElementById('loginErr').textContent = 'Usuario o contraseña incorrectos';
    document.getElementById('loginErr').style.display = 'block';
  }
}`;

if (!ui.includes(OLD_LOGIN.slice(0, 40))) throw new Error('doLogin block mismatch');
ui = ui.replace(OLD_LOGIN, NEW_LOGIN);

ui = ui.replace(
  `function doLogout() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appScreen').style.display   = 'none';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginErr').style.display = 'none';
  document.getElementById('loginErr').textContent = 'Usuario o contraseña incorrectos';
  ordenPOS = [];
  usuarioActual = null;
}`,
  `function doLogout() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appScreen').style.display   = 'none';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginErr').style.display = 'none';
  document.getElementById('loginErr').textContent = 'Usuario o contraseña incorrectos';
  ordenPOS = [];
  usuarioActual = null;
  zbToken = null;
  sessionStorage.removeItem('zb_token');
}`
);

ui = ui.replace(
  `  const renders = {
    ventas: renderVentasHoy, inventario: renderInvPOS,
    contabilidad: renderContabilidad, costos: renderCostos,
    recetas: renderRecetas, gastos: renderGastos,
    invAdmin: renderInvAdmin, reportes: renderReportes,
  };`,
  `  const renders = {
    ventas: renderVentasHoy, inventario: renderInvPOS,
    contabilidad: renderContabilidad, costos: renderCostos,
    recetas: renderRecetas, gastos: renderGastos,
    invAdmin: renderInvAdmin, reportes: renderReportes,
    socios: renderSocios, emailconfig: cargarConfigEmail, delivery: renderDeliveryAdmin,
  };`
);

const repSoc = `  return \`
============================================
  ZONA BREAK — REPORTE DIARIO
  \${hoy()}
============================================

📊 RESUMEN DEL DÍA:
  Ventas realizadas : \${rDia.cantidadVentas}
  Ingresos totales  : \${fmt(rDia.totalVentas)}
  Costo ingredientes: \${fmt(rDia.totalCostos)}
  Gastos operativos : \${fmt(rDia.totalGastos)}
  Ganancia bruta    : \${fmt(rDia.gananciaBruta)}
  Ganancia neta     : \${fmt(rDia.gananciaNeta)}

🏆 TOP PRODUCTOS HOY:
\${topStr}

📅 ACUMULADO DEL MES (\${mesActual()}):
  Ingresos mes      : \${fmt(rMes.totalVentas)}
  Costos mes        : \${fmt(rMes.totalCostos)}
  Gastos mes        : \${fmt(rMes.totalGastos)}
  Ganancia neta mes : \${fmt(rMes.gananciaNeta)}

💼 REPARTO SOCIOS (MES):
\${getSocios().map(s => '  ' + s.nombre + ' (' + s.porcentaje + '%): ' + (rMes.gananciaNeta > 0 ? fmt(rMes.gananciaNeta * s.porcentaje / 100) : fmt(0))).join('\\n')}

============================================
  Sistema POS Zona Break v7
============================================\`.trim();`;

ui = ui.replace(/return `\s*============================================[\s\S]*?Sistema POS Zona Break v5[\s\S]*?`.trim\(\);/, repSoc);

ui += `
async function renderDeliveryAdmin() {
  var per = document.getElementById('deliveryPeriodo');
  if (!per) return;
  zbTryRestoreToken();
  if (!zbToken) { document.getElementById('deliveryReport').innerHTML = '<p style="color:var(--gris)">Inicia sesión con el servidor.</p>'; return; }
  try {
    var r = await fetch(zbUrl('/api/reports/delivery?period=' + per.value), { headers: zbHeaders() });
    var d = await r.json();
    var ch = Object.entries(d.byChannel || {}).map(function(x) { return '<div class="conta-row"><span class="conta-label">' + x[0] + '</span><span class="conta-value oro">' + fmt(x[1]) + '</span></div>'; }).join('');
    var st = Object.entries(d.byStaff || {}).map(function(x) { return '<div class="conta-row"><span class="conta-label">' + x[0] + '</span><span class="conta-value verde">' + fmt(x[1]) + '</span></div>'; }).join('');
    document.getElementById('deliveryReport').innerHTML =
      '<div class="conta-card" style="text-align:left"><div class="conta-periodo">Por canal</div>' + (ch || '<p style="color:var(--gris)">Sin datos</p>') + '</div>' +
      '<div class="conta-card" style="text-align:left;margin-top:12px"><div class="conta-periodo">Por repartidor interno</div>' + (st || '<p style="color:var(--gris)">Asigna repartidor en ventas domicilio (POS)</p>') + '</div>';
  } catch (e) {
    document.getElementById('deliveryReport').innerHTML = '<p style="color:var(--rojo)">Error cargando reporte</p>';
  }
  var stf = window.__ZB_DELIVERY_STAFF__ || [];
  document.getElementById('staffListBody').innerHTML = stf.map(function(s) {
    return '<tr><td>' + s.name + '</td><td>' + (s.phone || '—') + '</td><td><button class="btn btn-r btn-sm" onclick="zbDeleteStaff(' + s.id + ').then(function(){return zbBootstrap();}).then(renderDeliveryAdmin)">Eliminar</button></td></tr>';
  }).join('') || '<tr><td colspan="3" style="color:var(--gris)">Sin repartidores</td></tr>';
}
`;

const out = core + '\n\n// ═══ UI (POS / Admin) ═══════════════════════════════════════\n' + ui;
fs.mkdirSync(path.join(root, 'public'), { recursive: true });
fs.writeFileSync(path.join(root, 'public', 'app.js'), out);
console.log('OK public/app.js');
