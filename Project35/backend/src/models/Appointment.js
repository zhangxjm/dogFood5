const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Service = require('./Service');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  customer_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  appointment_time: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '0:待确认 1:已确认 2:进行中 3:已完成 4:已取消'
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Appointment.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

module.exports = Appointment;
