const { errors } = require('../helpers/errorMessages');

class NotFoundError extends Error {
  constructor() {
    super();
    this.statusCode = 404;
    this.message = errors.notFound;
  }
}

module.exports = NotFoundError;
