const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL', 'XXL']
  },
  category: {
    type: String,
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
