const express = require('express');
const { BuildingPermit } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await BuildingPermit.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching building permits:', err);
    res.status(500).json({ error: 'Failed to fetch building permits.' });
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

module.exports = router;
