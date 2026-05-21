const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '货品名称'
  },
  category: {
    type: DataTypes.STRING(50),
    comment: '分类'
  },
  spec: {
    type: DataTypes.STRING(100),
    comment: '规格'
  },
  unit: {
    type: DataTypes.STRING(20),
    comment: '单位'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    comment: '批发价'
  },
  supplierId: {
    type: DataTypes.INTEGER,
    comment: '供货商ID',
    field: 'supplier_id'
  },
  remark: {
    type: DataTypes.TEXT,
    comment: '备注'
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Product;