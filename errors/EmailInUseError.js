const { errors } = require('../helpers/errorMessages');

class EmailInUseError extends Error {
  constructor() {
    super();
    this.statusCode = 409;
    this.message = errors.emailInUse;
  }
}

module.exports = EmailInUseError;
