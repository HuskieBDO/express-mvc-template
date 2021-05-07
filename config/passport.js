const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const VKStrategy = require('passport-vkontakte').Strategy;

const User = require('../models').User;
const SocialAccount = require('../models').SocialAccount;

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      // authScheme: 'Bearer',
    },
    async (jwt_payload, done) => {
      try {
        done(null, jwt_payload);
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
        done(
          null,
          { ...user.toJSON() },
          { message: 'Successfully registered' }
        );
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

        return done(
          null,
          { ...user.toJSON() },
          { message: 'Logged in Successfully' }
        );
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
    async (accessToken, refreshToken, params, profile, done) => {
      const socialAccount = await SocialAccount.findOne({
        where: { sid: profile.id },
      });
      let user = null;
      if (profile.emails.length) {
        user = await User.findOne({
          where: { email: profile.emails[0].value },
        });
      }
      if (user) {
      } else if (socialAccount) {
        user = await User.findOne({ where: { id: socialAccont.userId } });
      } else {
        user = await User.create({
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.emails.length ? profile.emails[0].value : null,
          password: uuidv4(),
        });
        await SocialAccount.create({
          userId: user.id,
          sid: profile.id,
          provider: 'vkontakte',
        });
      }
      return done(null, {
        ...user.toJSON(),
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY),
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findOne({ where: { id } });
    done(null, user);
  } catch (e) {
    done(null, e);
  }
});
