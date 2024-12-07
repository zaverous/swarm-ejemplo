/* const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret123';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authenticate;
 */

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret123';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado
  console.log('Token recibido:', token);
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado' }); // Sin token
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verificar el token
    console.log('Token decodificado:', decoded);
    req.user = decoded; // Guardar el usuario decodificado en la solicitud
    next(); // Pasar al siguiente middleware
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(401).json({ error: 'Token inválido o expirado' }); // Token no válido
  }
};

module.exports = authenticate;
