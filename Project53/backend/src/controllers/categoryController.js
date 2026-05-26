const Category = require('../models/Category');

const categoryController = {
  getAll: async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: '品类不存在' });
      }
      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: '品类名称不能为空' });
      }
      const existing = await Category.findOne({ name });
      if (existing) {
        return res.status(400).json({ success: false, message: '品类名称已存在' });
      }
      const category = new Category({ name, description });
      await category.save();
      res.json({ success: true, data: category, message: '创建成功' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description },
        { new: true }
      );
      if (!category) {
        return res.status(404).json({ success: false, message: '品类不存在' });
      }
      res.json({ success: true, data: category, message: '更新成功' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: '品类不存在' });
      }
      res.json({ success: true, message: '删除成功' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = categoryController;
