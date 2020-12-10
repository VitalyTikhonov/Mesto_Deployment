require('dotenv').config();

const {
  NODE_ENV,
  PORT = 3000,
  BASE_PATH = '/',
  JWT_SECRET_PROD,
  JWT_EXPIRY_DAYS = 7,
  DATABASE_ADDRESS = 'mongodb://localhost:27017/mestodb',
  JWT_COOKIE_NAME = 'mesto-jwt',
} = process.env;

const JWT_SECRET_DEV = '42aef6937efd499c4b99a325528cb1428b4c085402c1a48fccba4077f9269d13';
const JWT_SECRET = NODE_ENV === 'production' ? JWT_SECRET_PROD : JWT_SECRET_DEV;
const CORS_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:3001',
  'http://localhost:3000',
  'https://vitalytikhonov.github.io',
  'https://vitaliytikhonov.ru',
  'http://vitaliytikhonov.ru',
];

module.exports = {
  NODE_ENV,
  PORT,
  BASE_PATH,
  DATABASE_ADDRESS,
  JWT_SECRET,
  JWT_EXPIRY_DAYS,
  JWT_COOKIE_NAME,
  CORS_ORIGINS,
};
