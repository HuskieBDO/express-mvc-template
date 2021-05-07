const { body } = require('express-validator');
const db = require('../models');
const User = db.User;

module.exports = ValidateRegister = () => {
  return [
    body('email')
      .isEmail()
      .custom(async (value) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
          throw new Error('Email already exists');
        }
        return true;
      }),
    body('password').isLength({ min: 5 }),
    body('passwordConfirmation').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ];
};
