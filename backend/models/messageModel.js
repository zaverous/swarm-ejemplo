// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  mediaUrl: { type: String, required: false },
  mediaType: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

messageSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v; // Eliminar el campo __v al convertir a JSON
    return ret;
  },
});

const Message = mongoose.model('Message', messageSchema, 'Messages');
module.exports = Message;

