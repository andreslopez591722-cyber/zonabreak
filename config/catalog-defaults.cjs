/** Catálogo inicial (sincronizado con public/app.js) */
module.exports.DEFAULT_SOCIOS = [
  { nombre: 'Jesús', porcentaje: 30 },
  { nombre: 'Didier', porcentaje: 20 },
  { nombre: 'Marlon', porcentaje: 50 },
];

module.exports.DEFAULT_COSTOS = {
  carne: { nombre: 'Carne de res', unidad: 'kg', precio: 30000 },
  bordana: { nombre: 'Bordana/Lomo', unidad: 'kg', precio: 11000 },
  pollo: { nombre: 'Pollo', unidad: 'kg', precio: 30000 },
  papa: { nombre: 'Papa', unidad: 'kg', precio: 3000 },
  queso: { nombre: 'Queso cheddar', unidad: 'lamina', precio: 625 },
  chorizo: { nombre: 'Chorizo', unidad: 'unidad', precio: 13333 },
  tocineta: { nombre: 'Tocineta', unidad: 'kg', precio: 75000 },
  aceite: { nombre: 'Aceite', unidad: 'litro', precio: 30000 },
  panHamburguesa: { nombre: 'Pan hamburguesa', unidad: 'unidad', precio: 1200 },
  panPerro: { nombre: 'Pan perro', unidad: 'unidad', precio: 1100 },
  salchichaSubiza: { nombre: 'Salchicha suiza', unidad: 'unidad', precio: 3500 },
  empaque: { nombre: 'Empaque', unidad: 'unidad', precio: 4000 },
  costosFijos: { nombre: 'Costos fijos mes', unidad: 'mes', precio: 670000 },
};

module.exports.DEFAULT_RECETAS = {
  callejera150: {
    nombre: 'La Callejera 150', categoria: 'hamburguesas', precio: 18000, emoji: '🍔',
    fotoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    descripcion: '150g carne, pan, lechuga romana, salsa tártara, queso, tocineta, mermelada pimentón, cebolla',
    ingredientes: { carne: { cantidad: 150, unidad: 'g' }, panHamburguesa: { cantidad: 1, unidad: 'unidad' }, queso: { cantidad: 1, unidad: 'lamina' }, tocineta: { cantidad: 20, unidad: 'g' }, empaque: { cantidad: 1, unidad: 'unidad' } },
  },
  hiperSmash: {
    nombre: 'La Hiper Smash', categoria: 'hamburguesas', precio: 16000, emoji: '🍔',
    fotoUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80',
    descripcion: '75g carne smash, cebolla blanca, 2 láminas queso cheddar, salsa pepinillo',
    ingredientes: { carne: { cantidad: 75, unidad: 'g' }, panHamburguesa: { cantidad: 1, unidad: 'unidad' }, queso: { cantidad: 2, unidad: 'lamina' }, empaque: { cantidad: 1, unidad: 'unidad' } },
  },
  dobleZona: {
    nombre: 'La Doble Zona', categoria: 'hamburguesas', precio: 22000, emoji: '🍔',
    fotoUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80',
    descripcion: '2 carnes 125g, queso cheddar, tocineta, lechuga romana, tomate, cebolla, salsa pepinillo',
    ingredientes: { carne: { cantidad: 250, unidad: 'g' }, panHamburguesa: { cantidad: 1, unidad: 'unidad' }, queso: { cantidad: 2, unidad: 'lamina' }, tocineta: { cantidad: 30, unidad: 'g' }, empaque: { cantidad: 1, unidad: 'unidad' } },
  },
  choriperro: {
    nombre: 'El Choriperro Calle', categoria: 'perros', precio: 14000, emoji: '🌭',
    fotoUrl: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=400&q=80',
    descripcion: 'Chorizo mexicano, pan perro, salsa tomate, salsa crema, salsa de la casa',
    ingredientes: { chorizo: { cantidad: 1, unidad: 'unidad' }, panPerro: { cantidad: 1, unidad: 'unidad' }, empaque: { cantidad: 1, unidad: 'unidad' } },
  },
  suizoUrbano: {
    nombre: 'El Suizo Urbano', categoria: 'perros', precio: 13000, emoji: '🌭',
    fotoUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c18516?w=400&q=80',
    descripcion: 'Salchicha suiza, pan perro, papas ripio, salsa pepinillo',
    ingredientes: { salchichaSubiza: { cantidad: 1, unidad: 'unidad' }, panPerro: { cantidad: 1, unidad: 'unidad' }, papa: { cantidad: 80, unidad: 'g' }, aceite: { cantidad: 0.05, unidad: 'litro' }, empaque: { cantidad: 1, unidad: 'unidad' } },
  },
  picadaZona: {
    nombre: 'Picada Zona Break', categoria: 'picadas', precio: 28000, emoji: '🍖',
    fotoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    descripcion: '80g pollo, 80g chorizo, 80g lomo cerdo, 150g papas francesas',
    ingredientes: { pollo: { cantidad: 80, unidad: 'g' }, chorizo: { cantidad: 0.5, unidad: 'unidad' }, bordana: { cantidad: 80, unidad: 'g' }, papa: { cantidad: 150, unidad: 'g' }, aceite: { cantidad: 0.08, unidad: 'litro' }, empaque: { cantidad: 1, unidad: 'unidad' } },
  },
  salchipapa: {
    nombre: 'Salchipapa Zona Mix', categoria: 'extras', precio: 10000, emoji: '🍟',
    fotoUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80',
    descripcion: 'Papas fritas crocantes con salchicha, salsas de la casa',
    ingredientes: { papa: { cantidad: 200, unidad: 'g' }, aceite: { cantidad: 0.1, unidad: 'litro' }, empaque: { cantidad: 1, unidad: 'unidad' } },
  },
  papachorreada: {
    nombre: 'Papa Chorreada Break', categoria: 'extras', precio: 8000, emoji: '🥔',
    fotoUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400&q=80',
    descripcion: 'Papa crispy con salsa especial de la casa y queso fundido',
    ingredientes: { papa: { cantidad: 150, unidad: 'g' }, queso: { cantidad: 1, unidad: 'lamina' }, aceite: { cantidad: 0.08, unidad: 'litro' }, empaque: { cantidad: 1, unidad: 'unidad' } },
  },
  lomoUrbano: {
    nombre: 'Sándwich Lomo Urbano', categoria: 'extras', precio: 15000, emoji: '🥪',
    fotoUrl: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=400&q=80',
    descripcion: 'Lomo de cerdo a la plancha, pan artesanal, salsas y vegetales frescos',
    ingredientes: { bordana: { cantidad: 150, unidad: 'g' }, panHamburguesa: { cantidad: 1, unidad: 'unidad' }, empaque: { cantidad: 1, unidad: 'unidad' } },
  },
  cocaCola: { nombre: 'Coca Cola Original', categoria: 'bebidas', precio: 5000, emoji: '🥤', fotoUrl: '', descripcion: 'Coca Cola original 350ml', ingredientes: {} },
  cocaColaZero: { nombre: 'Coca Cola Zero', categoria: 'bebidas', precio: 5000, emoji: '🥤', fotoUrl: '', descripcion: 'Coca Cola Zero azúcar 350ml', ingredientes: {} },
  teHatsu: { nombre: 'Té Hatsu', categoria: 'bebidas', precio: 6000, emoji: '🍵', fotoUrl: '', descripcion: 'Té natural Hatsu', ingredientes: {} },
  sodaHatsu: { nombre: 'Soda Hatsu', categoria: 'bebidas', precio: 6000, emoji: '🫧', fotoUrl: '', descripcion: 'Soda natural Hatsu', ingredientes: {} },
  canadry: { nombre: 'Canada Dry', categoria: 'bebidas', precio: 5000, emoji: '🥤', fotoUrl: '', descripcion: 'Ginger Ale Canada Dry', ingredientes: {} },
  aguaHatsu: { nombre: 'Agua Hatsu', categoria: 'bebidas', precio: 5000, emoji: '💧', fotoUrl: '', descripcion: 'Agua natural Hatsu', ingredientes: {} },
  aguaSaborizante: { nombre: 'Agua Saborizante', categoria: 'bebidas', precio: 4000, emoji: '💧', fotoUrl: '', descripcion: 'Agua con sabor natural', ingredientes: {} },
  colombiana: { nombre: 'Colombiana', categoria: 'bebidas', precio: 4000, emoji: '🥤', fotoUrl: '', descripcion: 'Colombiana 350ml', ingredientes: {} },
  heineken: { nombre: 'Heineken', categoria: 'bebidas', precio: 8000, emoji: '🍺', fotoUrl: '', descripcion: 'Cerveza Heineken 330ml', ingredientes: {} },
  corinita: { nombre: 'Corinita', categoria: 'bebidas', precio: 5000, emoji: '🍺', fotoUrl: '', descripcion: 'Cerveza Corinita', ingredientes: {} },
  clubColombia: { nombre: 'Club Colombia', categoria: 'bebidas', precio: 7000, emoji: '🍺', fotoUrl: '', descripcion: 'Cerveza Club Colombia', ingredientes: {} },
  millar: { nombre: 'Millar', categoria: 'bebidas', precio: 5000, emoji: '🍺', fotoUrl: '', descripcion: 'Cerveza Millar', ingredientes: {} },
  estela: { nombre: 'Estela', categoria: 'bebidas', precio: 5000, emoji: '🍺', fotoUrl: '', descripcion: 'Cerveza Estela', ingredientes: {} },
  mojito: { nombre: 'Mojito', categoria: 'cocteles', precio: 15000, emoji: '🍸', fotoUrl: '', descripcion: 'Ron blanco, limón, menta, azúcar, soda', ingredientes: {} },
  margarita: { nombre: 'Margarita Clásica', categoria: 'cocteles', precio: 16000, emoji: '🍹', fotoUrl: '', descripcion: 'Tequila, triple sec, limón, sal', ingredientes: {} },
  cubaLibre: { nombre: 'Cuba Libre', categoria: 'cocteles', precio: 14000, emoji: '🥃', fotoUrl: '', descripcion: 'Ron, Coca Cola, limón, hielo', ingredientes: {} },
  tequilaSunrise: { nombre: 'Tequila Sunrise', categoria: 'cocteles', precio: 16000, emoji: '🌅', fotoUrl: '', descripcion: 'Tequila, jugo naranja, granadina', ingredientes: {} },
  pinaColada: { nombre: 'Piña Colada', categoria: 'cocteles', precio: 16000, emoji: '🍍', fotoUrl: '', descripcion: 'Ron, crema de coco, jugo de piña, hielo', ingredientes: {} },
  michelada: { nombre: 'Michelada', categoria: 'cocteles', precio: 12000, emoji: '🍺', fotoUrl: '', descripcion: 'Cerveza, limón, salsas, hielo, chile', ingredientes: {} },
  limonadaCoco: { nombre: 'Limonada de Coco', categoria: 'sinAlcohol', precio: 9000, emoji: '🥥', fotoUrl: '', descripcion: 'Limonada natural con coco rallado y hierbabuena', ingredientes: {} },
  limonadaRojos: { nombre: 'Limonada Frutos Rojos', categoria: 'sinAlcohol', precio: 9000, emoji: '🍓', fotoUrl: '', descripcion: 'Limonada con frutos rojos naturales', ingredientes: {} },
};

module.exports.CONFIG_IMPUESTOS = {
  iva: 0,
  servicio: 8,
  ivaIncluido: true,
};
