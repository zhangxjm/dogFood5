const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

const reviewController = {
  async getReviews(ctx) {
    try {
      const reviews = await Review.findAll({
        include: [{
          model: Appointment,
          as: 'appointment',
          include: [{ model: Service, as: 'service' }]
        }],
        order: [['created_at', 'DESC']]
      });
      ctx.body = {
        code: 200,
        message: 'success',
        data: reviews
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async getReview(ctx) {
    try {
      const { id } = ctx.params;
      const review = await Review.findByPk(id, {
        include: [{
          model: Appointment,
          as: 'appointment',
          include: [{ model: Service, as: 'service' }]
        }]
      });
      if (!review) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '评价不存在' };
        return;
      }
      ctx.body = {
        code: 200,
        message: 'success',
        data: review
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async createReview(ctx) {
    try {
      const data = ctx.request.body;
      const appointment = await Appointment.findByPk(data.appointment_id);
      if (!appointment) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '预约不存在' };
        return;
      }
      if (appointment.status !== 3) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '只能对已完成的服务进行评价' };
        return;
      }
      const existingReview = await Review.findOne({
        where: { appointment_id: data.appointment_id }
      });
      if (existingReview) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '该服务已评价过' };
        return;
      }
      const review = await Review.create(data);
      ctx.body = {
        code: 200,
        message: '评价成功',
        data: review
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { code: 500, message: error.message };
    }
  },

  async deleteReview(ctx) {
    try {
      const { id } = ctx.params;
      const review = await Review.findByPk(id);
      if (!review) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '评价不存在' };
        return;
      }
      await review.destroy();
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

module.exports = reviewController;
