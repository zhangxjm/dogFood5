const Router = require('koa-router');
const orderController = require('../controllers/orderController');

const router = new Router({ prefix: '/api/orders' });

router.get('/', orderController.getList);
router.get('/:id', orderController.getDetail);
router.post('/', orderController.create);
router.put('/:id/complete', orderController.complete);
router.put('/:id/cancel', orderController.cancel);

module.exports = router;