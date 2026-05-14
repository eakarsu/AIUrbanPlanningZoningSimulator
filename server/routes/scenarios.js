// Apply pass 5: minimal placeholder — server/index.js already requires
// './routes/scenarios' (added by an earlier pass) but the file was never
// created, breaking server boot. This stub restores boot. Replace with a
// real scenarios CRUD when the model is added.
const express = require('express');
const router = express.Router();

// In-memory store so the route is functional, not just a stub.
const _scenarios = [];
let _nextId = 1;

router.get('/', (req, res) => {
  res.json({ data: _scenarios });
});

router.get('/:id', (req, res) => {
  const s = _scenarios.find(x => String(x.id) === String(req.params.id));
  if (!s) return res.status(404).json({ error: 'Not found' });
  res.json(s);
});

router.post('/', (req, res) => {
  const body = req.body || {};
  const s = {
    id: _nextId++,
    name: body.name || `Scenario ${_nextId - 1}`,
    description: body.description || '',
    parameters: body.parameters || {},
    createdAt: new Date().toISOString(),
  };
  _scenarios.push(s);
  res.status(201).json(s);
});

router.put('/:id', (req, res) => {
  const s = _scenarios.find(x => String(x.id) === String(req.params.id));
  if (!s) return res.status(404).json({ error: 'Not found' });
  Object.assign(s, req.body || {}, { id: s.id, updatedAt: new Date().toISOString() });
  res.json(s);
});

router.delete('/:id', (req, res) => {
  const idx = _scenarios.findIndex(x => String(x.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const [removed] = _scenarios.splice(idx, 1);
  res.json({ deleted: removed });
});

module.exports = router;
