import { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Alert, Spinner } from 'react-bootstrap';
import useAuthStore from '../store/auth';

function Pedidos() {
  const { token, usuario } = useAuthStore();
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState(null);

  const estados = ['pendiente', 'enviado', 'cancelado'];

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!token || !usuario || usuario.rol !== 'admin') {
        setError('Acceso denegado');
        setCargando(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/pedidos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al cargar pedidos');
        setPedidos(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPedidos();
  }, [token, usuario]);

  const actualizarEstado = async (id, nuevoEstado) => {
    setActualizandoId(id);
    try {
      const res = await fetch(`http://localhost:3000/api/pedidos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar estado');

 
      setPedidos((prev) =>
        prev.map((p) => (p._id === id ? data.pedido : p))
      );

      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setActualizandoId(null);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Gestión de Pedidos</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {cargando && <Spinner animation="border" />}

      {!cargando && pedidos.length === 0 && <p>No hay pedidos aún.</p>}

      {!cargando && pedidos.length > 0 && (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p._id}>
                <td>{p.usuario?.nombre || 'Sin nombre'}</td>
                <td>
                  <ul>
                    {p.productos.map((item) => (
                      <li key={item.producto?._id || Math.random()}>
                        {item.producto
                          ? `${item.producto.nombre} x ${item.cantidad}`
                          : 'Producto no encontrado'}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{p.estado}</td>
                <td>
                  <Form.Select
                    value={p.estado}
                    disabled={actualizandoId === p._id}
                    onChange={(e) => actualizarEstado(p._id, e.target.value)}
                  >
                    {estados.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </Form.Select>
                  {actualizandoId === p._id && (
                    <Spinner animation="border" size="sm" className="ms-2" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Pedidos;

