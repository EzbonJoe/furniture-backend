const Collection = require('../models/Collection.js'); 
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getCollectionByKey = async (req, res) => {
  const { key } = req.params;
  try{
    const collection = await Collection.findOne({ key }).populate('products');
    res.status(200).json(collection);
  } catch(error){
    console.error('Error fetching collection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const createCollection = async (req, res) => {
  const { name, description, products } = req.body
  const backgroundImage = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const parsedProducts = JSON.parse(products);
    const key = slugify(name, { lower: true, strict: true });

    const existing = await Collection.findOne({ key });
    if (existing) {
      return res.status(400).json({ message: 'Collection with this name already exists' });
    }

    const newCollection = new Collection({
      key,
      name,
      description,
      backgroundImage,
      products: parsedProducts
    });

    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const updateCollection = async (req, res) => {
  const { id } = req.params;
  const { name, description, backgroundImage, products } = req.body;
  try {
    const parsedProducts = typeof products === 'string' ? JSON.parse(products) : products;
    const updateData = {
      name,
      description,
      products: parsedProducts,
    };

    if (req.file) {
      // Delete the old image from the /uploads folder
      if (collection.backgroundImage) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(collection.backgroundImage));
        fs.unlink(oldImagePath, (err) => {
          if (err) console.warn('Failed to delete old image:', err);
        });
      }

      // Set the new image path
      updateData.backgroundImage = `/uploads/${req.file.filename}`;
    }
    const updatedCollection = await Collection.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    if (!updatedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    res.status(200).json(updatedCollection);
  }catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const deleteCollection = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCollection = await Collection.findByIdAndDelete(id);
    if (!deletedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (deletedCollection.backgroundImage) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(deletedCollection.backgroundImage));
      fs.unlink(imagePath, (err) => {
        if (err) console.warn('Failed to delete background image:', err);
      });
    }

    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  getAllCollections,
  getCollectionByKey,
  createCollection,
  updateCollection,
  deleteCollection
};