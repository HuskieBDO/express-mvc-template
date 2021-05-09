const { User } = require('../models');
const { ChatMessage } = require('../models');

module.exports = {
  async sendMessage(socket, payload, io) {
    const userId = socket.request.user?.id || null;

    if (!userId) return socket.emit('unauthorized', {});

    const { text } = payload;

    const message = await ChatMessage.create({
      userId,
      text,
    });

    const messagesModel = await ChatMessage.findByPk(message.toJSON().id, {
      include: 'user',
    });

    return io.of('/chat').emit('chat.newMessage', messagesModel.toJSON());
  },

  async getMessages(socket, callback) {
    const messages = await ChatMessage.findAll({
      include: 'user',
      order: [['createdAt', 'ASC']],
    });
    return callback(messages);
  },
};
