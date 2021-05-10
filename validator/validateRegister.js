const { body } = require('express-validator');

const { User } = require('../models');

const validateRegister = () => {
  return [
    body('email')
      .normalizeEmail()
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

module.exports = validateRegister;
