const express = require('express');
const router = express.Router();

const {
  crearPedido,
  verMisPedidos,
  verTodosLosPedidos,
  actualizarEstadoPedido,
} = require('../controllers/pedidoController');

const { verifyToken } = require('../middlewares/authMiddleware');
const checkRol = require('../middlewares/checkRol');

// Crear un pedido (cliente)
router.post('/', verifyToken, checkRol('cliente'), crearPedido);

// Ver pedidos propios (cliente)
router.get('/mios', verifyToken, checkRol('cliente'), verMisPedidos);

// Ver todos los pedidos (admin)
router.get('/', verifyToken, checkRol('admin'), verTodosLosPedidos);

// Cambiar estado de pedido (admin)
router.put('/:id', verifyToken, checkRol('admin'), actualizarEstadoPedido);

module.exports = router;

