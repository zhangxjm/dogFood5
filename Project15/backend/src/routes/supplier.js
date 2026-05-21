const Router = require('koa-router');
const supplierController = require('../controllers/supplierController');

const router = new Router({ prefix: '/api/suppliers' });

router.get('/', supplierController.getList);
router.get('/all', supplierController.getAll);
router.get('/:id', supplierController.getDetail);
router.post('/', supplierController.create);
router.put('/:id', supplierController.update);
router.delete('/:id', supplierController.delete);

module.exports = router;