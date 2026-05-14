const express = require('express');
const rateLimit = require('express-rate-limit');
const { LandUse } = require('../models');
const { analyzeWithAI } = require('../utils/aiAnalyzer');
const sequelize = require('../db');

const router = express.Router();

const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 20,
  keyGenerator: (req) => req.user ? 'user:' + (req.user.id || req.user.userId) : req.ip,
  message: { error: 'AI rate limit exceeded. Max 20 requests/hour.' }
});

// Init ai_results table
sequelize.query(`
  CREATE TABLE IF NOT EXISTS ai_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    endpoint VARCHAR(100),
    input_data JSONB,
    result JSONB,
    created_at TIMESTAMP DEFAULT NOW()
  )
`).catch(() => {});

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const total = await LandUse.count();
    const items = await LandUse.findAll({ order: [['createdAt', 'DESC']], limit, offset });
    res.json({ data: items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Error fetching land use records:', err);
    res.status(500).json({ error: 'Failed to fetch land use records.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await LandUse.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Land use record not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching land use record:', err);
    res.status(500).json({ error: 'Failed to fetch land use record.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await LandUse.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating land use record:', err);
    res.status(500).json({ error: 'Failed to create land use record.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await LandUse.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Land use record not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating land use record:', err);
    res.status(500).json({ error: 'Failed to update land use record.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await LandUse.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Land use record not found.' });
    await item.destroy();
    res.json({ message: 'Land use record deleted successfully.' });
  } catch (err) {
    console.error('Error deleting land use record:', err);
    res.status(500).json({ error: 'Failed to delete land use record.' });
  }
});

// AI analyze endpoint for LandUse
router.post('/:id/analyze', aiRateLimiter, async (req, res) => {
  try {
    const item = await LandUse.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Land use record not found.' });

    const analysis = await analyzeWithAI('landuse', item.toJSON());

    // Save to ai_results
    await sequelize.query(
      `INSERT INTO ai_results (user_id, endpoint, input_data, result) VALUES (:userId, :endpoint, :input, :result)`,
      {
        replacements: {
          userId: req.user ? req.user.id : null,
          endpoint: 'land-use/analyze',
          input: JSON.stringify(item.toJSON()),
          result: analysis
        }
      }
    ).catch(() => {});

    await item.update({ status: 'analyzed' });
    res.json({ ...item.toJSON(), aiAnalysis: analysis });
  } catch (err) {
    console.error('Error analyzing land use:', err);
    res.status(500).json({ error: 'Failed to analyze land use.', details: err.message });
  }
});

module.exports = router;
