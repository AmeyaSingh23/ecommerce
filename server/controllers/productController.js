const Product = require('../models/Product');
const { cloudinary } = require('../middleware/upload');

// GET /api/products
const PAGE_SIZE = 8;

const getProducts = async (req, res) => {
  try {
    const { search, category, page = 1 } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category && category !== 'all') filter.category = { $regex: category, $options: 'i' };

    const currentPage = Number(page);
    const total = await Product.countDocuments(filter);
    const pages = Math.ceil(total / PAGE_SIZE);

    const products = await Product.find(filter)
      .skip((currentPage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE);

    res.json({ products, page: currentPage, pages, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete from Cloudinary if it's a cloudinary URL
    if (product.image && product.image.includes('cloudinary.com')) {
      // Extract public_id from URL — it's the part after /vendora/ without the extension
      const parts = product.image.split('/');
      const filename = parts[parts.length - 1].split('.')[0];
      const publicId = `vendora/${filename}`;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Cloudinary delete failed:', err.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products/:id/reviews
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview };