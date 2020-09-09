const { errors } = require('../helpers/errorMessages');

class DocNotFoundError extends Error {
  constructor(docType) {
    super();
    this.statusCode = 404;
    this.message = errors.docNotFound[docType];
  }
}

module.exports = DocNotFoundError;
