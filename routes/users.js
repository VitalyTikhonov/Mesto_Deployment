/* ИМПОРТ */
const router = require('express').Router();

const {
  getAllUsers,
  getSingleUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

/* РУТЕРЫ */
router.get('/', getAllUsers);

router.get('/:id', getSingleUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

/* ЭКСПОРТ */
module.exports = router;
