const Router = require('koa-router');
const ExpressController = require('../controllers/expressController');

const router = new Router({ prefix: '/api/express' });

router.post('/inbound', ExpressController.inbound);
router.post('/pickup', ExpressController.pickup);
router.post('/scan', ExpressController.scanPickup);
router.get('/list', ExpressController.getExpressList);
router.get('/detail/:id', ExpressController.getExpressDetail);
router.get('/statistics', ExpressController.getStatistics);
router.get('/expired', ExpressController.getExpiredList);

module.exports = router;
