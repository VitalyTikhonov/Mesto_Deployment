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
    jointErrorMessage = messageArray.join('. ');
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

module.exports = {
  joinErrorMessages,
  isUserExistent,
  isObjectIdValid,
  passwordRegexp,
};
