import React from 'react';
import { FaTimes, FaEdit, FaTrash, FaRobot } from 'react-icons/fa';
import AIOutput from './AIOutput';

const DetailModal = ({ item, fields, onClose, onEdit, onDelete, aiAnalysis, aiLoading, onRunAI, isAIFeature }) => {
  if (!item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item.name || item.permitNumber || 'Item Details'}</h2>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            {fields.map((field) => (
              <div key={field.key} className={`detail-field ${field.fullWidth ? 'full-width' : ''}`}>
                <span className="detail-label">{field.label}</span>
                <span className="detail-value">
                  {field.badge ? (
                    <span className={`badge badge-${String(item[field.key] || '').toLowerCase().replace(/[\s_]+/g, '-')}`}>
                      {item[field.key] || '-'}
                    </span>
                  ) : (
                    item[field.key] !== undefined && item[field.key] !== null ? String(item[field.key]) : '-'
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="detail-actions">
            <button className="btn btn-primary" onClick={() => onEdit(item)}>
              <FaEdit /> Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete(item)}>
              <FaTrash /> Delete
            </button>
            {isAIFeature && (
              <button className="btn btn-ai" onClick={() => onRunAI(item)} disabled={aiLoading}>
                <FaRobot /> {aiLoading ? 'Analyzing...' : 'Run AI Analysis'}
              </button>
            )}
          </div>

          {isAIFeature && (aiAnalysis || aiLoading) && (
            <div className="detail-ai-section">
              <h3><FaRobot /> AI Analysis Results</h3>
              <AIOutput analysis={aiAnalysis} loading={aiLoading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
