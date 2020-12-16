/* ИМПОРТ */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const validator = require('validator');
const { errors } = require('../helpers/errorMessages');

const {
  getCurrentUser,
  getAllUsers,
  getSingleUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

/* РУТЕРЫ */
router.get('/', getAllUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:id',
  celebrate(
    {
      params: Joi.object().options({ abortEarly: false }).keys({
        id: Joi.objectId().required(),
      }),
    },
    { warnings: true }, // просто чтобы позиционно распознавался следующий аргумент
    { mode: 'full' },
  ),
  getSingleUser,
);

router.patch(
  '/me',
  celebrate(
    {
      body: Joi.object().options({ abortEarly: false }).keys({
        userName: Joi.string().required().min(2).max(30),
        userDescription: Joi.string().required().min(2).max(30),
      }),
    },
    { warnings: true }, // просто чтобы позиционно распознавался следующий аргумент
    { mode: 'full' },
  ),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate(
    {
      body: Joi.object().options({ abortEarly: false }).keys({
        avatar: Joi.string().required().custom((value) => {
          if (!validator.isURL(value)) {
            throw new Error(errors.invalidInput.avatar);
          }
          return value;
        }),
      }),
    },
    { warnings: true }, // просто чтобы позиционно распознавался следующий аргумент
    { mode: 'full' },
  ),
  updateAvatar,
);

/* ЭКСПОРТ */
module.exports = router;
