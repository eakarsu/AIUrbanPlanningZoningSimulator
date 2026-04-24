const express = require('express');
const { PopulationDensity } = require('../models');
const { analyzeWithAI } = require('../utils/aiAnalyzer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await PopulationDensity.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching population density records:', err);
    res.status(500).json({ error: 'Failed to fetch population density records.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await PopulationDensity.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Population density record not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching population density record:', err);
    res.status(500).json({ error: 'Failed to fetch population density record.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await PopulationDensity.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating population density record:', err);
    res.status(500).json({ error: 'Failed to create population density record.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await PopulationDensity.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Population density record not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating population density record:', err);
    res.status(500).json({ error: 'Failed to update population density record.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await PopulationDensity.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Population density record not found.' });
    await item.destroy();
    res.json({ message: 'Population density record deleted successfully.' });
  } catch (err) {
    console.error('Error deleting population density record:', err);
    res.status(500).json({ error: 'Failed to delete population density record.' });
  }
});

router.post('/:id/analyze', async (req, res) => {
  try {
    const item = await PopulationDensity.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Population density record not found.' });

    const analysis = await analyzeWithAI('population', item.toJSON());
    await item.update({ aiAnalysis: analysis, status: 'analyzed' });
    res.json(item);
  } catch (err) {
    console.error('Error analyzing population density:', err);
    res.status(500).json({ error: 'Failed to analyze population density.', details: err.message });
  }
});

module.exports = router;
