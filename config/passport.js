const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const VKStrategy = require('passport-vkontakte').Strategy;

const { User } = require('../models');
const { SocialAccount } = require('../models');

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      // authScheme: 'Bearer',
    },
    async (jwtPayload, done) => {
      try {
        done(null, jwtPayload);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.create({ email, password });
        done(null, user.toJSON(), { message: 'Successfully registered' });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const compare = await bcrypt.compare(password, user.password);

        if (!compare) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user.toJSON(), { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  'vkontakte',
  new VKStrategy(
    {
      clientID: 7848277, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
      clientSecret: 'zlXjuSNPOAUhNFcsTAbn',
      callbackURL: 'http://127.0.0.1:3333/api/auth/social/vkontakte/callback',
    },
    async (req, accessToken, refreshToken, params, profile, done) => {
      let token = req.query.state.includes('token')
        ? req.query.state.split('token=')[1]
        : null;
      let user = null;

      if (token === 'undefined') {
        token = null;
      }

      if (token) {
        const jwtDecoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (jwtDecoded.id) {
          user = await User.findByPk(jwtDecoded.id);
        }
      }
      const socialAccount = await SocialAccount.findOne({
        where: { sid: profile.id },
      });
      if (!user && profile.emails?.length) {
        user = await User.findOne({
          where: { email: profile.emails[0].value },
        });
      }
      if (user && !socialAccount) {
        await SocialAccount.create({
          userId: user.id,
          sid: profile.id,
          provider: 'vkontakte',
        });
      } else if (!user && socialAccount) {
        user = await User.findOne({ where: { id: socialAccount.userId } });
      } else if (!user) {
        user = await User.create({
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.emails?.length ? profile.emails[0].value : null,
          password: uuidv4(),
        });
        await SocialAccount.create({
          userId: user.id,
          sid: profile.id,
          provider: 'vkontakte',
        });
      }
      return done(null, user.toJSON());
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (e) {
    done(null, e);
  }
});
