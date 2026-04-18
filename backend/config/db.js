const mongoose = require('mongoose');

async function connectDb() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI no está definida. ' +
      'En Railway: Settings > Variables > Add MONGODB_URI. ' +
      'En local: crea el archivo .env con MONGODB_URI=mongodb+srv://...'
    );
  }

  mongoose.set('strictQuery', true);

  // Opciones optimizadas para Railway / Atlas
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000, // 10s para encontrar servidor
    socketTimeoutMS: 45000,          // 45s para operaciones
  });

  console.log('✅ MongoDB Atlas conectado');
  return mongoose.connection;
}

module.exports = { connectDb };
