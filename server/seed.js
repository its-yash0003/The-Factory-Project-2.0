const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Classic Navy Snapback',
    description: 'Premium cotton snapback cap with adjustable strap. Features a structured six-panel design with embroidered logo. Perfect for everyday wear.',
    price: 24.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    category: 'Snapback',
    stock: 150
  },
  {
    name: 'Urban Black Trucker',
    description: 'Breathable mesh trucker cap with foam front panels. Perfect for casual wear and outdoor activities. Adjustable snap closure.',
    price: 19.99,
    sizes: ['M', 'L', 'XL', 'XXL'],
    category: 'Trucker',
    stock: 200
  },
  {
    name: 'Heritage Red Baseball',
    description: 'Traditional baseball cap with curved brim. Made from durable twill fabric with classic styling. A timeless American icon.',
    price: 22.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'Baseball',
    stock: 175
  },
  {
    name: 'Industrial Grey Bucket',
    description: 'Wide-brim bucket hat for maximum sun protection. Lightweight and packable design. Great for fishing and outdoor adventures.',
    price: 27.99,
    sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
    category: 'Bucket',
    stock: 100
  },
  {
    name: 'Performance Athletic Cap',
    description: 'Moisture-wicking performance cap with ventilation eyelets. Ideal for sports and running. Quick-dry fabric keeps you cool.',
    price: 29.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'Athletic',
    stock: 125
  },
  {
    name: 'Vintage Washed Denim',
    description: 'Distressed denim cap with vintage wash finish. Unstructured low-profile design. Each cap has unique character.',
    price: 32.99,
    sizes: ['M', 'L', 'XL', 'XXL'],
    category: 'Casual',
    stock: 80
  },
  {
    name: 'Executive Flat Brim',
    description: 'Modern flat brim cap with premium finish. Structured fit with metallic eyelets. Urban streetwear essential.',
    price: 34.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    category: 'Streetwear',
    stock: 90
  },
  {
    name: 'Camo Outdoor Explorer',
    description: 'Camouflage pattern cap for outdoor enthusiasts. Durable construction with adjustable closure. Built for the wild.',
    price: 26.99,
    sizes: ['M', 'L', 'XL', 'XXL', 'XXXL'],
    category: 'Outdoor',
    stock: 110
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${products.length} products successfully!`);

    products.forEach(p => {
      console.log(`   - ${p.name} ($${p.price})`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error seeding products:', err);
    process.exit(1);
  }
}

seedProducts();
