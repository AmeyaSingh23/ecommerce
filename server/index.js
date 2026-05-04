require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const startCleanupJob = require('./jobs/cleanupOrders');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
}))
app.use(express.json()); // parses incoming JSON request bodies

// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.use('/api/products', productRoutes);
app.use('/api/users', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// DB Connection + Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    startCleanupJob()
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));