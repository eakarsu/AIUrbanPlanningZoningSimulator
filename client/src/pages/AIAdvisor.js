import React, { useState } from 'react';
import { FaExchangeAlt, FaChartLine, FaBalanceScale, FaShieldAlt, FaLandmark, FaCogs, FaUsers, FaCalculator } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../utils/api';
import Navbar from '../components/Navbar';

// Surfaces the AI endpoints added in apply pass 2:
//   POST /api/ai/scenario-compare
//   POST /api/ai/impact-assessment
// Auth header is attached automatically by utils/api.js via localStorage token.

const TOOLS = [
  {
    key: 'scenario-compare',
    title: 'Scenario Comparison',
    icon: FaExchangeAlt,
    color: '#2563eb',
    description: 'Score and rank zoning/development scenarios across multiple criteria.',
  },
  {
    key: 'impact-assessment',
    title: 'Impact Assessment',
    icon: FaChartLine,
    color: '#7c3aed',
    description: 'Comprehensive infrastructure / environmental / community impact analysis.',
  },
  {
    key: 'compliance-analysis',
    title: 'Compliance Analysis',
    icon: FaShieldAlt,
    color: '#0d9488',
    description: 'Check NEPA, CEQA, wetlands, and other regulatory frameworks.',
  },
  {
    key: 'historic-preservation-advisor',
    title: 'Historic Preservation',
    icon: FaLandmark,
    color: '#b45309',
    description: 'Section 106, SHPO procedures, and rehabilitation guidance.',
  },
  {
    key: 'scenario-optimizer',
    title: 'Scenario Optimizer',
    icon: FaCogs,
    color: '#059669',
    description: 'Propose an optimized scenario given constraints and prioritized objectives.',
  },
  {
    key: 'community-benefit-analyzer',
    title: 'Community Benefit',
    icon: FaUsers,
    color: '#9333ea',
    description: 'Equity, displacement risk, and community-benefit terms.',
  },
  {
    key: 'density-far-calc',
    title: 'Density / FAR Calc',
    icon: FaCalculator,
    color: '#0ea5e9',
    description: 'Deterministic by-right density / FAR / parking calculator (no AI key required).',
  },
];

const DEFAULT_SCENARIOS = JSON.stringify(
  [
    {
      name: 'Mixed-Use Upzone',
      changes: ['Rezone block from R1 to R3', 'Add bus route', 'Reduce parking minimum'],
      params: { max_height: 55, allowed_uses: 'Multi-Family, Mixed-Use', bus_routes: 1, parking_min: 0.5 },
    },
    {
      name: 'Status Quo + Park',
      changes: ['Convert lot to park'],
      params: { max_height: 35, allowed_uses: 'Residential', bus_routes: 0, parking_min: 1.5, park_acres: 5 },
    },
  ],
  null,
  2
);

const DEFAULT_CRITERIA = JSON.stringify(
  ['affordable_housing', 'commercial_activity', 'green_space', 'traffic_impact', 'environmental_impact'],
  null,
  2
);

const DEFAULT_PROJECT = JSON.stringify(
  {
    name: '24-unit residential development',
    type: 'multifamily',
    units: 24,
    floor_area_sqft: 32000,
    max_height_ft: 45,
  },
  null,
  2
);

const DEFAULT_PARAMS = JSON.stringify(
  { existing_density: 'medium', transit_access: 'moderate', floodplain: false },
  null,
  2
);

const DEFAULT_FRAMEWORKS = JSON.stringify(
  ['NEPA', 'CEQA', 'Clean Water Act', 'Clean Air Act', 'wetlands', 'endangered species', 'local zoning code'],
  null,
  2
);

const DEFAULT_SITE = JSON.stringify(
  { address: '123 Main St', year_built: 1912, district: 'Old Town', condition: 'fair' },
  null,
  2
);

const DEFAULT_HISTORIC_RESOURCES = JSON.stringify(
  [{ name: 'Old Town Hall', designation: 'NRHP listed', distance_ft: 0 }],
  null,
  2
);

function tryParse(jsonText, fallback) {
  try {
    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (_e) {
    return fallback;
  }
}

export default function AIAdvisor() {
  const [active, setActive] = useState('scenario-compare');
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');

  // scenario-compare inputs
  const [scenariosText, setScenariosText] = useState(DEFAULT_SCENARIOS);
  const [criteriaText, setCriteriaText] = useState(DEFAULT_CRITERIA);

  // impact-assessment inputs
  const [projectText, setProjectText] = useState(DEFAULT_PROJECT);
  const [location, setLocation] = useState('Downtown West, Block 14');
  const [paramsText, setParamsText] = useState(DEFAULT_PARAMS);

  // compliance-analysis inputs
  const [complianceProjectText, setComplianceProjectText] = useState(DEFAULT_PROJECT);
  const [jurisdiction, setJurisdiction] = useState('Springfield, IL');
  const [frameworksText, setFrameworksText] = useState(DEFAULT_FRAMEWORKS);

  // historic-preservation-advisor inputs
  const [hpProjectText, setHpProjectText] = useState(DEFAULT_PROJECT);
  const [siteText, setSiteText] = useState(DEFAULT_SITE);
  const [historicResourcesText, setHistoricResourcesText] = useState(DEFAULT_HISTORIC_RESOURCES);
  const [hpJurisdiction, setHpJurisdiction] = useState('Springfield, IL');

  // scenario-optimizer inputs
  const [optimizerSiteText, setOptimizerSiteText] = useState(JSON.stringify({ address: '500 Market St', district: 'Downtown West', lot_size_sqft: 25000, current_zoning: 'C-2' }, null, 2));
  const [optimizerConstraintsText, setOptimizerConstraintsText] = useState(JSON.stringify({ max_height_ft: 75, min_open_space_percent: 15, no_demolition_of_historic: true }, null, 2));
  const [optimizerObjectivesText, setOptimizerObjectivesText] = useState(JSON.stringify(['affordable_housing', 'green_space', 'tax_revenue', 'traffic_minimization'], null, 2));

  // community-benefit-analyzer inputs
  const [cbProjectText, setCbProjectText] = useState(DEFAULT_PROJECT);
  const [cbDemographicsText, setCbDemographicsText] = useState(JSON.stringify({ median_income_usd: 48000, renter_share_percent: 62, minority_share_percent: 55 }, null, 2));
  const [cbAmenitiesText, setCbAmenitiesText] = useState(JSON.stringify({ parks_within_half_mile: 1, supermarkets: 0, transit_lines: 2 }, null, 2));
  const [cbEquityText, setCbEquityText] = useState(JSON.stringify(['affordability', 'cultural preservation', 'workforce inclusion', 'health access'], null, 2));

  // density-far-calc inputs
  const [farLot, setFarLot] = useState(25000);
  const [farFar, setFarFar] = useState(3);
  const [farHeight, setFarHeight] = useState(75);
  const [farF2F, setFarF2F] = useState(11);
  const [farCov, setFarCov] = useState(70);
  const [farUnit, setFarUnit] = useState(850);
  const [farOpen, setFarOpen] = useState(15);
  const [farPark, setFarPark] = useState(1);

  const run = async () => {
    setRunning(true);
    setError('');
    setOutput(null);
    try {
      let res;
      if (active === 'scenario-compare') {
        const scenarios = tryParse(scenariosText, null);
        if (!Array.isArray(scenarios) || scenarios.length < 2) {
          throw new Error('Provide a JSON array with at least two scenarios.');
        }
        const criteria = tryParse(criteriaText, undefined);
        res = await api.post('/ai/scenario-compare', { scenarios, criteria });
      } else if (active === 'impact-assessment') {
        const project = tryParse(projectText, null);
        if (!project) throw new Error('Project must be valid JSON.');
        const parameters = tryParse(paramsText, {});
        res = await api.post('/ai/impact-assessment', { project, location, parameters });
      } else if (active === 'compliance-analysis') {
        const project = tryParse(complianceProjectText, null);
        if (!project) throw new Error('Project must be valid JSON.');
        const frameworks = tryParse(frameworksText, undefined);
        res = await api.post('/ai/compliance-analysis', { project, jurisdiction, frameworks });
      } else if (active === 'historic-preservation-advisor') {
        const project = tryParse(hpProjectText, null);
        if (!project) throw new Error('Project must be valid JSON.');
        const site = tryParse(siteText, {});
        const historic_resources = tryParse(historicResourcesText, []);
        res = await api.post('/ai/historic-preservation-advisor', { project, site, historic_resources, jurisdiction: hpJurisdiction });
      } else if (active === 'scenario-optimizer') {
        const site = tryParse(optimizerSiteText, null);
        if (!site) throw new Error('Site must be valid JSON.');
        const constraints = tryParse(optimizerConstraintsText, {});
        const objectives = tryParse(optimizerObjectivesText, undefined);
        res = await api.post('/ai/scenario-optimizer', { site, constraints, objectives });
      } else if (active === 'community-benefit-analyzer') {
        const project = tryParse(cbProjectText, null);
        if (!project) throw new Error('Project must be valid JSON.');
        const demographics = tryParse(cbDemographicsText, {});
        const existing_amenities = tryParse(cbAmenitiesText, {});
        const equity_priorities = tryParse(cbEquityText, undefined);
        res = await api.post('/ai/community-benefit-analyzer', { project, demographics, existing_amenities, equity_priorities });
      } else {
        // density-far-calc — deterministic, non-AI
        res = await api.post('/ai/density-far-calc', {
          lot_size_sqft: Number(farLot),
          far: Number(farFar),
          max_height_ft: Number(farHeight),
          floor_to_floor_ft: Number(farF2F),
          lot_coverage_percent: Number(farCov),
          avg_unit_size_sqft: Number(farUnit),
          open_space_percent: Number(farOpen),
          parking_ratio_per_unit: Number(farPark),
        });
      }
      setOutput(res.data?.analysis || res.data);
      toast.success(active === 'density-far-calc' ? 'Calculation complete' : 'AI analysis complete');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'AI request failed';
      const status = err.response?.status;
      if (status === 503 || /OPENROUTER_API_KEY/i.test(msg) || /not configured/i.test(msg)) {
        setError('AI not configured: set OPENROUTER_API_KEY on the server.');
      } else {
        setError(msg);
      }
      toast.error(msg);
    } finally {
      setRunning(false);
    }
  };

  const ToolIcon = (TOOLS.find((t) => t.key === active) || TOOLS[0]).icon;

  return (
    <div>
      <Navbar currentPage="AI Advisor" />
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaBalanceScale /> AI Planning Advisor
        </h1>
        <p style={{ color: '#475569', marginTop: 0 }}>
          Compare zoning scenarios or run a comprehensive impact assessment.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1.25rem 0' }}>
          {TOOLS.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setActive(t.key);
                  setOutput(null);
                  setError('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1rem',
                  border: isActive ? `2px solid ${t.color}` : '1px solid #e2e8f0',
                  background: isActive ? `${t.color}15` : '#fff',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon color={t.color} />
                {t.title}
              </button>
            );
          })}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ToolIcon />
            <strong>{TOOLS.find((t) => t.key === active)?.title}</strong>
            <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>
              {TOOLS.find((t) => t.key === active)?.description}
            </span>
          </div>

          {active === 'scenario-compare' && (
            <>
              <label style={{ fontWeight: 600 }}>Scenarios (JSON array, ≥2 items)</label>
              <textarea
                rows={10}
                value={scenariosText}
                onChange={(e) => setScenariosText(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }}
              />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>
                Criteria (JSON array — optional)
              </label>
              <textarea
                rows={4}
                value={criteriaText}
                onChange={(e) => setCriteriaText(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </>
          )}

          {active === 'impact-assessment' && (
            <>
              <label style={{ fontWeight: 600 }}>Project (JSON)</label>
              <textarea
                rows={8}
                value={projectText}
                onChange={(e) => setProjectText(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }}
              />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>
                Parameters (JSON — optional)
              </label>
              <textarea
                rows={4}
                value={paramsText}
                onChange={(e) => setParamsText(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </>
          )}

          {active === 'compliance-analysis' && (
            <>
              <label style={{ fontWeight: 600 }}>Project (JSON)</label>
              <textarea
                rows={8}
                value={complianceProjectText}
                onChange={(e) => setComplianceProjectText(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }}
              />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>Jurisdiction</label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>
                Frameworks (JSON array — optional)
              </label>
              <textarea
                rows={5}
                value={frameworksText}
                onChange={(e) => setFrameworksText(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </>
          )}

          {active === 'scenario-optimizer' && (
            <>
              <label style={{ fontWeight: 600 }}>Site (JSON)</label>
              <textarea rows={6} value={optimizerSiteText} onChange={(e) => setOptimizerSiteText(e.target.value)} style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }} />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>Constraints (JSON)</label>
              <textarea rows={5} value={optimizerConstraintsText} onChange={(e) => setOptimizerConstraintsText(e.target.value)} style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }} />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>Objectives (JSON array, descending priority)</label>
              <textarea rows={4} value={optimizerObjectivesText} onChange={(e) => setOptimizerObjectivesText(e.target.value)} style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }} />
            </>
          )}

          {active === 'community-benefit-analyzer' && (
            <>
              <label style={{ fontWeight: 600 }}>Project (JSON)</label>
              <textarea rows={6} value={cbProjectText} onChange={(e) => setCbProjectText(e.target.value)} style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }} />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>Demographics (JSON)</label>
              <textarea rows={4} value={cbDemographicsText} onChange={(e) => setCbDemographicsText(e.target.value)} style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }} />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>Existing Amenities (JSON)</label>
              <textarea rows={4} value={cbAmenitiesText} onChange={(e) => setCbAmenitiesText(e.target.value)} style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }} />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>Equity Priorities (JSON array)</label>
              <textarea rows={3} value={cbEquityText} onChange={(e) => setCbEquityText(e.target.value)} style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }} />
            </>
          )}

          {active === 'density-far-calc' && (
            <>
              <p style={{ color: '#475569' }}>Deterministic calculation — runs without an AI key.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                <label>Lot size (sqft)<input type="number" value={farLot} onChange={(e) => setFarLot(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                <label>FAR<input type="number" step="0.1" value={farFar} onChange={(e) => setFarFar(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                <label>Max height (ft)<input type="number" value={farHeight} onChange={(e) => setFarHeight(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                <label>Floor-to-floor (ft)<input type="number" step="0.5" value={farF2F} onChange={(e) => setFarF2F(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                <label>Lot coverage (%)<input type="number" value={farCov} onChange={(e) => setFarCov(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                <label>Avg unit size (sqft)<input type="number" value={farUnit} onChange={(e) => setFarUnit(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                <label>Open space (%)<input type="number" value={farOpen} onChange={(e) => setFarOpen(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
                <label>Parking ratio /unit<input type="number" step="0.25" value={farPark} onChange={(e) => setFarPark(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} /></label>
              </div>
            </>
          )}

          {active === 'historic-preservation-advisor' && (
            <>
              <label style={{ fontWeight: 600 }}>Project (JSON)</label>
              <textarea
                rows={6}
                value={hpProjectText}
                onChange={(e) => setHpProjectText(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }}
              />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>Site (JSON)</label>
              <textarea
                rows={5}
                value={siteText}
                onChange={(e) => setSiteText(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }}
              />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>
                Historic Resources (JSON array)
              </label>
              <textarea
                rows={5}
                value={historicResourcesText}
                onChange={(e) => setHistoricResourcesText(e.target.value)}
                style={{ width: '100%', fontFamily: 'monospace', padding: '0.5rem', marginTop: '0.25rem' }}
              />
              <label style={{ fontWeight: 600, marginTop: '0.75rem', display: 'block' }}>Jurisdiction</label>
              <input
                type="text"
                value={hpJurisdiction}
                onChange={(e) => setHpJurisdiction(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </>
          )}

          <button
            onClick={run}
            disabled={running}
            style={{
              marginTop: '1rem',
              padding: '0.6rem 1.25rem',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: running ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {running ? 'Running…' : (active === 'density-far-calc' ? 'Calculate' : 'Run AI Analysis')}
          </button>

          {error && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                borderRadius: 6,
              }}
            >
              {error}
            </div>
          )}

          {output && (
            <div style={{ marginTop: '1.25rem' }}>
              <strong>Result</strong>
              <pre
                style={{
                  background: '#0f172a',
                  color: '#e2e8f0',
                  padding: '1rem',
                  borderRadius: 6,
                  overflow: 'auto',
                  fontSize: 13,
                  marginTop: '0.5rem',
                }}
              >
                {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
