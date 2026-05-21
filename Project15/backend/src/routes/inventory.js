const Router = require('koa-router');
const inventoryController = require('../controllers/inventoryController');

const router = new Router({ prefix: '/api/inventory' });

router.get('/', inventoryController.getInventoryList);
router.get('/logs', inventoryController.getLogList);
router.post('/in', inventoryController.stockIn);
router.post('/out', inventoryController.stockOut);

module.exports = router;