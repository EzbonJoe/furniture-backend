const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  deliveryOptionId: { type: String, required: true }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  items: [orderItemSchema],

  shippingAddress: shippingAddressSchema,

  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash on Delivery', 'Mobile Money', 'Credit Card']
  },

  totalAmount: { type: Number, required: true },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },

  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },

  deliveryDate: { type: Date }, 

  trackingNumber: { type: String }, 

  paidAt: { type: Date }, 
  deliveredAt: { type: Date }, 

  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order', orderSchema);