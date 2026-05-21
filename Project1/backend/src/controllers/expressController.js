const Express = require('../models/Express');
const PickupCodeService = require('../services/pickupCodeService');
const moment = require('moment');

class ExpressController {
  static async inbound(ctx) {
    try {
      const { trackingNumber, courierCompany, recipientName, recipientPhone, shelfLocation, remark } = ctx.request.body;

      if (!trackingNumber || !courierCompany || !recipientName || !recipientPhone || !shelfLocation) {
        ctx.status = 400;
        ctx.body = { error: '缺少必要参数' };
        return;
      }

      const existingExpress = await Express.findOne({ trackingNumber });
      if (existingExpress) {
        ctx.status = 400;
        ctx.body = { error: '该运单号已存在' };
        return;
      }

      const pickupCode = await PickupCodeService.generateUniquePickupCode();

      const express = new Express({
        trackingNumber,
        pickupCode,
        courierCompany,
        recipientName,
        recipientPhone,
        shelfLocation,
        remark: remark || '',
      });

      await express.save();

      ctx.status = 201;
      ctx.body = {
        message: '快递入库成功',
        data: express,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

  static async pickup(ctx) {
    try {
      const { pickupCode } = ctx.request.body;

      if (!pickupCode) {
        ctx.status = 400;
        ctx.body = { error: '请输入取件码' };
        return;
      }

      const express = await Express.findOne({ pickupCode: pickupCode.toUpperCase() });

      if (!express) {
        ctx.status = 404;
        ctx.body = { error: '取件码无效或快递不存在' };
        return;
      }

      if (express.status === 'picked') {
        ctx.status = 400;
        ctx.body = { error: '该快递已被取走' };
        return;
      }

      if (express.status === 'expired') {
        ctx.status = 400;
        ctx.body = { error: '该快递已过期，请联系工作人员' };
        return;
      }

      express.status = 'picked';
      express.pickupTime = new Date();
      await express.save();

      ctx.body = {
        message: '取件成功',
        data: express,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

  static async scanPickup(ctx) {
    try {
      const { scanData } = ctx.request.body;

      if (!scanData) {
        ctx.status = 400;
        ctx.body = { error: '扫码数据无效' };
        return;
      }

      let pickupCode = scanData.toUpperCase();

      if (!PickupCodeService.validatePickupCode(pickupCode)) {
        ctx.status = 400;
        ctx.body = { error: '扫码数据不是有效的取件码格式' };
        return;
      }

      const express = await Express.findOne({ pickupCode });

      if (!express) {
        ctx.status = 404;
        ctx.body = { error: '取件码无效或快递不存在' };
        return;
      }

      if (express.status === 'picked') {
        ctx.status = 400;
        ctx.body = { error: '该快递已被取走' };
        return;
      }

      if (express.status === 'expired') {
        ctx.status = 400;
        ctx.body = { error: '该快递已过期，请联系工作人员' };
        return;
      }

      express.status = 'picked';
      express.pickupTime = new Date();
      await express.save();

      ctx.body = {
        message: '扫码取件成功',
        data: express,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

  static async getExpressList(ctx) {
    try {
      const { status, page = 1, limit = 20 } = ctx.query;
      const query = {};

      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const expressList = await Express.find(query)
        .sort({ inboundTime: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Express.countDocuments(query);

      ctx.body = {
        data: expressList,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

  static async getExpressDetail(ctx) {
    try {
      const { id } = ctx.params;

      const express = await Express.findById(id);

      if (!express) {
        ctx.status = 404;
        ctx.body = { error: '快递不存在' };
        return;
      }

      ctx.body = { data: express };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

  static async getStatistics(ctx) {
    try {
      const { startDate, endDate } = ctx.query;

      let dateQuery = {};
      if (startDate && endDate) {
        dateQuery = {
          inboundTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        };
      }

      const totalInbound = await Express.countDocuments({ ...dateQuery });
      const totalPicked = await Express.countDocuments({ ...dateQuery, status: 'picked' });
      const totalPending = await Express.countDocuments({ ...dateQuery, status: 'pending' });
      const totalExpired = await Express.countDocuments({ ...dateQuery, status: 'expired' });

      const todayStart = moment().startOf('day').toDate();
      const todayEnd = moment().endOf('day').toDate();

      const todayInbound = await Express.countDocuments({
        inboundTime: { $gte: todayStart, $lte: todayEnd },
      });

      const todayPicked = await Express.countDocuments({
        pickupTime: { $gte: todayStart, $lte: todayEnd },
      });

      ctx.body = {
        data: {
          totalInbound,
          totalPicked,
          totalPending,
          totalExpired,
          todayInbound,
          todayPicked,
          pickupRate: totalInbound > 0 ? ((totalPicked / totalInbound) * 100).toFixed(2) : 0,
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }

  static async getExpiredList(ctx) {
    try {
      const { page = 1, limit = 20 } = ctx.query;
      const skip = (page - 1) * limit;

      const expiredExpress = await Express.find({ status: 'pending' })
        .sort({ inboundTime: 1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Express.countDocuments({ status: 'pending' });

      ctx.body = {
        data: expiredExpress,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  }
}

module.exports = ExpressController;
