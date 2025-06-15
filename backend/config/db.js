// Importa mongoose para conectarnos a MongoDB
const mongoose = require('mongoose');

// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

// Función asincrónica para conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

// Exporta la función
module.exports = connectDB;
