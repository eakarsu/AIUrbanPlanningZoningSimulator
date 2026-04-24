import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaCar, FaUsers, FaBuilding, FaMapMarkerAlt, FaLeaf, FaVolumeUp,
  FaTree, FaMap, FaFileAlt, FaCity, FaRoad, FaHospital
} from 'react-icons/fa';
import Navbar from '../components/Navbar';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const aiFeatures = [
  { key: 'traffic-simulations', name: 'Traffic Flow Simulation', desc: 'AI-powered traffic pattern analysis and congestion prediction', icon: FaCar, color: '#2563eb', endpoint: '/api/traffic-simulations' },
  { key: 'population-density', name: 'Population Density Modeling', desc: 'Predict population growth and density distribution patterns', icon: FaUsers, color: '#7c3aed', endpoint: '/api/population-density' },
  { key: 'infrastructure-impact', name: 'Infrastructure Impact Analysis', desc: 'Assess infrastructure project impacts on communities', icon: FaBuilding, color: '#0891b2', endpoint: '/api/infrastructure-impact' },
  { key: 'zoning-compliance', name: 'Zoning Compliance', desc: 'Automated zoning regulation compliance checking', icon: FaMapMarkerAlt, color: '#059669', endpoint: '/api/zoning-compliance' },
  { key: 'environmental-assessments', name: 'Environmental Assessment', desc: 'Comprehensive environmental impact evaluation', icon: FaLeaf, color: '#16a34a', endpoint: '/api/environmental-assessments' },
  { key: 'noise-analysis', name: 'Noise Level Analysis', desc: 'Analyze noise pollution levels and affected areas', icon: FaVolumeUp, color: '#d97706', endpoint: '/api/noise-analysis' },
  { key: 'green-space', name: 'Green Space Planning', desc: 'Optimize urban green space distribution and quality', icon: FaTree, color: '#15803d', endpoint: '/api/green-space' },
];

const mgmtFeatures = [
  { key: 'land-use', name: 'Land Use Management', desc: 'Track and manage land parcels and usage records', icon: FaMap, color: '#475569', endpoint: '/api/land-use' },
  { key: 'building-permits', name: 'Building Permits', desc: 'Process and manage building permit applications', icon: FaFileAlt, color: '#64748b', endpoint: '/api/building-permits' },
  { key: 'district-zones', name: 'District Zones', desc: 'Define and manage zoning district configurations', icon: FaCity, color: '#334155', endpoint: '/api/district-zones' },
  { key: 'transportation-routes', name: 'Transportation Routes', desc: 'Manage transportation network and route data', icon: FaRoad, color: '#57534e', endpoint: '/api/transportation-routes' },
  { key: 'public-facilities', name: 'Public Facilities', desc: 'Track public facility inventory and conditions', icon: FaHospital, color: '#6d28d9', endpoint: '/api/public-facilities' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const allFeatures = [...aiFeatures, ...mgmtFeatures];
    allFeatures.forEach(async (f) => {
      try {
        const res = await axios.get(f.endpoint, authHeader());
        const data = res.data;
        const count = Array.isArray(data) ? data.length : (data.data ? data.data.length : 0);
        setCounts(prev => ({ ...prev, [f.key]: count }));
      } catch {
        setCounts(prev => ({ ...prev, [f.key]: 0 }));
      }
    });
  }, []);

  const renderCard = (feature, index, isAI) => (
    <div
      key={feature.key}
      className="dashboard-card"
      style={{ animationDelay: `${index * 0.05}s`, '--card-accent': feature.color }}
      onClick={() => navigate(`/${feature.key}`)}
    >
      <div className="dashboard-card-header">
        <div className="dashboard-card-icon" style={{ background: feature.color }}>
          <feature.icon />
        </div>
        <div className="dashboard-card-count">{counts[feature.key] ?? '-'}</div>
      </div>
      <div className="dashboard-card-name">{feature.name}</div>
      <div className="dashboard-card-desc">{feature.desc}</div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <Navbar currentPage="Dashboard" />
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Welcome to Urban Planning HQ</h1>
          <p>Manage your city's planning, zoning, and infrastructure with AI-powered insights.</p>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-title">
            AI-Powered Features <span className="ai-badge">AI Enhanced</span>
          </div>
          <div className="dashboard-grid">
            {aiFeatures.map((f, i) => renderCard(f, i, true))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="dashboard-section-title">
            Management Features
          </div>
          <div className="dashboard-grid">
            {mgmtFeatures.map((f, i) => renderCard(f, i, false))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
