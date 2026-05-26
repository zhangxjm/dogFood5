const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  unit: { type: String, default: '瓶' },
  expiryDate: { type: Date, required: true },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
