const { check, validationResult } = require('express-validator');

// Middleware de validación para el registro
const validarRegistro = [
  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  check('email')
    .isEmail().withMessage('Email inválido'),
  check('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  check('rol')
    .notEmpty().withMessage('El rol es obligatorio')
    .isIn(['admin', 'cliente']).withMessage('El rol debe ser admin o cliente'),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];

module.exports = { validarRegistro };