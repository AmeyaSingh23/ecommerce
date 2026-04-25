const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

router.route('/').get(getProducts).post(protect, adminOnly, createProduct);
router.route('/:id').get(getProductById).put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct);

module.exports = router;