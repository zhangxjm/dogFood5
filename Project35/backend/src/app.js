const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');
const sequelize = require('./config/database');

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    app.listen(PORT, () => {
      console.log(`🚀 服务运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }
};

startServer();
