const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  
  orderItems: [
    {
      title: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
      }
    }
  ],
  
  
  shippingAddress: {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  
  totalPrice: { 
    type: Number, 
    required: true, 
    default: 0.00 
  },
  
  isPaid: { 
    type: Boolean, 
    required: true, 
    default: true 
  },
  
  paidAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Order', orderSchema);