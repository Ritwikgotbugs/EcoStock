const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const TrendingBuzzword = sequelize.define('TrendingBuzzword', {
  word: { type: DataTypes.STRING, allowNull: false },
  impact: { type: DataTypes.STRING, allowNull: false },
  item: { type: DataTypes.STRING, allowNull: false },
  reason: { type: DataTypes.STRING, allowNull: false }
});

module.exports = TrendingBuzzword; 