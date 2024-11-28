const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Permitir solicitudes desde React
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // Permitir cookies si es necesario
  }
});

// Middleware CORS para Express
app.use(cors({
  origin: 'http://localhost:5173', // Permitir solicitudes desde React
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

mongoose.connect('mongodb://localhost:27017/chatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado', socket.id);

  socket.on('sendMessage', (message) => {
    console.log('Mensaje recibido:', message);
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado', socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
