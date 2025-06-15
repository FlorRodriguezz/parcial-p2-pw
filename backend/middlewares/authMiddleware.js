const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header recibido:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'No hay token, acceso denegado' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extraído:', token);

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token mal formado, acceso denegado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Payload verificado:', payload);
    req.usuario = payload.usuario;
    next();
  } catch (error) {
    console.error('Error en verifyToken:', error.message);
    return res.status(401).json({ 
      success: false, 
      error: error.message === 'jwt expired' ? 'Token expirado' : 'Token inválido' 
    });
  }
};

// Middleware para verificar si el usuario es admin
const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ success: false, error: 'Acceso denegado, no es administrador' });
  }
  next();
};

module.exports = {
  verifyToken,
  verificarAdmin
};


