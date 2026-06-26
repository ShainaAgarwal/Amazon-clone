const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  
  
  address: {
    addressLine1: { type: String, default: '' },
    addressLine2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: 'United States' },
    phoneNumber: { type: String, default: '' }
  },

  
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order' 
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);