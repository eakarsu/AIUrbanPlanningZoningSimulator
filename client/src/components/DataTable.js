import React, { useState, useMemo } from 'react';
import { FaSortUp, FaSortDown, FaSort, FaEdit, FaTrash, FaSearch, FaInbox } from 'react-icons/fa';

const DataTable = ({ columns, data, onRowClick, onDelete, onEdit }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredData = useMemo(() => {
    let result = data || [];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = row[col.key];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
        })
      );
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, sortKey, sortDir, columns]);

  const renderSortIcon = (key) => {
    if (sortKey !== key) return <FaSort className="sort-icon" />;
    return sortDir === 'asc' ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />;
  };

  const renderCellValue = (col, value) => {
    if (value === undefined || value === null) return '-';
    if (col.render) return col.render(value);
    if (col.badge) {
      const cls = `badge badge-${String(value).toLowerCase().replace(/[\s_]+/g, '-')}`;
      return <span className={cls}>{String(value)}</span>;
    }
    return String(value);
  };

  return (
    <div className="data-table-container">
      <div className="data-table-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaSearch style={{ color: 'var(--slate-400)' }} />
          <input
            type="text"
            className="data-table-search"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>
          {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
        </div>
      </div>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={sortKey === col.key ? 'sorted' : ''}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} {renderSortIcon(col.key)}
                </th>
              ))}
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="data-table-empty">
                    <div className="data-table-empty-icon"><FaInbox /></div>
                    <div>No records found</div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id} onClick={() => onRowClick && onRowClick(row)}>
                  {columns.map((col) => (
                    <td key={col.key}>{renderCellValue(col, row[col.key])}</td>
                  ))}
                  <td>
                    <div className="data-table-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="btn btn-sm btn-secondary" onClick={() => onEdit && onEdit(row)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => onDelete && onDelete(row)} title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
