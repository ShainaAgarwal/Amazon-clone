const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_amazon_key_123';

// Throttling / Rate Limiting 
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { message: "Too many attempts from this IP. Try again after 15 minutes." }
});

//  Express Validator Error Handler
const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Protect Routes
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const resolvedId = decoded._id || decoded.id;
      
      req.user = {
        ...decoded,
        _id: resolvedId,
        id: resolvedId
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token verified failed" });
    }
  } else {
    return res.status(401).json({ message: "No token found, authorization denied" });
  }
};

//  Admin Authorization Check
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
};

module.exports = { authLimiter, validateFields, protect, adminOnly, JWT_SECRET };