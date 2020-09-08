const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DocNotFoundError = require('../errors/DocNotFoundError');
const BadNewPasswordError = require('../errors/BadNewPasswordError');
const EmailInUseError = require('../errors/EmailInUseError');
const InvalidInputError = require('../errors/InvalidInputError');
const MissingCredentialsError = require('../errors/MissingCredentialsError');

const { tempKey } = require('../configs/config.js');

const { NODE_ENV, JWT_SECRET } = process.env; // На будущее
const {
  getAllDocsHandler,
  updateHandler,
  errors,
  joinErrorMessages,
  isObjectIdValid,
  passwordRegexp,
} = require('../helpers/helpers');

function createUser(req, res, next) {
  const {
    name,
    about,
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
          name,
          about,
          avatar,
          password: hash,
          email,
        })
          .then((respObj) => {
            /* переменная с деструктуризацией const {свойства} = respObj удалена
            для исключения ошибки линтинга */
            res.send({
              name: respObj.name,
              about: respObj.about,
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
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : tempKey,
          { expiresIn: '7d' },
        );
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
          .end();

        /* Как токен попадает в req.cookies.jwt при запросе логина, то есть еще до авторизации?.. */
        // console.log('req.cookies.jwt', req.cookies.jwt);
      })
      .catch((err) => {
        if (err.statusCode === 401) {
          /* См. примечание в файле ошибки. */
          const returnedErr = err;
          returnedErr.message = errors.invalidCredentials;
          next(returnedErr);
        }
      });
  }
  return next(new MissingCredentialsError());
}

function getAllUsers(req, res) {
  getAllDocsHandler(User.find({}), req, res);
}

function getSingleUser(req, res, next) {
  try {
    const userId = req.params.id;
    isObjectIdValid(userId, 'user');
    User.findById(userId)
      .orFail()
      .then((respObj) => res.send(respObj))
      .catch((err) => {
        if (err instanceof mongoose.Error.DocumentNotFoundError) {
          next(new DocNotFoundError('user'));
        }
      });
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

function updateProfile(req, res, next) {
  try {
    const userId = req.user._id;
    isObjectIdValid(userId, 'user');
    const { name, about } = req.body;
    User.findByIdAndUpdate(
      userId,
      { name, about },
      {
        new: true,
        runValidators: true,
        upsert: false, // !!!!!!!!!!!!!
      },
    )
      .orFail()
      .then((respObj) => res.send(respObj))
      .catch((err) => {
        if (err instanceof mongoose.Error.DocumentNotFoundError) {
          throw new DocNotFoundError('user');
        } else if (err instanceof mongoose.Error.ValidationError) {
          res.status(400).send({ message: joinErrorMessages(err) });
        }
      })
      .catch(next);
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    isObjectIdValid(userId, 'user');
    const { avatar } = req.body;
    updateHandler(User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: false, // !!!!!!!!!!!!!
      },
    ), req, res);
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

module.exports = {
  createUser,
  login,
  getAllUsers,
  getSingleUser,
  updateProfile,
  updateAvatar,
};
