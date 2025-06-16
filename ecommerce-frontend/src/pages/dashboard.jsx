import { useEffect, useState } from 'react';
import { Container, Button, Table, Form, Row, Col, Alert } from 'react-bootstrap';
import useAuthStore from '../store/auth';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/dashboard.module.css';

function Dashboard() {
  const { token, usuario, logout } = useAuthStore();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [filtro, setFiltro] = useState('');
  const [editando, setEditando] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProductos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/productos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al cargar productos');
        setProductos(data.data || []);
      } catch (err) {
        let mensaje = err.message;
        if (mensaje.includes('401') || mensaje.toLowerCase().includes('token')) {
          mensaje = 'No autorizado. Por favor inicia sesión nuevamente.';
        } else if (mensaje.includes('Failed to fetch')) {
          mensaje = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else if (mensaje.includes('Error al cargar productos')) {
          mensaje = 'Hubo un problema al obtener los productos. Intenta más tarde.';
        }
        setError(mensaje);
      }
    };

    fetchProductos();
  }, [token, navigate]);

  const productosFiltrados = productos.filter(p =>
    p && p.nombre && p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const esAdminOVendedor = usuario?.rol === 'admin' || usuario?.rol === 'vendedor';

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al eliminar producto');
      setProductos(productos.filter(p => p._id !== id));
      setExito('Producto eliminado correctamente');
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  const handleEditar = (producto) => {
    setEditando(producto);
    setError('');
    setExito('');
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/api/productos/${editando._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editando),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al actualizar producto');
      setProductos(productos.map(p => (p._id === editando._id ? data.data : p)));
      setEditando(null);
      setExito('Producto actualizado correctamente');
    } catch (err) {
      setError('Error al editar: ' + err.message);
    }
  };

  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value.trim();
    const descripcion = e.target.descripcion.value.trim();
    const precio = Number(e.target.precio.value);
    const stock = Number(e.target.stock.value);
    const imagen = e.target.imagen.value.trim();
    const categoria = e.target.categoria.value.trim();
const nuevo = { nombre, descripcion, categoria, precio, stock, imagen };

    if (!nombre || !descripcion) {
      return setError('Todos los campos son obligatorios.');
    }
    if (precio <= 0 || stock < 0) {
      return setError('El precio debe ser mayor a 0 y el stock no puede ser negativo.');
    }
    try {
      const res = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al agregar producto');
      setProductos([...productos, data.producto]);

      e.target.reset();
      setExito('Producto agregado correctamente');
      setError('');
    } catch (err) {
      setError('Error al agregar: ' + err.message);
    }
  };

  useEffect(() => {
    if (error || exito) {
      const timer = setTimeout(() => {
        setError('');
        setExito('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, exito]);

  return (
    <Container fluid className={styles.dashboard}>
      <h2>Panel de Control</h2>
      {usuario && (
        <p>
          Hola, <strong>{usuario.nombre}</strong> (<em>{usuario.rol}</em>) |{' '}
          <Button variant="link" onClick={handleLogout}>Cerrar sesión</Button>
        </p>
      )}

      <Form>
        <Form.Group as={Row} controlId="formFiltro">
          <Form.Label column sm={2}>Buscar producto:</Form.Label>
          <Col sm={6}>
            <Form.Control
              type="text"
              placeholder="Nombre del producto"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </Col>
          <Col sm={2}>
            <Button onClick={() => setFiltro('')}>Limpiar</Button>
          </Col>
        </Form.Group>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {exito && <Alert variant="success" className="mt-3">{exito}</Alert>}

      <Table striped bordered hover className="mt-3">

<thead>
  <tr>
    <th>Imagen</th>
    <th>Nombre</th>
    <th>Descripción</th>
    <th>Categoría</th> 
    <th>Precio</th>
    <th>Stock</th>
    {esAdminOVendedor && <th>Acciones</th>}
  </tr>
</thead>

{/* Mostrar categoría en las filas */}
<tbody>
  {productosFiltrados.map(p => (
    <tr key={p._id}>
      <td>
        {p.imagen ? (
          <img
            src={`/img/${p.imagen}`}
            alt={p.nombre}
            style={{ width: '80px', height: 'auto', objectFit: 'cover' }}
            onError={(e) => (e.target.style.display = 'none')}
          />
        ) : '—'}
      </td>
      <td>{p.nombre}</td>
      <td>{p.descripcion}</td>
      <td>{p.categoria}</td> 
      <td>${p.precio}</td>
      <td>{p.stock}</td>
      {esAdminOVendedor && (
        <td>
          <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditar(p)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={() => handleEliminar(p._id)}>Eliminar</Button>
        </td>
      )}
    </tr>
  ))}
</tbody>

      </Table>

      {editando && (
        <Form className="mt-4" onSubmit={handleGuardarEdicion}>
          <h4>Editar Producto</h4>
          <Row className="mb-2">
            <Col>
              <Form.Control
                value={editando.nombre}
                onChange={e => setEditando({ ...editando, nombre: e.target.value })}
                placeholder="Nombre"
              />
            </Col>
            <Col>
              <Form.Control
                value={editando.descripcion}
                onChange={e => setEditando({ ...editando, descripcion: e.target.value })}
                placeholder="Descripción"
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Control
                type="number"
                value={editando.precio}
                onChange={e => setEditando({ ...editando, precio: Number(e.target.value) })}
                placeholder="Precio"
              />
            </Col>
              <Col>
    <Form.Control
      type="text"
      value={editando.categoria || ''}
      onChange={e => setEditando({ ...editando, categoria: e.target.value })}
      placeholder="Categoría (ej: Ropa, Accesorios)"
    />
  </Col>
            <Col>
              <Form.Control
                type="number"
                value={editando.stock}
                onChange={e => setEditando({ ...editando, stock: Number(e.target.value) })}
                placeholder="Stock"
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Control
  type="text"
  value={editando.imagen || ''}
  onChange={e => setEditando({ ...editando, imagen: e.target.value })}
  placeholder="Nombre del archivo de imagen (ej: cartera.jpg)"
/>
            </Col>
          </Row>
          <Button type="submit" variant="success" className="me-2">Guardar cambios</Button>
          <Button variant="secondary" onClick={() => setEditando(null)}>Cancelar</Button>
        </Form>
      )}

      {esAdminOVendedor && (
        <Form className="mt-5" onSubmit={handleAgregarProducto}>
          <h4>Agregar nuevo producto</h4>
          <Row className="mb-2">
            <Col>
              <Form.Control name="nombre" placeholder="Nombre" required />
            </Col>
            <Col>
              <Form.Control name="descripcion" placeholder="Descripción" required />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <Form.Control name="precio" type="number" placeholder="Precio" min="0.01" step="0.01" required />
            </Col>
            <Col>
              <Form.Control name="stock" type="number" placeholder="Stock" min="0" required />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
            <Form.Control name="categoria" placeholder="Categoría (ej: Ropa, Zapatos, Accesorios)" required />
            </Col>
            </Row>
          <Row className="mb-3">
            <Col>
              <Form.Control name="imagen" type="text" placeholder="Nombre del archivo de imagen (ej: cartera.jpg)" />
            </Col>
          </Row>
          <Button type="submit" variant="primary">Agregar producto</Button>
        </Form>
      )}
    </Container>
  );
}

export default Dashboard;



