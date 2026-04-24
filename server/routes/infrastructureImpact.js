const express = require('express');
const { InfrastructureImpact } = require('../models');
const { analyzeWithAI } = require('../utils/aiAnalyzer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await InfrastructureImpact.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching infrastructure impacts:', err);
    res.status(500).json({ error: 'Failed to fetch infrastructure impacts.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await InfrastructureImpact.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Infrastructure impact not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching infrastructure impact:', err);
    res.status(500).json({ error: 'Failed to fetch infrastructure impact.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await InfrastructureImpact.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating infrastructure impact:', err);
    res.status(500).json({ error: 'Failed to create infrastructure impact.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await InfrastructureImpact.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Infrastructure impact not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating infrastructure impact:', err);
    res.status(500).json({ error: 'Failed to update infrastructure impact.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await InfrastructureImpact.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Infrastructure impact not found.' });
    await item.destroy();
    res.json({ message: 'Infrastructure impact deleted successfully.' });
  } catch (err) {
    console.error('Error deleting infrastructure impact:', err);
    res.status(500).json({ error: 'Failed to delete infrastructure impact.' });
  }
});

router.post('/:id/analyze', async (req, res) => {
  try {
    const item = await InfrastructureImpact.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Infrastructure impact not found.' });

    const analysis = await analyzeWithAI('infrastructure', item.toJSON());
    await item.update({ aiAnalysis: analysis, status: 'analyzed' });
    res.json(item);
  } catch (err) {
    console.error('Error analyzing infrastructure impact:', err);
    res.status(500).json({ error: 'Failed to analyze infrastructure impact.', details: err.message });
  }
});

module.exports = router;
