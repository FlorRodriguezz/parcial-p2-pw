// Middleware para manejar errores en la aplicación
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.stack);

  // Manejo de errores específicos de validación de Mongoose
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Datos inválidos",
      details: err.errors
    });
  }

  // Manejo de error de duplicado en base de datos (clave única)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: "El producto ya existe"
    });
  }

  res.status(500).json({
    success: false,
    error: "Error interno del servidor"
  });
};

module.exports = errorHandler;
