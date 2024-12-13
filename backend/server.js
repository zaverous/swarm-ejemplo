const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 5000;

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: 'http://135.236.97.129', // Allow requests from your frontend
    methods: ['GET', 'POST'],
    credentials: true
  },
  transport: ['websocket'] //Force Websocket as the only transport
});


// Listen for connections
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // Listen for custom events
  socket.on('message', (msg) => {
    console.log('Message received:', msg);

    // Broadcast the message to all connected clients
    io.emit('message', msg);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A client disconnected:', socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

