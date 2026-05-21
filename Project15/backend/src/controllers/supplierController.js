const Supplier = require('../models/Supplier');

const supplierController = {
  async getList(ctx) {
    try {
      const { page = 1, pageSize = 10, keyword = '' } = ctx.query;
      const where = {};
      if (keyword) {
        where.name = { [require('sequelize').Op.like]: `%${keyword}%` };
      }
      const { count, rows } = await Supplier.findAndCountAll({
        where,
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
      const list = await Supplier.findAll({ order: [['name', 'ASC']] });
      ctx.body = { code: 200, message: 'success', data: list };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async getDetail(ctx) {
    try {
      const { id } = ctx.params;
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        ctx.body = { code: 404, message: '供货商不存在' };
        return;
      }
      ctx.body = { code: 200, message: 'success', data: supplier };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async create(ctx) {
    try {
      const data = ctx.request.body;
      const supplier = await Supplier.create(data);
      ctx.body = { code: 200, message: '创建成功', data: supplier };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body;
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        ctx.body = { code: 404, message: '供货商不存在' };
        return;
      }
      await supplier.update(data);
      ctx.body = { code: 200, message: '更新成功', data: supplier };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        ctx.body = { code: 404, message: '供货商不存在' };
        return;
      }
      await supplier.destroy();
      ctx.body = { code: 200, message: '删除成功' };
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        ctx.body = { code: 400, message: '该供货商下有关联的货品，无法删除，请先删除关联的货品' };
      } else {
        ctx.body = { code: 500, message: error.message };
      }
    }
  }
};

module.exports = supplierController;