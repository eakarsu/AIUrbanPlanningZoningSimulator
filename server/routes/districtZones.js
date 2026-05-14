const express = require('express');
const rateLimit = require('express-rate-limit');
const { DistrictZone } = require('../models');
const { analyzeWithAI } = require('../utils/aiAnalyzer');
const sequelize = require('../db');

const router = express.Router();

const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 20,
  keyGenerator: (req) => req.user ? 'user:' + (req.user.id || req.user.userId) : req.ip,
  message: { error: 'AI rate limit exceeded.' }
});

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const total = await DistrictZone.count();
    const items = await DistrictZone.findAll({ order: [['createdAt', 'DESC']], limit, offset });
    res.json({ data: items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Error fetching district zones:', err);
    res.status(500).json({ error: 'Failed to fetch district zones.' });
  }
});

// Map data endpoint for Leaflet — returns zones with geo fields
router.get('/map-data', async (req, res) => {
  try {
    const items = await DistrictZone.findAll({
      attributes: ['id', 'name', 'code', 'category', 'status', 'allowedUses', 'maxHeight', 'maxDensity'],
      where: { status: 'active' },
      order: [['name', 'ASC']]
    });

    // Return with placeholder lat/lng bounds (real implementation would use GIS fields)
    const mapData = items.map((zone, idx) => ({
      id: zone.id,
      name: zone.name,
      code: zone.code,
      category: zone.category,
      status: zone.status,
      allowedUses: zone.allowedUses,
      maxHeight: zone.maxHeight,
      maxDensity: zone.maxDensity,
      // Placeholder coordinates (would be real GIS data in production)
      bounds: null,
      color: getCategoryColor(zone.category)
    }));

    res.json({ data: mapData });
  } catch (err) {
    console.error('Error fetching map data:', err);
    res.status(500).json({ error: 'Failed to fetch map data.' });
  }
});

function getCategoryColor(category) {
  const colors = {
    'residential': '#4ade80',
    'commercial': '#60a5fa',
    'industrial': '#f87171',
    'mixed-use': '#a78bfa',
    'open-space': '#34d399',
    'institutional': '#fbbf24'
  };
  return colors[(category || '').toLowerCase()] || '#94a3b8';
}

router.get('/:id', async (req, res) => {
  try {
    const item = await DistrictZone.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'District zone not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching district zone:', err);
    res.status(500).json({ error: 'Failed to fetch district zone.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await DistrictZone.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating district zone:', err);
    res.status(500).json({ error: 'Failed to create district zone.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await DistrictZone.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'District zone not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating district zone:', err);
    res.status(500).json({ error: 'Failed to update district zone.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await DistrictZone.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'District zone not found.' });
    await item.destroy();
    res.json({ message: 'District zone deleted successfully.' });
  } catch (err) {
    console.error('Error deleting district zone:', err);
    res.status(500).json({ error: 'Failed to delete district zone.' });
  }
});

router.post('/:id/analyze', aiRateLimiter, async (req, res) => {
  try {
    const item = await DistrictZone.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'District zone not found.' });

    const analysis = await analyzeWithAI('districtzone', item.toJSON());

    await sequelize.query(
      `INSERT INTO ai_results (user_id, endpoint, input_data, result) VALUES (:userId, :endpoint, :input, :result)`,
      { replacements: { userId: req.user ? req.user.id : null, endpoint: 'district-zones/analyze', input: JSON.stringify(item.toJSON()), result: analysis } }
    ).catch(() => {});

    res.json({ ...item.toJSON(), aiAnalysis: analysis });
  } catch (err) {
    console.error('Error analyzing district zone:', err);
    res.status(500).json({ error: 'Failed to analyze district zone.', details: err.message });
  }
});

module.exports = router;
