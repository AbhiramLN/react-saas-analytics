import React, { useState, useMemo } from 'react';
import './DataTable.css';

const DataTable = ({ data, columns, searchable = false, filterable = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredData = useMemo(() => {
    let filtered = data || [];

    if (searchable && searchTerm) {
      filtered = filtered.filter(item => 
        columns.some(column => 
          item[column] && 
          item[column].toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterable && filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    return filtered;
  }, [data, searchTerm, filterStatus]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  return (
    <div className="data-table-container">
      {searchable && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      )}

      {filterable && (
        <div className="filter-container">
          <select value={filterStatus} onChange={handleFilter} className="filter-select">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column} className="table-header">
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="table-row">
                {columns.map(column => (
                  <td key={column} className="table-cell">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="pagination-button" disabled>
          Previous
        </button>
        <span className="pagination-info">
          Page 1 of {Math.ceil(filteredData.length / 10)}
        </span>
        <button className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default DataTable;
