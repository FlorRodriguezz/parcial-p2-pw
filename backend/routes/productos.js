const express = require('express');
const router = require('express').Router();
const {
  listarProductos,
  crearProducto,
  validarProducto,
  consultarStock,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productoController');

const { verifyToken } = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/checkRol');

// Listar todos los productos - pública
router.get('/', listarProductos);

// Consultar stock por nombre - pública
router.get('/stock', consultarStock);

// Obtener producto por ID - pública 
router.get('/:id', obtenerProductoPorId);

// Crear producto (solo admin)
router.post('/', verifyToken, checkRol('admin'), validarProducto, crearProducto);

// Actualizar producto (solo admin)
router.put('/:id', verifyToken, checkRol('admin'), validarProducto, actualizarProducto);

// Eliminar producto (solo admin)
router.delete('/:id', verifyToken, checkRol('admin'), eliminarProducto);

module.exports = router;
