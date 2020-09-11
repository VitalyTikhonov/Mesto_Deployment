/* ИМПОРТ */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const validator = require('validator');
const { errors } = require('../helpers/errorMessages');
const {
  getAllCards,
  createCard,
  deleteCard,
  toggleCardLike,
} = require('../controllers/cards');

/* РУТЕРЫ */
router.get('/', getAllCards);

router.post(
  '/',
  celebrate(
    {
      body: Joi.object().options({ abortEarly: false }).keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().custom((value) => {
          if (!validator.isURL(value)) {
            throw new Error(errors.invalidInput.link);
          }
          return value;
        }),
      }),
    },
    { warnings: true }, // просто чтобы позиционно распознавался следующий аргумент
    { mode: 'full' },
  ),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate(
    {
      params: Joi.object().options({ abortEarly: false }).keys({
        cardId: Joi.objectId(),
      }),
    },
    { warnings: true }, // просто чтобы позиционно распознавался следующий аргумент
    { mode: 'full' },
  ),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate(
    {
      params: Joi.object().options({ abortEarly: false }).keys({
        cardId: Joi.objectId().required(),
      }),
    },
    { warnings: true }, // просто чтобы позиционно распознавался следующий аргумент
    { mode: 'full' },
  ),
  toggleCardLike,
);

router.delete(
  '/:cardId/likes',
  celebrate(
    {
      params: Joi.object().options({ abortEarly: false }).keys({
        cardId: Joi.objectId(),
      }),
    },
    { warnings: true }, // просто чтобы позиционно распознавался следующий аргумент
    { mode: 'full' },
  ),
  toggleCardLike,
);

/* ЭКСПОРТ */
module.exports = router;
