const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { tempKey } = require('../configs/config.js');

const { NODE_ENV, JWT_SECRET } = process.env; // На будущее
const errors = {
  invalidInput: {
    name: 'Ошибка в поле Name.',
    email: 'Ошибка в поле Email.',
    about: 'Ошибка в поле About.',
    avatar: 'Проблема с аватаркой.',
    link: 'Проблема с изображением.',
  },
  docNotFound: {
    user: 'Такого пользователя нет',
    card: 'Такой карточки нет',
  },
  emailInUse: 'Этот адрес электронной почты уже используется',
  badPassword: (pswlength) => `Введите пароль длиной не менее ${pswlength} зн., состоящий из латинских букв, цифр и специальных символов`,
  objectId: {
    user: 'Ошибка в идентификаторе пользователя',
    card: 'Ошибка в идентификаторе карточки',
  },
};

const passwordRegexp = /[\u0023-\u0126]+/;

function joinErrorMessages(errorObject) {
  const fieldErrorMap = errors.invalidInput;
  const expectedBadFields = Object.keys(fieldErrorMap);
  const actualBadFields = Object.keys(errorObject.errors);
  const messageArray = [];
  let jointErrorMessage = null;
  if (expectedBadFields.some((field) => actualBadFields.includes(field))) {
    expectedBadFields.forEach((field) => {
      if (actualBadFields.includes(field)) {
        messageArray.push(fieldErrorMap[field]);
      }
    });
    jointErrorMessage = messageArray.join(' ');
  }
  return jointErrorMessage;
}

function isUserExistent(id) {
  return User.exists({ _id: id });
}

function isObjectIdValid(id, docType) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error();
    error.docType = docType;
    throw error;
  }
}

function createDocHandler(promise, req, res, docType) {
  promise
    .then((respObj) => {
      if (docType === 'user') {
        const {
          name,
          about,
          avatar,
          email,
          _id,
        } = respObj;
        res.send({
          name,
          about,
          avatar,
          email,
          _id,
        });
      } else {
        res.send(respObj);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: joinErrorMessages(err) });
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'Этот адрес электронной почты уже используется' });
      }
    });
}

function loginHandler(promise, req, res) {
  promise // findUserByCredentials
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
      res.status(401).send({ message: err.message });
    });
}

function getAllDocsHandler(promise, req, res, next) {
  promise
    .then((respObj) => res.send(respObj))
    .catch(next);
}

function getLikeDeleteHandler(promise, req, res, docType, userId) {
  promise
    .orFail()
    .then((respObj) => {
      // if (respObj.owner.toString() === userId) { // работало, но не декларативно
      if (respObj.owner.equals(userId)) {
        respObj.deleteOne()
          .then((deletedObj) => res.send(deletedObj));
      } else {
        res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: `${errors.docNotFound[docType]}` });
      }
    });
}

function updateHandler(promise, req, res) {
  promise
    .orFail()
    .then((respObj) => res.send(respObj))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(404).send({ message: `${errors.docNotFound.user}` });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: joinErrorMessages(err) });
      }
    });
}

module.exports = {
  createDocHandler,
  loginHandler,
  getAllDocsHandler,
  getLikeDeleteHandler,
  updateHandler,
  errors,
  joinErrorMessages,
  isUserExistent,
  isObjectIdValid,
  passwordRegexp,
};
