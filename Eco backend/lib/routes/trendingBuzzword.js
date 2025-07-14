const express = require('express');
const router = express.Router();
const { TrendingBuzzword } = require('../models/associations');

// Create
router.post('/', async (req, res) => {
  try {
    const buzzword = await TrendingBuzzword.create(req.body);
    res.status(201).json(buzzword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk insert
router.post('/bulk', async (req, res) => {
  try {
    const buzzwords = await TrendingBuzzword.bulkCreate(req.body);
    res.status(201).json(buzzwords);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const buzzwords = await TrendingBuzzword.findAll();
    res.json(buzzwords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const buzzword = await TrendingBuzzword.findByPk(req.params.id);
    if (!buzzword) return res.status(404).json({ error: 'Not found' });
    res.json(buzzword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await TrendingBuzzword.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const buzzword = await TrendingBuzzword.findByPk(req.params.id);
    res.json(buzzword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TrendingBuzzword.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 