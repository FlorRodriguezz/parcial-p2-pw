import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/navbar.module.css';
import useAuthStore from '../store/auth'; 
import { useState } from 'react';

function NavBar() {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/buscar?query=${encodeURIComponent(busqueda.trim())}`);
      setBusqueda('');
    }
  };

  return (
    <Navbar expand="lg" className={`bg-dark ${styles.navbar}`} variant="dark" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className={styles.brand}>
          BlairStore
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className={styles.link}>Inicio</Nav.Link>
            
            {usuario && (usuario.rol === 'admin' || usuario.rol === 'vendedor') ? (
              <Nav.Link as={Link} to="/dashboard" className={styles.link}>Productos</Nav.Link>
            ) : (
            <Nav.Link as={Link} to="/productos" className={styles.link}>Productos</Nav.Link>
            )}


            {usuario && usuario.rol === 'cliente' && (
              <>
                <Nav.Link as={Link} to="/carrito" className={styles.link}>Carrito</Nav.Link>
                <Nav.Link as={Link} to="/mis-pedidos" className={styles.link}>Mis Pedidos</Nav.Link>
              </>
            )}

            {usuario && usuario.rol === 'admin' && (
              <Nav.Link as={Link} to="/pedidos" className={styles.link}>Pedidos</Nav.Link>
            )}

            {!usuario ? (
              <>
                <Nav.Link as={Link} to="/login" className={styles.link}>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className={styles.link}>Registrarse</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link disabled className={styles.usuario}>
                  {usuario.nombre}
                </Nav.Link>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  onClick={handleLogout}
                  className={styles.logoutBtn}
                >
                  Logout
                </Button>
              </>
            )}

            <form className={styles.searchForm} onSubmit={handleBuscar}>
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className={styles.searchInput}
              />
            </form>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
