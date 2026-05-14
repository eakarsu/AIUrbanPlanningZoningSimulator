import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCopy, FaPlay, FaExchangeAlt, FaFileExport } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const MUTATIONS = [
  { kind: 'rezone', label: 'Rezone block (R1 → R3)' },
  { kind: 'add_route', label: 'Add bus route' },
  { kind: 'add_park', label: 'Convert lot to park' },
  { kind: 'increase_height', label: 'Increase max height (+20 ft)' },
  { kind: 'reduce_parking', label: 'Reduce parking minimum' },
];

export default function ScenarioWorkbench() {
  const [zones, setZones] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [baseline, setBaseline] = useState(null);
  const [scenario, setScenario] = useState(null);
  const [diff, setDiff] = useState(null);
  const [aiReport, setAiReport] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    api.get('/district-zones').then(r => {
      const data = r.data?.data || r.data || [];
      setZones(data);
      if (data.length) setBaseline(data[0]);
    });
    const stored = JSON.parse(localStorage.getItem('scenarios') || '[]');
    setScenarios(stored);
  }, []);

  const cloneToScenario = () => {
    if (!baseline) return;
    const s = {
      id: Date.now(),
      name: `${baseline.name} — Scenario ${scenarios.length + 1}`,
      base_id: baseline.id,
      mutations: [],
      params: {
        max_height: baseline.maxHeight || baseline.max_height || 35,
        max_coverage: baseline.maxCoverage || baseline.max_coverage || 60,
        allowed_uses: baseline.allowedUses || baseline.allowed_uses || 'Residential',
        bus_routes: 0,
        park_acres: 0,
        parking_min: 1.5,
      },
    };
    setScenario(s);
    setDiff(null);
    setAiReport('');
  };

  const applyMutation = (m) => {
    if (!scenario) return;
    const next = { ...scenario, mutations: [...scenario.mutations, m] };
    if (m.kind === 'rezone') next.params.allowed_uses = 'Multi-Family Residential, Mixed-Use';
    if (m.kind === 'add_route') next.params.bus_routes += 1;
    if (m.kind === 'add_park') next.params.park_acres += 5;
    if (m.kind === 'increase_height') next.params.max_height += 20;
    if (m.kind === 'reduce_parking') next.params.parking_min = Math.max(0, next.params.parking_min - 0.5);
    setScenario(next);
  };

  const runDependentSims = async () => {
    if (!scenario || !baseline) return;
    setRunning(true);
    setAiReport('');

    // Deterministic effects of mutations
    const baselineMetrics = {
      population_capacity: 1000,
      traffic_vph: 1500,
      env_score: 70,
      fiscal_revenue: 500000,
      noise_db: 65,
    };
    const sMetrics = { ...baselineMetrics };
    scenario.mutations.forEach(m => {
      if (m.kind === 'rezone') { sMetrics.population_capacity *= 2.5; sMetrics.traffic_vph *= 1.4; sMetrics.fiscal_revenue *= 1.8; }
      if (m.kind === 'add_route') { sMetrics.traffic_vph *= 0.85; sMetrics.env_score += 5; }
      if (m.kind === 'add_park') { sMetrics.env_score += 8; sMetrics.fiscal_revenue *= 0.95; }
      if (m.kind === 'increase_height') { sMetrics.population_capacity *= 1.4; sMetrics.fiscal_revenue *= 1.3; }
      if (m.kind === 'reduce_parking') { sMetrics.traffic_vph *= 0.9; sMetrics.population_capacity *= 1.1; }
    });

    const d = {
      population_capacity: { base: baselineMetrics.population_capacity, scenario: Math.round(sMetrics.population_capacity), delta: Math.round(sMetrics.population_capacity - baselineMetrics.population_capacity) },
      traffic_vph: { base: baselineMetrics.traffic_vph, scenario: Math.round(sMetrics.traffic_vph), delta: Math.round(sMetrics.traffic_vph - baselineMetrics.traffic_vph) },
      env_score: { base: baselineMetrics.env_score, scenario: Math.round(sMetrics.env_score), delta: sMetrics.env_score - baselineMetrics.env_score },
      fiscal_revenue: { base: baselineMetrics.fiscal_revenue, scenario: Math.round(sMetrics.fiscal_revenue), delta: Math.round(sMetrics.fiscal_revenue - baselineMetrics.fiscal_revenue) },
      noise_db: { base: baselineMetrics.noise_db, scenario: sMetrics.noise_db, delta: 0 },
    };
    setDiff(d);

    try {
      const res = await api.post('/ai/analyze', {
        feature: 'zoning-compliance',
        data: {
          scenario_name: scenario.name,
          base: baseline,
          mutations: scenario.mutations,
          metrics_diff: d,
        },
      });
      setAiReport(res.data.analysis || res.data.aiAnalysis || '');
    } catch {
      toast.warn('AI report unavailable');
    } finally {
      setRunning(false);
    }
  };

  const handleSave = () => {
    if (!scenario) return;
    const item = { ...scenario, diff, ai_report: aiReport, saved_at: new Date().toISOString() };
    const next = [item, ...scenarios];
    setScenarios(next);
    localStorage.setItem('scenarios', JSON.stringify(next));
    toast.success('Scenario saved');
  };

  const handleExport = () => {
    const json = JSON.stringify({ baseline, scenario, diff, ai_report: aiReport }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `scenario_${scenario?.id || 'export'}.json`;
    a.click();
  };

  return (
    <div className="page">
      <Navbar currentPage="Scenario Workbench" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaExchangeAlt style={{ marginRight: '0.5rem', color: '#2563eb' }} />What-If Scenario Workbench</h1>
            <p>Clone district → mutate → re-run dependent analyses → diff vs baseline</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {scenario && <button className="btn btn-secondary" onClick={handleExport}><FaFileExport /> Export</button>}
            {scenario && <button className="btn btn-secondary" onClick={handleSave}>Save</button>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8' }}>Baseline District</h3>
            <select value={baseline?.id || ''} onChange={e => setBaseline(zones.find(z => z.id === parseInt(e.target.value)))} style={inputStyle}>
              {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
            {baseline && (
              <div style={{ marginTop: 12, fontSize: 13, color: '#cbd5e1' }}>
                <div>Allowed: {baseline.allowedUses || baseline.allowed_uses || '-'}</div>
                <div>Max Height: {baseline.maxHeight || baseline.max_height || '-'} ft</div>
                <div>Max Coverage: {baseline.maxCoverage || baseline.max_coverage || '-'}%</div>
              </div>
            )}
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={cloneToScenario} disabled={!baseline}><FaCopy /> Clone to Scenario</button>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8' }}>Scenario</h3>
            {!scenario ? <div style={{ color: '#64748b', fontSize: 13 }}>Clone a district to begin</div> : (
              <>
                <input value={scenario.name} onChange={e => setScenario({ ...scenario, name: e.target.value })} style={inputStyle} />
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>Mutations applied: {scenario.mutations.length}</div>
                  {scenario.mutations.map((m, i) => (
                    <span key={i} style={{ display: 'inline-block', padding: '2px 8px', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', borderRadius: 6, fontSize: 11, marginRight: 6, marginBottom: 6 }}>{m.label}</span>
                  ))}
                </div>
                <div style={{ marginTop: 12 }}>
                  {MUTATIONS.map(m => (
                    <button key={m.kind} className="btn btn-secondary" style={{ marginRight: 4, marginBottom: 4, fontSize: 11 }} onClick={() => applyMutation(m)}>{m.label}</button>
                  ))}
                </div>
                <button className="btn btn-primary" style={{ marginTop: 12, width: '100%' }} onClick={runDependentSims} disabled={running}>
                  <FaPlay /> {running ? 'Re-running all dependent sims...' : 'Run Dependent Simulations'}
                </button>
              </>
            )}
          </div>
        </div>

        {diff && (
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <h3 style={{ marginTop: 0, fontSize: 15 }}>Side-by-Side Diff</h3>
            <table style={{ width: '100%', fontSize: 14, color: '#cbd5e1' }}>
              <thead><tr><th style={th}>Metric</th><th style={th}>Baseline</th><th style={th}>Scenario</th><th style={th}>Δ</th></tr></thead>
              <tbody>
                {Object.entries(diff).map(([k, v]) => (
                  <tr key={k}>
                    <td style={td}>{k.replace(/_/g, ' ')}</td>
                    <td style={td}>{v.base.toLocaleString()}</td>
                    <td style={td}>{v.scenario.toLocaleString()}</td>
                    <td style={{ ...td, color: v.delta > 0 ? '#10b981' : v.delta < 0 ? '#ef4444' : '#64748b', fontWeight: 700 }}>
                      {v.delta > 0 ? '+' : ''}{v.delta.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {aiReport && (
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, fontSize: 15 }}>AI Report</h3>
            <div style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{aiReport}</div>
          </div>
        )}

        <div style={{ ...cardStyle, marginTop: 16 }}>
          <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8' }}>Saved Scenarios ({scenarios.length})</h3>
          {scenarios.length === 0 ? <div style={{ color: '#64748b', fontSize: 13 }}>No saved scenarios yet</div> :
            scenarios.map(s => (
              <div key={s.id} style={{ padding: 10, borderBottom: '1px solid rgba(51,65,85,0.4)', fontSize: 13 }}>
                <strong style={{ color: '#f1f5f9' }}>{s.name}</strong> — {s.mutations.length} mutations · saved {new Date(s.saved_at).toLocaleString()}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

const cardStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 16 };
const inputStyle = { width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f1f5f9', fontSize: 13 };
const th = { textAlign: 'left', padding: '8px', borderBottom: '1px solid #334155', color: '#64748b', fontSize: 11, textTransform: 'uppercase' };
const td = { padding: '8px', borderBottom: '1px solid rgba(51,65,85,0.4)' };
