require('dotenv').config();
const rateLimit = require('express-rate-limit');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { isCelebrateError } = require('celebrate');
const cards = require('./routes/cards.js');
const users = require('./routes/users.js');
const { createUser, login } = require('./controllers/users.js');
const auth = require('./middleware/auth');
const NotFoundError = require('./errors/NotFoundError');

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
app.post(`${BASE_PATH}/signin`, login);
app.post(`${BASE_PATH}/signup`, createUser);
app.use(auth);
app.use(`${BASE_PATH}/cards`, cards);
app.use(`${BASE_PATH}/users`, users);
app.use((req, res, next) => next(new NotFoundError()));
// app.use(errors());
app.use((err, req, res, next) => {
  if (!isCelebrateError(err)) {
    return next(err);
  }
  const returnedErr = new Error();
  returnedErr.statusCode = 400;
  const celebInfo = Object.fromEntries(err.details).body.details;
  const celebFields = celebInfo.map((error) => error.context.label).join(', ');
  const celebMessages = celebInfo.map((error) => error.message).join('. ');
  returnedErr.message = `Следующие поля заполнены неверно: ${celebFields} (${celebMessages})`;
  return next(returnedErr);
});
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
