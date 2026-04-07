const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// POST /api/orders - Create new order (public)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, totalAmount, notes } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      totalAmount,
      notes
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// GET /api/orders - List all orders (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('items.productId', 'name images');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Single order details (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.productId', 'name images');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

// PUT /api/orders/:id/status - Update order status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
