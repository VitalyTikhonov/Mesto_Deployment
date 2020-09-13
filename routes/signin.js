/* ИМПОРТ */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const { login } = require('../controllers/users');

/* РУТЕРЫ */
router.post(
  '/',
  celebrate(
    {
      body: Joi.object().options({ abortEarly: false }).keys({
        email: Joi.string().email().required().min(8),
        password: Joi.string().required().min(8),
      }),
    },
    { warnings: true }, // просто чтобы позиционно распознавался следующий аргумент
    { mode: 'full' },
  ),
  login,
);

/* ЭКСПОРТ */
module.exports = router;
