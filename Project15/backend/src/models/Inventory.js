const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '货品ID',
    field: 'product_id'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '库存数量'
  },
  totalIn: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '累计入库',
    field: 'total_in'
  },
  totalOut: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '累计出库',
    field: 'total_out'
  }
}, {
  tableName: 'inventory',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Inventory;