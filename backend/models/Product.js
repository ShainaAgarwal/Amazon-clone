const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  name: { 
    type: String 
  }, 
  category: { 
    type: String, 
    required: true,
    lowercase: true 
  },
  price: { 
    type: Number, 
    required: true,
    default: 0.00 
  },
  image: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  
  
  rating: { 
    type: Number, 
    required: true, 
    default: 4.5, 
    min: 0,
    max: 5
  },
  
  
  countInStock: { 
    type: Number, 
    required: true, 
    default: 10, 
    min: 0
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);