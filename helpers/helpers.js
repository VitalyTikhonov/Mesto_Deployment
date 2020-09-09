const mongoose = require('mongoose');
const { errors } = require('./errorMessages');
const User = require('../models/user');
const InvalidObjectIdError = require('../errors/InvalidObjectIdError');

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
    throw new InvalidObjectIdError(docType);
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

module.exports = {
  createDocHandler,
  getLikeDeleteHandler,
  joinErrorMessages,
  isUserExistent,
  isObjectIdValid,
  passwordRegexp,
};
