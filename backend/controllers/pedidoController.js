const Pedido = require('../models/pedido');
const Producto = require('../models/producto');

// Crear un nuevo pedido (cliente)
const crearPedido = async (req, res) => {
  try {
    const { productos } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Debe enviar una lista de productos' });
    }

    // Validar stock y calcular cambios
    for (const item of productos) {
      const prod = await Producto.findById(item.producto);
      if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
      if (prod.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para ${prod.nombre}` });
      }
    }

    // Descontar stock
    for (const item of productos) {
      await Producto.findByIdAndUpdate(item.producto, {
        $inc: { stock: -item.cantidad }
      });
    }

   // Crea el nuevo pedido 
    const pedido = new Pedido({
      usuario: req.usuario.id,
      productos,
    });

    // Guarda el pedido en la base de datos
    const guardado = await pedido.save();
    res.status(201).json({ message: 'Pedido creado correctamente', pedido: guardado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

// Cliente: ver sus propios pedidos
const verMisPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuario.id }).populate('productos.producto', 'nombre precio');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos del usuario' });
  }
};

// Admin: ver todos los pedidos
const verTodosLosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('usuario', 'nombre email') 
      .populate('productos.producto', 'nombre precio');

    res.json(pedidos);
  } catch (error) {
    console.error("❌ Error en verTodosLosPedidos:", error.message);
    res.status(500).json({ error: 'Error al listar todos los pedidos' });
  }
};


// Admin: actualizar estado del pedido
const actualizarEstadoPedido = async (req, res) => {
  try {
    const { estado } = req.body;

    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    ).populate('usuario productos.producto');

    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

    res.json({ message: 'Estado actualizado', pedido });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
};
module.exports = {
  crearPedido,
  verMisPedidos,
  verTodosLosPedidos,
  actualizarEstadoPedido,
};
