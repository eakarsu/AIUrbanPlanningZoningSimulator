import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlay, FaCar, FaUsers, FaChartLine } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const TRAFFIC_PRESETS = [
  { label: 'Highway peak', vph: 4500, lanes: 4, intersections: 0 },
  { label: 'Arterial peak', vph: 1800, lanes: 2, intersections: 6 },
  { label: 'Residential', vph: 350, lanes: 2, intersections: 12 },
];

export default function Simulator() {
  const [mode, setMode] = useState('traffic'); // traffic | population
  const [tParams, setTParams] = useState({ vph: 1800, lanes: 2, intersections: 6, signal_cycle: 90, peak_hour_factor: 0.92 });
  const [pParams, setPParams] = useState({ population: 50000, growth_rate: 1.8, fertility: 1.7, migration: 500, years: 10 });
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [aiNarrative, setAiNarrative] = useState('');

  // Simple gravity / queueing model
  const runTrafficSim = () => {
    const { vph, lanes, intersections, signal_cycle, peak_hour_factor } = tParams;
    const capacity_per_lane = 1900;
    const v_c = vph / (lanes * capacity_per_lane);
    const los = v_c < 0.6 ? 'A' : v_c < 0.7 ? 'B' : v_c < 0.8 ? 'C' : v_c < 0.9 ? 'D' : v_c < 1.0 ? 'E' : 'F';
    const avg_delay = intersections * (signal_cycle / 4) * Math.pow(v_c, 2);
    const queue_per_intersection = (vph / 3600) * (signal_cycle / 2) * v_c;
    const free_speed = 35;
    const speed = free_speed * (1 - 0.3 * Math.pow(v_c, 2));
    return {
      type: 'traffic',
      v_c_ratio: v_c.toFixed(3),
      level_of_service: los,
      avg_delay_seconds: Math.round(avg_delay),
      avg_speed_mph: speed.toFixed(1),
      queue_per_intersection: queue_per_intersection.toFixed(1),
      bottleneck_risk: v_c >= 0.9 ? 'high' : v_c >= 0.75 ? 'medium' : 'low',
    };
  };

  // Cohort-component style projection
  const runPopulationSim = () => {
    const { population, growth_rate, fertility, migration, years } = pParams;
    const series = [];
    let pop = population;
    for (let y = 0; y <= years; y++) {
      series.push({ year: new Date().getFullYear() + y, population: Math.round(pop) });
      pop = pop * (1 + growth_rate / 100) + migration;
    }
    return {
      type: 'population',
      starting: population,
      ending: Math.round(pop),
      cagr: ((Math.pow(pop / population, 1 / years) - 1) * 100).toFixed(2),
      series,
      housing_demand_units: Math.round((pop - population) / 2.4),
      school_seat_demand: Math.round((pop - population) * 0.18),
    };
  };

  const handleRun = async () => {
    setRunning(true);
    setAiNarrative('');
    const r = mode === 'traffic' ? runTrafficSim() : runPopulationSim();
    setResults(r);
    try {
      const res = await api.post('/ai/analyze', {
        feature: mode === 'traffic' ? 'traffic-simulation' : 'population-density',
        data: { params: mode === 'traffic' ? tParams : pParams, results: r },
      });
      setAiNarrative(res.data.analysis || res.data.aiAnalysis || '');
    } catch {
      toast.warn('AI narrative unavailable; deterministic results saved');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="page">
      <Navbar currentPage="Real Simulator" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaChartLine style={{ marginRight: '0.5rem', color: '#2563eb' }} />Real Traffic & Population Simulator</h1>
            <p>Deterministic micro-sim + cohort projection — LLM explains the math</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <button className={`btn ${mode === 'traffic' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('traffic'); setResults(null); }}><FaCar /> Traffic Micro-Sim</button>
          <button className={`btn ${mode === 'population' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setMode('population'); setResults(null); }}><FaUsers /> Population Projection</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, fontSize: 15 }}>Parameters</h3>
            {mode === 'traffic' ? (
              <>
                {TRAFFIC_PRESETS.map(p => (
                  <button key={p.label} className="btn btn-secondary" style={{ marginRight: 6, marginBottom: 6, fontSize: 11 }}
                    onClick={() => setTParams({ ...tParams, vph: p.vph, lanes: p.lanes, intersections: p.intersections })}>
                    {p.label}
                  </button>
                ))}
                {Object.entries(tParams).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>{k.replace(/_/g, ' ')}</label>
                    <input type="number" step="0.01" value={v} onChange={e => setTParams({ ...tParams, [k]: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                  </div>
                ))}
              </>
            ) : (
              <>
                {Object.entries(pParams).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <label style={labelStyle}>{k.replace(/_/g, ' ')}</label>
                    <input type="number" step="0.01" value={v} onChange={e => setPParams({ ...pParams, [k]: parseFloat(e.target.value) || 0 })} style={inputStyle} />
                  </div>
                ))}
              </>
            )}
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={handleRun} disabled={running}>
              <FaPlay /> {running ? 'Running...' : 'Run Simulation'}
            </button>
          </div>

          <div>
            {!results ? (
              <div style={{ ...cardStyle, padding: 60, textAlign: 'center', color: '#64748b' }}>
                Set parameters and click Run.
              </div>
            ) : results.type === 'traffic' ? (
              <div style={cardStyle}>
                <h3 style={{ marginTop: 0 }}>Traffic Simulation Output</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <Stat label="V/C Ratio" value={results.v_c_ratio} color="#3b82f6" />
                  <Stat label="Level of Service" value={results.level_of_service} color={results.level_of_service >= 'D' ? '#ef4444' : '#10b981'} />
                  <Stat label="Avg Delay (s)" value={results.avg_delay_seconds} color="#f59e0b" />
                  <Stat label="Avg Speed (mph)" value={results.avg_speed_mph} color="#10b981" />
                  <Stat label="Queue / intersection" value={results.queue_per_intersection} color="#a855f7" />
                  <Stat label="Bottleneck Risk" value={results.bottleneck_risk} color={results.bottleneck_risk === 'high' ? '#ef4444' : '#f59e0b'} />
                </div>
              </div>
            ) : (
              <div style={cardStyle}>
                <h3 style={{ marginTop: 0 }}>Population Projection Output</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                  <Stat label="Start" value={results.starting.toLocaleString()} color="#3b82f6" />
                  <Stat label="End" value={results.ending.toLocaleString()} color="#10b981" />
                  <Stat label="CAGR %" value={`${results.cagr}%`} color="#f59e0b" />
                  <Stat label="Housing Need" value={results.housing_demand_units.toLocaleString()} color="#a855f7" />
                </div>
                <div style={{ marginTop: 16 }}>
                  <table style={{ width: '100%', fontSize: 13, color: '#cbd5e1' }}>
                    <thead><tr><th style={th}>Year</th><th style={th}>Population</th><th style={th}>Growth</th></tr></thead>
                    <tbody>
                      {results.series.map((s, i) => (
                        <tr key={s.year}>
                          <td style={td}>{s.year}</td>
                          <td style={td}>{s.population.toLocaleString()}</td>
                          <td style={td}>{i === 0 ? '-' : `+${(s.population - results.series[i - 1].population).toLocaleString()}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {aiNarrative && (
              <div style={{ ...cardStyle, marginTop: 12 }}>
                <h3 style={{ marginTop: 0 }}>AI Narrative</h3>
                <div style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{aiNarrative}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, value, color }) => (
  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: 14 }}>
    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
  </div>
);

const cardStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 16 };
const labelStyle = { display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4, textTransform: 'capitalize' };
const inputStyle = { width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f1f5f9', fontSize: 13 };
const th = { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #334155', color: '#64748b', fontSize: 11 };
const td = { padding: '6px 8px', borderBottom: '1px solid rgba(51,65,85,0.4)' };
