const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ecostock', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

module.exports = sequelize; 