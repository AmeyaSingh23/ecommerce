const Wishlist = require('../models/Wishlist');

// GET /api/wishlist
const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
        res.json(wishlist ? wishlist.products : []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/wishlist/:productId
const addToWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }
        if (wishlist.products.some(p => p.toString() === req.params.productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        wishlist.products.push(req.params.productId);
        await wishlist.save();
        res.status(201).json({ message: 'Added to wishlist' });
    } catch (err) {
        console.error('WISHLIST ERROR:', err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
        wishlist.products = wishlist.products.filter(
            p => p.toString() !== req.params.productId
        );
        await wishlist.save();
        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };