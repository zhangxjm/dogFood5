const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.get('/', saleController.getAll);
router.get('/stats', saleController.getStats);
router.get('/:id', saleController.getById);
router.post('/', saleController.create);
router.delete('/:id', saleController.delete);

module.exports = router;
