const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product'); 
const { protect } = require('../middleware/auth');


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving order history.' });
  }
};


const createOrder = async (req, res) => {
  const { cartItems, totalPrice, shippingAddress, billingAddress, paymentMethod } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'No order items detected inside checkout manifest.' });
  }

  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    
    for (const item of cartItems) {
      
      const productId = item.product || item.id || item._id;
      const product = await Product.findById(productId).session(session);

      if (!product) {
        throw new Error(`Product item matching configuration "${item.name || productId}" was not found.`);
      }

      if (product.countInStock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Only ${product.countInStock} items remaining.`);
      }

      
      product.countInStock -= item.quantity;
      await product.save({ session });
    }

    
    const processedItems = cartItems.map((item) => ({
      name: item.name,
      qty: item.quantity,
      image: item.image,
      price: typeof item.cost === 'string' ? parseFloat(item.cost.replace('$', '')) : item.cost,
      product: item.product || item.id || item._id
    }));

    const order = new Order({
      user: req.user._id,
      orderItems: processedItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      totalPrice,
      isPaid: paymentMethod === 'COD' ? false : true, 
      status: 'Processing'
    });

    const createdOrder = await order.save({ session });

    
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: 'Order created and stock updated successfully.',
      order: createdOrder
    });

  } catch (error) {
    
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({ 
      message: error.message || 'System failed to finalize the transaction layout safely.' 
    });
  }
};



router.route('/')
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }
      if (order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this resource.' });
      }
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).json({ message: 'Server error retrieving order details.' });
    }
  });

module.exports = router;