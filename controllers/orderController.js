const Order = require('../models/Order.js');
const cart = require('../models/Cart.js');
const Product = require('../models/Product.js');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail.js'); // Import the sendEmail utility
const User = require('../models/userModel.js'); // Import User model to fetch user details

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;
    const cartItems = await cart.findOne({ user: userId }).populate('items.product');
    const user = await User.findById(userId).select('name email'); // Fetch user details

    if (!cartItems || cartItems.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;

    const orderItems = cartItems.items.map(item => {
      totalAmount += item.product.priceCents * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        deliveryOptionId: item.deliveryOptionId
      };
    });

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount: totalAmount / 100, // Convert cents to dollars
      status: 'Pending'
    });

    await newOrder.save();

    // Send confirmation email
    await sendEmail(
      user.email,
      "Order Confirmation",
      `<h3>Hi ${user.name || 'Customer'},</h3>
      <p>Your order has been placed successfully.</p>
      <p>Order ID: ${newOrder._id}</p>
      <p>Total: $${newOrder.totalAmount}</p>
      <p>We will notify you when it's being processed.</p>
      <br><p>Thank you for shopping with us!</p>`
    );


    // Clear the cart after placing the order
    cartItems.items = [];
    await cartItems.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate('items.product', 'name images priceCents');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getOrderById = async(req, res) => {
  try{
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;
    const orderId = req.params.id;   
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    let order;

    if (isAdmin) {
      // Allow admin to access any order
      order = await Order.findById(orderId)
        .populate('user', 'name email')
        .populate('items.product', 'name images priceCents');
    } else {
      // Regular user can only access their own order
      order = await Order.findOne({ _id: orderId, user: userId })
        .populate('items.product', 'name images priceCents');
    }


    if (!order) {      
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  }catch(error){
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getAllOrders = async(req,res) => {
  try{
    const orders = await Order.find().populate('user', 'name email')
    res.status(200).json(orders);
  }catch(error){
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateOrderStatus = async(req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;    

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();

    await sendEmail(
      order.user.email,
      `Your order status has been updated`,
      `<h3>Hello ${order.user.name || "Customer"},</h3>
       <p>Your order <strong>${order._id}</strong> status is now: <strong>${order.status}</strong>.</p>
       <p>Thank you for shopping with us!</p>`
    );

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
}

