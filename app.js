const rateLimit = require('express-rate-limit');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');

const { corsOptions } = require('./middleware/cors');
const { requestLogger, errorLogger } = require('./middleware/logger');
const {
  PORT,
  BASE_PATH,
  DATABASE_ADDRESS,
  NODE_ENV,
} = require('./configs/config');
const signin = require('./routes/signin');
const signup = require('./routes/signup');
const cards = require('./routes/cards');
const users = require('./routes/users');
const auth = require('./middleware/auth');
const celebValidateRequest = require('./middleware/requestValidators');
const NotFoundError = require('./errors/NotFoundError');

mongoose.connect(DATABASE_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('*', cors(corsOptions));
app.use(helmet());
app.use(requestLogger); // перед rateLimiter
app.use(limiter); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
app.use(bodyParser.json());
app.use(cookieParser());
// app.get(`${BASE_PATH}crash-test`, (req) => {
//   setTimeout(() => {
//     const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
//     console.log('fullUrl MESTO', fullUrl);
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });
app.use(`${BASE_PATH}signin`, signin);
app.use(`${BASE_PATH}signup`, signup);
app.use(auth);
app.use(`${BASE_PATH}cards`, cards);
app.use(`${BASE_PATH}users`, users);
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
  next();
});
app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}. NODE_ENV: ${NODE_ENV}`);
});
