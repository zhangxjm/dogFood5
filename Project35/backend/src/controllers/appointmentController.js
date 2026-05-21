const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

const appointmentController = {
  async getAppointments(ctx) {
    try {
      const { status } = ctx.query;
      const where = {};
      if (status !== undefined) {
        where.status = status;
      }
      const appointments = await Appointment.findAll({
        where,
        include: [{ model: Service, as: 'service' }],
        order: [['created_at', 'DESC']]
      });
      ctx.body = {
        code: 200,
        message: 'success',
        data: appointments
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async getAppointment(ctx) {
    try {
      const { id } = ctx.params;
      const appointment = await Appointment.findByPk(id, {
        include: [{ model: Service, as: 'service' }]
      });
      if (!appointment) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '预约不存在' };
        return;
      }
      ctx.body = {
        code: 200,
        message: 'success',
        data: appointment
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async createAppointment(ctx) {
    try {
      const data = ctx.request.body;
      const appointment = await Appointment.create(data);
      ctx.body = {
        code: 200,
        message: '预约成功',
        data: appointment
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async updateAppointment(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body;
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '预约不存在' };
        return;
      }
      await appointment.update(data);
      ctx.body = {
        code: 200,
        message: '更新成功',
        data: appointment
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async updateStatus(ctx) {
    try {
      const { id } = ctx.params;
      const { status } = ctx.request.body;
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '预约不存在' };
        return;
      }
      await appointment.update({ status });
      ctx.body = {
        code: 200,
        message: '状态更新成功',
        data: appointment
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  }
};

module.exports = appointmentController;
