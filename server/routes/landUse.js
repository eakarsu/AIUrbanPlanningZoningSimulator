const express = require('express');
const { LandUse } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await LandUse.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
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

module.exports = router;
