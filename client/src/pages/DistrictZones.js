import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCity, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/district-zones';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'category', label: 'Category' },
  { key: 'maxHeight', label: 'Max Height' },
  { key: 'maxDensity', label: 'Max Density' },
  { key: 'minLotSize', label: 'Min Lot Size' },
  { key: 'status', label: 'Status', badge: true },
];

const formFields = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'code', label: 'Code', type: 'text' },
  { key: 'category', label: 'Category', type: 'select', options: ['R1', 'R2', 'R3', 'C1', 'C2', 'I1', 'I2', 'MU', 'AG'] },
  { key: 'maxHeight', label: 'Max Height (ft)', type: 'number' },
  { key: 'maxDensity', label: 'Max Density (units/acre)', type: 'number' },
  { key: 'minLotSize', label: 'Min Lot Size (sq ft)', type: 'number' },
  { key: 'allowedUses', label: 'Allowed Uses', type: 'text', fullWidth: true },
  { key: 'restrictions', label: 'Restrictions', type: 'text', fullWidth: true },
  { key: 'status', label: 'Status', type: 'select', options: ['active', 'pending', 'inactive', 'under-review'] },
];

const detailFields = [
  { key: 'name', label: 'Name' },
  { key: 'code', label: 'Code' },
  { key: 'category', label: 'Category' },
  { key: 'maxHeight', label: 'Max Height (ft)' },
  { key: 'maxDensity', label: 'Max Density (units/acre)' },
  { key: 'minLotSize', label: 'Min Lot Size (sq ft)' },
  { key: 'allowedUses', label: 'Allowed Uses', fullWidth: true },
  { key: 'restrictions', label: 'Restrictions', fullWidth: true },
  { key: 'status', label: 'Status', badge: true },
];

const DistrictZones = () => {
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
      <Navbar currentPage="District Zones" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaCity style={{ marginRight: '0.5rem', color: '#334155' }} />District Zones</h1>
            <p>Define and manage zoning district configurations</p>
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
            onSave={handleSave} title={editItem ? 'Edit District Zone' : 'New District Zone'} />
        )}
      </div>
    </div>
  );
};

export default DistrictZones;
