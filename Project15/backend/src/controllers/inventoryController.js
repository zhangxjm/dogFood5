const Inventory = require('../models/Inventory');
const InventoryLog = require('../models/InventoryLog');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const { Op } = require('sequelize');

const inventoryController = {
  async getInventoryList(ctx) {
    try {
      const { page = 1, pageSize = 10, keyword = '' } = ctx.query;
      const productWhere = {};
      if (keyword) {
        productWhere.name = { [Op.like]: `%${keyword}%` };
      }
      const { count, rows } = await Inventory.findAndCountAll({
        include: [
          { 
            model: Product, 
            as: 'Product', 
            where: productWhere,
            include: [{ model: Supplier, as: 'Supplier', attributes: ['id', 'name'] }]
          }
        ],
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
        order: [['created_at', 'DESC']]
      });
      ctx.body = {
        code: 200,
        message: 'success',
        data: {
          list: rows,
          total: count,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async getLogList(ctx) {
    try {
      const { page = 1, pageSize = 10, type } = ctx.query;
      const where = {};
      if (type) {
        where.type = type;
      }
      const { count, rows } = await InventoryLog.findAndCountAll({
        where,
        include: [{ model: Product, as: 'Product', attributes: ['id', 'name', 'spec', 'unit'] }],
        offset: (page - 1) * pageSize,
        limit: parseInt(pageSize),
        order: [['created_at', 'DESC']]
      });
      ctx.body = {
        code: 200,
        message: 'success',
        data: {
          list: rows,
          total: count,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        }
      };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async stockIn(ctx) {
    try {
      const { productId, quantity, operator, remark } = ctx.request.body;
      if (!productId || !quantity) {
        ctx.body = { code: 400, message: '货品ID和数量不能为空' };
        return;
      }
      const product = await Product.findByPk(productId);
      if (!product) {
        ctx.body = { code: 404, message: '货品不存在' };
        return;
      }
      let inventory = await Inventory.findOne({ where: { productId } });
      if (!inventory) {
        inventory = await Inventory.create({ productId, quantity: 0, totalIn: 0, totalOut: 0 });
      }
      await inventory.update({
        quantity: inventory.quantity + parseInt(quantity),
        totalIn: inventory.totalIn + parseInt(quantity)
      });
      await InventoryLog.create({ productId, type: 'in', quantity, operator, remark });
      ctx.body = { code: 200, message: '入库成功', data: inventory };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async stockOut(ctx) {
    try {
      const { productId, quantity, operator, remark } = ctx.request.body;
      if (!productId || !quantity) {
        ctx.body = { code: 400, message: '货品ID和数量不能为空' };
        return;
      }
      const product = await Product.findByPk(productId);
      if (!product) {
        ctx.body = { code: 404, message: '货品不存在' };
        return;
      }
      let inventory = await Inventory.findOne({ where: { productId } });
      if (!inventory || inventory.quantity < parseInt(quantity)) {
        ctx.body = { code: 400, message: '库存不足' };
        return;
      }
      await inventory.update({
        quantity: inventory.quantity - parseInt(quantity),
        totalOut: inventory.totalOut + parseInt(quantity)
      });
      await InventoryLog.create({ productId, type: 'out', quantity, operator, remark });
      ctx.body = { code: 200, message: '出库成功', data: inventory };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  }
};

module.exports = inventoryController;