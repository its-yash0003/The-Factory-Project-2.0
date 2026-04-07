const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@factory.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const admin = new User({
      email: 'admin@factory.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('   Email: admin@factory.com');
    console.log('   Password: admin123');

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
