/* ИМПОРТ */
const router = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  toggleCardLike,
} = require('../controllers/cards');

/* РУТЕРЫ */
router.get('/', getAllCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', toggleCardLike);

router.delete('/:cardId/likes', toggleCardLike);

/* ЭКСПОРТ */
module.exports = router;
