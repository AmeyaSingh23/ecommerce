const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderToPaid, updateOrderToDelivered } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder).get(protect, adminOnly, getAllOrders);
router.route('/my').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, adminOnly, updateOrderToDelivered);

module.exports = router;