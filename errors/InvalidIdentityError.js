const { errors } = require('../helpers/errorMessages');

class InvalidIdentityError extends Error {
  constructor() {
    super();
    this.statusCode = 409;
    this.message = errors.invalidIdentity;
  }
}

module.exports = InvalidIdentityError;
