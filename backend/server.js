// server.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const setupSocket = require('./socket');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

connectDB().then(() => {
  // Solo arrancar el servidor después de que la conexión a MongoDB sea exitosa
  app.use(cors());
  app.use(express.json());

  // Rutas
  app.use('/api/users', userRoutes);
  app.use('/api/chats', chatRoutes);

  // Configuración de Socket.IO
  setupSocket(io);

  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });

  const adminRoutes = require('./routes/adminRoutes');
  app.use('/admin', adminRoutes); // Ahora las rutas estarán bajo '/admin'
}).catch((error) => {
  console.error('Error al conectar con la base de datos:', error);
});