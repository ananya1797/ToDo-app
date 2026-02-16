const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const auth = require('../middleware/fetchuser');
const User = require('../models/User');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// create order
router.post('/create-order', auth, async (req, res) => {
  const options = {
    amount: 49900, // ₹499
    currency: "INR",
    receipt: "receipt_" + Date.now()
  };

  const order = await instance.orders.create(options);
  res.json(order);
});

// verify payment (simple version)
router.post('/verify', auth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    isPremium: true
  });

  res.json({ success: true });
});

module.exports = router;