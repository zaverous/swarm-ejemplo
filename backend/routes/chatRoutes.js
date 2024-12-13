const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messagesController');
const authenticate = require('../middleware/authenticate');
const { getUserChats } = require('../controllers/userController');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const router = express.Router();

// Obtener los chats de un usuario
router.get('/', authenticate, async (req, res) => {

  router.get('/Messages', authenticate, getMessages);

  try {
    // Obtener los chats del usuario y sus mensajes
    const chats = await Chat.find({ members: req.user.id })
      .populate('messages')  // Poblamos los mensajes del chat
      .sort({ createdAt: -1 });  // Ordenamos los chats por fecha de creación (más reciente primero)
    console.log("Los chats del usuario "+req.user.id+" son... ",chats);
    const individualChats = chats.filter(chat => !chat.isGroup);
    const groupChats = chats.filter(chat => chat.isGroup);
      // Devolver los chats en un objeto con ambas categorías
    res.status(200).json(chats);
    // Devolver los chats ordenados por fecha
    //res.status(200).json(chats);
  } catch (error) {
    console.error("Error al obtener los chats:", error);
    res.status(500).json({ message: "Error al obtener los chats" });
  }
});
// Obtener todos los chats del usuario autenticado

  

module.exports = router;

