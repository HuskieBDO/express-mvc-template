const socketio = require('socket.io');
const socketioJwt = require('socketio-jwt-auth');
const { User } = require('../models');

const ChatController = require('../controllers/ChatController');

module.exports = (server) => {
  const io = socketio(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: false,
    },
  });

  /* socketioJwt.authorize({
    secret: process.env.JWT_SECRET_KEY,
    handshake: true,
    decodedPropertyName: 'user',
  }); */

  setInterval(() => {
    io.of('/chat').emit('chat.online', { count: io.engine.clientsCount });
  }, 10000);

  io.of('/chat').use((socket, next) => {
    const token = socket.handshake.headers.authorization;
    console.log(token);
    next();
  });

  io.of('/chat').use(
    socketioJwt.authenticate(
      {
        secret: process.env.JWT_SECRET_KEY,
        succeedWithoutToken: true,
      },
      async function (payload, done) {
        if (!payload) return done(null, false, 'Token expired');
        try {
          const user = await User.findByPk(payload.id);
          if (!user) {
            // return fail with an error message
            return done(null, false, 'User not found');
          }
          return done(null, user);
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  io.of('/chat').on('connection', (socket) => {
    // this socket is authenticated, we are good to handle more events from it.
    socket.on('chat.getMessages', (callback) =>
      ChatController.getMessages(socket, callback)
    );
    socket.on('chat.sendMessage', (data) =>
      ChatController.sendMessage(socket, data, io)
    );
  });
};
