const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { validateSupplier } = require('../middleware/validate');

router.get('/', supplierController.getAllSuppliers);
router.post('/', validateSupplier, supplierController.createSupplier);
router.patch('/:id/archive', supplierController.archiveSupplier);

module.exports = router;

