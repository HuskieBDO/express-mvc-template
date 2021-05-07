require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const passport = require('passport');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

require('./config/passport');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes/api'));

io.on('connection', (socket) => {
  console.log('Socket connection ID', socket.id);
});

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
