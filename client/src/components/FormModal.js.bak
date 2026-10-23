import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const FormModal = ({ fields, item, onSave, onClose, title }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      const initial = {};
      fields.forEach((f) => {
        initial[f.key] = f.defaultValue || '';
      });
      setFormData(initial);
    }
  }, [item, fields]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((f) => {
      if (f.required !== false && !formData[f.key] && formData[f.key] !== 0) {
        newErrors[f.key] = `${f.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title || (item ? 'Edit Item' : 'Add New Item')}</h2>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {fields.map((field) => (
                <div key={field.key} className={`form-group ${field.fullWidth ? 'full-width' : ''}`}>
                  <label className="form-label">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className={`form-select ${errors[field.key] ? 'error' : ''}`}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                    >
                      <option value="">Select {field.label}</option>
                      {(field.options || []).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || 'text'}
                      className={`form-input ${errors[field.key] ? 'error' : ''}`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleChange(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                    />
                  )}
                  {errors[field.key] && <span className="form-error">{errors[field.key]}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary"><FaSave /> Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
