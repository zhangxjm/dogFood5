const mongoose = require('mongoose');

const expressSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  pickupCode: {
    type: String,
    required: true,
    unique: true,
  },
  courierCompany: {
    type: String,
    required: true,
  },
  recipientName: {
    type: String,
    required: true,
  },
  recipientPhone: {
    type: String,
    required: true,
  },
  shelfLocation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'picked', 'expired'],
    default: 'pending',
  },
  inboundTime: {
    type: Date,
    default: Date.now,
  },
  pickupTime: {
    type: Date,
  },
  remark: {
    type: String,
    default: '',
  },
  notified: {
    type: Boolean,
    default: false,
  },
});

expressSchema.index({ pickupCode: 1 });
expressSchema.index({ status: 1 });
expressSchema.index({ inboundTime: -1 });

module.exports = mongoose.model('Express', expressSchema);
