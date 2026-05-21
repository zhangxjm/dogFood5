const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const giftRoutes = require('./routes/gifts');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gift-manager';

app.use(cors());
app.use(express.json());

app.use('/api/gifts', giftRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '礼品管理系统后端服务运行正常' });
});

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('成功连接到 MongoDB');
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB 连接失败:', error.message);
});
