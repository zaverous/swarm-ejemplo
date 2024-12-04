import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ChatBox.css";
import assets from "../../assets/assets";

const ChatBox = () => {
  const { chatId } = useParams(); // Obtener chatId desde la URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) {
        console.error("chatId no definido");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3001/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error("Error al cargar los mensajes");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chatId, content: newMessage }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
      } else {
        console.error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={assets.profile_img} alt="Chat User" />
        <p>Chat {chatId}</p>
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
};

export default ChatBox;
