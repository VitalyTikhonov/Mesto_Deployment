const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const InvalidCredentialsError = require('../errors/InvalidCredentialsError');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  userDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: (link) => validator.isURL(link),
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => validator.isEmail(email),
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findByCredentials = function findByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .orFail(new InvalidCredentialsError())
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new InvalidCredentialsError());
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
