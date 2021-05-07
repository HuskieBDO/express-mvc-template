const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
const passport = require('passport');

const {
  validateLogin,
  validateRegister,
  validate,
} = require('../../validator');

router.post('/login', validateLogin(), validate, AuthController.login);
router.post('/register', validateRegister(), validate, AuthController.register);
router.get('/profile', AuthController.profile);

router.get('/social/:provider', AuthController.redirect);
router.get('/social/:provider/callback', AuthController.callback);

module.exports = router;
