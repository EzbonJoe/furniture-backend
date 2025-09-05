const express = require('express');
const router = express.Router();

const {
  createNewCart,
  getCartById,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  updateDeliveryOptionId
} = require('../controllers/cartControllers');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createNewCart); // Create a new cart
router.patch('/update-delivery-option', protect, updateDeliveryOptionId); // Update delivery option ID for an item
router.post('/add-item', protect, addItemToCart); // Add item to cart
router.patch('/update-item', protect, updateCartItem); // Update item in cart
router.delete('/remove-item', protect, removeItemFromCart); // Remove item from cart
router.delete('/clear/:userId', protect, clearCart); // Clear cart
router.get('/:userId', protect, getCartById); // Get cart by user ID

module.exports = router;