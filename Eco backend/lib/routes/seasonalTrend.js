const express = require('express');
const router = express.Router();
const { SeasonalTrend } = require('../models/associations');

// Create
router.post('/', async (req, res) => {
  try {
    const trend = await SeasonalTrend.create(req.body);
    res.status(201).json(trend);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk insert
router.post('/bulk', async (req, res) => {
  try {
    const trends = await SeasonalTrend.bulkCreate(req.body);
    res.status(201).json(trends);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const trends = await SeasonalTrend.findAll();
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const trend = await SeasonalTrend.findByPk(req.params.id);
    if (!trend) return res.status(404).json({ error: 'Not found' });
    res.json(trend);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await SeasonalTrend.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const trend = await SeasonalTrend.findByPk(req.params.id);
    res.json(trend);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SeasonalTrend.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 