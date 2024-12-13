import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ChatBox.css";
import assets from "../../assets/assets";
import api from '../../api'

/* const ChatBox = ({ activeChatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId) return; //No cargar mensajes si no hay Chat seleccionado

      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/api/Messages/${activeChatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setMessages(response.data);
        } else {
          console.error("Error al cargar los mensajes");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchMessages();
  }, [activeChatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/Messages", {
        activeChatId: activeChatId,
        content: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage("");
      } else {
        console.error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  if (!activeChatId) {
    return (
      <div className="chat-box">
        <div className="no-chat">
          <p>Selecciona un chat para empezar a conversar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={assets.profile_img} alt="Chat User" />
        <p>Chat {activeChatId}</p>
      </div>
      <div className="chat-msg">
        {messages.map((message) => (
          <div key={message._id} className="msg">
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Send a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}; */

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
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta del servidor:", response.data);

      /* if (response.status === 200) {
        console.log("Mensajes obtenidos:", response.data);
        setMessages(response.data);
      } else {
        console.error("Error al cargar los mensajes:", response.statusText);
      } */

        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error("Respuesta inesperada del servidor:", response.data);
          setMessages([]);
        }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
    };

    useEffect(() => {
      if (activeChatId) {
        fetchMessages();
      }
    }, [activeChatId]);

    return (
      <div className="chat-msg">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message._id} className="msg">
              <p>{message.content}</p>
            </div>
          ))
        ) : (
          <p>No hay mensajes para este chat.</p>
        )}
      </div>
    );

  };

export default ChatBox;
