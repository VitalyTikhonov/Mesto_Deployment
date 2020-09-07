const { errors } = require('../helpers/helpers');

class BadPasswordError extends Error {
  constructor(pswlength) {
    super();
    this.statusCode = 404;
    this.message = errors.badPassword(pswlength);
  }
}

module.exports = BadPasswordError;
