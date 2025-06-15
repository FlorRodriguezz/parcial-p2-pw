require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const cors = require('cors');

const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');

const errorHandler = require("./middlewares/errorHandler");
const pedidosRoutes = require('./routes/pedidos');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors());


// Rutas públicas y privadas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);

app.use('/api/pedidos', pedidosRoutes);


// Middleware de manejo de errores 
app.use(errorHandler);

// Servir archivos estáticos desde /public
app.use(express.static('public'));

// Ruta de prueba
app.get("/test", (req, res) => {
  res.send("Server OK!");
});

module.exports = app;

