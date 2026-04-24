const express = require('express');
const { GreenSpace } = require('../models');
const { analyzeWithAI } = require('../utils/aiAnalyzer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await GreenSpace.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching green spaces:', err);
    res.status(500).json({ error: 'Failed to fetch green spaces.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await GreenSpace.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Green space not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching green space:', err);
    res.status(500).json({ error: 'Failed to fetch green space.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await GreenSpace.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating green space:', err);
    res.status(500).json({ error: 'Failed to create green space.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await GreenSpace.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Green space not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating green space:', err);
    res.status(500).json({ error: 'Failed to update green space.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await GreenSpace.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Green space not found.' });
    await item.destroy();
    res.json({ message: 'Green space deleted successfully.' });
  } catch (err) {
    console.error('Error deleting green space:', err);
    res.status(500).json({ error: 'Failed to delete green space.' });
  }
});

router.post('/:id/analyze', async (req, res) => {
  try {
    const item = await GreenSpace.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Green space not found.' });

    const analysis = await analyzeWithAI('greenspace', item.toJSON());
    await item.update({ aiAnalysis: analysis, status: 'analyzed' });
    res.json(item);
  } catch (err) {
    console.error('Error analyzing green space:', err);
    res.status(500).json({ error: 'Failed to analyze green space.', details: err.message });
  }
});

module.exports = router;
