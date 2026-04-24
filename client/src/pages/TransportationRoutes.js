import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaRoad, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/transportation-routes';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'routeNumber', label: 'Route #' },
  { key: 'type', label: 'Type' },
  { key: 'startPoint', label: 'Start' },
  { key: 'endPoint', label: 'End' },
  { key: 'distance', label: 'Distance' },
  { key: 'condition', label: 'Condition', badge: true },
  { key: 'status', label: 'Status', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'routeNumber', label: 'Route Number', type: 'text' },
  { key: 'type', label: 'Type', type: 'select', options: ['highway', 'arterial', 'bus', 'rail', 'bicycle', 'pedestrian'] },
  { key: 'startPoint', label: 'Start Point', type: 'text' },
  { key: 'endPoint', label: 'End Point', type: 'text' },
  { key: 'distance', label: 'Distance (mi)', type: 'number' },
  { key: 'avgDailyTraffic', label: 'Avg Daily Traffic', type: 'number' },
  { key: 'condition', label: 'Condition', type: 'select', options: ['excellent', 'good', 'fair', 'poor'] },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'under-construction', 'planned', 'closed'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'routeNumber', label: 'Route Number' },
  { key: 'type', label: 'Type' },
  { key: 'startPoint', label: 'Start Point' },
  { key: 'endPoint', label: 'End Point' },
  { key: 'distance', label: 'Distance (mi)' },
  { key: 'avgDailyTraffic', label: 'Avg Daily Traffic' },
  { key: 'condition', label: 'Condition', badge: true },
  { key: 'status', label: 'Status', badge: true },
];

const TransportationRoutes = () => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

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

  return (
    <div className="page">
      <Navbar currentPage="Transportation Routes" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaRoad style={{ marginRight: '0.5rem', color: '#57534e' }} />Transportation Routes</h1>
            <p>Manage transportation network and route data</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowForm(true); }}><FaPlus /> Add New</button>
        </div>
        <DataTable columns={columns} data={data} onRowClick={setSelectedItem} onEdit={handleEdit} onDelete={handleDelete} />
        {selectedItem && (
          <DetailModal item={selectedItem} fields={detailFields} onClose={() => setSelectedItem(null)}
            onEdit={handleEdit} onDelete={handleDelete} isAIFeature={false} />
        )}
        {showForm && (
          <FormModal fields={formFields} item={editItem} onClose={() => { setShowForm(false); setEditItem(null); }}
            onSave={handleSave} title={editItem ? 'Edit Transportation Route' : 'New Transportation Route'} />
        )}
      </div>
    </div>
  );
};

export default TransportationRoutes;
