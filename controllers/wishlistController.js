const Wishlist = require("../models/Wishlist.js");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if the product is already in the wishlist
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({ userId, products: [] });
    }

    // Check if the product is already in the wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add the product to the wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ userId }).populate('products', 'name images priceCents');  

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
}

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } =  req.params;
    const userId = req.user.id;

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Check if the product is in the wishlist
    if (!wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product not in wishlist" });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};