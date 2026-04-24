import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaBuilding, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/infrastructure-impact';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'projectType', label: 'Project Type' },
  { key: 'location', label: 'Location' },
  { key: 'estimatedCost', label: 'Est. Cost' },
  { key: 'affectedPopulation', label: 'Affected Pop.' },
  { key: 'severity', label: 'Severity', badge: true },
  { key: 'status', label: 'Status', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'projectType', label: 'Project Type', type: 'select', options: ['road', 'bridge', 'utility', 'building', 'transit'] },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'estimatedCost', label: 'Estimated Cost ($)', type: 'number' },
  { key: 'impactRadius', label: 'Impact Radius (mi)', type: 'number' },
  { key: 'affectedPopulation', label: 'Affected Population', type: 'number' },
  { key: 'duration', label: 'Duration (months)', type: 'number' },
  { key: 'severity', label: 'Severity', type: 'select', options: ['low', 'moderate', 'high', 'critical'] },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'pending', 'completed', 'draft'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'projectType', label: 'Project Type' },
  { key: 'location', label: 'Location' },
  { key: 'estimatedCost', label: 'Estimated Cost ($)' },
  { key: 'impactRadius', label: 'Impact Radius (mi)' },
  { key: 'affectedPopulation', label: 'Affected Population' },
  { key: 'duration', label: 'Duration (months)' },
  { key: 'severity', label: 'Severity', badge: true },
  { key: 'status', label: 'Status', badge: true },
];

const InfrastructureImpact = () => {
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
      <Navbar currentPage="Infrastructure Impact Analysis" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaBuilding style={{ marginRight: '0.5rem', color: '#0891b2' }} />Infrastructure Impact Analysis</h1>
            <p>Assess infrastructure project impacts on communities</p>
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
            onSave={handleSave} title={editItem ? 'Edit Infrastructure Impact' : 'New Infrastructure Impact'} />
        )}
      </div>
    </div>
  );
};

export default InfrastructureImpact;
