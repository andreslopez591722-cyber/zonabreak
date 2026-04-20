require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectDb } = require('./config/db');

const authRoutes      = require('./routes/auth');
const productsRoutes  = require('./routes/products');
const ordersRoutes    = require('./routes/orders');
const partnersRoutes  = require('./routes/partners');
const deliveryRoutes  = require('./routes/delivery');
const inventoryRoutes = require('./routes/inventory');
const expensesRoutes  = require('./routes/expenses');
const reportsRoutes   = require('./routes/reports');
const recipesRoutes   = require('./routes/recipes');
const costeoRoutes    = require('./routes/costeo');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

app.set('io', io);

app.use(cors({ origin: true }));
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth',      authRoutes);
app.use('/api/products',  productsRoutes);
app.use('/api/orders',    ordersRoutes);
app.use('/api/partners',  partnersRoutes);
app.use('/api/delivery',  deliveryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/expenses',  expensesRoutes);
app.use('/api/reports',   reportsRoutes);
app.use('/api/recipes',   recipesRoutes);
app.use('/api/costeo',    costeoRoutes);

app.get('/api/public/config', (_req, res) => {
  res.json({
    whatsapp: {
      cocina: process.env.WHATSAPP_COCINA || '',
      caja:   process.env.WHATSAPP_CAJA   || '',
      admin:  process.env.WHATSAPP_ADMIN  || '',
    },
    brand: 'ZONA BREAK',
  });
});

const frontendDir = path.join(__dirname, '..', 'frontend');
const rootDir     = path.join(__dirname, '..');
app.use(express.static(frontendDir));
app.use('/components', express.static(path.join(rootDir, 'components')));

app.get('*', (req, res) => {
  if (!req.path.includes('.') && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(frontendDir, 'index.html'));
  }
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

connectDb()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 ZONA BREAK → http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('❌ No se pudo conectar a MongoDB:', e.message);
    process.exit(1);
  });

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
