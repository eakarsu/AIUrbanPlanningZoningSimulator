const express = require('express');
const { DistrictZone } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await DistrictZone.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching district zones:', err);
    res.status(500).json({ error: 'Failed to fetch district zones.' });
  }
});

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

module.exports = router;
