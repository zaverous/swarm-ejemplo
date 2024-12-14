import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./ChatBox.css";
import assets from "../../assets/assets";
import api from '../../api'

const ChatBox = ({ activeChatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId) {
        console.log("No hay chatId activo.");
        return;
      }

      console.log("Cargando mensajes para chatId:", activeChatId);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://135.236.97.129/api/Messages?chatId=${activeChatId}`, {
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
          setMessages(data);
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
    fetchMessages();
  }, [activeChatId]);


  useEffect(() => {
    // Scroll al último mensaje cuando cambien los mensajes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


   // Manejar el envío de mensajes
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/Messages",
        {
          chatId: activeChatId,
          content: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        console.log("Mensaje enviado:", response.data);
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
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div key={message._id} className="msg">
              <img
                src={message.sender?.avatar || assets.profile_img}
                alt={message.sender?.username || "Usuario"}
              />
              <p>
                <strong>{message.sender?.username || "Desconocido"}:</strong>{" "}
                {message.content}
              </p>
            </div>
          ))
        ) : (
          <p>No hay mensajes para este chat.</p>
        )}
        <div ref={messagesEndRef}></div>
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

  };

export default ChatBox;
