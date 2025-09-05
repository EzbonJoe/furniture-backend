const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product : { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  deliveryOptionId: {
    type: String, 
    required: true,
    default: "1"
  }

});

const cartSchema = new mongoose.Schema({
   user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true // each user has only one cart
  },
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Cart', cartSchema);