require('dotenv').config();
const mongoose = require('mongoose');
const Gift = require('./models/Gifts');
const Recipient = require('./models/Recipients');
const Reminder = require('./models/Reminders');
const History = require('./models/History');

const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDB = process.env.MONGO_DB || 'gift_list_db';
const mongoURI = `mongodb://${mongoHost}:${mongoPort}/${mongoDB}`;

const seedData = async () => {
  console.log('Seeding initial data...');
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    const giftCount = await Gift.countDocuments();
    if (giftCount > 0) {
      console.log('Data already exists, skip seeding.');
      return;
    }

    const gifts = await Gift.insertMany([
      { name: '精美茶叶礼盒', category: '食品饮品', price: 399, quantity: 10, description: '明前龙井+普洱双拼', tags: ['健康', '送礼佳品'] },
      { name: '真丝丝巾', category: '服饰配件', price: 299, quantity: 5, description: '100%桑蚕丝', tags: ['优雅', '女款'] },
      { name: '智能保温杯', category: '生活用品', price: 199, quantity: 20, description: '带温度显示', tags: ['实用', '科技'] },
      { name: '精品红酒', category: '食品饮品', price: 588, quantity: 8, description: '法国进口赤霞珠', tags: ['高端', '商务'] },
      { name: '手工巧克力礼盒', category: '食品饮品', price: 168, quantity: 15, description: '比利时工艺', tags: ['甜蜜', '节日'] },
      { name: '蓝牙音箱', category: '电子产品', price: 459, quantity: 6, description: '便携防水音箱', tags: ['科技', '娱乐'] },
      { name: '文房四宝套装', category: '文化用品', price: 488, quantity: 4, description: '笔墨纸砚精美套装', tags: ['文化', '雅致'] },
      { name: '鲜花礼盒', category: '鲜花礼品', price: 258, quantity: 12, description: '季节鲜花组合', tags: ['浪漫', '祝福'] }
    ]);
    console.log('Gifts seeded:', gifts.length);

    const recipients = await Recipient.insertMany([
      { name: '父亲', relationship: '父亲', birthday: '06-15', preferences: '喜欢茶叶、文玩', notes: '送礼讲究实用' },
      { name: '母亲', relationship: '母亲', birthday: '08-20', preferences: '喜欢丝巾、鲜花', notes: '喜欢浪漫小礼物' },
      { name: '张总', relationship: '客户', birthday: '03-10', preferences: '喜欢红酒、商务礼品', notes: '重要客户' },
      { name: '李姐', relationship: '闺蜜', birthday: '11-25', preferences: '喜欢巧克力、时尚', notes: '最好的朋友' },
      { name: '王经理', relationship: '领导', birthday: '05-01', preferences: '喜欢茶叶、文房', notes: '公司直属领导' }
    ]);
    console.log('Recipients seeded:', recipients.length);

    const today = new Date();
    const reminders = await Reminder.insertMany([
      { title: '父亲生日送礼', recipientId: recipients[0]._id, giftId: gifts[0]._id, occasion: '生日', remindDate: new Date(today.getFullYear(), 5, 10), status: 'pending', notes: '提前一周准备' },
      { title: '母亲节送礼', recipientId: recipients[1]._id, giftId: gifts[7]._id, occasion: '母亲节', remindDate: new Date(today.getFullYear(), 4, 10), status: 'pending', notes: '康乃馨+丝巾' },
      { title: '张总中秋礼品', recipientId: recipients[2]._id, giftId: gifts[3]._id, occasion: '中秋节', remindDate: new Date(today.getFullYear(), 8, 15), status: 'pending', notes: '商务拜访' }
    ]);
    console.log('Reminders seeded:', reminders.length);

    const history = await History.insertMany([
      { recipientId: recipients[0]._id, giftId: gifts[0]._id, occasion: '端午节', giveDate: new Date(today.getFullYear() - 1, 5, 15), reaction: '非常喜欢', notes: '节日问候' },
      { recipientId: recipients[1]._id, giftId: gifts[1]._id, occasion: '生日', giveDate: new Date(today.getFullYear() - 1, 7, 20), reaction: '惊喜感动', notes: '红色款式' },
      { recipientId: recipients[2]._id, giftId: gifts[3]._id, occasion: '春节', giveDate: new Date(today.getFullYear() - 1, 0, 20), reaction: '感谢', notes: '年会拜访' },
      { recipientId: recipients[3]._id, giftId: gifts[4]._id, occasion: '情人节', giveDate: new Date(today.getFullYear() - 1, 1, 14), reaction: '甜蜜', notes: '附带贺卡' }
    ]);
    console.log('History seeded:', history.length);

    console.log('All seed data inserted successfully!');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
