const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes'); 
const adminHomePageRoutes = require('./routes/adminHomePageRoutes');
const userDashboardRoutes = require('./routes/userDashboardRoutes');
const contactRoute = require('./routes/contactRoute');
const searchRoute = require('./routes/searchRoute');
const cors = require('cors');
const app = express();
const path = require('path');


// Middlewares
app.use(cors());
app.use(express.json());


// Routes
// app.get('/', (req, res) => {
//   res.send('Furniture API is running');
// });

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminHomePageRoutes);
app.use('/api/user', userDashboardRoutes);
app.use('/api/contact', contactRoute);
app.use('/api/search', searchRoute)

module.exports = app;