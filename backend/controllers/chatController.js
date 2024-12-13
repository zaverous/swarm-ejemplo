const { mongoose } = require('../config/db');
const Chat = require('../models/chatModel');  // Asegúrate de tener el modelo Chat configurado correctamente
const Message = require('../models/messageModel');  // Asegúrate de importar el modelo Message

// Obtener los chats de un usuario
// Función auxiliar para asegurar que la conexión esté lista
async function ensureDBConnected() {
  if (mongoose.connection.readyState !== 1) {
    console.log('Esperando conexión a la base de datos...');
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve); // Espera el evento 'connected'
    });
  }
}


const getChats = async (req, res) => {
  try {
  await ensureDBConnected();
  const chats = await Chat.find({ members: req.user.id })
  .populate('messages')
  .sort({ createdAt: -1 })
  ;   

  for (let chat of chats){
    const chatId2 = new mongoose.Types.ObjectId(String (chat.id));

    //CAMBIO DE LUISA
    const lastMessage = await Message.findOne({ chatId: chatId2 })
    .populate('sender', 'username avatar')
    .sort({createdAt: -1});
    if(lastMessage){
      chat.lastMessage = lastMessage.content;
      chat.lastMessageSender = lastMessage.sender.username;
    }else{
      chat.lastMessage = null;
      chat.lastMessageSender = null;}
  }
  res.status(200).json(chats);
  } catch (error) {
    console.error("Error al obtener los chats:", error);
    res.status(500).json({ message: "Error al obtener los chats" });
  }
};

module.exports = { getChats};//, sendMessage, getMessages };
