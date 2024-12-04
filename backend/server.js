const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { connectDB, mongoose } = require('./db'); // Conexión a MongoDB

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Puerto del frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

const SECRET_KEY = 'secret123';

app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Middleware para verificar JWT
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

// Ruta base para verificar estado del servidor
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Servidor funcionando correctamente' });
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verificar que se proporcionen username y password
  if (!username || !password) {
    return res.status(400).json({ error: 'Nombre de usuario y contraseña son obligatorios' });
  }

  try {
    const db = mongoose.connection.db;
    // Buscar al usuario por username
    const user = await db.collection('Users').findOne({ username });

    // Si el usuario no existe o la contraseña no coincide, devolver error
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Responder con el token
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

//Ruta de registro de usuarios
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const db = mongoose.connection.db;

    // Verificar si el username o email ya existen
    const existingUser = await db.collection('Users').findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario o correo ya están en uso' });
    }

    // Insertar nuevo usuario
    await db.collection('Users').insertOne({
      username,
      email,
      password, // Guardar la contraseña en texto plano
      avatar: null,
      status: 'offline',
      createdAt: new Date(),
      blockedUsers: [],
      contacts: [],
    });

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

//Cargar chats del usuario
app.get('/chats', authenticate, async (req, res) => {
  try {
    const db = mongoose.connection.db;

    // Buscar chats en los que el usuario es miembro
    const chats = await db.collection('Chats').find({
      members: new mongoose.Types.ObjectId(req.user.id),
    }).toArray();

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error al cargar chats:', error);
    res.status(500).json({ error: 'Error al cargar chats' });
  }
});

//Ruta para obtener mensajes de un chat
app.get('/messages/:chatId', authenticate, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const messages = await db.collection('Messages').find({ chatId: new mongoose.Types.ObjectId(req.params.chatId) }).toArray();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'No se pudieron obtener los mensajes' });
  }
});

//Ruta para enviar un mensaje
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/messages', authenticate, upload.single('media'), async (req, res) => {
  try {
    const { content, chatId } = req.body;
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const db = mongoose.connection.db;
    const message = {
      chatId: new mongoose.Types.ObjectId(chatId),
      sender: new mongoose.Types.ObjectId(req.user.id),
      content,
      mediaUrl,
      createdAt: new Date(),
    };

    await db.collection('Messages').insertOne(message);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'No se pudo enviar el mensaje' });
  }
});

//ruta para obtener los detalles de múltiples usuarios
app.post('/users/details', authenticate, async (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds)) {
    return res.status(400).json({ error: 'userIds debe ser un array' });
  }

  try {
    const db = mongoose.connection.db;
    const users = await db
      .collection('Users')
      .find({ _id: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) } })
      .project({ username: 1, avatar: 1 }) // Solo devolver los campos necesarios
      .toArray();

    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener detalles de usuarios:', error);
    res.status(500).json({ error: 'Error al obtener detalles de usuarios' });
  }
});


// Ruta protegida para obtener perfil del usuario
app.get('/profile', authenticate, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const user = await db.collection('Users').findOne({ _id: req.user.id });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error al obtener perfil del usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// WebSocket para chat en tiempo real
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  socket.on('sendMessage', async (message) => {
    const db = mongoose.connection.db;

    // Guardar mensaje en la base de datos
    await db.collection('Messages').insertOne({
      chatId: new mongoose.Types.ObjectId(message.chatId),
      sender: new mongoose.Types.ObjectId(message.sender),
      content: message.content,
      createdAt: new Date(),
    });

    // Emitir mensaje a todos los clientes conectados al chat
    io.to(message.chatId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Ruta para consultar la base de datos
app.get('/:collectionName', authenticate, async (req, res) => {
  const { collectionName } = req.params;

  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    const documents = await collection.find().toArray();
    res.status(200).json(documents);
  } catch (error) {
    console.error(`Error al obtener la colección ${collectionName}:`, error);
    res.status(500).json({ error: `No se pudo obtener la colección ${collectionName}` });
  }
});

// Iniciar el servidor
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
