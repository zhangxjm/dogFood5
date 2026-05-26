const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class MoveRequest extends Model {}

MoveRequest.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '客户姓名'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: '联系电话'
  },
  moveFrom: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '搬出地址'
  },
  moveTo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '搬入地址'
  },
  moveDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '搬家日期'
  },
  floorFrom: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '搬出楼层'
  },
  floorTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '搬入楼层'
  },
  hasElevator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否有电梯'
  },
  distance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '距离(公里)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '物品描述'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
    comment: '状态'
  }
}, {
  sequelize,
  modelName: 'MoveRequest',
  tableName: 'move_requests',
  timestamps: true,
  underscored: false
});

module.exports = MoveRequest;
