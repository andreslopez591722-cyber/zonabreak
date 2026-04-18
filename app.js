// ============================================================
// ZONA BREAK — app.js  v6.0
// ============================================================

// ── SOCIOS (editables desde Admin) ───────────────────────
const DEFAULT_SOCIOS = [
  { nombre: 'Marlon',  porcentaje: 50 },
  { nombre: 'Jesús',   porcentaje: 30 },
  { nombre: 'Didier',  porcentaje: 20 },
];

// ── COSTOS BASE ───────────────────────────────────────────
const DEFAULT_COSTOS = {
  carne:           { nombre:'Carne de res',    unidad:'kg',     precio: 30000 },
  bordana:         { nombre:'Bordana/Lomo',    unidad:'kg',     precio: 11000 },
  pollo:           { nombre:'Pollo',           unidad:'kg',     precio: 30000 },
  papa:            { nombre:'Papa',            unidad:'kg',     precio:  3000 },
  queso:           { nombre:'Queso cheddar',   unidad:'lamina', precio: 625   },
  chorizo:         { nombre:'Chorizo',         unidad:'unidad', precio: 13333 },
  tocineta:        { nombre:'Tocineta',        unidad:'kg',     precio: 75000 },
  aceite:          { nombre:'Aceite',          unidad:'litro',  precio: 30000 },
  panHamburguesa:  { nombre:'Pan hamburguesa', unidad:'unidad', precio:  1200 },
  panPerro:        { nombre:'Pan perro',       unidad:'unidad', precio:  1100 },
  salchichaSubiza: { nombre:'Salchicha suiza', unidad:'unidad', precio:  3500 },
  empaque:         { nombre:'Empaque',         unidad:'unidad', precio:  4000 },
  costosFijos:     { nombre:'Costos fijos mes',unidad:'mes',    precio: 670000 },
};

// ── RECETAS ───────────────────────────────────────────────
const DEFAULT_RECETAS = {
  // HAMBURGUESAS
  callejera150: {
    nombre:'La Callejera 150', categoria:'hamburguesas', precio:18000, emoji:'🍔',
    fotoUrl:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    descripcion:'150g carne, pan, lechuga romana, salsa tártara, queso, tocineta, mermelada pimentón, cebolla',
    ingredientes:{ carne:{cantidad:150,unidad:'g'}, panHamburguesa:{cantidad:1,unidad:'unidad'}, queso:{cantidad:1,unidad:'lamina'}, tocineta:{cantidad:20,unidad:'g'}, empaque:{cantidad:1,unidad:'unidad'} }
  },
  hiperSmash: {
    nombre:'La Hiper Smash', categoria:'hamburguesas', precio:16000, emoji:'🍔',
    fotoUrl:'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80',
    descripcion:'75g carne smash, cebolla blanca, 2 láminas queso cheddar, salsa pepinillo',
    ingredientes:{ carne:{cantidad:75,unidad:'g'}, panHamburguesa:{cantidad:1,unidad:'unidad'}, queso:{cantidad:2,unidad:'lamina'}, empaque:{cantidad:1,unidad:'unidad'} }
  },
  dobleZona: {
    nombre:'La Doble Zona', categoria:'hamburguesas', precio:22000, emoji:'🍔',
    fotoUrl:'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80',
    descripcion:'2 carnes 125g, queso cheddar, tocineta, lechuga romana, tomate, cebolla, salsa pepinillo',
    ingredientes:{ carne:{cantidad:250,unidad:'g'}, panHamburguesa:{cantidad:1,unidad:'unidad'}, queso:{cantidad:2,unidad:'lamina'}, tocineta:{cantidad:30,unidad:'g'}, empaque:{cantidad:1,unidad:'unidad'} }
  },
  // PERROS
  choriperro: {
    nombre:'El Choriperro Calle', categoria:'perros', precio:14000, emoji:'🌭',
    fotoUrl:'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=400&q=80',
    descripcion:'Chorizo mexicano, pan perro, salsa tomate, salsa crema, salsa de la casa',
    ingredientes:{ chorizo:{cantidad:1,unidad:'unidad'}, panPerro:{cantidad:1,unidad:'unidad'}, empaque:{cantidad:1,unidad:'unidad'} }
  },
  suizoUrbano: {
    nombre:'El Suizo Urbano', categoria:'perros', precio:13000, emoji:'🌭',
    fotoUrl:'https://images.unsplash.com/photo-1627308595229-7830a5c18516?w=400&q=80',
    descripcion:'Salchicha suiza, pan perro, papas ripio, salsa pepinillo',
    ingredientes:{ salchichaSubiza:{cantidad:1,unidad:'unidad'}, panPerro:{cantidad:1,unidad:'unidad'}, papa:{cantidad:80,unidad:'g'}, aceite:{cantidad:0.05,unidad:'litro'}, empaque:{cantidad:1,unidad:'unidad'} }
  },
  // PICADAS
  picadaZona: {
    nombre:'Picada Zona Break', categoria:'picadas', precio:28000, emoji:'🍖',
    fotoUrl:'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    descripcion:'80g pollo, 80g chorizo, 80g lomo cerdo, 150g papas francesas',
    ingredientes:{ pollo:{cantidad:80,unidad:'g'}, chorizo:{cantidad:0.5,unidad:'unidad'}, bordana:{cantidad:80,unidad:'g'}, papa:{cantidad:150,unidad:'g'}, aceite:{cantidad:0.08,unidad:'litro'}, empaque:{cantidad:1,unidad:'unidad'} }
  },
  // EXTRAS
  salchipapa: {
    nombre:'Salchipapa Zona Mix', categoria:'extras', precio:10000, emoji:'🍟',
    fotoUrl:'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80',
    descripcion:'Papas fritas crocantes con salchicha, salsas de la casa',
    ingredientes:{ papa:{cantidad:200,unidad:'g'}, aceite:{cantidad:0.1,unidad:'litro'}, empaque:{cantidad:1,unidad:'unidad'} }
  },
  papachorreada: {
    nombre:'Papa Chorreada Break', categoria:'extras', precio:8000, emoji:'🥔',
    fotoUrl:'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400&q=80',
    descripcion:'Papa crispy con salsa especial de la casa y queso fundido',
    ingredientes:{ papa:{cantidad:150,unidad:'g'}, queso:{cantidad:1,unidad:'lamina'}, aceite:{cantidad:0.08,unidad:'litro'}, empaque:{cantidad:1,unidad:'unidad'} }
  },
  lomoUrbano: {
    nombre:'Sándwich Lomo Urbano', categoria:'extras', precio:15000, emoji:'🥪',
    fotoUrl:'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=400&q=80',
    descripcion:'Lomo de cerdo a la plancha, pan artesanal, salsas y vegetales frescos',
    ingredientes:{ bordana:{cantidad:150,unidad:'g'}, panHamburguesa:{cantidad:1,unidad:'unidad'}, empaque:{cantidad:1,unidad:'unidad'} }
  },
  // BEBIDAS
  cocaCola:       { nombre:'Coca Cola Original',      categoria:'bebidas', precio:5000,  emoji:'🥤', fotoUrl:'', descripcion:'Coca Cola original 350ml', ingredientes:{} },
  cocaColaZero:   { nombre:'Coca Cola Zero',          categoria:'bebidas', precio:5000,  emoji:'🥤', fotoUrl:'', descripcion:'Coca Cola Zero azúcar 350ml', ingredientes:{} },
  teHatsu:        { nombre:'Té Hatsu',                categoria:'bebidas', precio:6000,  emoji:'🍵', fotoUrl:'', descripcion:'Té natural Hatsu', ingredientes:{} },
  sodaHatsu:      { nombre:'Soda Hatsu',              categoria:'bebidas', precio:6000,  emoji:'🫧', fotoUrl:'', descripcion:'Soda natural Hatsu', ingredientes:{} },
  canadry:        { nombre:'Canada Dry',              categoria:'bebidas', precio:5000,  emoji:'🥤', fotoUrl:'', descripcion:'Ginger Ale Canada Dry', ingredientes:{} },
  aguaHatsu:      { nombre:'Agua Hatsu',              categoria:'bebidas', precio:5000,  emoji:'💧', fotoUrl:'', descripcion:'Agua natural Hatsu', ingredientes:{} },
  aguaSaborizante:{ nombre:'Agua Saborizante',        categoria:'bebidas', precio:4000,  emoji:'💧', fotoUrl:'', descripcion:'Agua con sabor natural', ingredientes:{} },
  colombiana:     { nombre:'Colombiana',              categoria:'bebidas', precio:4000,  emoji:'🥤', fotoUrl:'', descripcion:'Colombiana 350ml', ingredientes:{} },
  heineken:       { nombre:'Heineken',                categoria:'bebidas', precio:8000,  emoji:'🍺', fotoUrl:'', descripcion:'Cerveza Heineken 330ml', ingredientes:{} },
  corinita:       { nombre:'Corinita',                categoria:'bebidas', precio:5000,  emoji:'🍺', fotoUrl:'', descripcion:'Cerveza Corinita', ingredientes:{} },
  clubColombia:   { nombre:'Club Colombia',           categoria:'bebidas', precio:7000,  emoji:'🍺', fotoUrl:'', descripcion:'Cerveza Club Colombia', ingredientes:{} },
  millar:         { nombre:'Millar',                  categoria:'bebidas', precio:5000,  emoji:'🍺', fotoUrl:'', descripcion:'Cerveza Millar', ingredientes:{} },
  estela:         { nombre:'Estela',                  categoria:'bebidas', precio:5000,  emoji:'🍺', fotoUrl:'', descripcion:'Cerveza Estela', ingredientes:{} },
  // COCTELES
  mojito:         { nombre:'Mojito',                  categoria:'cocteles', precio:15000, emoji:'🍸', fotoUrl:'', descripcion:'Ron blanco, limón, menta, azúcar, soda', ingredientes:{} },
  margarita:      { nombre:'Margarita Clásica',       categoria:'cocteles', precio:16000, emoji:'🍹', fotoUrl:'', descripcion:'Tequila, triple sec, limón, sal', ingredientes:{} },
  cubaLibre:      { nombre:'Cuba Libre',              categoria:'cocteles', precio:14000, emoji:'🥃', fotoUrl:'', descripcion:'Ron, Coca Cola, limón, hielo', ingredientes:{} },
  tequilaSunrise: { nombre:'Tequila Sunrise',         categoria:'cocteles', precio:16000, emoji:'🌅', fotoUrl:'', descripcion:'Tequila, jugo naranja, granadina', ingredientes:{} },
  pinaColada:     { nombre:'Piña Colada',             categoria:'cocteles', precio:16000, emoji:'🍍', fotoUrl:'', descripcion:'Ron, crema de coco, jugo de piña, hielo', ingredientes:{} },
  michelada:      { nombre:'Michelada',               categoria:'cocteles', precio:12000, emoji:'🍺', fotoUrl:'', descripcion:'Cerveza, limón, salsas, hielo, chile', ingredientes:{} },
  // COCTELES SIN ALCOHOL
  limonadaCoco:   { nombre:'Limonada de Coco',        categoria:'sinAlcohol', precio:9000, emoji:'🥥', fotoUrl:'', descripcion:'Limonada natural con coco rallado y hierbabuena', ingredientes:{} },
  limonadaRojos:  { nombre:'Limonada Frutos Rojos',   categoria:'sinAlcohol', precio:9000, emoji:'🍓', fotoUrl:'', descripcion:'Limonada con frutos rojos naturales', ingredientes:{} },
};

// ── IVA Y SERVICIO ────────────────────────────────────────
const CONFIG_IMPUESTOS = {
  iva: 0,           // % IVA (0 = no aplica, 8 = 8%, 19 = 19%)
  servicio: 8,      // % servicio por defecto
  ivaIncluido: true, // true = precios ya incluyen IVA
};

// ── LOCALSTORAGE ──────────────────────────────────────────
const LS  = (k,d) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):d; } catch(e){return d;} };
const LSS = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch(e){} };

function getSocios()    { return LS('zb_socios', DEFAULT_SOCIOS); }
function saveSocios(d)  { LSS('zb_socios', d); }
function getCostos()    { return LS('zb_costos', DEFAULT_COSTOS); }
function saveCostos(d)  { LSS('zb_costos', d); }
function getRecetas()   { return LS('zb_recetas', DEFAULT_RECETAS); }
function saveRecetas(d) { LSS('zb_recetas', d); }
function getVentas()    { return LS('zb_ventas', []); }
function getGastos()    { return LS('zb_gastos', []); }
function getInventario(){ 
  const def={};
  Object.keys(DEFAULT_COSTOS).forEach(k=>{if(k!=='costosFijos')def[k]={stock:0,unidad:DEFAULT_COSTOS[k].unidad};});
  return LS('zb_inventario',def);
}
function saveVenta(v)      { const a=getVentas(); a.unshift(v); LSS('zb_ventas',a.slice(0,5000)); }
function saveGasto(g)      { const a=getGastos(); a.unshift(g); LSS('zb_gastos',a); }
function saveInventario(d) { LSS('zb_inventario',d); }
function getConfigImp()    { return LS('zb_impuestos', CONFIG_IMPUESTOS); }
function saveConfigImp(d)  { LSS('zb_impuestos', d); }

// ── CÁLCULO COSTO POR PRODUCTO ────────────────────────────
function calcCostoProducto(id) {
  const recetas=getRecetas(); const costos=getCostos();
  const r=recetas[id]; if(!r) return 0;
  let total=0;
  Object.entries(r.ingredientes||{}).forEach(([ing,info])=>{
    const c=costos[ing]; if(!c) return;
    let cu=0;
    if(info.unidad==='g')      cu=(info.cantidad/1000)*c.precio;
    else if(info.unidad==='kg') cu=info.cantidad*c.precio;
    else if(info.unidad==='ml') cu=(info.cantidad/1000)*c.precio;
    else if(info.unidad==='litro') cu=info.cantidad*c.precio;
    else cu=info.cantidad*c.precio;
    total+=cu;
  });
  return Math.round(total);
}

// ── DESCONTAR INVENTARIO ──────────────────────────────────
function descontarInventario(items) {
  const recetas=getRecetas(); const inv=getInventario();
  items.forEach(({id,qty})=>{
    const r=recetas[id]; if(!r) return;
    Object.entries(r.ingredientes||{}).forEach(([ing,info])=>{
      if(!inv[ing]) return;
      const cant=info.cantidad*qty;
      if(info.unidad==='g')      inv[ing].stock=Math.max(0,(inv[ing].stock||0)-cant/1000);
      else if(info.unidad==='kg') inv[ing].stock=Math.max(0,(inv[ing].stock||0)-cant);
      else if(info.unidad==='ml') inv[ing].stock=Math.max(0,(inv[ing].stock||0)-cant/1000);
      else if(info.unidad==='litro') inv[ing].stock=Math.max(0,(inv[ing].stock||0)-cant);
      else inv[ing].stock=Math.max(0,(inv[ing].stock||0)-cant);
    });
  });
  saveInventario(inv);
}

// ── FECHAS ────────────────────────────────────────────────
function hoy()       { return new Date().toLocaleDateString('es-CO'); }
function mesActual() { const n=new Date(); return `${n.getMonth()+1}/${n.getFullYear()}`; }
function semanaKey() { const n=new Date(); const d=new Date(n); d.setDate(n.getDate()-n.getDay()); return d.toLocaleDateString('es-CO'); }
function fmt(n)      { return '$'+Math.round(n).toLocaleString('es-CO'); }
function uid()       { return 'ZB-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,4).toUpperCase(); }

// ── RESUMEN VENTAS ────────────────────────────────────────
function resumenVentas(periodo) {
  const ventas=getVentas();
  let fil;
  if(periodo==='dia')    fil=ventas.filter(v=>v.fecha===hoy());
  else if(periodo==='semana') fil=ventas.filter(v=>v.semana===semanaKey());
  else                   fil=ventas.filter(v=>v.mes===mesActual());
  const totalVentas  = fil.reduce((s,v)=>s+(v.total||0),0);
  const totalCostos  = fil.reduce((s,v)=>s+(v.items||[]).reduce((si,i)=>si+calcCostoProducto(i.id)*i.qty,0),0);
  const gastos=getGastos();
  let filG;
  if(periodo==='dia')    filG=gastos.filter(g=>g.fecha===hoy());
  else if(periodo==='semana') filG=gastos.filter(g=>g.semana===semanaKey());
  else                   filG=gastos.filter(g=>g.mes===mesActual());
  const totalGastos  = filG.reduce((s,g)=>s+(g.monto||0),0);
  const costoFijoMes = getCostos().costosFijos?.precio||670000;
  const costoFijo    = periodo==='mes'?costoFijoMes:periodo==='semana'?costoFijoMes/4:costoFijoMes/30;
  const gananciaBruta= totalVentas-totalCostos;
  const gananciaNeta = gananciaBruta-totalGastos-costoFijo;
  // Rappi
  const rappiVentas  = fil.filter(v=>v.tipo==='rappi').reduce((s,v)=>s+(v.total||0),0);
  const domicilioV   = fil.filter(v=>v.tipo==='domicilio').reduce((s,v)=>s+(v.total||0),0);
  const localV       = fil.filter(v=>v.tipo==='local'||!v.tipo).reduce((s,v)=>s+(v.total||0),0);
  return { totalVentas,totalCostos,totalGastos,costoFijo,gananciaBruta,gananciaNeta,
           cantidadVentas:fil.length,periodo,rappiVentas,domicilioV,localV };
}
