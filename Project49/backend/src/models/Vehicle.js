const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Vehicle extends Model {}

Vehicle.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: '车型名称'
  },
  size: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: '车辆尺寸'
  },
  capacity: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '载重容量'
  },
  pricePerKm: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '每公里价格'
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '基础价格'
  },
  floorPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    comment: '每层楼加价'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '描述'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '是否启用'
  }
}, {
  sequelize,
  modelName: 'Vehicle',
  tableName: 'vehicles',
  timestamps: true,
  underscored: false
});

module.exports = Vehicle;
