const Koa = require('koa');
const cors = require('koa-cors');
const { koaBody } = require('koa-body');
const router = require('./routes');
const { sequelize } = require('./config/database');
const { initializeData } = require('./seeders');

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(koaBody({
  jsonLimit: '10mb',
  formLimit: '10mb',
  multipart: true
}));

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
  if (ctx.url === '/') {
    ctx.body = {
      name: 'Moving Service Management System',
      version: '1.0.0',
      status: 'running',
      api: {
        health: '/api/health',
        vehicles: '/api/vehicles',
        requests: '/api/move-requests',
        records: '/api/move-records',
        ratings: '/api/ratings',
        stats: '/api/stats'
      }
    };
  }
});

const startServer = async () => {
  let retries = 30;
  while (retries > 0) {
    try {
      console.log(`Connecting to database... (${retries} retries left)`);
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
      break;
    } catch (error) {
      retries--;
      console.error(`Failed to connect to database: ${error.message}`);
      if (retries === 0) {
        console.error('All retries exhausted, exiting...');
        process.exit(1);
      }
      console.log('Waiting 2 seconds before retry...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  try {
    console.log('Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('Database models synced successfully.');

    console.log('Initializing data...');
    await initializeData();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
      console.log(`Health check: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
