const { errors } = require('../helpers/errorMessages');

class BadNewPasswordError extends Error {
  constructor(pswlength) {
    super();
    this.statusCode = 400;
    this.message = errors.badPassword(pswlength);
  }
}

module.exports = BadNewPasswordError;
