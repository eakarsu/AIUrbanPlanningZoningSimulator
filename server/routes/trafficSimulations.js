const express = require('express');
const { TrafficSimulation } = require('../models');
const { analyzeWithAI } = require('../utils/aiAnalyzer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await TrafficSimulation.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching traffic simulations:', err);
    res.status(500).json({ error: 'Failed to fetch traffic simulations.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await TrafficSimulation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Traffic simulation not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching traffic simulation:', err);
    res.status(500).json({ error: 'Failed to fetch traffic simulation.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await TrafficSimulation.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating traffic simulation:', err);
    res.status(500).json({ error: 'Failed to create traffic simulation.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await TrafficSimulation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Traffic simulation not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating traffic simulation:', err);
    res.status(500).json({ error: 'Failed to update traffic simulation.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await TrafficSimulation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Traffic simulation not found.' });
    await item.destroy();
    res.json({ message: 'Traffic simulation deleted successfully.' });
  } catch (err) {
    console.error('Error deleting traffic simulation:', err);
    res.status(500).json({ error: 'Failed to delete traffic simulation.' });
  }
});

router.post('/:id/analyze', async (req, res) => {
  try {
    const item = await TrafficSimulation.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Traffic simulation not found.' });

    const analysis = await analyzeWithAI('traffic', item.toJSON());
    await item.update({ aiAnalysis: analysis, status: 'analyzed' });
    res.json(item);
  } catch (err) {
    console.error('Error analyzing traffic simulation:', err);
    res.status(500).json({ error: 'Failed to analyze traffic simulation.', details: err.message });
  }
});

module.exports = router;
