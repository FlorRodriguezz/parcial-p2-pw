const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Middleware de validación para el registro
const validarRegistro = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').notEmpty().withMessage('El rol es obligatorio')
    .isIn(['admin', 'cliente']).withMessage('El rol debe ser admin o cliente'),
 
  // Middleware para verificar si hubo errores de validación
    (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ success: false, errores: errores.array() });
    }
    next();
  }
];

// Controlador para registrar usuario
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ success: false, error: 'El email ya está registrado' });
    }

    // Crear nuevo usuario
    const usuario = new Usuario({ nombre, email, password, rol });
    await usuario.save();

    res.status(201).json({
  success: true,
  mensaje: 'Usuario registrado correctamente',
  usuario: {
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  }
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
};

// Controlador para login
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ success: false, error: 'Email o contraseña incorrectos' });
    }

    const esValido = await usuario.compararPassword(password);
    if (!esValido) {
      return res.status(400).json({ success: false, error: 'Email o contraseña incorrectos' });
    }

     // Crea payload con datos del usuario para el token JWT
    const payload = {
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({
      success: true,
      token,
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error del servidor al hacer login' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  validarRegistro
};

