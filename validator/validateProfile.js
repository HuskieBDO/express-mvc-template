const Joi = require('joi');

const { User } = require('../models');

const validateProfile = {
  body: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().trim().min(3).required(),
    passwordConfirmation: Joi.ref('password'),
  }),
};

module.exports = validateProfile;
