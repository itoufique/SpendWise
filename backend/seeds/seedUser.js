const connectDB = require('../config/db');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');

const run = async () => {
  await connectDB();

  try {
    const email = 'assistant@local';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('User already exists:', email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash('assistant123', 10);
    const user = await User.create({ name: 'AI Assistant', email, password: hashed, role: 'admin', preferences: [] });

    await Wishlist.create({ user: user._id, products: [] });

    console.log('Created user', email, 'with password assistant123');
    process.exit(0);
  } catch (err) {
    console.error('User seed error:', err);
    process.exit(1);
  }
};

run();
