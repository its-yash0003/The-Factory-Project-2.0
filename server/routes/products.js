const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// GET /api/products - List all active products with filters
router.get('/', async (req, res) => {
  try {
    const { category, size } = req.query;
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }
    if (size) {
      filter.sizes = { $in: [size] };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// POST /api/products - Create product (admin only, with image upload)
router.post('/', auth, upload.array('images', 4), async (req, res) => {
  try {
    const { name, description, price, sizes, category, stock } = req.body;

    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      sizes: sizes ? (Array.isArray(sizes) ? sizes : JSON.parse(sizes)) : [],
      category,
      images,
      stock: parseInt(stock) || 100
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', auth, upload.array('images', 4), async (req, res) => {
  try {
    const { name, description, price, sizes, category, stock, isActive, removeImages } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (sizes) product.sizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (isActive !== undefined) product.isActive = isActive;

    // Handle image removal
    if (removeImages) {
      const imagesToRemove = Array.isArray(removeImages) ? removeImages : JSON.parse(removeImages);
      product.images = product.images.filter(img => !imagesToRemove.includes(img));
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Soft delete (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
