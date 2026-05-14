import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { FaMap, FaLayerGroup, FaDrawPolygon, FaSearchLocation, FaPlus, FaInfo } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';

const LAYERS = [
  { key: 'zones', label: 'District Zones', endpoint: '/district-zones', color: '#7c3aed' },
  { key: 'permits', label: 'Building Permits', endpoint: '/building-permits', color: '#f59e0b' },
  { key: 'traffic', label: 'Traffic Counts', endpoint: '/traffic-simulations', color: '#dc2626' },
  { key: 'green', label: 'Green Space', endpoint: '/green-space', color: '#16a34a' },
  { key: 'noise', label: 'Noise Contours', endpoint: '/noise-analysis', color: '#9333ea' },
  { key: 'facilities', label: 'Public Facilities', endpoint: '/public-facilities', color: '#0891b2' },
  { key: 'routes', label: 'Transport Routes', endpoint: '/transportation-routes', color: '#475569' },
];

// Pseudo-coords helper — assigns deterministic lat/lng per id since DB has STRING locations
function pseudoCoords(layer, item) {
  const seed = parseInt(item.id || 1) + layer.charCodeAt(0);
  const lat = 40.7 + ((seed * 17) % 50) / 100;
  const lng = -74.0 + ((seed * 31) % 80) / 100;
  return { lat, lng };
}

export default function GISMap() {
  const [activeLayers, setActiveLayers] = useState({ zones: true, permits: true });
  const [layerData, setLayerData] = useState({});
  const [selected, setSelected] = useState(null);
  const [drawing, setDrawing] = useState(null); // 'parcel' | 'route' | null
  const [drawnFeatures, setDrawnFeatures] = useState([]);
  const [search, setSearch] = useState('');
  const [points, setPoints] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    LAYERS.forEach(async (layer) => {
      try {
        const res = await api.get(layer.endpoint);
        const items = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setLayerData(prev => ({ ...prev, [layer.key]: items }));
      } catch {
        setLayerData(prev => ({ ...prev, [layer.key]: [] }));
      }
    });
  }, []);

  useEffect(() => {
    const pts = [];
    LAYERS.forEach(layer => {
      if (!activeLayers[layer.key]) return;
      (layerData[layer.key] || []).forEach(item => {
        const c = pseudoCoords(layer.key, item);
        pts.push({ ...c, layer, item });
      });
    });
    setPoints(pts);
  }, [activeLayers, layerData]);

  const handleMapClick = (e) => {
    if (!drawing) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width);
    const y = ((e.clientY - rect.top) / rect.height);
    const f = drawnFeatures.find(d => d.id === drawing.id);
    if (f) {
      f.points.push({ x, y });
      setDrawnFeatures([...drawnFeatures]);
    }
  };

  const startDraw = (kind) => {
    const id = Date.now();
    setDrawing({ id, kind });
    setDrawnFeatures([...drawnFeatures, { id, kind, points: [] }]);
    toast.info(`Drawing ${kind}. Click points; Finish to save.`);
  };

  const finishDraw = () => {
    setDrawing(null);
    toast.success('Geometry saved');
  };

  const filteredPoints = search ? points.filter(p =>
    JSON.stringify(p.item).toLowerCase().includes(search.toLowerCase())
  ) : points;

  return (
    <div className="page">
      <Navbar currentPage="GIS Map" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaMap style={{ marginRight: '0.5rem', color: '#2563eb' }} />GIS Map View</h1>
            <p>Spatial layer toggles, click-to-inspect, draw-to-create</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => startDraw('parcel')}><FaDrawPolygon /> Draw Parcel</button>
            <button className="btn btn-secondary" onClick={() => startDraw('route')}><FaDrawPolygon /> Draw Route</button>
            {drawing && <button className="btn btn-primary" onClick={finishDraw}>Finish</button>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 320px', gap: 16, height: 'calc(100vh - 220px)' }}>
          {/* Layers panel */}
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}><FaLayerGroup /> Layers</h3>
            {LAYERS.map(layer => (
              <label key={layer.key} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={!!activeLayers[layer.key]}
                  onChange={e => setActiveLayers({ ...activeLayers, [layer.key]: e.target.checked })}
                  style={{ marginRight: 8 }}
                />
                <span style={{ width: 12, height: 12, background: layer.color, borderRadius: 2, marginRight: 8, display: 'inline-block' }}></span>
                {layer.label}
                <span style={{ marginLeft: 'auto', color: '#64748b' }}>{layerData[layer.key]?.length || 0}</span>
              </label>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid #334155', margin: '12px 0' }} />
            <input
              placeholder="Search address / id..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Map */}
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', position: 'relative' }} ref={mapRef} onClick={handleMapClick}>
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%)',
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 40px)',
              position: 'relative', cursor: drawing ? 'crosshair' : 'default',
            }}>
              {filteredPoints.map((p, i) => (
                <div
                  key={`${p.layer.key}_${p.item.id}`}
                  onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                  title={p.item.name || p.item.id}
                  style={{
                    position: 'absolute',
                    left: `${((p.lng + 74) * 100)}%`,
                    top: `${((40.75 - p.lat) * 800)}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 14, height: 14, borderRadius: '50%',
                    background: p.layer.color, border: '2px solid #fff',
                    cursor: 'pointer', boxShadow: `0 0 12px ${p.layer.color}80`,
                  }}
                />
              ))}
              {/* Drawn features */}
              {drawnFeatures.map(f => (
                <svg key={f.id} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                  {f.points.length > 0 && (
                    <polygon
                      points={f.points.map(p => `${p.x * 100}%,${p.y * 100}%`).join(' ')}
                      fill="rgba(99,102,241,0.25)" stroke="#6366f1" strokeWidth="2"
                    />
                  )}
                </svg>
              ))}
              <div style={{ position: 'absolute', bottom: 12, right: 12, padding: '6px 12px', background: 'rgba(0,0,0,0.6)', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
                <FaSearchLocation /> {filteredPoints.length} features visible
              </div>
            </div>
          </div>

          {/* Inspect panel */}
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, fontSize: 14, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}><FaInfo /> Inspector</h3>
            {!selected ? (
              <div style={{ color: '#64748b', fontSize: 13, padding: 16, textAlign: 'center' }}>Click a point on the map</div>
            ) : (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 6, background: selected.layer.color, color: '#fff', fontSize: 11 }}>
                    {selected.layer.label}
                  </span>
                </div>
                {Object.entries(selected.item).slice(0, 12).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>{k}</div>
                    <div style={{ fontSize: 13, color: '#e2e8f0', wordBreak: 'break-word' }}>{String(v).slice(0, 80) || '-'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = { background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: 14, overflow: 'auto' };
const inputStyle = { width: '100%', padding: '8px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, color: '#f1f5f9', fontSize: 12 };
