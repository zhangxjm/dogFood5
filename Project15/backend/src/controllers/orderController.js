const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const InventoryLog = require('../models/InventoryLog');
const { Op } = require('sequelize');

const orderController = {
  async getList(ctx) {
    try {
      const { page = 1, pageSize = 10, status } = ctx.query;
      const where = {};
      if (status) {
        where.status = status;
      }
      const { count, rows } = await Order.findAndCountAll({
        where,
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: Product, as: 'Product', attributes: ['id', 'name', 'spec', 'unit'] }]
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

  async getDetail(ctx) {
    try {
      const { id } = ctx.params;
      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: Product, as: 'Product', attributes: ['id', 'name', 'spec', 'unit'] }]
          }
        ]
      });
      if (!order) {
        ctx.body = { code: 404, message: '订单不存在' };
        return;
      }
      ctx.body = { code: 200, message: 'success', data: order };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async create(ctx) {
    try {
      const { customerName, customerPhone, items, remark } = ctx.request.body;
      if (!items || items.length === 0) {
        ctx.body = { code: 400, message: '订单项不能为空' };
        return;
      }
      for (const item of items) {
        const inventory = await Inventory.findOne({ where: { productId: item.productId } });
        if (!inventory || inventory.quantity < item.quantity) {
          const product = await Product.findByPk(item.productId);
          ctx.body = { code: 400, message: `货品${product?.name || ''}库存不足` };
          return;
        }
      }
      const orderNo = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
      let totalAmount = 0;
      const orderItems = [];
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        const price = product.price;
        const amount = price * item.quantity;
        totalAmount += amount;
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price,
          amount
        });
      }
      const order = await Order.create({
        orderNo,
        customerName,
        customerPhone,
        totalAmount,
        remark,
        status: 'pending'
      });
      for (const item of orderItems) {
        await OrderItem.create({ orderId: order.id, ...item });
      }
      ctx.body = { code: 200, message: '订单创建成功', data: order };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async complete(ctx) {
    try {
      const { id } = ctx.params;
      const order = await Order.findByPk(id, {
        include: [{ model: OrderItem, as: 'items' }]
      });
      if (!order) {
        ctx.body = { code: 404, message: '订单不存在' };
        return;
      }
      if (order.status !== 'pending') {
        ctx.body = { code: 400, message: '订单状态不正确' };
        return;
      }
      for (const item of order.items) {
        const inventory = await Inventory.findOne({ where: { productId: item.productId } });
        if (!inventory || inventory.quantity < item.quantity) {
          const product = await Product.findByPk(item.productId);
          ctx.body = { code: 400, message: `货品${product?.name || ''}库存不足` };
          return;
        }
      }
      for (const item of order.items) {
        const inventory = await Inventory.findOne({ where: { productId: item.productId } });
        await inventory.update({
          quantity: inventory.quantity - item.quantity,
          totalOut: inventory.totalOut + item.quantity
        });
        await InventoryLog.create({
          productId: item.productId,
          type: 'out',
          quantity: item.quantity,
          remark: `订单出库: ${order.orderNo}`
        });
      }
      await order.update({ status: 'completed' });
      ctx.body = { code: 200, message: '订单完成成功' };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  },

  async cancel(ctx) {
    try {
      const { id } = ctx.params;
      const order = await Order.findByPk(id);
      if (!order) {
        ctx.body = { code: 404, message: '订单不存在' };
        return;
      }
      if (order.status !== 'pending') {
        ctx.body = { code: 400, message: '订单状态不正确' };
        return;
      }
      await order.update({ status: 'cancelled' });
      ctx.body = { code: 200, message: '订单取消成功' };
    } catch (error) {
      ctx.body = { code: 500, message: error.message };
    }
  }
};

module.exports = orderController;