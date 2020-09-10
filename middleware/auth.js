const jwt = require('jsonwebtoken');
const { tempKey } = require('../configs/config.js');
const { isObjectIdValid } = require('../helpers/helpers');
const User = require('../models/user');
const NotAuthorizedError = require('../errors/NotAuthorizedError');
const UnknownRequestorError = require('../errors/UnknownRequestorError');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new NotAuthorizedError());
  }

  let payload;

  try {
    payload = jwt.verify(token, tempKey);
  } catch {
    return next(new NotAuthorizedError());
  }

  req.user = payload;

  try {
    const userId = req.user._id; // после записи payload в req.user
    isObjectIdValid(userId, 'requestor');
    const checkIdentity = await User.exists({ _id: userId });
    if (!checkIdentity) {
      throw new UnknownRequestorError();
    }
  } catch (err) {
    next(err);
  }

  next();
};
