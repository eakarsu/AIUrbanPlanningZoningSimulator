const express = require('express');
const { TransportationRoute } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await TransportationRoute.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching transportation routes:', err);
    res.status(500).json({ error: 'Failed to fetch transportation routes.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await TransportationRoute.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Transportation route not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching transportation route:', err);
    res.status(500).json({ error: 'Failed to fetch transportation route.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await TransportationRoute.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating transportation route:', err);
    res.status(500).json({ error: 'Failed to create transportation route.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await TransportationRoute.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Transportation route not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating transportation route:', err);
    res.status(500).json({ error: 'Failed to update transportation route.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await TransportationRoute.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Transportation route not found.' });
    await item.destroy();
    res.json({ message: 'Transportation route deleted successfully.' });
  } catch (err) {
    console.error('Error deleting transportation route:', err);
    res.status(500).json({ error: 'Failed to delete transportation route.' });
  }
});

module.exports = router;
