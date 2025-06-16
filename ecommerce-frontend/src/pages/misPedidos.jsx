import { useEffect, useState } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import useAuthStore from '../store/auth';

function MisPedidos() {
  const { token } = useAuthStore();
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/pedidos/mios', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error al cargar pedidos');

        setPedidos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPedidos();
  }, [token]);

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Mis Pedidos</h2>

      {pedidos.length === 0 && <p>No has realizado pedidos aún.</p>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Productos</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido._id}>
              <td>{pedido._id}</td>
              <td>{new Date(pedido.createdAt).toLocaleString()}</td>
              <td>{pedido.estado}</td>
              <td>
                <ul>
                  {pedido.productos.map(({ producto, cantidad }) => (
                    <li key={producto?._id || Math.random()}>
                      {producto ? (
                        <>
                          {producto.nombre} - Cantidad: {cantidad} - Precio unitario: ${producto.precio}
                        </>
                      ) : (
                        'Producto no encontrado'
                      )}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default MisPedidos;
