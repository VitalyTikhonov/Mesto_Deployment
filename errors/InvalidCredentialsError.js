const { errors } = require('../helpers/errorMessages');

class InvalidCredentialsError extends Error {
  constructor() {
    super();
    this.statusCode = 401;
    this.message = errors.invalidCredentials;
  }
}
module.exports = InvalidCredentialsError;
