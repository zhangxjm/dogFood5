const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const connectDB = require('./config/database');
const expressRoutes = require('./routes/express');
const { startReminderService } = require('./services/reminderService');

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser());

router.get('/', async (ctx) => {
  ctx.body = {
    message: '快递驿站取件系统 API',
    version: '1.0.0',
  };
});

app.use(router.routes()).use(router.allowedMethods());
app.use(expressRoutes.routes()).use(expressRoutes.allowedMethods());

const startServer = async () => {
  await connectDB();
  startReminderService();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();

module.exports = app;
