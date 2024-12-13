import React, { useEffect, useState } from 'react';
import './Chat.css'; // Rutas relativas
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'; // Rutas relativas
import ChatBox from '../../components/ChatBox/ChatBox';
//import RightSidebar from '../../components/RightSidebar/RightSidebar';
import { io } from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]); // Estado para mensajes
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    // Conectar al servidor de WebSocket
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
      withCredentials: true,
    });
    setSocket(newSocket);

    // Limpiar conexión al desmontar
    return () => newSocket.close();
  }, []);

  /* useEffect(() => {
    if (socket) {
      // Escuchar mensajes entrantes
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit('sendMessage', message);
    }
  };

  return (
    <div className="chat">
      <div className="chat-container">
        <LeftSidebar setActiveChatId={setActiveChatId} />
        <ChatBox activeChatId={activeChatId} messages={messages} onSendMessage={sendMessage} />
        <RightSidebar />
      </div>
    </div>
  ); */

  useEffect(() => {
    if (socket) {
      // Escuchar mensajes entrantes
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log('[Chat] Mensaje recibido por WebSocket:', message);
      });
    }
}, [socket]);

const sendMessage = (message) => {
  if (socket) {
    console.log('[Chat] Enviando mensaje por WebSocket:', message);
    socket.emit('sendMessage', message);
  }
};

return (
  <div className="chat">
    <div className="chat-container">
      {/* Pasar setActiveChatId a LeftSidebar */}
      <LeftSidebar
        setActiveChatId={(chatId) => {
          console.log("Chat seleccionado en LeftSidebar:", chatId);
          setActiveChatId(chatId);
        }}
      />
      {/* Pasar activeChatId y mensajes a ChatBox */}
      <ChatBox
        activeChatId={activeChatId}
        messages={messages}
        onSendMessage={sendMessage}
      />
      {/* <RightSidebar /> */}
    </div>
  </div>
);

};

export default Chat;
