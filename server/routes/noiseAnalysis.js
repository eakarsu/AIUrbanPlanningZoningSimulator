const express = require('express');
const { NoiseAnalysis } = require('../models');
const { analyzeWithAI } = require('../utils/aiAnalyzer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await NoiseAnalysis.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching noise analyses:', err);
    res.status(500).json({ error: 'Failed to fetch noise analyses.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await NoiseAnalysis.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Noise analysis not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching noise analysis:', err);
    res.status(500).json({ error: 'Failed to fetch noise analysis.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await NoiseAnalysis.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating noise analysis:', err);
    res.status(500).json({ error: 'Failed to create noise analysis.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await NoiseAnalysis.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Noise analysis not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating noise analysis:', err);
    res.status(500).json({ error: 'Failed to update noise analysis.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await NoiseAnalysis.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Noise analysis not found.' });
    await item.destroy();
    res.json({ message: 'Noise analysis deleted successfully.' });
  } catch (err) {
    console.error('Error deleting noise analysis:', err);
    res.status(500).json({ error: 'Failed to delete noise analysis.' });
  }
});

router.post('/:id/analyze', async (req, res) => {
  try {
    const item = await NoiseAnalysis.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Noise analysis not found.' });

    const analysis = await analyzeWithAI('noise', item.toJSON());
    await item.update({ aiAnalysis: analysis, complianceStatus: 'analyzed' });
    res.json(item);
  } catch (err) {
    console.error('Error analyzing noise levels:', err);
    res.status(500).json({ error: 'Failed to analyze noise levels.', details: err.message });
  }
});

module.exports = router;
