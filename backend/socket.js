const setupSocket = (io) => {
    io.on('connection', (socket) => {
      console.log(`Usuario conectado: ${socket.id}`);
  
      socket.on('sendMessage', (message) => {
        io.to(message.chatId).emit('receiveMessage', message);
      });
  
      socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
      });
    });
  };
  
  module.exports = setupSocket;
  