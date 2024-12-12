const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  isGroup: { type: Boolean, required: true },
  groupName: { type: String, required: false },
  groupAvatar: { type: String, required: false },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});


const Chat = mongoose.model('Chat', chatSchema, 'Chats');

module.exports = Chat;