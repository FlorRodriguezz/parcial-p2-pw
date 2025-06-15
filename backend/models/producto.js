const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
nombre: { type: String, required: true, unique: true },
 descripcion: { type: String }, 
precio: { type: Number},
stock: { type: Number, default: 0 },
imagen: { type: String } 
}, { collection: 'productos'});
const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;
