const express = require('express');
const router = express.Router();
const { OverstockItem, EcoScore, TrendingBuzzword, SeasonalTrend } = require('../models/associations');

// Create
router.post('/', async (req, res) => {
  try {
    const item = await OverstockItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk insert
router.post('/bulk', async (req, res) => {
  try {
    const items = await OverstockItem.bulkCreate(req.body);
    res.status(201).json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const items = await OverstockItem.findAll({
      include: [
        { model: EcoScore, as: 'eco_score' },
        { model: SeasonalTrend, as: 'seasonal_trend' },
        { model: TrendingBuzzword, as: 'trending_buzzwords', through: { attributes: [] } }
      ]
    });
    // Flatten eco_score value
    const result = items.map(item => {
      const obj = item.toJSON();
      obj.eco_score = obj.eco_score && typeof obj.eco_score === 'object' && obj.eco_score.value !== undefined ? obj.eco_score.value : (obj.eco_score || 0);
      return obj;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const item = await OverstockItem.findByPk(req.params.id, {
      include: [
        { model: EcoScore, as: 'eco_score' },
        { model: SeasonalTrend, as: 'seasonal_trend' },
        { model: TrendingBuzzword, as: 'trending_buzzwords', through: { attributes: [] } }
      ]
    });
    if (!item) return res.status(404).json({ error: 'Not found' });
    const obj = item.toJSON();
    obj.eco_score = obj.eco_score && typeof obj.eco_score === 'object' && obj.eco_score.value !== undefined ? obj.eco_score.value : (obj.eco_score || 0);
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await OverstockItem.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const item = await OverstockItem.findByPk(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await OverstockItem.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 