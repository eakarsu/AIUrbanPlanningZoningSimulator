import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaHospital, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/public-facilities';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'address', label: 'Address' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'yearBuilt', label: 'Year Built' },
  { key: 'condition', label: 'Condition', badge: true },
  { key: 'status', label: 'Status', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'type', label: 'Type', type: 'select', options: ['school', 'hospital', 'fire-station', 'police', 'library', 'recreation', 'government'] },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'capacity', label: 'Capacity', type: 'number' },
  { key: 'yearBuilt', label: 'Year Built', type: 'number' },
  { key: 'condition', label: 'Condition', type: 'select', options: ['excellent', 'good', 'fair', 'poor'] },
  { key: 'operatingBudget', label: 'Operating Budget ($)', type: 'number' },
  { key: 'servingPopulation', label: 'Serving Population', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'under-renovation', 'planned', 'closed'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'address', label: 'Address' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'yearBuilt', label: 'Year Built' },
  { key: 'condition', label: 'Condition', badge: true },
  { key: 'operatingBudget', label: 'Operating Budget ($)' },
  { key: 'servingPopulation', label: 'Serving Population' },
  { key: 'status', label: 'Status', badge: true },
];

const PublicFacilities = () => {
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
      <Navbar currentPage="Public Facilities" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaHospital style={{ marginRight: '0.5rem', color: '#6d28d9' }} />Public Facilities</h1>
            <p>Track public facility inventory and conditions</p>
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
            onSave={handleSave} title={editItem ? 'Edit Public Facility' : 'New Public Facility'} />
        )}
      </div>
    </div>
  );
};

export default PublicFacilities;
