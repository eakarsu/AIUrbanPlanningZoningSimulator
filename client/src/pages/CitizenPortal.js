import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUserCheck, FaSearch, FaUpload, FaBell, FaFileAlt } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';

export default function CitizenPortal() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState(null);
  const [zones, setZones] = useState([]);
  const [permits, setPermits] = useState([]);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submission, setSubmission] = useState({ name: '', email: '', address: '', use_type: 'Residential', description: '' });
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    api.get('/district-zones').then(r => setZones(r.data?.data || r.data || []));
    api.get('/building-permits').then(r => setPermits(r.data?.data || r.data || []));
    const stored = JSON.parse(localStorage.getItem('citizen_submissions') || '[]');
    setSubmissions(stored);
  }, []);

  const handleSearch = () => {
    if (!search) return;
    const lc = search.toLowerCase();
    const matchingPermits = permits.filter(p => (p.location || '').toLowerCase().includes(lc) || (p.address || '').toLowerCase().includes(lc));
    const matchingZones = zones.filter(z => (z.name || '').toLowerCase().includes(lc) || (matchingPermits.length && matchingPermits.some(p => (p.location || '').includes(z.name))));
    setResults({ permits: matchingPermits, zones: matchingZones, address: search });
  };

  const handleSubmit = () => {
    if (!submission.name || !submission.email || !submission.address) {
      toast.error('Name, email, and address required');
      return;
    }
    const item = {
      id: Date.now(),
      ...submission,
      file_name: file?.name || null,
      submitted_at: new Date().toISOString(),
      status: 'received',
      reference: `CP-${Date.now().toString().slice(-6)}`,
    };
    const next = [item, ...submissions];
    setSubmissions(next);
    localStorage.setItem('citizen_submissions', JSON.stringify(next));
    toast.success(`Submitted! Reference ${item.reference}. Email confirmation will be sent.`);
    setShowSubmit(false);
    setSubmission({ name: '', email: '', address: '', use_type: 'Residential', description: '' });
    setFile(null);
  };

  return (
    <div className="page">
      <Navbar currentPage="Citizen Portal" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaUserCheck style={{ marginRight: '0.5rem', color: '#2563eb' }} />Public Citizen Portal</h1>
            <p>Address lookup → zoning + permits + hearings; submit applications with documents</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowSubmit(true)}><FaUpload /> Submit Permit App</button>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 20, marginBottom: 16 }}>
          <h3 style={{ marginTop: 0, fontSize: 15, color: '#f1f5f9' }}><FaSearch style={{ marginRight: 8 }} />Search Address</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              placeholder="Enter street, neighborhood, or zone name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={{ flex: 1, padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f1f5f9' }}
            />
            <button className="btn btn-primary" onClick={handleSearch}><FaSearch /> Lookup</button>
          </div>
        </div>

        {results && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8' }}>Zoning ({results.zones.length})</h3>
              {results.zones.length === 0 ? <div style={{ color: '#64748b', fontSize: 13 }}>No zones matched "{results.address}"</div> :
                results.zones.map(z => (
                  <div key={z.id} style={rowStyle}>
                    <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{z.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Allowed: {z.allowedUses || z.allowed_uses || '-'}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Max height: {z.maxHeight || z.max_height || '-'} · Coverage: {z.maxCoverage || z.max_coverage || '-'}%</div>
                  </div>
                ))}
            </div>
            <div style={cardStyle}>
              <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8' }}>Active Permits ({results.permits.length})</h3>
              {results.permits.length === 0 ? <div style={{ color: '#64748b', fontSize: 13 }}>No permits in this area</div> :
                results.permits.map(p => (
                  <div key={p.id} style={rowStyle}>
                    <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{p.name || p.applicationNumber || `Permit #${p.id}`}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{p.use_type || p.type || '-'} · status {p.status}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8' }}><FaFileAlt style={{ marginRight: 6 }} />Your Submissions ({submissions.length})</h3>
          {submissions.length === 0 ? <div style={{ color: '#64748b', fontSize: 13 }}>No submissions yet</div> : (
            <table style={{ width: '100%', fontSize: 13, color: '#cbd5e1' }}>
              <thead><tr><th style={th}>Reference</th><th style={th}>Address</th><th style={th}>Type</th><th style={th}>Status</th><th style={th}>Submitted</th><th style={th}>Doc</th></tr></thead>
              <tbody>
                {submissions.map(s => (
                  <tr key={s.id}>
                    <td style={td}>{s.reference}</td>
                    <td style={td}>{s.address}</td>
                    <td style={td}>{s.use_type}</td>
                    <td style={td}><span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: 11 }}>{s.status}</span></td>
                    <td style={td}>{new Date(s.submitted_at).toLocaleDateString()}</td>
                    <td style={td}>{s.file_name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showSubmit && (
          <div style={overlayStyle} onClick={() => setShowSubmit(false)}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
              <h2 style={{ marginTop: 0, color: '#f1f5f9' }}>Submit Permit Application</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Full Name *" value={submission.name} onChange={v => setSubmission({ ...submission, name: v })} />
                <Field label="Email *" value={submission.email} onChange={v => setSubmission({ ...submission, email: v })} />
                <Field label="Property Address *" value={submission.address} onChange={v => setSubmission({ ...submission, address: v })} colSpan />
                <div>
                  <label style={labelStyle}>Use Type</label>
                  <select value={submission.use_type} onChange={e => setSubmission({ ...submission, use_type: e.target.value })} style={inputStyle}>
                    <option>Residential</option><option>Commercial</option><option>Industrial</option><option>Mixed-Use</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Site Plan / PDF</label>
                  <input type="file" accept=".pdf,.dwg,image/*" onChange={e => setFile(e.target.files?.[0])} style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Project Description</label>
                  <textarea value={submission.description} onChange={e => setSubmission({ ...submission, description: e.target.value })} rows={4} style={{ ...inputStyle, fontFamily: 'inherit' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                <button className="btn btn-secondary" onClick={() => setShowSubmit(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}><FaBell /> Submit &amp; Get Confirmation</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Field = ({ label, value, onChange, colSpan }) => (
  <div style={{ gridColumn: colSpan ? '1 / -1' : 'auto' }}>
    <label style={labelStyle}>{label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} style={inputStyle} />
  </div>
);

const cardStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 16 };
const rowStyle = { padding: '10px 0', borderBottom: '1px solid rgba(51,65,85,0.4)' };
const labelStyle = { display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f1f5f9', fontSize: 13 };
const th = { textAlign: 'left', padding: '8px', borderBottom: '1px solid #334155', color: '#64748b', fontSize: 11, textTransform: 'uppercase' };
const td = { padding: '8px', borderBottom: '1px solid rgba(51,65,85,0.4)' };
const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24, width: 'min(720px, 92vw)', maxHeight: '90vh', overflow: 'auto' };
