import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCar, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/traffic-simulations';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'location', label: 'Location' },
  { key: 'vehicleCount', label: 'Vehicles' },
  { key: 'peakHour', label: 'Peak Hour' },
  { key: 'avgSpeed', label: 'Avg Speed' },
  { key: 'congestionLevel', label: 'Congestion', badge: true },
  { key: 'status', label: 'Status', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'vehicleCount', label: 'Vehicle Count', type: 'number' },
  { key: 'peakHour', label: 'Peak Hour', type: 'text' },
  { key: 'avgSpeed', label: 'Average Speed (mph)', type: 'number' },
  { key: 'congestionLevel', label: 'Congestion Level', type: 'select', options: ['low', 'moderate', 'high', 'severe'] },
  { key: 'roadType', label: 'Road Type', type: 'select', options: ['highway', 'arterial', 'collector', 'local'] },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'pending', 'completed', 'draft'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'location', label: 'Location' },
  { key: 'vehicleCount', label: 'Vehicle Count' },
  { key: 'peakHour', label: 'Peak Hour' },
  { key: 'avgSpeed', label: 'Average Speed' },
  { key: 'congestionLevel', label: 'Congestion Level', badge: true },
  { key: 'roadType', label: 'Road Type' },
  { key: 'status', label: 'Status', badge: true },
];

const TrafficSimulations = () => {
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
    } catch (err) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = () => { setEditItem(null); setShowForm(true); };

  const handleSave = async (formData) => {
    try {
      if (editItem) {
        await api.put(`${ENDPOINT}/${editItem.id}`, formData);
        toast.success('Updated successfully');
      } else {
        await api.post(ENDPOINT, formData);
        toast.success('Created successfully');
      }
      setShowForm(false);
      setEditItem(null);
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const handleEdit = (item) => { setEditItem(item); setShowForm(true); setSelectedItem(null); };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    try {
      await api.delete(`${ENDPOINT}/${item.id}`);
      toast.success('Deleted successfully');
      setSelectedItem(null);
      fetchData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleRunAI = async (item) => {
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const res = await api.post(`${ENDPOINT}/${item.id}/analyze`);
      setAiAnalysis(res.data.aiAnalysis || res.data.analysis || res.data.data?.aiAnalysis || '');
    } catch (err) {
      toast.error('AI analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar currentPage="Traffic Flow Simulation" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaCar style={{ marginRight: '0.5rem', color: '#2563eb' }} />Traffic Flow Simulation</h1>
            <p>AI-powered traffic pattern analysis and congestion prediction</p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}><FaPlus /> Add New</button>
        </div>
        <DataTable columns={columns} data={data} onRowClick={(item) => { setSelectedItem(item); setAiAnalysis(item.aiAnalysis || null); }} onEdit={handleEdit} onDelete={handleDelete} />
        {selectedItem && (
          <DetailModal
            item={selectedItem} fields={detailFields} onClose={() => { setSelectedItem(null); setAiAnalysis(null); }}
            onEdit={handleEdit} onDelete={handleDelete} isAIFeature={true}
            aiAnalysis={aiAnalysis} aiLoading={aiLoading} onRunAI={handleRunAI}
          />
        )}
        {showForm && (
          <FormModal
            fields={formFields} item={editItem} onClose={() => { setShowForm(false); setEditItem(null); }}
            onSave={handleSave} title={editItem ? 'Edit Traffic Simulation' : 'New Traffic Simulation'}
          />
        )}
      </div>
    </div>
  );
};

export default TrafficSimulations;
