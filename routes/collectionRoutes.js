const express = require('express');
const router = express.Router();

const {
  getAllCollections,
  getCollectionByKey,
  createCollection,
  updateCollection,
  deleteCollection
} = require('../controllers/collectionController');

const { protect } = require('../middleware/authMiddleware');

const { isAdmin } = require('../middleware/adminMiddleware');

const { upload } = require('../middleware/upload');

router.get('/', getAllCollections);
router.post('/',upload.single('backgroundImage'), protect, isAdmin, createCollection); 
router.get('/:key', getCollectionByKey);
router.patch('/:id',upload.single('backgroundImage'), protect, isAdmin, updateCollection);
router.delete('/:id', protect, isAdmin, deleteCollection);

module.exports = router;
