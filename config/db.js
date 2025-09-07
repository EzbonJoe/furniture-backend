const mongoose = require('mongoose');
const Product = require('../models/Product.js');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    await Product.syncIndexes();
    console.log("Indexes synced for Product model ✅");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;