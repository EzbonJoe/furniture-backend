const express = require('express');
const router = express.Router();

const {
  getAllCollections,
  getCollectionByKey,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController.js');

const { protect } = require('../middleware/authMiddleware.js');

const { isAdmin } = require('../middleware/adminMiddleware.js');

const { upload } = require('../middleware/upload.js');

router.get('/', getAllCollections);
router.post('/',upload.single('backgroundImage'), protect, isAdmin, createCollection); 
router.get('/:key', getCollectionByKey);
router.patch('/:id',upload.single('backgroundImage'), protect, isAdmin, updateCollection);
router.delete('/:id', protect, isAdmin, deleteCollection);

module.exports = router;
