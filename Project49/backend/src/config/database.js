const { Sequelize } = require('sequelize');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'moving_service'
};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    timezone: '+08:00',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      idle: 10000
    }
  }
);

module.exports = { sequelize, dbConfig };
