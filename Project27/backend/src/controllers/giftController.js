const Gift = require('../models/Gift');

exports.getAllGifts = async (req, res) => {
  try {
    const { category, status, recipient, isHistory } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (recipient) filter.recipient = recipient;
    if (isHistory !== undefined) filter.isHistory = isHistory === 'true';
    
    const gifts = await Gift.find(filter).sort({ giftDate: -1 });
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGiftById = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) {
      return res.status(404).json({ message: '礼品未找到' });
    }
    res.json(gift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGift = async (req, res) => {
  try {
    const gift = new Gift(req.body);
    const savedGift = await gift.save();
    res.status(201).json(savedGift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateGift = async (req, res) => {
  try {
    const gift = await Gift.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!gift) {
      return res.status(404).json({ message: '礼品未找到' });
    }
    res.json(gift);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);
    if (!gift) {
      return res.status(404).json({ message: '礼品未找到' });
    }
    res.json({ message: '礼品已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUpcomingReminders = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    
    const reminders = await Gift.find({
      giftDate: { $gte: today, $lte: futureDate },
      isHistory: false,
      status: { $ne: '已送出' }
    }).sort({ giftDate: 1 });
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecipients = async (req, res) => {
  try {
    const recipients = await Gift.distinct('recipient');
    res.json(recipients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Gift.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalGifts = await Gift.countDocuments();
    const pendingGifts = await Gift.countDocuments({ status: '待购买' });
    const purchasedGifts = await Gift.countDocuments({ status: '已购买' });
    const sentGifts = await Gift.countDocuments({ status: '已送出' });
    const historyGifts = await Gift.countDocuments({ isHistory: true });
    
    const totalPrice = await Gift.aggregate([
      { $match: { price: { $exists: true, $ne: null } } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    
    res.json({
      totalGifts,
      pendingGifts,
      purchasedGifts,
      sentGifts,
      historyGifts,
      totalSpent: totalPrice[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
