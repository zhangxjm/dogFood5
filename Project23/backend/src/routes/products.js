const express = require('express');
const router = express.Router();
const { Product } = require('../database');

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({ include: 'Category' });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: '商品不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      const updated = await product.update(req.body);
      res.json(updated);
    } else {
      res.status(404).json({ error: '商品不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/price', async (req, res) => {
  try {
    const { price } = req.body;
    const product = await Product.findByPk(req.params.id);
    if (product) {
      const updated = await product.update({ price });
      res.json(updated);
    } else {
      res.status(404).json({ error: '商品不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: '商品已删除' });
    } else {
      res.status(404).json({ error: '商品不存在' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats/hot', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const hotProducts = await Product.getHotProducts(parseInt(limit));
    res.json(hotProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
