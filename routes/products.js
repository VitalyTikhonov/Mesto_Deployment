/* ИМПОРТ */
const router = require('express').Router();
const {
  createProduct,
} = require('../controllers/products');

/* РУТЕРЫ */
router.post('/', createProduct);

/* ЭКСПОРТ */
module.exports = router;
