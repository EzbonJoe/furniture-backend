const Cart = require('../models/Cart.js');

const createNewCart = async(req, res) => {
  try{
    const userId = req.user.id; // comes from JWT
    const existingCart = await Cart.findOne({ user: userId });
    if (existingCart) {
      return res.status(200).json(existingCart);
    }

    const newCart = new Cart({ user: userId, items: [] });
    await newCart.save();
    res.status(201).json(newCart);
  }catch (error) {
    res.status(500).json({ message: 'Error creating cart', error: error.message });
  }
}

const getCartById = async(req, res) => {
  try{
    const { userId } = req.params;

    const cart = await Cart.findOne({user: userId}).populate('items.product');

    if (!cart) {
      return res.status(200).json({ cartItems: [] });
    } 

    const cartItems = cart.items
    .filter(item => item.product !== null) // skip deleted products
    .map(item => ({
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      deliveryOptionId: item.deliveryOptionId
    }));

    cart.items = cartItems;
    await cart.save();

    res.status(200).json({ cartItems }); 
  }catch(error){
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Internal server error' }); 
  }
}

const addItemToCart = async(req, res) => {
  try{
    const userId = req.user.id;
    const { productId, quantity, deliveryOptionId } = req.body;

    if (!deliveryOptionId) {
      return res.status(400).json({ message: 'Delivery option ID is required' }); 
    }

    let cart = await Cart.findOne({user: userId});

    if (!cart) {
      // If no cart exists for the user, create a new one
      cart = new Cart({ user: userId, items: [] });
    }   

    const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      if (deliveryOptionId) {
        cart.items[existingItemIndex].deliveryOptionId = deliveryOptionId;
      }
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity, deliveryOptionId });
    }

    await cart.save();
    res.status(200).json(cart);
  }catch(error){
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const updateCartItem = async(req, res) => {  
  try{
    const userId = req.user.id;
    const {  productId, quantity } = req.body;

    const cart = await Cart.findOne({user: userId});

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log("Cart Items:", cart.items.map(item => item.product.toString()));
    console.log("Looking for productId:", productId);

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update the quantity of the item
    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    res.status(200).json(cart);
    console.log("userId:", userId);
    console.log("productId:", productId);
    console.log("quantity:", quantity);

  }catch(error){
    console.error('Error updating cart item:', error);
    return res.status(500).json({ message: 'Internal server error' }); 
  }
}

const removeItemFromCart = async(req, res) => {  
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }else if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    }else{
      //remove item 
      cart.items.splice(itemIndex, 1);
    }


    await cart.save();
    res.status(200).json(cart);

  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const clearCart = async(req, res) => {
  try {
    const userId = req.user.id;    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Clear the items array
    cart.items = [];
    
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const updateDeliveryOptionId = async (req,res) => {
  try {
    const userId = req.user.id;
    const { productId, deliveryOptionId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    // Update the delivery option ID of the item
    cart.items[itemIndex].deliveryOptionId = deliveryOptionId;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error updating delivery option ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }  
}

module.exports = {
  createNewCart,
  getCartById,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  updateDeliveryOptionId
}