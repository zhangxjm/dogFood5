const Router = require('koa-router');
const productController = require('../controllers/productController');

const router = new Router({ prefix: '/api/products' });

router.get('/', productController.getList);
router.get('/all', productController.getAll);
router.get('/:id', productController.getDetail);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;