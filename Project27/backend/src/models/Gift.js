const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['电子产品', '服饰', '食品', '书籍', '化妆品', '家居', '运动', '其他']
  },
  price: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  recipient: {
    type: String,
    required: true,
    trim: true
  },
  recipientNote: {
    type: String,
    trim: true
  },
  occasion: {
    type: String,
    required: true,
    trim: true
  },
  giftDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['待购买', '已购买', '已送出'],
    default: '待购买'
  },
  isHistory: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gift', giftSchema);
