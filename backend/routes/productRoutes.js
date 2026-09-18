const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validate');

router.get('/', productController.getAllProducts);
router.post('/', validateProduct, productController.createProduct);
router.post('/:id/stock', productController.updateStock);

module.exports = router;

