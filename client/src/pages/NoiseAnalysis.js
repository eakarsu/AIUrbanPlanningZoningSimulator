import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaVolumeUp, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/noise-analysis';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'location', label: 'Location' },
  { key: 'decibelLevel', label: 'Decibels (dB)' },
  { key: 'source', label: 'Source' },
  { key: 'timeOfDay', label: 'Time of Day' },
  { key: 'affectedArea', label: 'Affected Area' },
  { key: 'complianceStatus', label: 'Compliance', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'decibelLevel', label: 'Decibel Level (dB)', type: 'number' },
  { key: 'source', label: 'Source', type: 'select', options: ['traffic', 'construction', 'industrial', 'commercial', 'aircraft'] },
  { key: 'timeOfDay', label: 'Time of Day', type: 'text' },
  { key: 'affectedArea', label: 'Affected Area (sq mi)', type: 'number' },
  { key: 'residentialProximity', label: 'Residential Proximity (ft)', type: 'number' },
  { key: 'complianceStatus', label: 'Compliance Status', type: 'select', options: ['compliant', 'non-compliant', 'pending', 'under-review'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'location', label: 'Location' },
  { key: 'decibelLevel', label: 'Decibel Level (dB)' },
  { key: 'source', label: 'Source' },
  { key: 'timeOfDay', label: 'Time of Day' },
  { key: 'affectedArea', label: 'Affected Area' },
  { key: 'residentialProximity', label: 'Residential Proximity' },
  { key: 'complianceStatus', label: 'Compliance Status', badge: true },
];

const NoiseAnalysis = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get(ENDPOINT);
      setData(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch { toast.error('Failed to fetch data'); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (formData) => {
    try {
      if (editItem) {
        await api.put(`${ENDPOINT}/${editItem.id}`, formData);
        toast.success('Updated successfully');
      } else {
        await api.post(ENDPOINT, formData);
        toast.success('Created successfully');
      }
      setShowForm(false); setEditItem(null); setSelectedItem(null); fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  const handleEdit = (item) => { setEditItem(item); setShowForm(true); setSelectedItem(null); };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      await api.delete(`${ENDPOINT}/${item.id}`);
      toast.success('Deleted successfully'); setSelectedItem(null); fetchData();
    } catch { toast.error('Delete failed'); }
  };

  const handleRunAI = async (item) => {
    setAiLoading(true); setAiAnalysis(null);
    try {
      const res = await api.post(`${ENDPOINT}/${item.id}/analyze`);
      setAiAnalysis(res.data.aiAnalysis || res.data.analysis || res.data.data?.aiAnalysis || '');
    } catch { toast.error('AI analysis failed'); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="page">
      <Navbar currentPage="Noise Level Analysis" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaVolumeUp style={{ marginRight: '0.5rem', color: '#d97706' }} />Noise Level Analysis</h1>
            <p>Analyze noise pollution levels and affected areas</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowForm(true); }}><FaPlus /> Add New</button>
        </div>
        <DataTable columns={columns} data={data} onRowClick={(item) => { setSelectedItem(item); setAiAnalysis(item.aiAnalysis || null); }} onEdit={handleEdit} onDelete={handleDelete} />
        {selectedItem && (
          <DetailModal item={selectedItem} fields={detailFields} onClose={() => { setSelectedItem(null); setAiAnalysis(null); }}
            onEdit={handleEdit} onDelete={handleDelete} isAIFeature={true}
            aiAnalysis={aiAnalysis} aiLoading={aiLoading} onRunAI={handleRunAI} />
        )}
        {showForm && (
          <FormModal fields={formFields} item={editItem} onClose={() => { setShowForm(false); setEditItem(null); }}
            onSave={handleSave} title={editItem ? 'Edit Noise Analysis' : 'New Noise Analysis'} />
        )}
      </div>
    </div>
  );
};

export default NoiseAnalysis;
