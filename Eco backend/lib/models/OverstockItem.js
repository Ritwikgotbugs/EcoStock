const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const OverstockItem = sequelize.define('OverstockItem', {
  sku: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  region: { type: DataTypes.STRING, allowNull: false },
  predicted_demand: { type: DataTypes.FLOAT, allowNull: false },
  actual_stock: { type: DataTypes.FLOAT, allowNull: false },
  safety_buffer: { type: DataTypes.FLOAT, allowNull: false },
  eco_multiplier: { type: DataTypes.FLOAT, allowNull: false },
  recommended_reorder: { type: DataTypes.FLOAT, allowNull: false },
  anomaly_flag: { type: DataTypes.BOOLEAN, allowNull: false },
  anomaly_reason: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  shelf_life_days: { type: DataTypes.INTEGER },
  trend_score: { type: DataTypes.FLOAT },
  seasonal_factor: { type: DataTypes.FLOAT },
  overstocked_percentage: { type: DataTypes.FLOAT },
  predicted_stock_required: { type: DataTypes.FLOAT },
  ecoScoreId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'EcoScores', key: 'id' } },
  seasonalTrendId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'SeasonalTrends', key: 'id' } }
});

module.exports = OverstockItem; 