const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  brand: { type: String, required: true, index: true },
  price: { type: Number, required: true, index: true },
  rating: { type: Number, default: 4.2, min: 0, max: 5, index: true },
  popularity: { type: Number, default: 0 },
  images: [{ type: String }],
  specs: { type: Map, of: String },
  stock: { type: Number, default: 100 },
  features: [{ type: String }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
