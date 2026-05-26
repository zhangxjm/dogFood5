const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Rating extends Model {}

Rating.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '记录ID',
    references: {
      model: 'move_records',
      key: 'id'
    }
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
  overallRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    comment: '综合评分(1-5)'
  },
  serviceRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    comment: '服务态度评分'
  },
  timelinessRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    comment: '准时度评分'
  },
  careRating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    comment: '物品爱护评分'
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '评语'
  },
  reviewerName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '评价人姓名'
  }
}, {
  sequelize,
  modelName: 'Rating',
  tableName: 'ratings',
  timestamps: true,
  underscored: false
});

module.exports = Rating;
