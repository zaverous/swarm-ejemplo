const express = require('express');
const app = express();
const port = 3000;

// Serve static HTML
app.get('/', (req, res) => {
  res.send(`
    <h1>Frontend with Socket.IO</h1>
    <p>Open your browser console to see real-time messages.</p>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <script>
      // Connect to the backend
      const socket = io('http://135.236.97.129', {
		transports: ['websocket'], // Force WebSocket transport
	});

      // Listen for messages
      socket.on('message', (msg) => {
        console.log('Message from backend:', msg);
      });

      // Emit a message
      socket.emit('message', 'Hello from the frontend!');
    </script>
  `);
});

app.listen(port, () => {
  console.log(`Frontend running on port ${port}`);
});

