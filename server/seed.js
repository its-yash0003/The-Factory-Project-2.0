const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Classic Navy Snapback',
    description: 'Premium cotton snapback cap with adjustable strap. Features a structured six-panel design with embroidered logo.',
    price: 24.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'Snapback',
    stock: 150
  },
  {
    name: 'Urban Black Trucker',
    description: 'Breathable mesh trucker cap with foam front panels. Perfect for casual wear and outdoor activities.',
    price: 19.99,
    sizes: ['M', 'L', 'XL'],
    category: 'Trucker',
    stock: 200
  },
  {
    name: 'Heritage Red Baseball',
    description: 'Traditional baseball cap with curved brim. Made from durable twill fabric with classic styling.',
    price: 22.99,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Baseball',
    stock: 175
  },
  {
    name: 'Industrial Grey Bucket',
    description: 'Wide-brim bucket hat for maximum sun protection. Lightweight and packable design.',
    price: 27.99,
    sizes: ['M', 'L', 'XL', 'XXL'],
    category: 'Bucket',
    stock: 100
  },
  {
    name: 'Performance Athletic Cap',
    description: 'Moisture-wicking performance cap with ventilation eyelets. Ideal for sports and running.',
    price: 29.99,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Athletic',
    stock: 125
  },
  {
    name: 'Vintage Washed Denim',
    description: 'Distressed denim cap with vintage wash finish. Unstructured low-profile design.',
    price: 32.99,
    sizes: ['M', 'L', 'XL'],
    category: 'Casual',
    stock: 80
  },
  {
    name: 'Executive Flat Brim',
    description: 'Modern flat brim cap with premium finish. Structured fit with metallic eyelets.',
    price: 34.99,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'Streetwear',
    stock: 90
  },
  {
    name: 'Camo Outdoor Explorer',
    description: 'Camouflage pattern cap for outdoor enthusiasts. Durable construction with adjustable closure.',
    price: 26.99,
    sizes: ['M', 'L', 'XL', 'XXL'],
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
