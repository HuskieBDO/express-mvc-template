const { body } = require('express-validator');

module.exports = validateLogin = () => {
  return [body('email').isEmail(), body('password').isLength({ min: 5 })];
};
