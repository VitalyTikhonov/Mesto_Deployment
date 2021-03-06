const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DocNotFoundError = require('../errors/DocNotFoundError');
const NoDocsError = require('../errors/NoDocsError');
const BadNewPasswordError = require('../errors/BadNewPasswordError');
const EmailInUseError = require('../errors/EmailInUseError');
const InvalidInputError = require('../errors/InvalidInputError');
const UnknownRequestorError = require('../errors/UnknownRequestorError');
const MissingCredentialsError = require('../errors/MissingCredentialsError');

const { JWT_SECRET, JWT_COOKIE_NAME } = require('../configs/config');
const { passwordRegexp } = require('../helpers/helpers');

function createUser(req, res, next) {
  const {
    userName,
    userDescription,
    avatar,
    password,
    email,
  } = req.body;

  const PSWLENGTH = 8;

  if (password && password.length >= PSWLENGTH && password.match(passwordRegexp)) {
    /* По аналогии с тем, как в тренажере предложено сделать для авторизации
    (User.findByCredentials), пытался сделать и здесь, чтобы проверять, не занята ли почта,
    прежде чем считать хеш пароля. Но не получилось разобраться с множеством ошибок, которые
    возникали. */
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({
          userName,
          userDescription,
          avatar,
          password: hash,
          email,
        })
          .then((respObj) => {
            /* переменная с деструктуризацией const {свойства} = respObj удалена
            для исключения ошибки линтинга */
            const token = jwt.sign( // делаем токен
              { _id: respObj._id },
              // { _id: '5f59fd0c710b20e7857e392' }, // невалидный айди для тестирования
              JWT_SECRET,
              { expiresIn: '7d' },
            );
            res
              .cookie(JWT_COOKIE_NAME, token, { // отправляем токен
                maxAge: 3600000 * 24 * 7,
                httpOnly: true,
                sameSite: true,
              })
              .send({
                userName: respObj.userName,
                userDescription: respObj.userDescription,
                avatar: respObj.avatar,
                email: respObj.email,
                _id: respObj._id,
              });
          })
          .catch((err) => {
            if (err instanceof mongoose.Error.ValidationError) {
              next(new InvalidInputError(err));
            } else if (err.code === 11000) {
              next(new EmailInUseError());
            }
          });
      });
  } else {
    next(new BadNewPasswordError(PSWLENGTH));
  }
}

function login(req, res, next) {
  const { email, password } = req.body;
  if (typeof email === 'string'
    && typeof password === 'string'
    /* Чем обусловены следующие две проверки: насколько я сейчас понимаю, поле password все равно
    присутсвует в запросе, даже если пароль не введен, – просто оно пустое, но это строка.
    Если так, то ошибку выбросит модель, а там у нее будет негативный текст – "Неправильные…",
    что неправильно. Если одно из полей пустое, нужно сообщать "Введите" или типа такого. */
    && email.length !== 0
    && password.length !== 0) {
    return User.findByCredentials(email, password) // return!
      .then((user) => {
        const token = jwt.sign( // делаем токен
          { _id: user._id },
          // { _id: '5f59fd0c710b20e7857e392' }, // невалидный айди для тестирования
          JWT_SECRET,
          { expiresIn: '7d' },
        );
        res
          .cookie(JWT_COOKIE_NAME, token, { // отправляем токен
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
          .send({
            /* почему здесь не отрабатывает select: false и при отправке всего user
            отправляется и пароль? */
            userName: user.userName,
            userDescription: user.userDescription,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          });
      })
      .catch(next);
  }
  return next(new MissingCredentialsError());
}

function logout(req, res) {
  res
    .clearCookie(JWT_COOKIE_NAME)
    .send({ message: 'Досвидосы!' });
  // .end();
}

function getCurrentUser(req, res, next) {
  const userId = req.user._id;
  /* идентификатор отправителя запроса (ПОДЧЕРКИВАНИЕ ПЕРЕД id!) */

  User.findById(userId)
    .orFail(new DocNotFoundError('user'))
    .then((respObj) => {
      res.send(respObj);
    })
    .catch(next);
}

function getAllUsers(req, res, next) {
  User.find({})
    .orFail(new NoDocsError('user'))
    .then((respObj) => res.send(respObj))
    .catch(next);
}

function getSingleUser(req, res, next) {
  try {
    const userId = req.params.id; // интересующего пользователя (joi-objectid)
    User.findById(userId)
      .orFail(new DocNotFoundError('user'))
      .then((respObj) => res.send(respObj))
      .catch(next);
  } catch (err) {
    next(err);
  }
}

function updateProfile(req, res, next) {
  try {
    const userId = req.user._id; // свой (проверяется в auth)
    const { userName, userDescription } = req.body;
    User.findByIdAndUpdate(
      userId,
      { userName, userDescription },
      {
        new: true,
        runValidators: true,
        upsert: false, // !!!!!!!!!!!!!
      },
    )
      .orFail(new UnknownRequestorError())
      .then((respObj) => res.send(respObj))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          return next(new InvalidInputError(err));
        }
        return next(err);
      });
  } catch (err) {
    next(err);
  }
}

function updateAvatar(req, res, next) {
  try {
    const userId = req.user._id; // свой (проверяется в auth)
    const { avatar } = req.body;
    User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: false, // !!!!!!!!!!!!!
      },
    )
      .orFail(new UnknownRequestorError())
      .then((respObj) => res.send(respObj))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          return next(new InvalidInputError(err));
        }
        return next(err);
      });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createUser,
  login,
  logout,
  getCurrentUser,
  getAllUsers,
  getSingleUser,
  updateProfile,
  updateAvatar,
};
