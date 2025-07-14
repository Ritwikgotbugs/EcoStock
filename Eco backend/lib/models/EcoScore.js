const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const EcoScore = sequelize.define('EcoScore', {
  value: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING },
  calculated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = EcoScore; 