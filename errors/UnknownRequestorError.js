const { errors } = require('../helpers/errorMessages');

class UnknownRequestorError extends Error {
  constructor() {
    super();
    this.statusCode = 409;
    this.message = errors.unknownRequestor;
  }
}

module.exports = UnknownRequestorError;
