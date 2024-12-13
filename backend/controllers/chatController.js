const mongoose = require('../config/db');
const Chat = require('../models/chatModel');  // Asegúrate de tener el modelo Chat configurado correctamente
const Message = require('../models/messageModel');  // Asegúrate de importar el modelo Message

// Obtener los chats de un usuario
const getChats = async (req, res) => {
  try {
    // Obtener los chats donde el usuario es miembro, poblamos los mensajes de cada chat
    const chats = await Chat.find({ members: req.user.id })
      .populate('messages')  // Poblamos los mensajes del chat
      .populate('members', 'username avatar')  // Poblamos los miembros del chat (solo campos relevantes)
      .sort({ createdAt: -1 });  // Ordenamos los chats por fecha de creación (más reciente primero)

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error al obtener los chats:", error);
    res.status(500).json({ message: "Error al obtener los chats" });
  }
};

// Enviar un mensaje
/* const sendMessage = async (req, res) => {
  const { chatId, content, mediaUrl, mediaType } = req.body;
  
  try {
    // Creamos el nuevo mensaje en la base de datos
    const message = new Message({
      chatId: new mongoose.Types.ObjectId(chatId),
      sender: req.user._id,
      content,
      mediaUrl,
      mediaType,
      createdAt: new Date(),
    });

    // Guardamos el mensaje
    await message.save();

    // Actualizamos el chat agregando el nuevo mensaje
    const chat = await Chat.findById(chatId);
    chat.messages.push(message._id);
    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ message: "Error al enviar mensaje" });
  }
}; */

/* const getMessages = async (req, res) => {
  const { chatId } = req.query; // Usamos req.query en lugar de req.params

  console.log("chatId recibido:", chatId);

  try {
    if (!chatId) {
      return res.status(400).json({ message: "Se requiere un chatId para obtener mensajes" });
    }

    // Filtrar mensajes por el campo chatId
    const messages = await Message.find({ chatId })
      .populate('sender', 'username avatar') // Poblar datos del remitente
      .sort({ createdAt: 1 }); // Ordenar de más antiguo a más reciente
    
      console.log("Mensajes encontrados:", messages);

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    res.status(500).json({ message: "Error al obtener los mensajes" });
  }
}; */



module.exports = { getChats};//, sendMessage, getMessages };