const mongoose = require('../config/db');

const getChats = async (req, res) => {
  const db = mongoose.connection.db;
  try {
    const chats = await db.collection('Chats').find({ members: req.user.id }).toArray();
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar chats' });
  }
};

const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const db = mongoose.connection.db;

  try {
    const message = {
      chatId: new mongoose.Types.ObjectId(chatId),
      sender: new mongoose.Types.ObjectId(req.user.id),
      content,
      createdAt: new Date(),
    };

    await db.collection('Messages').insertOne(message);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
};

const getMessages = async (req, res) => {
  const db = mongoose.connection.db;
  try {
    const messages = await db.collection('Messages').find({ chatId: new mongoose.Types.ObjectId(req.params.chatId) }).toArray();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

module.exports = { getChats, sendMessage, getMessages };
