const express = require('express');
const Gift = require('../models/Gifts');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category && category !== '全部') filter.category = category;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const gifts = await Gift.find(filter).sort({ createdAt: -1 });
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const gifts = await Gift.find();
    const categories = [...new Set(gifts.map(g => g.category))];
    res.json(['全部', ...categories]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ error: '未找到该礼品' });
    res.json(gift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const gift = new Gift(req.body);
    await gift.save();
    res.status(201).json(gift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const gift = await Gift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(gift);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Gift.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
