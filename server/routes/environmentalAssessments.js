const express = require('express');
const { EnvironmentalAssessment } = require('../models');
const { analyzeWithAI } = require('../utils/aiAnalyzer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await EnvironmentalAssessment.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching environmental assessments:', err);
    res.status(500).json({ error: 'Failed to fetch environmental assessments.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await EnvironmentalAssessment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Environmental assessment not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching environmental assessment:', err);
    res.status(500).json({ error: 'Failed to fetch environmental assessment.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await EnvironmentalAssessment.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating environmental assessment:', err);
    res.status(500).json({ error: 'Failed to create environmental assessment.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await EnvironmentalAssessment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Environmental assessment not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating environmental assessment:', err);
    res.status(500).json({ error: 'Failed to update environmental assessment.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await EnvironmentalAssessment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Environmental assessment not found.' });
    await item.destroy();
    res.json({ message: 'Environmental assessment deleted successfully.' });
  } catch (err) {
    console.error('Error deleting environmental assessment:', err);
    res.status(500).json({ error: 'Failed to delete environmental assessment.' });
  }
});

router.post('/:id/analyze', async (req, res) => {
  try {
    const item = await EnvironmentalAssessment.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Environmental assessment not found.' });

    const analysis = await analyzeWithAI('environmental', item.toJSON());
    await item.update({ aiAnalysis: analysis, riskLevel: 'assessed' });
    res.json(item);
  } catch (err) {
    console.error('Error analyzing environmental assessment:', err);
    res.status(500).json({ error: 'Failed to analyze environmental assessment.', details: err.message });
  }
});

module.exports = router;
