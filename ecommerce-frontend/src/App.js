import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Register from './pages/register';
import Carrito from './pages/carrito';
import Pedidos from './pages/pedidos';
import NavbarApp from './components/navbar';
import MisPedidos from './pages/misPedidos';
import useAuthStore from './store/auth'; 
import GaleriaProductos from './pages/galeriaProductos';
import Categoria from './pages/categoria';

function ProtectedRoute({ children }) {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <NavbarApp />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<GaleriaProductos />} />
        <Route path="/categoria/:categoria" element={<Categoria />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute>
              <Pedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-pedidos"
          element={
            <ProtectedRoute>
              <MisPedidos />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

