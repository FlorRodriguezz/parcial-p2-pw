const { body, validationResult } = require("express-validator");
const Producto = require('../models/producto');

// Middleware de validación para datos de producto
const validarProducto = [
  
   // Validar campo "nombre"
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es requerido")
    .isLength({ max: 100 }).withMessage("Máximo 100 caracteres"),

    // Validar campo "precio"
  body("precio")
    .isFloat({ gt: 0 }).withMessage("Precio debe ser mayor a 0")
    .toFloat(),

     // Validar campo "stock"
  body("stock")
    .isInt({ min: 0 }).withMessage("Stock no puede ser negativo")
    .toInt(),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next();
  }
];


// Controlador para crear un nuevo producto
const crearProducto = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const nuevoProducto = new Producto(req.body);
    const guardado = await nuevoProducto.save();
    res.status(201).json({
      success: true,
      message: 'Producto agregado correctamente',
      producto: guardado
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


// Controlador para listar todos los productos
const listarProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json({ success: true, data: productos });
  } catch (err) {
    res.status(500).json({ success: false, error: "Error al listar productos" });
  }
};


// Controlador para obtener un producto por su ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener el producto" });
  }
};


// Controlador para consultar el stock de un producto por su nombre
const consultarStock = async (req, res) => {
  const nombre = req.query.nombre;
  if (!nombre) {
    return res.status(400).json({ error: "Falta el nombre del producto" });
  }

  try {
    const producto = await Producto.findOne({ nombre });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ stock: producto.stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar el stock" });
  }
};


// Controlador para actualizar un producto por ID
const actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!productoActualizado) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, data: productoActualizado });
  } catch (error) {
    res.status(400).json({ success: false, error: "Error al actualizar el producto" });
  }
};


// Controlador para eliminar un producto por ID
const eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
      return res.status(404).json({ success: false, error: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al eliminar el producto" });
  }
};

module.exports = {
  listarProductos,
  crearProducto,
  validarProducto,
  consultarStock,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
};
