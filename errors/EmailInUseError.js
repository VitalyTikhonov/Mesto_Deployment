const { errors } = require('../helpers/helpers');

class EmailInUseError extends Error {
  constructor() {
    super();
    this.statusCode = 409;
    this.message = errors.emailInUse;
  }
}

module.exports = EmailInUseError;
