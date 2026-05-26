const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient', required: true },
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift', required: true },
  occasion: { type: String, required: true },
  giveDate: { type: Date, required: true, index: true },
  reaction: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
