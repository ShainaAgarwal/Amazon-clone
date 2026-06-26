const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { authLimiter, validateFields, JWT_SECRET } = require('../middleware/auth');

// Registration Route
router.post('/register',
  authLimiter,
  [
    
    body('username', 'Name must be at least 3 characters long').isLength({ min: 3 }),
    body('email', 'Please provide a valid email structure').isEmail(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
  ],
  validateFields,
  async (req, res) => {
    const { username, email, password, isAdmin } = req.body;
    try {
      
      let userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        isAdmin: false 
      });

      
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '2h' });

      res.status(201).json({ 
        message: "User registered successfully",
        token,
        userInfo: { 
          _id: user._id,
          username: user.username, 
          email: user.email, 
          isAdmin: user.isAdmin,
          shippingAddress: user.shippingAddress 
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Server error during registration", error: err.message });
    }
  }
);

// Login Route
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '2h' });

    
    res.json({
      token,
      userInfo: { 
        _id: user._id,
        username: user.username, 
        email: user.email, 
        isAdmin: user.isAdmin,
        shippingAddress: user.shippingAddress || {} 
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;