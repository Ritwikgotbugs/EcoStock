const express = require('express');
const router = express.Router();
const { EcoScore } = require('../models/associations');

// Bulk insert
router.post('/bulk', async (req, res) => {
  try {
    const scores = await EcoScore.bulkCreate(req.body);
    res.status(201).json(scores);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create
router.post('/', async (req, res) => {
  try {
    const score = await EcoScore.create(req.body);
    res.status(201).json(score);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const scores = await EcoScore.findAll();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const score = await EcoScore.findByPk(req.params.id);
    if (!score) return res.status(404).json({ error: 'Not found' });
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await EcoScore.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const score = await EcoScore.findByPk(req.params.id);
    res.json(score);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await EcoScore.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 