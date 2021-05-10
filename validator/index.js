const { validationResult } = require('express-validator');

const validateLogin = require('./validateLogin');
const validateRegister = require('./validateRegister');
const validateProfile = require('./validateProfile');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors.array().reduce((acc, err) => {
    acc.push({ [err.param]: err.msg });
    return acc;
  }, []);

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validateLogin,
  validateRegister,
  validate,
};
