import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrafficSimulations from './pages/TrafficSimulations';
import PopulationDensity from './pages/PopulationDensity';
import InfrastructureImpact from './pages/InfrastructureImpact';
import ZoningCompliance from './pages/ZoningCompliance';
import EnvironmentalAssessments from './pages/EnvironmentalAssessments';
import NoiseAnalysis from './pages/NoiseAnalysis';
import GreenSpace from './pages/GreenSpace';
import LandUse from './pages/LandUse';
import BuildingPermits from './pages/BuildingPermits';
import DistrictZones from './pages/DistrictZones';
import TransportationRoutes from './pages/TransportationRoutes';
import PublicFacilities from './pages/PublicFacilities';
import GISMap from './pages/GISMap';
import Simulator from './pages/Simulator';
import ComplianceEngine from './pages/ComplianceEngine';
import CitizenPortal from './pages/CitizenPortal';
import ScenarioWorkbench from './pages/ScenarioWorkbench';
import AIAdvisor from './pages/AIAdvisor';
// === Batch 08 Gaps & Frontend Mounts ===
import CfZoningScenarioOptimizerMaximizingAffordableHousingCommercial from './pages/CfZoningScenarioOptimizerMaximizingAffordableHousingCommercial'
import CfInfrastructureImpactPredictorForSchoolsUtilitiesTransit from './pages/CfInfrastructureImpactPredictorForSchoolsUtilitiesTransit'
import CfEnvironmentalComplianceCheckerForNepaWetlandsEndangered from './pages/CfEnvironmentalComplianceCheckerForNepaWetlandsEndangered'
import CfCommunityBenefitAnalyzerQuantifyingJobsTaxHousing from './pages/CfCommunityBenefitAnalyzerQuantifyingJobsTaxHousing'
import CfHistoricPreservationAdvisorFlaggingDistrictsAndCompatible from './pages/CfHistoricPreservationAdvisorFlaggingDistrictsAndCompatible'
import CfPublicCommentModerationPipelineWithSentimentAnalysis from './pages/CfPublicCommentModerationPipelineWithSentimentAnalysis'
import GapCriticalOnly1AiEndpointDespiteScenario from './pages/GapCriticalOnly1AiEndpointDespiteScenario'
import GapNoConversationalPlanningCopilotForCitizensOr from './pages/GapNoConversationalPlanningCopilotForCitizensOr'
import GapNoPredictivePermitApprovalMl from './pages/GapNoPredictivePermitApprovalMl'
import GapNoRealTimeGisIntegrationArcgisQgis from './pages/GapNoRealTimeGisIntegrationArcgisQgis'
import GapNoPublicCommentStakeholderFeedbackSystem from './pages/GapNoPublicCommentStakeholderFeedbackSystem'
import GapNoMultiYearZoningAmendmentTracking from './pages/GapNoMultiYearZoningAmendmentTracking'
import GapNoDensityFarCalculationUtility from './pages/GapNoDensityFarCalculationUtility'
import GapNoWebhooksNotifications from './pages/GapNoWebhooksNotifications'
import GapNoAuditLogging from './pages/GapNoAuditLogging'
import GapNoPublicPortalCitizenSelfService from './pages/GapNoPublicPortalCitizenSelfService'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/traffic-simulations" element={<ProtectedRoute><TrafficSimulations /></ProtectedRoute>} />
        <Route path="/population-density" element={<ProtectedRoute><PopulationDensity /></ProtectedRoute>} />
        <Route path="/infrastructure-impact" element={<ProtectedRoute><InfrastructureImpact /></ProtectedRoute>} />
        <Route path="/zoning-compliance" element={<ProtectedRoute><ZoningCompliance /></ProtectedRoute>} />
        <Route path="/environmental-assessments" element={<ProtectedRoute><EnvironmentalAssessments /></ProtectedRoute>} />
        <Route path="/noise-analysis" element={<ProtectedRoute><NoiseAnalysis /></ProtectedRoute>} />
        <Route path="/green-space" element={<ProtectedRoute><GreenSpace /></ProtectedRoute>} />
        <Route path="/land-use" element={<ProtectedRoute><LandUse /></ProtectedRoute>} />
        <Route path="/building-permits" element={<ProtectedRoute><BuildingPermits /></ProtectedRoute>} />
        <Route path="/district-zones" element={<ProtectedRoute><DistrictZones /></ProtectedRoute>} />
        <Route path="/transportation-routes" element={<ProtectedRoute><TransportationRoutes /></ProtectedRoute>} />
        <Route path="/public-facilities" element={<ProtectedRoute><PublicFacilities /></ProtectedRoute>} />
        <Route path="/gis-map" element={<ProtectedRoute><GISMap /></ProtectedRoute>} />
        <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
        <Route path="/compliance-engine" element={<ProtectedRoute><ComplianceEngine /></ProtectedRoute>} />
        <Route path="/citizen-portal" element={<ProtectedRoute><CitizenPortal /></ProtectedRoute>} />
        <Route path="/scenario-workbench" element={<ProtectedRoute><ScenarioWorkbench /></ProtectedRoute>} />
        <Route path="/ai-advisor" element={<ProtectedRoute><AIAdvisor /></ProtectedRoute>} />
      {/* // === Batch 08 Gaps & Frontend Mounts === */}
      <Route path="/cf-zoning-scenario-optimizer-maximizing-affordable-housing-commercial-green-space" element={<ProtectedRoute><CfZoningScenarioOptimizerMaximizingAffordableHousingCommercial /></ProtectedRoute>} />
      <Route path="/cf-infrastructure-impact-predictor-for-schools-utilities-transit" element={<ProtectedRoute><CfInfrastructureImpactPredictorForSchoolsUtilitiesTransit /></ProtectedRoute>} />
      <Route path="/cf-environmental-compliance-checker-for-nepa-wetlands-endangered-species" element={<ProtectedRoute><CfEnvironmentalComplianceCheckerForNepaWetlandsEndangered /></ProtectedRoute>} />
      <Route path="/cf-community-benefit-analyzer-quantifying-jobs-tax-housing-impact" element={<ProtectedRoute><CfCommunityBenefitAnalyzerQuantifyingJobsTaxHousing /></ProtectedRoute>} />
      <Route path="/cf-historic-preservation-advisor-flagging-districts-and-compatible-development" element={<ProtectedRoute><CfHistoricPreservationAdvisorFlaggingDistrictsAndCompatible /></ProtectedRoute>} />
      <Route path="/cf-public-comment-moderation-pipeline-with-sentiment-analysis" element={<ProtectedRoute><CfPublicCommentModerationPipelineWithSentimentAnalysis /></ProtectedRoute>} />
      <Route path="/gap-critical-only-1-ai-endpoint-despite-scenario-compliance" element={<ProtectedRoute><GapCriticalOnly1AiEndpointDespiteScenario /></ProtectedRoute>} />
      <Route path="/gap-no-conversational-planning-copilot-for-citizens-or-officials" element={<ProtectedRoute><GapNoConversationalPlanningCopilotForCitizensOr /></ProtectedRoute>} />
      <Route path="/gap-no-predictive-permit-approval-ml" element={<ProtectedRoute><GapNoPredictivePermitApprovalMl /></ProtectedRoute>} />
      <Route path="/gap-no-real-time-gis-integration-arcgis-qgis" element={<ProtectedRoute><GapNoRealTimeGisIntegrationArcgisQgis /></ProtectedRoute>} />
      <Route path="/gap-no-public-comment-stakeholder-feedback-system" element={<ProtectedRoute><GapNoPublicCommentStakeholderFeedbackSystem /></ProtectedRoute>} />
      <Route path="/gap-no-multi-year-zoning-amendment-tracking" element={<ProtectedRoute><GapNoMultiYearZoningAmendmentTracking /></ProtectedRoute>} />
      <Route path="/gap-no-density-far-calculation-utility" element={<ProtectedRoute><GapNoDensityFarCalculationUtility /></ProtectedRoute>} />
      <Route path="/gap-no-webhooks-notifications" element={<ProtectedRoute><GapNoWebhooksNotifications /></ProtectedRoute>} />
      <Route path="/gap-no-audit-logging" element={<ProtectedRoute><GapNoAuditLogging /></ProtectedRoute>} />
      <Route path="/gap-no-public-portal-citizen-self-service" element={<ProtectedRoute><GapNoPublicPortalCitizenSelfService /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
