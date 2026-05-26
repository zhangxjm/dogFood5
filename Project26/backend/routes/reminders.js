const express = require('express');
const Reminder = require('../models/Reminders');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find()
      .populate('recipientId', 'name')
      .populate('giftId', 'name')
      .sort({ remindDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const soon = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const reminders = await Reminder.find({
      remindDate: { $gte: now, $lte: soon },
      status: 'pending'
    })
      .populate('recipientId', 'name')
      .populate('giftId', 'name')
      .sort({ remindDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const r = await Reminder.findById(req.params.id).populate('recipientId giftId');
    if (!r) return res.status(404).json({ error: '未找到提醒' });
    res.json(r);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const r = new Reminder(req.body);
    await r.save();
    await r.populate('recipientId giftId');
    res.status(201).json(r);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const r = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('recipientId giftId');
    res.json(r);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
