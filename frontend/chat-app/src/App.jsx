import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Conectar a Socket.IO en el backend (puerto 3001)
const socket = io('http://localhost:3001');

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Escuchar los mensajes que el servidor emite
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('receiveMessage');  // Limpiar el evento al desmontar el componente
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', message);  // Enviar mensaje al servidor
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Chat en Vivo</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje"
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default App;
