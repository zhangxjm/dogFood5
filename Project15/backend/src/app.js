const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
require('dotenv').config();

const sequelize = require('./config/database');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const Inventory = require('./models/Inventory');
const InventoryLog = require('./models/InventoryLog');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

Product.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'Supplier' });
Inventory.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });
InventoryLog.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'Product' });

const supplierRoutes = require('./routes/supplier');
const productRoutes = require('./routes/product');
const inventoryRoutes = require('./routes/inventory');
const orderRoutes = require('./routes/order');

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(bodyParser());

app.use(supplierRoutes.routes()).use(supplierRoutes.allowedMethods());
app.use(productRoutes.routes()).use(productRoutes.allowedMethods());
app.use(inventoryRoutes.routes()).use(inventoryRoutes.allowedMethods());
app.use(orderRoutes.routes()).use(orderRoutes.allowedMethods());

app.use(async (ctx) => {
  ctx.body = { message: '零食批发进销存系统API' };
});

async function initData() {
  const suppliers = await Supplier.findAll();
  if (suppliers.length === 0) {
    await Supplier.bulkCreate([
      { name: '好丽友食品有限公司', contact: '张经理', phone: '13800138001', address: '北京市朝阳区', remark: '主要供应商' },
      { name: '乐事（中国）有限公司', contact: '李总', phone: '13800138002', address: '上海市浦东新区', remark: '薯片供应商' },
      { name: '旺旺集团', contact: '王主管', phone: '13800138003', address: '杭州市西湖区', remark: '休闲食品' }
    ]);
    const products = [
      { name: '好丽友派', category: '糕点', spec: '6枚/盒', unit: '盒', price: 12.5, supplierId: 1 },
      { name: '呀！土豆', category: '膨化', spec: '70g/袋', unit: '袋', price: 5.5, supplierId: 2 },
      { name: '乐事薯片原味', category: '膨化', spec: '104g/袋', unit: '袋', price: 8.0, supplierId: 2 },
      { name: '旺旺雪饼', category: '米饼', spec: '84g/袋', unit: '袋', price: 6.5, supplierId: 3 },
      { name: 'QQ糖', category: '糖果', spec: '70g/袋', unit: '袋', price: 4.0, supplierId: 3 }
    ];
    await Product.bulkCreate(products);
    for (let i = 1; i <= 5; i++) {
      await Inventory.create({ productId: i, quantity: 100, totalIn: 100, totalOut: 0 });
    }
    console.log('初始数据创建完成');
  }
}

sequelize.sync({ alter: true }).then(() => {
  console.log('数据库连接成功');
  initData();
  app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('数据库连接失败:', err);
});