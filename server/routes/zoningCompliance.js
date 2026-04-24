const express = require('express');
const { ZoningCompliance } = require('../models');
const { analyzeWithAI } = require('../utils/aiAnalyzer');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await ZoningCompliance.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching zoning compliance records:', err);
    res.status(500).json({ error: 'Failed to fetch zoning compliance records.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await ZoningCompliance.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Zoning compliance record not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching zoning compliance record:', err);
    res.status(500).json({ error: 'Failed to fetch zoning compliance record.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await ZoningCompliance.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating zoning compliance record:', err);
    res.status(500).json({ error: 'Failed to create zoning compliance record.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await ZoningCompliance.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Zoning compliance record not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating zoning compliance record:', err);
    res.status(500).json({ error: 'Failed to update zoning compliance record.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await ZoningCompliance.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Zoning compliance record not found.' });
    await item.destroy();
    res.json({ message: 'Zoning compliance record deleted successfully.' });
  } catch (err) {
    console.error('Error deleting zoning compliance record:', err);
    res.status(500).json({ error: 'Failed to delete zoning compliance record.' });
  }
});

router.post('/:id/analyze', async (req, res) => {
  try {
    const item = await ZoningCompliance.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Zoning compliance record not found.' });

    const analysis = await analyzeWithAI('zoning', item.toJSON());
    await item.update({ aiAnalysis: analysis, complianceStatus: 'reviewed' });
    res.json(item);
  } catch (err) {
    console.error('Error analyzing zoning compliance:', err);
    res.status(500).json({ error: 'Failed to analyze zoning compliance.', details: err.message });
  }
});

module.exports = router;
