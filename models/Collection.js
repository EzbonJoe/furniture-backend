const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  backgroundImage: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
})

module.exports  = mongoose.model('Collection', collectionSchema);