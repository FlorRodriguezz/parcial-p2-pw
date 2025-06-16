import { useEffect, useState } from 'react';
import styles from '../styles/galeria.module.css';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import useCartStore from '../store/cart';

function GaleriaProductos() {
  const [productos, setProductos] = useState([]);
  const [visibleDesc, setVisibleDesc] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);

  const { carrito, agregarAlCarrito } = useCartStore();

  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProductos(data.data);
      })
      .catch(err => {
        console.error('Error al cargar productos', err);
      });
  }, []);

  const toggleDescripcion = (id) => {
    setVisibleDesc(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const abrirModal = (producto) => {
    setProductoSeleccionado(producto);
    setCantidadSeleccionada(1);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setProductoSeleccionado(null);
  };

  const manejarAgregarAlCarrito = () => {
    if (!productoSeleccionado) return;

    if (cantidadSeleccionada < 1) {
      alert("La cantidad debe ser al menos 1");
      return;
    }
    if (cantidadSeleccionada > productoSeleccionado.stock) {
      alert(`No hay suficiente stock. Stock máximo: ${productoSeleccionado.stock}`);
      return;
    }

    agregarAlCarrito(productoSeleccionado, cantidadSeleccionada);
    cerrarModal();
  };

  return (
    <Container className={styles.galeriaContainer}>
      <h2 className={styles.titulo}>Productos Destacados</h2>
      <div className={styles.grid}>
        {productos.map((prod) => {
          const imgSrc = prod.imagen?.startsWith('http') ? prod.imagen : `/img/${prod.imagen || 'default.jpg'}`;
          const enCarrito = carrito.find(p => p._id === prod._id);

          return (
            <div key={prod._id} className={styles.card}>
              <img src={imgSrc} alt={prod.nombre} className={styles.cardImg} />
              <h3>{prod.nombre}</h3>
              {visibleDesc[prod._id] && <p>{prod.descripcion}</p>}
              <p><strong>${prod.precio}</strong></p>
              <div className={styles.botones}>
                <button
                  className={styles.botonVerMas}
                  onClick={() => toggleDescripcion(prod._id)}
                >
                  {visibleDesc[prod._id] ? 'Ver menos' : 'Ver más'}
                </button>
                <button
                  className={styles.botonAgregar}
                  onClick={() => abrirModal(prod)}
                >
                  {enCarrito ? `Añadir más (${enCarrito.cantidad})` : 'Añadir al carrito'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>Agregar al carrito</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {productoSeleccionado && (
            <>
              <p><strong>{productoSeleccionado.nombre}</strong></p>
              <p>Stock disponible: {productoSeleccionado.stock}</p>
              <Form>
                <Form.Group controlId="cantidadInput">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={productoSeleccionado.stock}
                    value={cantidadSeleccionada}
                    onChange={e => setCantidadSeleccionada(Number(e.target.value))}
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={cerrarModal}>Cancelar</Button>
          <Button variant="dark" onClick={manejarAgregarAlCarrito}>Agregar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GaleriaProductos;


