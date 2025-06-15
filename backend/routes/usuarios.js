const express = require('express');
const router = express.Router();
const { 
    registrarUsuario, 
    loginUsuario,
    validarRegistro
 } = require('../controllers/usuarioController');

// Ruta para registrar usuario
router.post('/registro', validarRegistro, registrarUsuario);

// Ruta para login usuario
router.post('/login', loginUsuario);

module.exports = router;
