import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUsers, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/population-density';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'district', label: 'District' },
  { key: 'currentPopulation', label: 'Population' },
  { key: 'area', label: 'Area (sq mi)' },
  { key: 'density', label: 'Density' },
  { key: 'growthRate', label: 'Growth Rate' },
  { key: 'status', label: 'Status', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'district', label: 'District', type: 'text' },
  { key: 'currentPopulation', label: 'Current Population', type: 'number' },
  { key: 'area', label: 'Area (sq mi)', type: 'number' },
  { key: 'density', label: 'Density (per sq mi)', type: 'number' },
  { key: 'growthRate', label: 'Growth Rate (%)', type: 'number' },
  { key: 'projectedPopulation', label: 'Projected Population', type: 'number' },
  { key: 'yearProjected', label: 'Year Projected', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'pending', 'completed', 'draft'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'district', label: 'District' },
  { key: 'currentPopulation', label: 'Current Population' },
  { key: 'area', label: 'Area (sq mi)' },
  { key: 'density', label: 'Density (per sq mi)' },
  { key: 'growthRate', label: 'Growth Rate (%)' },
  { key: 'projectedPopulation', label: 'Projected Population' },
  { key: 'yearProjected', label: 'Year Projected' },
  { key: 'status', label: 'Status', badge: true },
];

const PopulationDensity = () => {
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
      <Navbar currentPage="Population Density Modeling" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaUsers style={{ marginRight: '0.5rem', color: '#7c3aed' }} />Population Density Modeling</h1>
            <p>Predict population growth and density distribution patterns</p>
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
            onSave={handleSave} title={editItem ? 'Edit Population Model' : 'New Population Model'} />
        )}
      </div>
    </div>
  );
};

export default PopulationDensity;
