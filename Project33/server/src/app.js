const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { initDatabase } = require('./database');
const { initData } = require('./initData');
const router = require('./routes');

const app = new Koa();
const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await initDatabase();
    await initData();
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }

  app.use(cors());
  app.use(bodyParser());

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.error(err);
      ctx.status = err.status || 500;
      ctx.body = { code: 1, message: err.message || 'Internal Server Error' };
    }
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start();
