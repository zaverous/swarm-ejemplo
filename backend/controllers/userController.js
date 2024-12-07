/*const jwt = require('jsonwebtoken');
const {mongoose} = require('../config/db');
const SECRET_KEY = 'secret123';

// Función auxiliar para asegurar que la conexión esté lista
async function ensureDBConnected() {
  if (mongoose.connection.readyState !== 1) {
    console.log('Esperando conexión a la base de datos...');
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve); // Espera el evento 'connected'
    });
  }
}

// Controlador de registro de usuario
async function registerUser(req, res) {
  try {
    await ensureDBConnected(); // Asegurar conexión
    const db = mongoose.connection.db; // Ahora debería estar conectado

    const { username, email, password } = req.body;

    // Resto de lógica para insertar usuario
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    await db.collection('users').insertOne({ 
      _id: new mongoose.Types.ObjectId(), //Genera un ID único
      username, 
      email, 
      password
     });
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const db = mongoose.connection.db;

  try {
    const user = await db.collection('Users').findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
};

module.exports = { registerUser, loginUser };

*/

/*const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  if(!mongoose.connection || mongoose.connection.readyState !== 1){
    console.error('ERROR 500: Conexión a la base de datos no disponible');
  }

  const db = mongoose.connection.db;

  try {
    const existingUser = await db.collection('Users').findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario ya existe' });
    }

    await db.collection('Users').insertOne({ username, email, password, createdAt: new Date() });
    res.status(201).json({ message: 'Registro exitoso' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro' });
  }
};*/

const jwt = require('jsonwebtoken');
const { mongoose } = require('../config/db');
const SECRET_KEY = 'secret123';

// Función auxiliar para asegurar que la conexión esté lista
async function ensureDBConnected() {
  if (mongoose.connection.readyState !== 1) {
    console.log('Esperando conexión a la base de datos...');
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve); // Espera el evento 'connected'
    });
  }
}

// Controlador de registro de usuario
async function registerUser(req, res) {
  console.log("Datos recibidos en el registro:", req.body);
  try {
    await ensureDBConnected(); // Asegurar conexión
    const db = mongoose.connection.db; // Ahora debería estar conectado

    const { username, email, password } = req.body;

    // Comprobar si el email ya está registrado
    const existingUser = await db.collection('Users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Insertar el nuevo usuario con los datos proporcionados
    await db.collection('Users').insertOne({ 
      _id: new mongoose.Types.ObjectId(), // Genera un ID único
      username, 
      email, 
      password, 
      avatar: 'https://example.com/default-avatar.png', // Valor predeterminado para avatar
      status: 'offline', // Valor predeterminado para status
      createdAt: new Date(), // Fecha de creación del usuario
      blockedUsers: [], // Lista vacía para blockedUsers
      contacts: [] // Lista vacía para contacts
    });

    // Responder con éxito
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message || error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}

// Controlador de inicio de sesión de usuario
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const db = mongoose.connection.db;

  try {
    // Buscar usuario en la base de datos
    const user = await db.collection('Users').findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    // Responder con el token
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message || error);
    res.status(500).json({ error: 'Error en el inicio de sesión', details: error.message });
  }
};

module.exports = { registerUser, loginUser };
