const express = require('express');
const { analyzeWithAI } = require('../utils/aiAnalyzer');

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { feature, data } = req.body;

    if (!feature || !data) {
      return res.status(400).json({ error: 'Feature type and data are required.' });
    }

    const validFeatures = ['traffic', 'population', 'infrastructure', 'zoning', 'environmental', 'noise', 'greenspace'];
    if (!validFeatures.includes(feature)) {
      return res.status(400).json({ error: `Invalid feature type. Must be one of: ${validFeatures.join(', ')}` });
    }

    const analysis = await analyzeWithAI(feature, data);
    res.json({ analysis });
  } catch (err) {
    console.error('AI analysis error:', err);
    res.status(500).json({ error: 'Failed to perform AI analysis.', details: err.message });
  }
});

module.exports = router;
