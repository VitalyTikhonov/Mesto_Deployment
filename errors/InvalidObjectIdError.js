const { errors } = require('../helpers/errorMessages');

class InvalidObjectIdError extends Error {
  constructor(docType) {
    super();
    this.statusCode = 409;
    this.message = errors.objectId[docType];
  }
}

module.exports = InvalidObjectIdError;
