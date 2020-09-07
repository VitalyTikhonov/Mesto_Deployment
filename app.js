require('dotenv').config();
const rateLimit = require('express-rate-limit');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cards = require('./routes/cards.js');
const users = require('./routes/users.js');
const { createUser, login } = require('./controllers/users.js');
const auth = require('./middleware/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const app = express();

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());
app.post('/webdev/projects/mesto/signin', login);
app.post('/webdev/projects/mesto/signup', createUser);
app.use(auth);
app.use('/webdev/projects/mesto/cards', cards);
app.use('/webdev/projects/mesto/users', users);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
// app.use((err, req, res, next) => {
//     res.status(500).send({ message: 'На сервере произошла ошибка' });
// });
app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}.`);
});
