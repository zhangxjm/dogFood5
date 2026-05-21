const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'plant_care',
  process.env.DB_USER || 'plantuser',
  process.env.DB_PASSWORD || 'plantpass123',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    timezone: '+08:00',
    logging: false
  }
);

module.exports = sequelize;
