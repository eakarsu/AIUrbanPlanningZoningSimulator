import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AppSidebar.css';

const STATIC_LINKS = [
  { to: '/insights/timeline', label: 'Timeline View', group: 'Insights' },
  { to: '/codex/custom-viz', label: 'Custom Viz', group: 'Insights' },
  { to: '/codex/operations', label: 'Operations', group: 'Insights' },
  { to: '/dashboard', label: 'Dashboard', group: 'Workspace' },
  { to: '/traffic-simulations', label: 'Traffic Simulations', group: 'Workspace' },
  { to: '/population-density', label: 'Population Density', group: 'Workspace' },
  { to: '/infrastructure-impact', label: 'Infrastructure Impact', group: 'Workspace' },
  { to: '/zoning-compliance', label: 'Zoning Compliance', group: 'Workspace' },
  { to: '/environmental-assessments', label: 'Environmental Assessments', group: 'Workspace' },
  { to: '/noise-analysis', label: 'Noise Analysis', group: 'Workspace' },
  { to: '/green-space', label: 'Green Space', group: 'Workspace' },
  { to: '/land-use', label: 'Land Use', group: 'Workspace' },
  { to: '/building-permits', label: 'Building Permits', group: 'Workspace' },
  { to: '/district-zones', label: 'District Zones', group: 'Workspace' },
  { to: '/transportation-routes', label: 'Transportation Routes', group: 'Workspace' },
  { to: '/public-facilities', label: 'Public Facilities', group: 'Workspace' },
  { to: '/gis-map', label: 'GIS Map', group: 'Workspace' },
  { to: '/simulator', label: 'Simulator', group: 'Workspace' },
  { to: '/compliance-engine', label: 'Compliance Engine', group: 'Workspace' },
  { to: '/citizen-portal', label: 'Citizen Portal', group: 'Workspace' },
  { to: '/scenario-workbench', label: 'Scenario Workbench', group: 'Workspace' },
  { to: '/ai-advisor', label: 'AI Advisor', group: 'AI tools' },
  { to: '/cf-zoning-scenario-optimizer-maximizing-affordable-housing-commercial-green-space', label: 'Cf Zoning Scenario Optimizer Maximizing Affordable Housing Commercial', group: 'Workspace' },
  { to: '/cf-infrastructure-impact-predictor-for-schools-utilities-transit', label: 'Cf Infrastructure Impact Predictor For Schools Utilities Transit', group: 'Workspace' },
  { to: '/cf-environmental-compliance-checker-for-nepa-wetlands-endangered-species', label: 'Cf Environmental Compliance Checker For Nepa Wetlands Endangered', group: 'Workspace' },
  { to: '/cf-community-benefit-analyzer-quantifying-jobs-tax-housing-impact', label: 'Cf Community Benefit Analyzer Quantifying Jobs Tax Housing', group: 'Workspace' },
  { to: '/cf-historic-preservation-advisor-flagging-districts-and-compatible-development', label: 'Cf Historic Preservation Advisor Flagging Districts And Compatible', group: 'Workspace' },
  { to: '/cf-public-comment-moderation-pipeline-with-sentiment-analysis', label: 'Cf Public Comment Moderation Pipeline With Sentiment Analysis', group: 'Workspace' },
  { to: '/gap-critical-only-1-ai-endpoint-despite-scenario-compliance', label: 'Gap Critical Only1 Ai Endpoint Despite Scenario', group: 'Workspace' },
  { to: '/gap-no-conversational-planning-copilot-for-citizens-or-officials', label: 'Gap No Conversational Planning Copilot For Citizens Or', group: 'Workspace' },
  { to: '/gap-no-predictive-permit-approval-ml', label: 'Gap No Predictive Permit Approval Ml', group: 'Workspace' },
  { to: '/gap-no-real-time-gis-integration-arcgis-qgis', label: 'Gap No Real Time Gis Integration Arcgis Qgis', group: 'Workspace' },
  { to: '/gap-no-public-comment-stakeholder-feedback-system', label: 'Gap No Public Comment Stakeholder Feedback System', group: 'Workspace' },
  { to: '/gap-no-multi-year-zoning-amendment-tracking', label: 'Gap No Multi Year Zoning Amendment Tracking', group: 'Workspace' },
  { to: '/gap-no-density-far-calculation-utility', label: 'Gap No Density Far Calculation Utility', group: 'Workspace' },
  { to: '/gap-no-webhooks-notifications', label: 'Gap No Webhooks Notifications', group: 'Workspace' },
  { to: '/gap-no-audit-logging', label: 'Gap No Audit Logging', group: 'Workspace' },
  { to: '/gap-no-public-portal-citizen-self-service', label: 'Gap No Public Portal Citizen Self Service', group: 'Workspace' },
];

export default function AppSidebar({ extraLinks = [] }) {
  const LINKS = [...STATIC_LINKS, ...extraLinks];
  const [query, setQuery] = useState('');
  const visible = LINKS.filter(link => link.label.toLowerCase().includes(query.toLowerCase().trim()));
  return <aside className="codex-side" aria-label="Application navigation">
    <div className="codex-side-brand"><strong>AIUrban Planning Zoning Simulator</strong><span>Workspace</span></div>
    <label className="codex-side-search-label" htmlFor="codex-side-search">Find a section</label>
    <input id="codex-side-search" className="codex-side-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search navigation" />
    <nav className="codex-side-links" aria-label="Sections">
      {['Workspace', 'AI tools', 'Insights'].map(group => {
        const items = visible.filter(link => link.group === group);
        return items.length ? <div className="codex-side-group" key={group}>
          <span className="codex-side-heading">{group}</span>
          {items.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => `codex-side-link${isActive ? ' active' : ''}`}>{link.label}</NavLink>)}
        </div> : null;
      })}
      {visible.length === 0 && <p className="codex-side-empty">No matching sections</p>}
    </nav>
  </aside>;
}
