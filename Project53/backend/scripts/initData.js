const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('../src/models/Category');
const Product = require('../src/models/Product');
const Sale = require('../src/models/Sale');

const initData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    console.log('Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});

    console.log('Creating categories...');
    const categories = await Category.insertMany([
      { name: '白酒', description: '各类白酒产品' },
      { name: '啤酒', description: '各类啤酒产品' },
      { name: '红酒', description: '各类红酒产品' },
      { name: '洋酒', description: '各类洋酒产品' },
      { name: '黄酒', description: '各类黄酒产品' }
    ]);
    console.log(`Created ${categories.length} categories`);

    const today = new Date();
    const addDays = (days) => {
      const date = new Date(today);
      date.setDate(date.getDate() + days);
      return date;
    };

    console.log('Creating products...');
    const products = await Product.insertMany([
      { name: '茅台飞天53度', categoryId: categories[0]._id, price: 1499, cost: 1200, unit: '瓶', expiryDate: addDays(365), stock: 50, minStock: 10 },
      { name: '五粮液52度', categoryId: categories[0]._id, price: 1099, cost: 800, unit: '瓶', expiryDate: addDays(365), stock: 30, minStock: 10 },
      { name: '泸州老窖特曲', categoryId: categories[0]._id, price: 268, cost: 180, unit: '瓶', expiryDate: addDays(180), stock: 45, minStock: 15 },
      { name: '青岛啤酒经典', categoryId: categories[1]._id, price: 6, cost: 3, unit: '瓶', expiryDate: addDays(20), stock: 200, minStock: 50 },
      { name: '哈尔滨啤酒', categoryId: categories[1]._id, price: 5, cost: 2.5, unit: '瓶', expiryDate: addDays(15), stock: 150, minStock: 50 },
      { name: '百威啤酒', categoryId: categories[1]._id, price: 8, cost: 4, unit: '瓶', expiryDate: addDays(10), stock: 100, minStock: 30 },
      { name: '张裕干红葡萄酒', categoryId: categories[2]._id, price: 128, cost: 80, unit: '瓶', expiryDate: addDays(365), stock: 60, minStock: 20 },
      { name: '长城解百纳', categoryId: categories[2]._id, price: 98, cost: 60, unit: '瓶', expiryDate: addDays(300), stock: 40, minStock: 15 },
      { name: '拉菲传奇', categoryId: categories[2]._id, price: 298, cost: 200, unit: '瓶', expiryDate: addDays(720), stock: 25, minStock: 10 },
      { name: '芝华士12年', categoryId: categories[3]._id, price: 328, cost: 220, unit: '瓶', expiryDate: addDays(3650), stock: 35, minStock: 10 },
      { name: '人头马XO', categoryId: categories[3]._id, price: 1588, cost: 1200, unit: '瓶', expiryDate: addDays(3650), stock: 15, minStock: 5 },
      { name: '轩尼诗VSOP', categoryId: categories[3]._id, price: 688, cost: 500, unit: '瓶', expiryDate: addDays(3650), stock: 20, minStock: 5 },
      { name: '古越龙山五年', categoryId: categories[4]._id, price: 45, cost: 25, unit: '瓶', expiryDate: addDays(90), stock: 80, minStock: 20 },
      { name: '女儿红六年', categoryId: categories[4]._id, price: 68, cost: 40, unit: '瓶', expiryDate: addDays(60), stock: 60, minStock: 20 },
      { name: '即墨老酒', categoryId: categories[4]._id, price: 38, cost: 20, unit: '瓶', expiryDate: addDays(25), stock: 100, minStock: 30 },
      { name: '临期特酿白酒', categoryId: categories[0]._id, price: 99, cost: 50, unit: '瓶', expiryDate: addDays(5), stock: 20, minStock: 5 },
      { name: '过期旧啤酒', categoryId: categories[1]._id, price: 4, cost: 2, unit: '瓶', expiryDate: addDays(-10), stock: 30, minStock: 10 }
    ]);
    console.log(`Created ${products.length} products`);

    console.log('Creating sales...');
    const salesData = [];
    for (let i = 0; i < 20; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 5) + 1;
      const daysAgo = Math.floor(Math.random() * 30);
      const saleTime = new Date();
      saleTime.setDate(saleTime.getDate() - daysAgo);
      salesData.push({
        productId: product._id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
        customerName: ['张三', '李四', '王五', '赵六', ''][Math.floor(Math.random() * 5)],
        paymentMethod: ['现金', '微信', '支付宝', '银行卡'][Math.floor(Math.random() * 4)],
        saleTime
      });
    }
    const sales = await Sale.insertMany(salesData);
    console.log(`Created ${sales.length} sales`);

    console.log('Data initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
};

initData();
