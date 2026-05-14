const express = require('express');
const rateLimit = require('express-rate-limit');
const { BuildingPermit } = require('../models');
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
    const total = await BuildingPermit.count();
    const items = await BuildingPermit.findAll({ order: [['createdAt', 'DESC']], limit, offset });
    res.json({ data: items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Error fetching building permits:', err);
    res.status(500).json({ error: 'Failed to fetch building permits.' });
  }
});

// Public endpoint (unauthenticated) for citizen portal
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = search ? {
      [require('sequelize').Op.or]: [
        { projectAddress: { [require('sequelize').Op.like]: `%${search}%` } },
        { permitNumber: { [require('sequelize').Op.like]: `%${search}%` } },
        { permitType: { [require('sequelize').Op.like]: `%${search}%` } }
      ]
    } : {};

    const total = await BuildingPermit.count({ where });
    const items = await BuildingPermit.findAll({
      where,
      attributes: ['id', 'permitNumber', 'projectAddress', 'permitType', 'description', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    res.json({ data: items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Error fetching public permits:', err);
    res.status(500).json({ error: 'Failed to fetch permits.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await BuildingPermit.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Building permit not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching building permit:', err);
    res.status(500).json({ error: 'Failed to fetch building permit.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await BuildingPermit.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating building permit:', err);
    res.status(500).json({ error: 'Failed to create building permit.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await BuildingPermit.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Building permit not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating building permit:', err);
    res.status(500).json({ error: 'Failed to update building permit.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await BuildingPermit.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Building permit not found.' });
    await item.destroy();
    res.json({ message: 'Building permit deleted successfully.' });
  } catch (err) {
    console.error('Error deleting building permit:', err);
    res.status(500).json({ error: 'Failed to delete building permit.' });
  }
});

router.post('/:id/analyze', aiRateLimiter, async (req, res) => {
  try {
    const item = await BuildingPermit.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Building permit not found.' });

    const analysis = await analyzeWithAI('buildingpermit', item.toJSON());

    await sequelize.query(
      `INSERT INTO ai_results (user_id, endpoint, input_data, result) VALUES (:userId, :endpoint, :input, :result)`,
      { replacements: { userId: req.user ? req.user.id : null, endpoint: 'building-permits/analyze', input: JSON.stringify(item.toJSON()), result: analysis } }
    ).catch(() => {});

    await item.update({ status: 'under-review' });
    res.json({ ...item.toJSON(), aiAnalysis: analysis });
  } catch (err) {
    console.error('Error analyzing building permit:', err);
    res.status(500).json({ error: 'Failed to analyze building permit.', details: err.message });
  }
});

module.exports = router;
