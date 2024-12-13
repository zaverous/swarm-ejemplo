const mongoose = require('../config/db');
const Message = require('../models/messageModel'); // Modelo de mensajes
const Chat = require('../models/chatModel'); // Modelo de chats

const getMessages = async (req, res) => {
  const { chatId } = req.query; // Se espera un parámetro `chatId` en la query string

  console.log("Obteniendo mensajes para chatId:", chatId);

  try {
    // Buscar mensajes relacionados con el chatId
    const messages = await Message.find({ chatId })
      .populate('sender', 'username avatar') // Poblamos el remitente con campos relevantes
      .sort({ createdAt: -1 }); // Ordenar por fecha de creación

    console.log("Mensajes encontrados:", messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    res.status(500).json({ message: "Error al obtener los mensajes" });
  }
};

const sendMessage = async (req, res) => {
  const { chatId, content, mediaUrl, mediaType } = req.body;

  console.log("Enviando mensaje al chatId:", chatId);

  try {
    // Crear un nuevo mensaje
    const message = new Message({
      chatId,
      sender: req.user.id, // Obtenemos el ID del usuario autenticado
      content,
      mediaUrl,
      mediaType,
      createdAt: new Date(),
    });

    // Guardar el mensaje en la base de datos
    await message.save();

    const populatedMessage = await message.populate("sender", "username avatar"); // Poblamos los detalles del usuario

    const chat = await Chat.findById(chatId);
    chat.messages.push(message._id);
    await chat.save();

    console.log("Mensaje enviado:", message);
    res.status(201).json(message);
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
};

module.exports = { getMessages, sendMessage };
