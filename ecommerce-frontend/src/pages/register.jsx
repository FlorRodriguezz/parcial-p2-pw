import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth';
import styles from '../styles/register.module.css';

function Register() {
  const { setToken, setUsuario } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'cliente',
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en el registro');

      setToken(data.token);
      setUsuario(data.usuario);

      setExito('Registro exitoso. Redirigiendo...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h2>Registro de Usuario</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {exito && <Alert variant="success">{exito}</Alert>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select name="rol" value={formData.rol} onChange={handleChange}>
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
            <option value="vendedor">Vendedor</option>
          </select>

          <button type="submit" className={styles.registerBtn}>
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

