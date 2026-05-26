const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  birthday: String,
  preferences: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipient', recipientSchema);
