import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ChatBox.css";
import assets from "../../assets/assets";
import api from '../../api'

const ChatBox = ({ activeChatId }) => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    if (!activeChatId) {
      console.log("No hay chatId activo.");
      return;
    }

    console.log("Cargando mensajes para chatId:", activeChatId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/Messages?chatId=${activeChatId}`, {
        headers: {
          method: "GET",
          Authorization: `Bearer ${token}`,
        },
      });

    console.log("Respuesta del servidor:", response.data);

    if (response.ok) {
      const data = await response.json(); // Convertir el flujo en JSON
      console.log("Mensajes recibidos del servidor:", data);

      if (Array.isArray(data)) {
        setMessages(data); // Actualizar el estado con los mensajes
      } else {
        console.error("Respuesta inesperada del servidor:", data);
        setMessages([]); // Vaciar el estado si la respuesta no es válida
      }
    } else {
      console.error("Error en la solicitud al servidor:", response.status, response.statusText);
      setMessages([]); // Vaciar el estado si hay un error en la respuesta
    }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error.message || error);
      setMessages([]); // Vaciar el estado si hay un error en la solicitud
    }
  };

    useEffect(() => {
      if (activeChatId) {
        fetchMessages();
      }
    }, [activeChatId]);

    return (
      <div className="chat-box">
      <div className="chat-user">
        <img src={assets.profile_img} alt="Chat User" />
        <p>Chat {activeChatId}</p>
      </div>
      <div className="chat-msg">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div key={message._id} className="msg">
              <img src={message.sender.avatar} alt={message.sender.username} />
              <p>
                <strong>{message.sender.username}:</strong> {message.content}
              </p>
            </div>
          ))
        ) : (
          <p>No hay mensajes para este chat.</p>
        )}
      </div>
      {/* <div className="chat-input">
        <input
          type="text"
          placeholder="Send a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div> */}
    </div>
    );

  };

export default ChatBox;
