const express = require('express');
const router = express.Router();
const { Sale, transaction } = require('../database');

router.get('/', async (req, res) => {
  try {
    const sales = await Sale.findAll({ include: 'Product' });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ error: '销售记录不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await transaction(async (t) => {
      const { ProductId, quantity } = req.body;
      const product = await t.Product.findByPk(ProductId);
      
      if (!product) {
        throw new Error('商品不存在');
      }
      
      if (product.stock < quantity) {
        throw new Error('库存不足');
      }
      
      const unitPrice = product.price;
      const totalPrice = unitPrice * quantity;
      
      await product.update({ stock: product.stock - quantity });
      
      const sale = await t.Sale.create({
        ProductId,
        quantity,
        unitPrice,
        totalPrice
      });
      
      await t.commit();
      return sale;
    });
    
    const saleWithProduct = await Sale.findByPk(result.id);
    res.status(201).json(saleWithProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await transaction(async (t) => {
      const sale = await t.Sale.findByPk(req.params.id);
      if (!sale) {
        throw new Error('销售记录不存在');
      }
      
      const product = await t.Product.findByPk(sale.ProductId);
      if (product) {
        await product.update({ stock: product.stock + sale.quantity });
      }
      
      await t.Sale.destroy(sale.id);
      await t.commit();
    });
    
    res.json({ message: '销售记录已删除，库存已恢复' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
