const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class MoveRecord extends Model {}

MoveRecord.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '需求ID',
    references: {
      model: 'move_requests',
      key: 'id'
    }
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '车辆ID',
    references: {
      model: 'vehicles',
      key: 'id'
    }
  },
  actualStartTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '实际开始时间'
  },
  actualEndTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '实际结束时间'
  },
  actualDistance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: '实际距离(公里)'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: '总金额'
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid',
    comment: '付款状态'
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注'
  }
}, {
  sequelize,
  modelName: 'MoveRecord',
  tableName: 'move_records',
  timestamps: true,
  underscored: false
});

module.exports = MoveRecord;
