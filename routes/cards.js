/* ИМПОРТ */
const router = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

/* РУТЕРЫ */
router.get('/', getAllCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', unlikeCard);

/* ЭКСПОРТ */
module.exports = router;
