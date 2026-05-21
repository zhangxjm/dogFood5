const Service = require('../models/Service');

const serviceController = {
  async getServices(ctx) {
    try {
      const { status } = ctx.query;
      const where = {};
      if (status !== undefined) {
        where.status = status;
      }
      const services = await Service.findAll({ where, order: [['created_at', 'DESC']] });
      ctx.body = {
        code: 200,
        message: 'success',
        data: services
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async getService(ctx) {
    try {
      const { id } = ctx.params;
      const service = await Service.findByPk(id);
      if (!service) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '服务不存在' };
        return;
      }
      ctx.body = {
        code: 200,
        message: 'success',
        data: service
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async createService(ctx) {
    try {
      const data = ctx.request.body;
      const service = await Service.create(data);
      ctx.body = {
        code: 200,
        message: '创建成功',
        data: service
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async updateService(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body;
      const service = await Service.findByPk(id);
      if (!service) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '服务不存在' };
        return;
      }
      await service.update(data);
      ctx.body = {
        code: 200,
        message: '更新成功',
        data: service
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async deleteService(ctx) {
    try {
      const { id } = ctx.params;
      const service = await Service.findByPk(id);
      if (!service) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '服务不存在' };
        return;
      }
      await service.destroy();
      ctx.body = {
        code: 200,
        message: '删除成功'
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  }
};

module.exports = serviceController;
