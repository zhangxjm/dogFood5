const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient' },
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift' },
  occasion: { type: String, required: true },
  remindDate: { type: Date, required: true, index: true },
  status: { type: String, enum: ['pending', 'done'], default: 'pending' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', reminderSchema);
