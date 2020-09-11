/* ИМПОРТ */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const validator = require('validator');
const { errors } = require('../helpers/errorMessages');

const { createUser } = require('../controllers/users');

/* РУТЕРЫ */
router.post(
  '/',
  celebrate(
    {
      body: Joi.object().options({ abortEarly: false }).keys({
        name: Joi.string().required().min(2).max(30),
        about: Joi.string().required().min(2).max(30),
        avatar: Joi.string().custom((value) => {
          if (!validator.isURL(value)) {
            throw new Error(errors.invalidInput.avatar);
          }
          return value;
        }),
        password: Joi.string().required().min(8),
        email: Joi.string().email().required().min(8),
      }),
    },
    { warnings: true }, // просто чтобы позиционно распознавался следующий аргумент
    { mode: 'full' },
  ),
  createUser,
);

/* ЭКСПОРТ */
module.exports = router;
