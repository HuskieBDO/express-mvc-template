const { body } = require('express-validator');

const validateLogin = () => {
  return [body('email').isEmail(), body('password').isLength({ min: 5 })];
};

module.exports = validateLogin;
