require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const auth = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const trafficSimulationRoutes = require('./routes/trafficSimulations');
const populationDensityRoutes = require('./routes/populationDensity');
const infrastructureImpactRoutes = require('./routes/infrastructureImpact');
const zoningComplianceRoutes = require('./routes/zoningCompliance');
const environmentalAssessmentRoutes = require('./routes/environmentalAssessments');
const noiseAnalysisRoutes = require('./routes/noiseAnalysis');
const greenSpaceRoutes = require('./routes/greenSpace');
const landUseRoutes = require('./routes/landUse');
const buildingPermitRoutes = require('./routes/buildingPermits');
const districtZoneRoutes = require('./routes/districtZones');
const transportationRouteRoutes = require('./routes/transportationRoutes');
const publicFacilityRoutes = require('./routes/publicFacilities');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes (no auth required)
app.use('/api/auth', authRoutes);

// Protected routes (auth required)
app.use('/api/ai', auth, aiRoutes);
app.use('/api/traffic-simulations', auth, trafficSimulationRoutes);
app.use('/api/population-density', auth, populationDensityRoutes);
app.use('/api/infrastructure-impact', auth, infrastructureImpactRoutes);
app.use('/api/zoning-compliance', auth, zoningComplianceRoutes);
app.use('/api/environmental-assessments', auth, environmentalAssessmentRoutes);
app.use('/api/noise-analysis', auth, noiseAnalysisRoutes);
app.use('/api/green-space', auth, greenSpaceRoutes);
app.use('/api/land-use', auth, landUseRoutes);
app.use('/api/building-permits', auth, buildingPermitRoutes);
app.use('/api/district-zones', auth, districtZoneRoutes);
app.use('/api/transportation-routes', auth, transportationRouteRoutes);
app.use('/api/public-facilities', auth, publicFacilityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
sequelize.sync().then(() => {
  console.log('Database synced successfully.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
  process.exit(1);
});

module.exports = app;
