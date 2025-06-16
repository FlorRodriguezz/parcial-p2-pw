import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; 
import styles from '../styles/home.module.css';

function Home() {
  return (
    <div className={styles.home}>
      <div
        className={styles.hero}
        style={{ backgroundImage: "url('/img/portadaa.jpg')" }}
      >
        <h1>New Winter Collection</h1>
        <p>Classic Winter Fits</p>
        <Button variant="light">Shop Now</Button>
      </div>

      <Container className="mt-5">
        <h2 className={styles.sectionTitle}>Shop Categories</h2>
        <Row className="mt-4">
          <Col md={3}>
            <div className={styles.categoryCard}>
              <Link to="/categoria/ropa">
                <img src="/img/ropa.jpg" alt="Ropa" />
                <p>Ropa</p>
              </Link>
            </div>
          </Col>
          <Col md={3}>
            <div className={styles.categoryCard}>
              <Link to="/categoria/accesorios">
                <img src="/img/cartera.jpg" alt="Accesorios" />
                <p>Accesorios</p>
              </Link>
            </div>
          </Col>
          <Col md={3}>
            <div className={styles.categoryCard}>
              <Link to="/categoria/zapatos">
                <img src="/img/zapatos.jpg" alt="Zapatos" />
                <p>Zapatos</p>
              </Link>
            </div>
          </Col>
          <Col md={3}>
            <div className={styles.categoryCard}>
              <Link to="/categoria/joyeria">
                <img src="/img/joyas.jpg" alt="Joyas" />
                <p>Joyas</p>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
