import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTree, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/green-space';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'location', label: 'Location' },
  { key: 'area', label: 'Area (acres)' },
  { key: 'treeCount', label: 'Trees' },
  { key: 'biodiversityScore', label: 'Biodiversity' },
  { key: 'status', label: 'Status', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'type', label: 'Type', type: 'select', options: ['park', 'garden', 'wetland', 'forest', 'plaza'] },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'area', label: 'Area (acres)', type: 'number' },
  { key: 'treeCount', label: 'Tree Count', type: 'number' },
  { key: 'biodiversityScore', label: 'Biodiversity Score', type: 'number' },
  { key: 'maintenanceCost', label: 'Maintenance Cost ($)', type: 'number' },
  { key: 'accessibility', label: 'Accessibility', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'pending', 'under-development', 'completed'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'location', label: 'Location' },
  { key: 'area', label: 'Area (acres)' },
  { key: 'treeCount', label: 'Tree Count' },
  { key: 'biodiversityScore', label: 'Biodiversity Score' },
  { key: 'maintenanceCost', label: 'Maintenance Cost ($)' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'status', label: 'Status', badge: true },
];

const GreenSpace = () => {
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
      <Navbar currentPage="Green Space Planning" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaTree style={{ marginRight: '0.5rem', color: '#15803d' }} />Green Space Planning</h1>
            <p>Optimize urban green space distribution and quality</p>
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
            onSave={handleSave} title={editItem ? 'Edit Green Space' : 'New Green Space'} />
        )}
      </div>
    </div>
  );
};

export default GreenSpace;
