import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth';
import styles from '../styles/login.module.css';
import { Alert } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);
  const setUsuario = useAuthStore((state) => state.setUsuario); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();

      try {
        const data = JSON.parse(text);

        if (!res.ok) {
          throw new Error(data.error || 'Error al iniciar sesión');
        }

        setToken(data.token);
        setUsuario(data.usuario);
        navigate('/dashboard');
      } catch (jsonError) {
        throw new Error('Respuesta inválida del servidor: ' + text);
      }
    } catch (err) {
      let mensaje = err.message;

      if (mensaje.includes('Failed to fetch')) {
        mensaje = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else if (mensaje.includes('Email o contraseña incorrectos')) {
        mensaje = 'Email o contraseña incorrectos. Por favor verifica tus datos.';
      } else if (mensaje.includes('Respuesta inválida del servidor')) {
        mensaje = 'Hubo un problema con la respuesta del servidor. Intenta nuevamente.';
      }

      setError(mensaje);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Alert variant="danger">{error}</Alert>}
          <button type="submit">Ingresar</button>
        </form>
        <button
  type="button"
  className={styles.registerBtn}
  onClick={() => navigate('/register')}
>
  ¿No tenés cuenta? Registrate
</button>

      </div>
    </div>
  );
}

export default Login;
