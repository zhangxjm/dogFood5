const mongoose = require('mongoose');

const serviceTypes = [
  { name: '代取快递', description: '帮忙取送快递', basePrice: 5, isActive: true },
  { name: '代买外卖', description: '帮忙购买外卖送餐', basePrice: 8, isActive: true },
  { name: '代买药品', description: '帮忙购买药品', basePrice: 10, isActive: true },
  { name: '代取文件', description: '帮忙取送重要文件', basePrice: 12, isActive: true },
  { name: '其他跑腿', description: '其他类型的跑腿服务', basePrice: 10, isActive: true }
];

async function init() {
  try {
    await mongoose.connect('mongodb://localhost:27017/errand_db');
    console.log('Connected to MongoDB');

    const ServiceType = mongoose.model('ServiceType', new mongoose.Schema({
      name: String,
      description: String,
      basePrice: Number,
      isActive: Boolean
    }));

    await ServiceType.deleteMany({});
    await ServiceType.insertMany(serviceTypes);
    console.log('Service types initialized');

    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

init();
