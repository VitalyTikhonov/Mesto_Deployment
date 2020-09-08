const { errors } = require('../helpers/helpers');

class MissingCredentialsError extends Error {
  constructor() {
    super();
    this.statusCode = 400;
    this.message = errors.missingCredentials;
  }
}

module.exports = MissingCredentialsError;
