import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaFileAlt, FaPlus } from 'react-icons/fa';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import DataTable from '../components/DataTable';
import DetailModal from '../components/DetailModal';
import FormModal from '../components/FormModal';

const ENDPOINT = '/building-permits';

const columns = [
  { key: 'permitNumber', label: 'Permit #' },
  { key: 'applicant', label: 'Applicant' },
  { key: 'projectAddress', label: 'Address' },
  { key: 'permitType', label: 'Type' },
  { key: 'estimatedCost', label: 'Est. Cost' },
  { key: 'sqFootage', label: 'Sq Ft' },
  { key: 'status', label: 'Status', badge: true },
];

const formFields = [
  { key: 'permitNumber', label: 'Permit Number', type: 'text' },
  { key: 'applicant', label: 'Applicant', type: 'text' },
  { key: 'projectAddress', label: 'Project Address', type: 'text' },
  { key: 'permitType', label: 'Permit Type', type: 'select', options: ['new-construction', 'renovation', 'demolition', 'change-of-use'] },
  { key: 'description', label: 'Description', type: 'text', fullWidth: true },
  { key: 'estimatedCost', label: 'Estimated Cost ($)', type: 'number' },
  { key: 'sqFootage', label: 'Square Footage', type: 'number' },
  { key: 'stories', label: 'Stories', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected', 'under-review', 'completed'] },
];

const detailFields = [
  { key: 'permitNumber', label: 'Permit Number' },
  { key: 'applicant', label: 'Applicant' },
  { key: 'projectAddress', label: 'Project Address' },
  { key: 'permitType', label: 'Permit Type' },
  { key: 'description', label: 'Description', fullWidth: true },
  { key: 'estimatedCost', label: 'Estimated Cost ($)' },
  { key: 'sqFootage', label: 'Square Footage' },
  { key: 'stories', label: 'Stories' },
  { key: 'status', label: 'Status', badge: true },
];

const BuildingPermits = () => {
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
    if (!window.confirm(`Are you sure you want to delete "${item.permitNumber || item.name}"?`)) return;
    try {
      await api.delete(`${ENDPOINT}/${item.id}`);
      toast.success('Deleted successfully'); setSelectedItem(null); fetchData();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="page">
      <Navbar currentPage="Building Permits" />
      <div className="page-content">
        <div className="page-header">
          <div className="page-header-left">
            <h1><FaFileAlt style={{ marginRight: '0.5rem', color: '#64748b' }} />Building Permits</h1>
            <p>Process and manage building permit applications</p>
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
            onSave={handleSave} title={editItem ? 'Edit Building Permit' : 'New Building Permit'} />
        )}
      </div>
    </div>
  );
};

export default BuildingPermits;
