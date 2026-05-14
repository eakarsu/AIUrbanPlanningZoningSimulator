import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaShieldAlt, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function ComplianceEngine() {
  const [permits, setPermits] = useState([]);
  const [zones, setZones] = useState([]);
  const [noise, setNoise] = useState([]);
  const [environmental, setEnvironmental] = useState([]);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [check, setCheck] = useState(null);
  const [aiJustification, setAiJustification] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/building-permits').then(r => setPermits(r.data?.data || r.data || []));
    api.get('/district-zones').then(r => setZones(r.data?.data || r.data || []));
    api.get('/noise-analysis').then(r => setNoise(r.data?.data || r.data || []));
    api.get('/environmental-assessments').then(r => setEnvironmental(r.data?.data || r.data || []));
  }, []);

  const evaluate = (permit) => {
    // Find applicable district zone (by location string match heuristic)
    const zone = zones.find(z => permit.location && z.name && permit.location.toLowerCase().includes(z.name.toLowerCase()))
      || zones[0];
    if (!zone) return { compliant: false, hits: ['No district zone defined'], score: 0 };

    const hits = [];
    let score = 100;

    const proposedHeight = parseFloat(permit.height || permit.proposed_height || 0);
    const maxHeight = parseFloat(zone.maxHeight || zone.max_height || 100);
    if (proposedHeight > maxHeight) {
      hits.push({ type: 'fail', rule: 'Max Height', expected: `${maxHeight} ft`, actual: `${proposedHeight} ft` });
      score -= 30;
    } else {
      hits.push({ type: 'pass', rule: 'Max Height', expected: `<= ${maxHeight} ft`, actual: `${proposedHeight} ft` });
    }

    const lotCoverage = parseFloat(permit.lot_coverage || permit.coverage || 50);
    const maxCoverage = parseFloat(zone.maxCoverage || zone.max_coverage || 70);
    if (lotCoverage > maxCoverage) {
      hits.push({ type: 'fail', rule: 'Lot Coverage', expected: `<= ${maxCoverage}%`, actual: `${lotCoverage}%` });
      score -= 20;
    } else {
      hits.push({ type: 'pass', rule: 'Lot Coverage', expected: `<= ${maxCoverage}%`, actual: `${lotCoverage}%` });
    }

    const useType = (permit.use_type || permit.proposed_use || '').toLowerCase();
    const allowed = (zone.allowedUses || zone.allowed_uses || '').toLowerCase();
    if (allowed && useType && !allowed.includes(useType)) {
      hits.push({ type: 'fail', rule: 'Allowed Use', expected: allowed, actual: useType });
      score -= 35;
    } else {
      hits.push({ type: 'pass', rule: 'Allowed Use', expected: allowed || 'any', actual: useType || '?' });
    }

    // Nearby noise check
    const nearbyNoise = noise.filter(n => n.location && permit.location && n.location.includes(permit.location.split(',')[0]));
    if (nearbyNoise.some(n => parseFloat(n.dbLevel || n.db_level || 0) > 75)) {
      hits.push({ type: 'warn', rule: 'Ambient Noise', expected: '<= 75 dB', actual: 'High noise area' });
      score -= 5;
    }

    // Environmental
    const envIssues = environmental.filter(e => e.location && permit.location && e.location.includes(permit.location.split(',')[0]));
    if (envIssues.some(e => (e.impactLevel || '').toLowerCase().includes('high'))) {
      hits.push({ type: 'warn', rule: 'Environmental Impact', expected: 'Low/Moderate', actual: 'High impact area' });
      score -= 10;
    }

    const compliant = !hits.some(h => h.type === 'fail');
    return { compliant, hits, score, zone };
  };

  const handleSelect = async (permit) => {
    setSelectedPermit(permit);
    setAiJustification('');
    const c = evaluate(permit);
    setCheck(c);
    setLoading(true);
    try {
      const res = await api.post('/ai/analyze', {
        feature: 'zoning-compliance',
        data: {
          permit,
          zone: c.zone,
          rule_hits: c.hits,
          compliance_score: c.score,
          compliant: c.compliant,
        },
      });
      setAiJustification(res.data.analysis || res.data.aiAnalysis || '');
    } catch {
      toast.error('AI justification unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar currentPage="Compliance Engine" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaShieldAlt style={{ marginRight: '0.5rem', color: '#2563eb' }} />Cross-Table Zoning Compliance</h1>
            <p>Deterministic rule check against district zone, noise, and environmental — LLM provides justification</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 14 }}>
            <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8' }}>Building Permits ({permits.length})</h3>
            <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
              {permits.map(p => (
                <div key={p.id} onClick={() => handleSelect(p)} style={{
                  padding: 12, borderBottom: '1px solid #334155', cursor: 'pointer',
                  background: selectedPermit?.id === p.id ? 'rgba(37,99,235,0.1)' : 'transparent',
                }}>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: 14 }}>{p.name || p.applicationNumber || `Permit #${p.id}`}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{p.location || '-'} · {p.use_type || p.type || '-'}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {!selectedPermit ? (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 60, textAlign: 'center', color: '#64748b' }}>
                Select a permit to run compliance check
              </div>
            ) : (
              <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h2 style={{ margin: 0, fontSize: 18, color: '#f1f5f9' }}>{selectedPermit.name || `Permit #${selectedPermit.id}`}</h2>
                  <div style={{
                    padding: '6px 14px', borderRadius: 20,
                    background: check?.compliant ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: check?.compliant ? '#10b981' : '#ef4444',
                    fontWeight: 700, fontSize: 14,
                  }}>
                    {check?.compliant ? 'COMPLIANT' : 'VIOLATIONS FOUND'} · Score {check?.score}/100
                  </div>
                </div>

                <h3 style={{ fontSize: 14, color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: 6 }}>Rule Hits</h3>
                <div style={{ marginBottom: 20 }}>
                  {check?.hits.map((h, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: 10,
                      borderBottom: '1px solid rgba(51,65,85,0.4)', fontSize: 13,
                    }}>
                      <div style={{ width: 28, textAlign: 'center', color: h.type === 'pass' ? '#10b981' : h.type === 'warn' ? '#f59e0b' : '#ef4444' }}>
                        {h.type === 'pass' ? <FaCheck /> : h.type === 'warn' ? <FaExclamationTriangle /> : <FaTimes />}
                      </div>
                      <div style={{ flex: 1, color: '#f1f5f9', fontWeight: 600 }}>{h.rule}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>Expected: {h.expected}</div>
                      <div style={{ color: '#cbd5e1', fontSize: 12 }}>Actual: {h.actual}</div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 14, color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: 6 }}>AI Justification &amp; Variance Recommendation</h3>
                {loading ? (
                  <div style={{ color: '#64748b', padding: 20, textAlign: 'center' }}>Generating justification...</div>
                ) : (
                  <div style={{ whiteSpace: 'pre-wrap', color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{aiJustification || 'No narrative yet'}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
