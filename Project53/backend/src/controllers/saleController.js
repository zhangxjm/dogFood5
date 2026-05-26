const Sale = require('../models/Sale');
const Product = require('../models/Product');
const moment = require('moment');

const saleController = {
  getAll: async (req, res) => {
    try {
      const { startDate, endDate, keyword } = req.query;
      let filter = {};
      if (startDate && endDate) {
        filter.saleTime = {
          $gte: new Date(startDate),
          $lte: new Date(endDate + 'T23:59:59')
        };
      }
      if (keyword) filter.productName = { $regex: keyword, $options: 'i' };
      const sales = await Sale.find(filter).sort({ saleTime: -1 });
      res.json({ success: true, data: sales });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getStats: async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySales = await Sale.find({ saleTime: { $gte: today } });
      const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalPrice, 0);
      const todayCount = todaySales.reduce((sum, s) => sum + s.quantity, 0);

      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthSales = await Sale.find({ saleTime: { $gte: monthStart } });
      const monthRevenue = monthSales.reduce((sum, s) => sum + s.totalPrice, 0);

      res.json({
        success: true,
        data: {
          todaySales: todaySales.length,
          todayRevenue,
          todayCount,
          monthRevenue
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { productId, quantity, customerName, paymentMethod } = req.body;
      if (!productId || !quantity) {
        return res.status(400).json({ success: false, message: '请填写必填项' });
      }
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: '商品不存在' });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: '库存不足' });
      }
      const totalPrice = product.price * quantity;
      const sale = new Sale({
        productId,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalPrice,
        customerName: customerName || '',
        paymentMethod: paymentMethod || '现金'
      });
      await sale.save();
      product.stock -= quantity;
      await product.save();
      res.json({ success: true, data: sale, message: '售卖成功' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id);
      if (!sale) {
        return res.status(404).json({ success: false, message: '记录不存在' });
      }
      res.json({ success: true, data: sale });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const sale = await Sale.findByIdAndDelete(req.params.id);
      if (!sale) {
        return res.status(404).json({ success: false, message: '记录不存在' });
      }
      res.json({ success: true, message: '删除成功' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = saleController;
