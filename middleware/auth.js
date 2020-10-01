const jwt = require('jsonwebtoken');
const { isObjectIdValid } = require('../helpers/helpers');
const User = require('../models/user');
const NotAuthorizedError = require('../errors/NotAuthorizedError');
const UnknownRequestorError = require('../errors/UnknownRequestorError');

const { NODE_ENV, JWT_SECRET, JWT_COOKIE_NAME } = process.env;

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const token = req.cookies[JWT_COOKIE_NAME];

  if (!token) {
    return next(new NotAuthorizedError());
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
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
