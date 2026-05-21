const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '订单ID',
    field: 'order_id'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '货品ID',
    field: 'product_id'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '数量'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    comment: '单价'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    comment: '小计金额'
  }
}, {
  tableName: 'order_items',
  timestamps: false
});

module.exports = OrderItem;