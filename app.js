require('dotenv').config();
const rateLimit = require('express-rate-limit');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middleware/logger');
const signin = require('./routes/signin');
const signup = require('./routes/signup');
const cards = require('./routes/cards');
const users = require('./routes/users');
const auth = require('./middleware/auth');
const celebValidateRequest = require('./middleware/requestValidators');
const NotFoundError = require('./errors/NotFoundError');

console.log('HELLO', process.env.HELLO);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const app = express();

const { PORT = 3000 } = process.env;
const BASE_PATH = '/webdev/projects/mesto';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(`${BASE_PATH}/signin`, signin);
app.use(`${BASE_PATH}/signup`, signup);
app.use(auth);
app.use(`${BASE_PATH}/cards`, cards);
app.use(`${BASE_PATH}/users`, users);
app.use((req, res, next) => next(new NotFoundError()));
app.use(errorLogger);
app.use(celebValidateRequest);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? `На сервере произошла ошибка: ${message}`
      : message,
  });
  // console.log('err\n', err);
  next();
});
app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}.`);
});
