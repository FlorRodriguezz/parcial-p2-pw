import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function CategoriaPage() {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  setLoading(true);
  setError(null);
  fetch(`http://localhost:3000/api/productos?categoria=${categoria}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setProductos(data.data);
      } else {
        setError("No se pudieron cargar los productos");
      }
      setLoading(false);
    })
    .catch(() => {
      setError("Error en la conexión");
      setLoading(false);
    });
}, [categoria]);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <h2>Productos en categoría: {categoria}</h2>
      <Row>
        {productos.length === 0 && <p>No hay productos en esta categoría.</p>}
        {productos.map(prod => (
          <Col key={prod._id} sm={6} md={4} lg={3} className="mb-3">
            <Card>
              <Card.Img variant="top" src={prod.imagen} />
              <Card.Body>
                <Card.Title>{prod.nombre}</Card.Title>
                <Card.Text>{prod.descripcion}</Card.Text>
                <Card.Text><strong>${prod.precio}</strong></Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CategoriaPage;
