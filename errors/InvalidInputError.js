const { joinErrorMessages } = require('../helpers/helpers');

class InvalidInputError extends Error {
  constructor(error) {
    super();
    this.statusCode = 400;
    this.message = joinErrorMessages(error);
  }
}

module.exports = InvalidInputError;
