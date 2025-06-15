const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
   // Referencia al usuario que hizo el pedido
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  productos: [
    {
       // Referencia al producto pedido 
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },
        // Cantidad solicitada para ese producto (mínimo 1)
      cantidad: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  // Estado del pedido
  estado: {
    type: String,
    enum: ['pendiente', 'enviado', 'cancelado'],
    default: 'pendiente'
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Pedido', pedidoSchema);
