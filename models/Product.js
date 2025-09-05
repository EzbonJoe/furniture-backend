const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String},
  priceCents: { type: Number, required: true },
  images: [String],
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }]
});

productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
