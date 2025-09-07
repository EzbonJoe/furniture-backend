const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes.js');
const collectionRoutes = require('./routes/collectionRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const wishlistRoutes = require('./routes/wishlistRoutes.js'); 
const adminHomePageRoutes = require('./routes/adminHomePageRoutes.js');
const userDashboardRoutes = require('./routes/userDashboardRoutes.js');
const contactRoute = require('./routes/contactRoute.js');
const searchRoute = require('./routes/searchRoute.js');
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