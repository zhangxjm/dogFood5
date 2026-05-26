const Product = require('../models/Product');
const moment = require('moment');

const productController = {
  getAll: async (req, res) => {
    try {
      const { categoryId, keyword, expiryAlert } = req.query;
      let filter = {};
      if (categoryId) filter.categoryId = categoryId;
      if (keyword) filter.name = { $regex: keyword, $options: 'i' };
      if (expiryAlert === 'true') {
        const today = new Date();
        const alertDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        filter.expiryDate = { $lte: alertDate, $gte: today };
      }
      const products = await Product.find(filter).populate('categoryId').sort({ expiryDate: 1 });
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getExpiryAlert: async (req, res) => {
    try {
      const today = new Date();
      const alertDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const products = await Product.find({
        expiryDate: { $lte: alertDate, $gte: today }
      }).populate('categoryId').sort({ expiryDate: 1 });
      const expiredProducts = await Product.find({
        expiryDate: { $lt: today }
      }).populate('categoryId').sort({ expiryDate: 1 });
      res.json({
        success: true,
        data: {
          expiringSoon: products,
          expired: expiredProducts
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('categoryId');
      if (!product) {
        return res.status(404).json({ success: false, message: '商品不存在' });
      }
      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { name, categoryId, price, cost, unit, expiryDate, stock, minStock } = req.body;
      if (!name || !categoryId || !price || !cost || !expiryDate) {
        return res.status(400).json({ success: false, message: '请填写必填项' });
      }
      const product = new Product({
        name,
        categoryId,
        price,
        cost,
        unit: unit || '瓶',
        expiryDate,
        stock: stock || 0,
        minStock: minStock || 10
      });
      await product.save();
      await product.populate('categoryId');
      res.json({ success: true, data: product, message: '创建成功' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ).populate('categoryId');
      if (!product) {
        return res.status(404).json({ success: false, message: '商品不存在' });
      }
      res.json({ success: true, data: product, message: '更新成功' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: '商品不存在' });
      }
      res.json({ success: true, message: '删除成功' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = productController;
