const { errors } = require('../helpers/errorMessages');

class NoRightsError extends Error {
  constructor() {
    super();
    this.statusCode = 403;
    this.message = errors.noRights;
  }
}

module.exports = NoRightsError;
