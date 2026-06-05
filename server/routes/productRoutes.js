const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview } = require('../controllers/productController');
const upload = require('../middleware/upload');

router.route('/').get(getProducts).post(protect, adminOnly, createProduct);
router.route('/:id').get(getProductById).put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct);
router.route('/:id/reviews').post(protect, createReview);
router.post('/upload', protect, adminOnly, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;