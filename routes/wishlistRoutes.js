const express = require('express');
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

// Route to add a product to the wishlist
router.post('/add', protect, addToWishlist);
// Route to get the user's wishlist
router.get('/', protect, getWishlist);
// Route to remove a product from the wishlist
router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;