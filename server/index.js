require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
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
const scenariosRoutes = require('./routes/scenarios');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true
}));
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
app.use('/api/scenarios', auth, scenariosRoutes);

// Public permit tracker (unauthenticated)
const buildingPermitPublicRoutes = require('./routes/buildingPermits');
app.use('/api/public/building-permits', buildingPermitPublicRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve client build (single-port mode for verification)
const path = require('path');
const fs = require('fs');
const clientBuildDir = path.join(__dirname, '..', 'client', 'build');
if (fs.existsSync(clientBuildDir)) {
  app.use(express.static(clientBuildDir));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildDir, 'index.html'));
  });
}

// Start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced successfully.');
  app.use('/api/zoning-scenario-optimizer', require('./routes/zoningScenarioOptimizer')); app.use('/api/infrastructure-impact-predictor', require('./routes/infrastructureImpactPredictor')); app.use('/api/environmental-compliance-checker', require('./routes/environmentalComplianceChecker')); app.use('/api/community-benefit-analyzer', require('./routes/communityBenefitAnalyzer')); app.use('/api/historic-preservation-advisor', require('./routes/historicPreservationAdvisor')); app.use('/api/public-comment-moderation', require('./routes/publicCommentModeration'));

// === Batch 08 Gaps & Frontend Mounts ===
app.use('/api/gap-critical-only-1-ai-endpoint-despite-scenario-compliance', require('./routes/gapCriticalOnly1AiEndpointDespiteScenarioCompliance'));
app.use('/api/gap-no-conversational-planning-copilot-for-citizens-or-officials', require('./routes/gapNoConversationalPlanningCopilotForCitizensOrOfficials'));
app.use('/api/gap-no-predictive-permit-approval-ml', require('./routes/gapNoPredictivePermitApprovalMl'));
app.use('/api/gap-no-real-time-gis-integration-arcgis-qgis', require('./routes/gapNoRealTimeGisIntegrationArcgisQgis'));
app.use('/api/gap-no-public-comment-stakeholder-feedback-system', require('./routes/gapNoPublicCommentStakeholderFeedbackSystem'));
app.use('/api/gap-no-multi-year-zoning-amendment-tracking', require('./routes/gapNoMultiYearZoningAmendmentTracking'));
app.use('/api/gap-no-density-far-calculation-utility', require('./routes/gapNoDensityFarCalculationUtility'));
app.use('/api/gap-no-webhooks-notifications', require('./routes/gapNoWebhooksNotifications'));
app.use('/api/gap-no-audit-logging', require('./routes/gapNoAuditLogging'));
app.use('/api/gap-no-public-portal-citizen-self-service', require('./routes/gapNoPublicPortalCitizenSelfService'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
  process.exit(1);
});

module.exports = app;
