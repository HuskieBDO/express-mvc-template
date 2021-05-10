require('dotenv').config();
const cors = require('cors');
const path = require('path');
const express = require('express');
const passport = require('passport');
const { ValidationError } = require('express-validation');

const app = express();
const server = require('http').Server(app);

require('./config/passport');
require('./config/socket')(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes/api'));

app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
