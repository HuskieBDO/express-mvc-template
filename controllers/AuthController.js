const User = require('../models').User;
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = {
  async login(req, res, next) {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err || !user) {
          return res.status(400).json(info);
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

          return res.json({ message: 'Successful loggedin', token });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  },

  async register(req, res, next) {
    passport.authenticate('register', async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('An error occurred.');

          return next(error);
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);

          return res.json({ message: 'Successful registered', token });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  },

  async profile(req, res, next) {
    passport.authenticate(
      'jwt',
      { session: false },
      async function (err, user) {
        const _user = await User.findByPk(user.id);
        if (!_user) {
          return res.status(400).send({
            message: 'User not found',
          });
        }
        return res.status(200).send({
          data: _user.toJSON(),
        });
      }
    )(req, res, next);
  },

  redirect(req, res, next) {
    const provider = req.params.provider;
    return passport.authenticate(provider, {
      scope: ['email'],
    })(req, res, next);
  },

  callback(req, res, next) {
    const provider = req.params.provider;
    passport.authenticate(provider, {
      session: false,
    });
    res
      .status(200)
      .json({ message: 'Social auth was successful', user: req.user });
  },
};
