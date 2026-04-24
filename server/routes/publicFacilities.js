const express = require('express');
const { PublicFacility } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await PublicFacility.findAll({ order: [['createdAt', 'DESC']] });
    res.json(items);
  } catch (err) {
    console.error('Error fetching public facilities:', err);
    res.status(500).json({ error: 'Failed to fetch public facilities.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await PublicFacility.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Public facility not found.' });
    res.json(item);
  } catch (err) {
    console.error('Error fetching public facility:', err);
    res.status(500).json({ error: 'Failed to fetch public facility.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await PublicFacility.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error('Error creating public facility:', err);
    res.status(500).json({ error: 'Failed to create public facility.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await PublicFacility.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Public facility not found.' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error('Error updating public facility:', err);
    res.status(500).json({ error: 'Failed to update public facility.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await PublicFacility.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Public facility not found.' });
    await item.destroy();
    res.json({ message: 'Public facility deleted successfully.' });
  } catch (err) {
    console.error('Error deleting public facility:', err);
    res.status(500).json({ error: 'Failed to delete public facility.' });
  }
});

module.exports = router;
