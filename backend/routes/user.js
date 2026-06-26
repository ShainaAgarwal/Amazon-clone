const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.route('/profile/address')

  .get(protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: 'User not found.'
        });
      }

      res.status(200).json({
        address: user.address || {}
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server error retrieving address data.'
      });
    }
  })

  .put(protect, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: 'User not found.'
        });
      }

      user.address = {
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        country: req.body.country,
        phoneNumber: req.body.phoneNumber
      };

      await user.save();

      res.status(200).json({
        message: 'Address updated successfully.',
        address: user.address
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server error updating profile address.'
      });
    }
  });

module.exports = router;