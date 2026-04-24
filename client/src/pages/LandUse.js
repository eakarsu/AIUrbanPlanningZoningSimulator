import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaMap, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/land-use';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'parcelNumber', label: 'Parcel #' },
  { key: 'category', label: 'Category' },
  { key: 'currentUse', label: 'Current Use' },
  { key: 'owner', label: 'Owner' },
  { key: 'area', label: 'Area' },
  { key: 'status', label: 'Status', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'parcelNumber', label: 'Parcel Number', type: 'text' },
  { key: 'category', label: 'Category', type: 'select', options: ['residential', 'commercial', 'industrial', 'agricultural', 'institutional'] },
  { key: 'currentUse', label: 'Current Use', type: 'text' },
  { key: 'owner', label: 'Owner', type: 'text' },
  { key: 'area', label: 'Area (sq ft)', type: 'number' },
  { key: 'zoneDistrict', label: 'Zone District', type: 'text' },
  { key: 'assessedValue', label: 'Assessed Value ($)', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'pending', 'inactive', 'under-review'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'parcelNumber', label: 'Parcel Number' },
  { key: 'category', label: 'Category' },
  { key: 'currentUse', label: 'Current Use' },
  { key: 'owner', label: 'Owner' },
  { key: 'area', label: 'Area (sq ft)' },
  { key: 'zoneDistrict', label: 'Zone District' },
  { key: 'assessedValue', label: 'Assessed Value ($)' },
  { key: 'status', label: 'Status', badge: true },
];

const LandUse = () => {
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
      <Navbar currentPage="Land Use Management" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaMap style={{ marginRight: '0.5rem', color: '#475569' }} />Land Use Management</h1>
            <p>Track and manage land parcels and usage records</p>
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
            onSave={handleSave} title={editItem ? 'Edit Land Use Record' : 'New Land Use Record'} />
        )}
      </div>
    </div>
  );
};

export default LandUse;
