const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('collections');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: `${error}` }); 
  }

}

const getProductById = async (req, res) => {
  const { id } = req.params;
  try{
    const product = await Product.findById(id).populate('collections'); 
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  }catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const createProduct = async (req, res) => {
  const { name, description, priceCents } = req.body;
  try {
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const newProduct = new Product({ name, description ,priceCents, images: imagePaths });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateProduct = async (req, res) => {
  const {id } = req.params;

  try {
    const updates = {
      name: req.body.name,
      description: req.body.description,
      priceCents: Number(req.body.priceCents)
    };

    // Handle uploaded images if needed
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedProduct);
  }catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};