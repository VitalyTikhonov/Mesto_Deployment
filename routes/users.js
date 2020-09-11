/* ИМПОРТ */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const validator = require('validator');
const { errors } = require('../helpers/errorMessages');

const {
  getAllUsers,
  getSingleUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

/* РУТЕРЫ */
router.get('/', getAllUsers);

router.get(
  '/:id',
  celebrate({
    params: Joi.object().options({ abortEarly: false }).keys({
      id: Joi.objectId(),
    }),
  }),
  getSingleUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().options({ abortEarly: false }).keys({
      avatar: Joi.string().custom((value) => {
        if (!validator.isURL(value)) {
          throw new Error(errors.invalidInput.avatar);
        }
        return value;
      }),
    }),
  }),
  updateAvatar,
);

/* ЭКСПОРТ */
module.exports = router;
