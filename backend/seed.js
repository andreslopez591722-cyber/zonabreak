require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { connectDb } = require('./config/db');
const { Product, Inventory, Partner, DeliveryPerson } = require('./models');

async function run() {
  await connectDb();
  console.log('🌱 Seeding ZONA BREAK...');

  // ── SOCIOS ─────────────────────────────────────────────────
  await Partner.deleteMany({});
  await Partner.insertMany([
    { name: 'Jesús',  percentage: 30, sortOrder: 0 },
    { name: 'Didier', percentage: 20, sortOrder: 1 },
    { name: 'Marlon', percentage: 50, sortOrder: 2 },
  ]);
  console.log('✅ Socios');

  // ── INVENTARIO ─────────────────────────────────────────────
  await Inventory.deleteMany({});
  await Inventory.insertMany([
    { key: 'carne',      name: 'Carne de res',        unit: 'kg',     stock: 50,  minStock: 5,  costPerUnit: 30000 },
    { key: 'bordana',    name: 'Bordana/Lomo cerdo',   unit: 'kg',     stock: 30,  minStock: 3,  costPerUnit: 11000 },
    { key: 'pollo',      name: 'Pollo',               unit: 'kg',     stock: 40,  minStock: 5,  costPerUnit: 30000 },
    { key: 'cerdo',      name: 'Costilla de cerdo',   unit: 'kg',     stock: 20,  minStock: 3,  costPerUnit: 18000 },
    { key: 'papa',       name: 'Papa',                unit: 'kg',     stock: 80,  minStock: 10, costPerUnit: 3000  },
    { key: 'queso',      name: 'Queso cheddar',       unit: 'unidad', stock: 300, minStock: 30, costPerUnit: 625   },
    { key: 'chorizo',    name: 'Chorizo',             unit: 'unidad', stock: 60,  minStock: 10, costPerUnit: 13333 },
    { key: 'tocineta',   name: 'Tocineta',            unit: 'kg',     stock: 10,  minStock: 1,  costPerUnit: 75000 },
    { key: 'aceite',     name: 'Aceite',              unit: 'litro',  stock: 20,  minStock: 2,  costPerUnit: 30000 },
    { key: 'pan_hamb',   name: 'Pan hamburguesa',     unit: 'unidad', stock: 200, minStock: 20, costPerUnit: 1200  },
    { key: 'pan_perro',  name: 'Pan perro caliente',  unit: 'unidad', stock: 150, minStock: 15, costPerUnit: 1100  },
    { key: 'pan_sand',   name: 'Pan sándwich/baguette', unit: 'unidad', stock: 100, minStock: 15, costPerUnit: 1500 },
    { key: 'salchicha',  name: 'Salchicha suiza',     unit: 'unidad', stock: 100, minStock: 10, costPerUnit: 3500  },
    { key: 'empaque',    name: 'Empaque/Caja',        unit: 'unidad', stock: 500, minStock: 50, costPerUnit: 4000  },
    { key: 'carbon',     name: 'Carbón/Leña',         unit: 'kg',     stock: 30,  minStock: 5,  costPerUnit: 2000  },
  ]);
  console.log('✅ Inventario');

  // ── REPARTIDORES ────────────────────────────────────────────
  await DeliveryPerson.deleteMany({});
  await DeliveryPerson.insertMany([
    { name: 'Carlos Domicilios', phone: '3001234001' },
    { name: 'Pedro Rider',       phone: '3001234002' },
  ]);
  console.log('✅ Repartidores');

  // ── PRODUCTOS ───────────────────────────────────────────────
  await Product.deleteMany({});
  await Product.insertMany([

    // ── HAMBURGUESAS ──────────────────────────────────────────
    {
      name: 'La Callejera 150', slug: 'callejera-150', category: 'hamburguesas',
      price: 18000, emoji: '🍔',
      description: '150g carne, lechuga romana, salsa tártara, queso, tocineta, mermelada pimentón, cebolla',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'carne',    amount: 150, unit: 'g' },
        { ingredientKey: 'pan_hamb', amount: 1,   unit: 'unidad' },
        { ingredientKey: 'queso',    amount: 1,   unit: 'unidad' },
        { ingredientKey: 'tocineta', amount: 20,  unit: 'g' },
        { ingredientKey: 'empaque',  amount: 1,   unit: 'unidad' },
      ],
    },
    {
      name: 'La Hiper Smash', slug: 'hiper-smash', category: 'hamburguesas',
      price: 16000, emoji: '🍔',
      description: '75g carne smash, cebolla blanca, 2 láminas queso cheddar, salsa pepinillo',
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'carne',    amount: 75, unit: 'g' },
        { ingredientKey: 'pan_hamb', amount: 1,  unit: 'unidad' },
        { ingredientKey: 'queso',    amount: 2,  unit: 'unidad' },
        { ingredientKey: 'empaque',  amount: 1,  unit: 'unidad' },
      ],
    },
    {
      name: 'La Doble Zona', slug: 'doble-zona', category: 'hamburguesas',
      price: 22000, emoji: '🍔',
      description: '2 carnes 125g, queso cheddar, tocineta, lechuga romana, tomate, cebolla, salsa pepinillo',
      imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'carne',    amount: 250, unit: 'g' },
        { ingredientKey: 'pan_hamb', amount: 1,   unit: 'unidad' },
        { ingredientKey: 'queso',    amount: 2,   unit: 'unidad' },
        { ingredientKey: 'tocineta', amount: 30,  unit: 'g' },
        { ingredientKey: 'empaque',  amount: 1,   unit: 'unidad' },
      ],
    },

    // ── PERROS CALIENTES ──────────────────────────────────────
    {
      name: 'El Choriperro Calle', slug: 'choriperro-calle', category: 'perros',
      price: 14000, emoji: '🌭',
      description: 'Chorizo mexicano, pan perro, salsa tomate, salsa crema, salsa de la casa',
      imageUrl: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'chorizo',   amount: 1, unit: 'unidad' },
        { ingredientKey: 'pan_perro', amount: 1, unit: 'unidad' },
        { ingredientKey: 'empaque',   amount: 1, unit: 'unidad' },
      ],
    },
    {
      name: 'El Suizo Urbano', slug: 'suizo-urbano', category: 'perros',
      price: 13000, emoji: '🌭',
      description: 'Salchicha suiza, pan perro, papas ripio, salsa pepinillo',
      imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c18516?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'salchicha', amount: 1,  unit: 'unidad' },
        { ingredientKey: 'pan_perro', amount: 1,  unit: 'unidad' },
        { ingredientKey: 'papa',      amount: 80, unit: 'g' },
        { ingredientKey: 'aceite',    amount: 50, unit: 'ml' },
        { ingredientKey: 'empaque',   amount: 1,  unit: 'unidad' },
      ],
    },

    // ── SÁNDWICHES ────────────────────────────────────────────
    {
      name: 'Sándwich Lomo Urbano', slug: 'sandwich-lomo', category: 'sandwiches',
      price: 15000, emoji: '🥪',
      description: 'Lomo de cerdo a la plancha, pan artesanal, salsas y vegetales frescos',
      imageUrl: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'bordana',  amount: 150, unit: 'g' },
        { ingredientKey: 'pan_sand', amount: 1,   unit: 'unidad' },
        { ingredientKey: 'empaque',  amount: 1,   unit: 'unidad' },
      ],
    },
    {
      name: 'Sándwich Pollo Crispy', slug: 'sandwich-pollo', category: 'sandwiches',
      price: 14000, emoji: '🥪',
      description: 'Pechuga de pollo apanada, lechuga, tomate, salsa de la casa',
      imageUrl: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'pollo',    amount: 150, unit: 'g' },
        { ingredientKey: 'pan_sand', amount: 1,   unit: 'unidad' },
        { ingredientKey: 'empaque',  amount: 1,   unit: 'unidad' },
      ],
    },
    {
      name: 'Sándwich Mixto Zona', slug: 'sandwich-mixto', category: 'sandwiches',
      price: 16000, emoji: '🥪',
      description: 'Tocineta, queso derretido, carne, vegetales y salsa especial en pan tostado',
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'carne',    amount: 100, unit: 'g' },
        { ingredientKey: 'tocineta', amount: 30,  unit: 'g' },
        { ingredientKey: 'queso',    amount: 1,   unit: 'unidad' },
        { ingredientKey: 'pan_sand', amount: 1,   unit: 'unidad' },
        { ingredientKey: 'empaque',  amount: 1,   unit: 'unidad' },
      ],
    },

    // ── PICADAS ────────────────────────────────────────────────
    {
      name: 'Picada Zona Break', slug: 'picada-zona', category: 'picadas',
      price: 28000, emoji: '🍖',
      description: '80g pollo, 80g chorizo, 80g lomo cerdo, 150g papas francesas',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'pollo',   amount: 80,  unit: 'g' },
        { ingredientKey: 'chorizo', amount: 1,   unit: 'unidad' },
        { ingredientKey: 'bordana', amount: 80,  unit: 'g' },
        { ingredientKey: 'papa',    amount: 150, unit: 'g' },
        { ingredientKey: 'aceite',  amount: 80,  unit: 'ml' },
        { ingredientKey: 'empaque', amount: 1,   unit: 'unidad' },
      ],
    },
    {
      name: 'Picada Carnes Mix', slug: 'picada-carnes', category: 'picadas',
      price: 35000, emoji: '🍖',
      description: '100g carne, 100g cerdo, 100g pollo, chorizo y papas fritas — para dos',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'carne',   amount: 100, unit: 'g' },
        { ingredientKey: 'cerdo',   amount: 100, unit: 'g' },
        { ingredientKey: 'pollo',   amount: 100, unit: 'g' },
        { ingredientKey: 'chorizo', amount: 1,   unit: 'unidad' },
        { ingredientKey: 'papa',    amount: 200, unit: 'g' },
        { ingredientKey: 'aceite',  amount: 100, unit: 'ml' },
        { ingredientKey: 'empaque', amount: 1,   unit: 'unidad' },
      ],
    },

    // ── ASADOS ────────────────────────────────────────────────
    {
      name: 'Costilla BBQ Zona', slug: 'costilla-bbq', category: 'asados',
      price: 32000, emoji: '🥩',
      description: 'Costilla de cerdo marinada al carbón con salsa BBQ casera y ensalada',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'cerdo',   amount: 300, unit: 'g' },
        { ingredientKey: 'carbon',  amount: 200, unit: 'g' },
        { ingredientKey: 'empaque', amount: 1,   unit: 'unidad' },
      ],
    },
    {
      name: 'Pechuga a la Brasa', slug: 'pechuga-brasa', category: 'asados',
      price: 24000, emoji: '🥩',
      description: 'Pechuga de pollo al carbón, acompañada de papas y ensalada fresca',
      imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'pollo',   amount: 250, unit: 'g' },
        { ingredientKey: 'papa',    amount: 150, unit: 'g' },
        { ingredientKey: 'aceite',  amount: 50,  unit: 'ml' },
        { ingredientKey: 'carbon',  amount: 150, unit: 'g' },
        { ingredientKey: 'empaque', amount: 1,   unit: 'unidad' },
      ],
    },
    {
      name: 'Churrasco Break', slug: 'churrasco-break', category: 'asados',
      price: 38000, emoji: '🥩',
      description: 'Carne de res al carbón, término a elección, con papas y chimichurri casero',
      imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'carne',   amount: 300, unit: 'g' },
        { ingredientKey: 'papa',    amount: 150, unit: 'g' },
        { ingredientKey: 'carbon',  amount: 200, unit: 'g' },
        { ingredientKey: 'empaque', amount: 1,   unit: 'unidad' },
      ],
    },

    // ── EXTRAS ────────────────────────────────────────────────
    {
      name: 'Salchipapa Zona Mix', slug: 'salchipapa', category: 'extras',
      price: 10000, emoji: '🍟',
      description: 'Papas fritas crocantes con salchicha y salsas de la casa',
      imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'papa',      amount: 200, unit: 'g' },
        { ingredientKey: 'salchicha', amount: 1,   unit: 'unidad' },
        { ingredientKey: 'aceite',    amount: 100, unit: 'ml' },
        { ingredientKey: 'empaque',   amount: 1,   unit: 'unidad' },
      ],
    },
    {
      name: 'Papa Chorreada Break', slug: 'papa-chorreada', category: 'extras',
      price: 8000, emoji: '🥔',
      description: 'Papa crispy con salsa especial de la casa y queso fundido',
      imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&q=80',
      stockDeduct: [
        { ingredientKey: 'papa',    amount: 150, unit: 'g' },
        { ingredientKey: 'queso',   amount: 1,   unit: 'unidad' },
        { ingredientKey: 'aceite',  amount: 80,  unit: 'ml' },
        { ingredientKey: 'empaque', amount: 1,   unit: 'unidad' },
      ],
    },

    // ── BEBIDAS ───────────────────────────────────────────────
    { name: 'Coca Cola Original',    slug: 'coca-cola',        category: 'bebidas', price: 5000, emoji: '🥤', description: 'Coca Cola original 350ml',    imageUrl: '', stockDeduct: [] },
    { name: 'Coca Cola Zero',        slug: 'coca-cola-zero',   category: 'bebidas', price: 5000, emoji: '🥤', description: 'Coca Cola Zero sin azúcar',   imageUrl: '', stockDeduct: [] },
    { name: 'Té Hatsu',              slug: 'te-hatsu',         category: 'bebidas', price: 6000, emoji: '🍵', description: 'Té natural Hatsu',            imageUrl: '', stockDeduct: [] },
    { name: 'Soda Hatsu',            slug: 'soda-hatsu',       category: 'bebidas', price: 6000, emoji: '🫧', description: 'Soda natural Hatsu',          imageUrl: '', stockDeduct: [] },
    { name: 'Canada Dry',            slug: 'canada-dry',       category: 'bebidas', price: 5000, emoji: '🥤', description: 'Ginger Ale Canada Dry',       imageUrl: '', stockDeduct: [] },
    { name: 'Agua Hatsu',            slug: 'agua-hatsu',       category: 'bebidas', price: 5000, emoji: '💧', description: 'Agua natural Hatsu',          imageUrl: '', stockDeduct: [] },
    { name: 'Agua Saborizante',      slug: 'agua-saborizante', category: 'bebidas', price: 4000, emoji: '💧', description: 'Agua con sabor natural',      imageUrl: '', stockDeduct: [] },
    { name: 'Colombiana',            slug: 'colombiana',       category: 'bebidas', price: 4000, emoji: '🥤', description: 'Colombiana 350ml',            imageUrl: '', stockDeduct: [] },
    { name: 'Heineken',              slug: 'heineken',         category: 'bebidas', price: 8000, emoji: '🍺', description: 'Cerveza Heineken 330ml',      imageUrl: '', stockDeduct: [] },
    { name: 'Corinita',              slug: 'corinita',         category: 'bebidas', price: 5000, emoji: '🍺', description: 'Cerveza Corinita',            imageUrl: '', stockDeduct: [] },
    { name: 'Club Colombia',         slug: 'club-colombia',    category: 'bebidas', price: 7000, emoji: '🍺', description: 'Cerveza Club Colombia',       imageUrl: '', stockDeduct: [] },
    { name: 'Millar',                slug: 'millar',           category: 'bebidas', price: 5000, emoji: '🍺', description: 'Cerveza Millar',             imageUrl: '', stockDeduct: [] },
    { name: 'Estela',                slug: 'estela',           category: 'bebidas', price: 5000, emoji: '🍺', description: 'Cerveza Estela',             imageUrl: '', stockDeduct: [] },

    // ── COCTELES ──────────────────────────────────────────────
    { name: 'Mojito',            slug: 'mojito',          category: 'cocteles', price: 15000, emoji: '🍸', description: 'Ron blanco, limón, menta, azúcar, soda',     imageUrl: '', stockDeduct: [] },
    { name: 'Margarita Clásica', slug: 'margarita',       category: 'cocteles', price: 16000, emoji: '🍹', description: 'Tequila, triple sec, limón, sal',             imageUrl: '', stockDeduct: [] },
    { name: 'Cuba Libre',        slug: 'cuba-libre',      category: 'cocteles', price: 14000, emoji: '🥃', description: 'Ron, Coca Cola, limón, hielo',                imageUrl: '', stockDeduct: [] },
    { name: 'Tequila Sunrise',   slug: 'tequila-sunrise', category: 'cocteles', price: 16000, emoji: '🌅', description: 'Tequila, jugo naranja, granadina',            imageUrl: '', stockDeduct: [] },
    { name: 'Piña Colada',       slug: 'pina-colada',     category: 'cocteles', price: 16000, emoji: '🍍', description: 'Ron, crema de coco, jugo de piña, hielo',     imageUrl: '', stockDeduct: [] },
    { name: 'Michelada',         slug: 'michelada',       category: 'cocteles', price: 12000, emoji: '🍺', description: 'Cerveza, limón, salsas, hielo, chile',        imageUrl: '', stockDeduct: [] },

    // ── SIN ALCOHOL ───────────────────────────────────────────
    { name: 'Limonada de Coco',      slug: 'limonada-coco',  category: 'sinAlcohol', price: 9000, emoji: '🥥', description: 'Limonada natural con coco rallado y hierbabuena', imageUrl: '', stockDeduct: [] },
    { name: 'Limonada Frutos Rojos', slug: 'limonada-rojos', category: 'sinAlcohol', price: 9000, emoji: '🍓', description: 'Limonada con frutos rojos naturales',               imageUrl: '', stockDeduct: [] },
  ]);

  console.log('✅ Productos cargados (catálogo completo con Sándwiches, Picadas y Asados)');
  console.log('\n🎉 ¡Seed completado! La app está lista.');
  process.exit(0);
}

run().catch(e => {
  console.error('❌ Error seed:', e.message);
  process.exit(1);
});
