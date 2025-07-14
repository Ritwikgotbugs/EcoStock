const OverstockItem = require('./OverstockItem');
const EcoScore = require('./EcoScore');
const TrendingBuzzword = require('./TrendingBuzzword');
const SeasonalTrend = require('./SeasonalTrend');

// One EcoScore per OverstockItem
OverstockItem.belongsTo(EcoScore, { as: 'eco_score', foreignKey: 'ecoScoreId' });
EcoScore.hasMany(OverstockItem, { foreignKey: 'ecoScoreId' });

// Many-to-many: OverstockItem <-> TrendingBuzzword
OverstockItem.belongsToMany(TrendingBuzzword, { through: 'OverstockItemTrendingBuzzword', as: 'trending_buzzwords' });
TrendingBuzzword.belongsToMany(OverstockItem, { through: 'OverstockItemTrendingBuzzword', as: 'overstock_items' });

// One SeasonalTrend per OverstockItem
OverstockItem.belongsTo(SeasonalTrend, { as: 'seasonal_trend', foreignKey: 'seasonalTrendId' });
SeasonalTrend.hasMany(OverstockItem, { foreignKey: 'seasonalTrendId' });

module.exports = { OverstockItem, EcoScore, TrendingBuzzword, SeasonalTrend }; 