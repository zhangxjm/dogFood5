const express = require('express');
const History = require('../models/History');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { recipientId, year } = req.query;
    const filter = {};
    if (recipientId) filter.recipientId = recipientId;
    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${year}-12-31T23:59:59`);
      filter.giveDate = { $gte: start, $lte: end };
    }
    const records = await History.find(filter)
      .populate('recipientId', 'name relationship')
      .populate('giftId', 'name category price')
      .sort({ giveDate: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const h = await History.findById(req.params.id).populate('recipientId giftId');
    if (!h) return res.status(404).json({ error: '未找到记录' });
    res.json(h);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const h = new History(req.body);
    await h.save();
    await h.populate('recipientId giftId');
    res.status(201).json(h);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const h = await History.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('recipientId giftId');
    res.json(h);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
