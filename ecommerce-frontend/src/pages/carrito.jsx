import { useState } from 'react';
import { Container, Table, Button, Form, Alert } from 'react-bootstrap';
import useAuthStore from '../store/auth';
import useCartStore from '../store/cart';
import styles from '../styles/carrito.module.css';

function Carrito() {
  const { token } = useAuthStore();
  const carrito = useCartStore(state => state.carrito);
  const limpiarCarrito = useCartStore(state => state.limpiarCarrito);
  const actualizarCantidad = useCartStore(state => state.actualizarCantidad);
  const eliminarDelCarrito = useCartStore(state => state.eliminarDelCarrito);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const confirmarPedido = async () => {
    if (carrito.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    const productosEnviar = carrito.map(p => ({ producto: p._id, cantidad: p.cantidad }));

    try {
      const res = await fetch('http://localhost:3000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productos: productosEnviar }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar pedido');

      limpiarCarrito();
      setMensaje('Pedido realizado con éxito');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <Container className={styles.container}>
      <h2 className={styles.titulo}>Mi Carrito</h2>

      {mensaje && <Alert variant="success" className={styles.alerta}>{mensaje}</Alert>}
      {error && <Alert variant="danger" className={styles.alerta}>{error}</Alert>}

      {carrito.length === 0 ? (
        <p className="text-center">Tu carrito está vacío</p>
      ) : (
        <>
          <Table bordered className={styles.tabla}>
            <thead>
              <tr>
                <th className={styles.thead}>Producto</th>
                <th className={styles.thead}>Cantidad</th>
                <th className={styles.thead}>Precio</th>
                <th className={styles.thead}>Subtotal</th>
                <th className={styles.thead}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item._id}>
                  <td className={styles.tbody}>{item.nombre}</td>
                  <td className={styles.tbody}>
                    <Form.Control
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.cantidad}
                      onChange={(e) => {
                        const nuevaCantidad = parseInt(e.target.value);
                        if (nuevaCantidad <= item.stock) {
                          actualizarCantidad(item._id, nuevaCantidad);
                        } else {
                          alert(`Solo hay ${item.stock} unidades disponibles`);
                        }
                      }}
                    />
                  </td>
                  <td className={styles.tbody}>${item.precio}</td>
                  <td className={styles.tbody}>${item.precio * item.cantidad}</td>
                  <td className={styles.tbody}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarDelCarrito(item._id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h5 className="mt-3 text-end">Total: <strong>${total}</strong></h5>

          <div className="d-flex justify-content-end">
            <Button className={`mt-3 ${styles.boton}`} onClick={confirmarPedido}>
              Confirmar pedido
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Carrito;
