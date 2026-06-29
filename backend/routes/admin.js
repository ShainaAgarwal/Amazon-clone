const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

router.post('/products', protect, adminOnly, async (req, res) => {
  try {
    const { title, price, description, image, category, rating, countInStock } = req.body;
    
    const newProduct = await Product.create({ 
      title, 
      price, 
      description, 
      image, 
      category,
      rating: rating !== undefined ? rating : 4.5,
      countInStock: countInStock !== undefined ? countInStock : 10
    });
    
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});

router.get('/products', protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory catalog", error: error.message });
  }
});
router.get('/orders', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'email username') // Plucks user info automatically
      .sort({ createdAt: -1 }); // Newest orders first
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch global order tracking logs", 
      error: error.message 
    });
  }
});

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user database" });
  }
});

router.get('/public/products', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skipValue = (page - 1) * limit;
    const totalProducts = await Product.countDocuments();

    const products = await Product.find({})
      .skip(skipValue)
      .limit(limit);

    res.json({
      products,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ message: "Error pulling marketplace data", error: error.message });
  }
});

module.exports = router;