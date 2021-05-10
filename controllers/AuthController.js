const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

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

          return res.json({ message: 'Successful loggedin', data: { token } });
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

          return res.json({
            message: 'Successful registered',
            data: { token },
          });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  },

  async profile(req, res, next) {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
      const usr = await User.findByPk(user.id, {
        include: 'socials',
      });
      if (!usr) {
        return res.status(400).send({
          message: 'User not found',
        });
      }
      return res.status(200).send({
        data: usr.toJSON(),
      });
    })(req, res, next);
  },

  async redirect(req, res, next) {
    const { provider } = req.params;
    const { token } = req.query;
    passport.authenticate(provider, {
      session: false,
      scope: ['email'],
      state: `token=${token}&redirect=${req.get('Referrer')}`,
    })(req, res, next);
  },

  async callback(req, res, next) {
    const { provider } = req.params;
    await passport.authenticate(
      provider,
      {
        session: false,
      },
      (err, user) => {
        if (err) return next(new Error('connection denied'));
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
        const backUrl = req.get('Referrer')
          ? req.get('Referrer')
          : 'http://localhost:3000';
        return res.redirect(`${backUrl}?token=${token}`);
      }
    )(req, res, next);
  },
};
