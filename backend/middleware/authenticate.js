const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret123';

const authenticate = (req, res, next) => {
  // Comprobamos si el encabezado de la solicitud contiene el token
  const token = req.headers.authorization?.split(' ')[1]; 
  //console.log('Token recibido:', token);

  //app.options("*", cors());

  // Si no hay token en los encabezados, devolvemos un error
  if (!token) {
    console.log('No se encontró el token');
    return res.status(401).json({ error: 'Acceso denegado' }); // Sin token
  }

  try {
    // Intentamos verificar y decodificar el token
    const decoded = jwt.verify(token, SECRET_KEY);
    //console.log('Token decodificado:', decoded); // Log del contenido del token decodificado

    // Asignamos el usuario decodificado a req.user
    req.user = decoded;
    //console.log('Usuario asignado a req.user:', req.user); // Log del usuario asignado

    // Pasamos al siguiente middleware
    next();
  } catch (error) {
    // Si ocurre un error al verificar el token, lo mostramos
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' }); // Token no válido
  }
};

module.exports = authenticate;