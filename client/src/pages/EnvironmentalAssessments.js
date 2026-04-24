import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaLeaf, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/environmental-assessments';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'projectName', label: 'Project' },
  { key: 'location', label: 'Location' },
  { key: 'assessmentType', label: 'Type' },
  { key: 'airQualityIndex', label: 'AQI' },
  { key: 'waterQualityScore', label: 'Water Score' },
  { key: 'riskLevel', label: 'Risk Level', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'projectName', label: 'Project Name', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'assessmentType', label: 'Assessment Type', type: 'select', options: ['EIA', 'SEA', 'HIA', 'cumulative'] },
  { key: 'airQualityIndex', label: 'Air Quality Index', type: 'number' },
  { key: 'waterQualityScore', label: 'Water Quality Score', type: 'number' },
  { key: 'soilCondition', label: 'Soil Condition', type: 'text' },
  { key: 'biodiversityImpact', label: 'Biodiversity Impact', type: 'text' },
  { key: 'riskLevel', label: 'Risk Level', type: 'select', options: ['low', 'moderate', 'high', 'critical'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'projectName', label: 'Project Name' },
  { key: 'location', label: 'Location' },
  { key: 'assessmentType', label: 'Assessment Type' },
  { key: 'airQualityIndex', label: 'Air Quality Index' },
  { key: 'waterQualityScore', label: 'Water Quality Score' },
  { key: 'soilCondition', label: 'Soil Condition' },
  { key: 'biodiversityImpact', label: 'Biodiversity Impact' },
  { key: 'riskLevel', label: 'Risk Level', badge: true },
];

const EnvironmentalAssessments = () => {
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
      <Navbar currentPage="Environmental Assessment" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaLeaf style={{ marginRight: '0.5rem', color: '#16a34a' }} />Environmental Assessment</h1>
            <p>Comprehensive environmental impact evaluation</p>
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
            onSave={handleSave} title={editItem ? 'Edit Environmental Assessment' : 'New Environmental Assessment'} />
        )}
      </div>
    </div>
  );
};

export default EnvironmentalAssessments;
