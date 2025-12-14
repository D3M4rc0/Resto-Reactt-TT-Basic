import React, { useState, useMemo } from 'react';

const AdminTable = ({
  data = [],
  columns = [],
  onEdit = null,
  onDelete = null,
  onView = null,
  searchable = false, // CAMBIADO: Por defecto FALSE para evitar duplicación
  pagination = false, // CAMBIADO: Por defecto FALSE (la hacemos en AdminProducts)
  itemsPerPage = 10,
  title = '',
  emptyMessage = 'No hay datos disponibles',
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrado de datos SOLO si searchable=true
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data;
    
    return data.filter(item =>
      columns.some(col => {
        const value = item[col.key];
        return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns, searchable]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginación SOLO si pagination=true
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, pagination]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderCell = (item, column) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }
    
    if (column.type === 'boolean') {
      return value ? '✅' : '❌';
    }
    
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('es-ES');
    }
    
    if (column.type === 'currency' && typeof value === 'number') {
      return `$${value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    return value || '-';
  };

  if (loading) {
    return (
      <div className="admin-table-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  const displayData = pagination ? paginatedData : sortedData;

  return (
    <div className="admin-table-container">
      {/* Header de la tabla SOLO si searchable=true */}
      {searchable && (
        <div className="table-header">
          {title && <h3 className="table-title">{title}</h3>}
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar en esta tabla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`${column.sortable ? 'sortable' : ''} ${
                    sortConfig.key === column.key ? `sorted-${sortConfig.direction}` : ''
                  }`}
                  style={{ width: column.width }}
                >
                  <div className="th-content">
                    {column.label}
                    {column.sortable && (
                      <span className="sort-indicator">
                        {sortConfig.key === column.key 
                          ? (sortConfig.direction === 'asc' ? '↑' : '↓')
                          : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              
              <th className="actions-column">Acciones</th>
            </tr>
          </thead>
          
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={column.className || ''}>
                      <div className="cell-content">
                        {renderCell(item, column)}
                      </div>
                    </td>
                  ))}
                  
                  <td className="actions-cell">
                    <div className="action-buttons">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="action-btn view-btn"
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                      )}
                      
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="action-btn edit-btn"
                          title="Editar"
                        >
                          ✏️
                        </button>
                      )}
                      
                      {onDelete && (
                        <button
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de eliminar este registro?')) {
                              onDelete(item.id);
                            }
                          }}
                          className="action-btn delete-btn"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1}>
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p className="empty-message">{emptyMessage}</p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="clear-search-btn"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;