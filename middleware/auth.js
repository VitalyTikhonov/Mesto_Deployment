const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotAuthorizedError = require('../errors/NotAuthorizedError');
const UnknownRequestorError = require('../errors/UnknownRequestorError');

const { JWT_SECRET, JWT_COOKIE_NAME } = require('../configs/config');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const token = req.cookies[JWT_COOKIE_NAME];

  if (!token) {
    return next(new NotAuthorizedError());
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return next(new NotAuthorizedError());
  }

  req.user = { _id: '5f4271b869f66ac6e5ea7997' }; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // req.user = payload;

  try {
    const userId = req.user._id; // после записи payload в req.user
    const checkIdentity = await User.exists({ _id: userId });
    if (!checkIdentity) {
      throw new UnknownRequestorError();
    }
  } catch (err) {
    next(err);
  }

  next();
};
