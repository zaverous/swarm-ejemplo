const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { connectDB, mongoose } = require('/home/adrian-cimsi/CIMSI/backend/db'); // Conexión a MongoDB

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
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

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = mongoose.connection.db;
    const user = await db.collection('Users').findOne({ username, password });

    if (!user) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// WebSocket para chat en tiempo real
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  socket.on('sendMessage', (message) => {
    console.log(`Mensaje recibido: ${message.content} de ${message.sender}`);
    io.emit('receiveMessage', message); // Enviar mensaje a todos los usuarios conectados
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// Rutas para consultar la base de datos
app.get('/:collectionName', async (req, res) => {
  const { collectionName } = req.params;

  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    const documents = await collection.find().toArray();
    res.json(documents);
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
