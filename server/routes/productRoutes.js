const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview } = require('../controllers/productController');

router.route('/').get(getProducts).post(protect, adminOnly, createProduct);
router.route('/:id').get(getProductById).put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct);
router.route('/:id/reviews').post(protect, createReview);

module.exports = router;