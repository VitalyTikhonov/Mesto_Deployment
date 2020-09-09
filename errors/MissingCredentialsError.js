const { errors } = require('../helpers/errorMessages');

class MissingCredentialsError extends Error {
  constructor() {
    super();
    this.statusCode = 400;
    this.message = errors.missingCredentials;
  }
}

module.exports = MissingCredentialsError;
