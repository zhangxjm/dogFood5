const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

const productController = {
  async getList(ctx) {
    try {
      const { page = 1, pageSize = 10, keyword = '' } = ctx.query;
      const where = {};
      if (keyword) {
        where.name = { [require('sequelize').Op.like]: `%${keyword}%` };
      }
      const { count, rows } = await Product.findAndCountAll({
        where,
        include: [{ model: Supplier, as: 'Supplier', attributes: ['id', 'name'] }],
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

  async getAll(ctx) {
    try {
      const list = await Product.findAll({
        include: [{ model: Supplier, as: 'Supplier', attributes: ['id', 'name'] }],
        order: [['name', 'ASC']]
      });
      ctx.body = { code: 200, message: 'success', data: list };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async getDetail(ctx) {
    try {
      const { id } = ctx.params;
      const product = await Product.findByPk(id, {
        include: [{ model: Supplier, as: 'Supplier', attributes: ['id', 'name'] }]
      });
      if (!product) {
        ctx.body = { code: 404, message: '货品不存在' };
        return;
      }
      ctx.body = { code: 200, message: 'success', data: product };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async create(ctx) {
    try {
      const data = ctx.request.body;
      const product = await Product.create(data);
      ctx.body = { code: 200, message: '创建成功', data: product };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body;
      const product = await Product.findByPk(id);
      if (!product) {
        ctx.body = { code: 404, message: '货品不存在' };
        return;
      }
      await product.update(data);
      ctx.body = { code: 200, message: '更新成功', data: product };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const product = await Product.findByPk(id);
      if (!product) {
        ctx.body = { code: 404, message: '货品不存在' };
        return;
      }
      await product.destroy();
      ctx.body = { code: 200, message: '删除成功' };
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        ctx.body = { code: 400, message: '该货品有关联的库存或订单，无法删除' };
      } else {
        ctx.body = { code: 500, message: error.message };
      }
    }
  }
};

module.exports = productController;