const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const SeasonalTrend = sequelize.define('SeasonalTrend', {
  month: { type: DataTypes.STRING, allowNull: false },
  winter_items: { type: DataTypes.INTEGER, allowNull: false },
  summer_items: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = SeasonalTrend; 