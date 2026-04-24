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
      </Routes>
    </div>
  );
}

export default App;
