const schedule = require('node-schedule');
const Express = require('../models/Express');
const moment = require('moment');

const EXPIRED_DAYS = 3;
const REMINDER_HOURS = [9, 14, 18];

class ReminderService {
  static async checkAndSendReminders() {
    try {
      const threeDaysAgo = moment().subtract(EXPIRED_DAYS, 'days').toDate();

      const pendingExpress = await Express.find({
        status: 'pending',
        inboundTime: { $lte: threeDaysAgo },
        notified: false,
      });

      console.log(`[${new Date().toLocaleString()}] 检查到 ${pendingExpress.length} 个即将过期的快递`);

      for (const express of pendingExpress) {
        console.log(`提醒: ${express.recipientName} - 取件码: ${express.pickupCode}, 电话: ${express.recipientPhone}`);
        
        express.notified = true;
        await express.save();
      }

      return pendingExpress;
    } catch (error) {
      console.error('发送提醒时出错:', error);
      return [];
    }
  }

  static async markAsExpired() {
    try {
      const fiveDaysAgo = moment().subtract(5, 'days').toDate();

      const result = await Express.updateMany(
        {
          status: 'pending',
          inboundTime: { $lte: fiveDaysAgo },
        },
        {
          $set: { status: 'expired' },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[${new Date().toLocaleString()}] 已将 ${result.modifiedCount} 个快递标记为过期`);
      }

      return result.modifiedCount;
    } catch (error) {
      console.error('标记过期快递时出错:', error);
      return 0;
    }
  }

  static async getExpiredList() {
    try {
      const threeDaysAgo = moment().subtract(EXPIRED_DAYS, 'days').toDate();

      const expiredList = await Express.find({
        status: 'pending',
        inboundTime: { $lte: threeDaysAgo },
      }).sort({ inboundTime: 1 });

      return expiredList;
    } catch (error) {
      console.error('获取滞留件列表时出错:', error);
      return [];
    }
  }

  static startReminderService() {
    console.log('滞留件提醒服务已启动');

    for (const hour of REMINDER_HOURS) {
      schedule.scheduleJob(`0 ${hour} * * *`, async () => {
        console.log(`[${new Date().toLocaleString()}] 执行定时提醒任务`);
        await this.checkAndSendReminders();
      });
    }

    schedule.scheduleJob('0 0 * * *', async () => {
      console.log(`[${new Date().toLocaleString()}] 执行每日过期标记任务`);
      await this.markAsExpired();
    });
  }
}

module.exports = ReminderService;
