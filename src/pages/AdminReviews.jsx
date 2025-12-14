import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';

const AdminReviews = () => {
  const { user } = useAuth();
  const { entities, loading, error, deleteItem, refresh } = useAdmin();
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const reviews = entities.reviews || [];

  const isAdmin = user && user.rol === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/';
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true,
      render: (value) => `#${value}`
    },
    { 
      key: 'usuario', 
      label: 'Usuario',
      render: (value) => value?.nombre || 'Anónimo'
    },
    { 
      key: 'producto', 
      label: 'Producto',
      render: (value) => value?.nombre || 'Producto eliminado'
    },
    { 
      key: 'calificacion', 
      label: 'Calificación', 
      sortable: true,
      render: (value) => (
        <div className="rating-stars">
          {'★'.repeat(value)}
          {'☆'.repeat(5 - value)}
          <span className="rating-number">({value}/5)</span>
        </div>
      )
    },
    { 
      key: 'comentario', 
      label: 'Comentario',
      render: (value) => (
        <div className="comment-preview">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </div>
      )
    },
    { 
      key: 'fecha', 
      label: 'Fecha', 
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('es-ES')
    },
    { 
      key: 'estado', 
      label: 'Estado',
      render: (value) => (
        <span className={`status-badge ${value}`}>
          {value === 'aprobado' ? '✅ Aprobado' : 
           value === 'pendiente' ? '⏳ Pendiente' : 
           '❌ Rechazado'}
        </span>
      )
    }
  ];

  const formFields = [
    { 
      name: 'estado', 
      label: 'Estado', 
      type: 'select',
      options: [
        { value: 'aprobado', label: '✅ Aprobado' },
        { value: 'pendiente', label: '⏳ Pendiente' },
        { value: 'rechazado', label: '❌ Rechazado' }
      ],
      required: true
    },
    { 
      name: 'calificacion', 
      label: 'Calificación', 
      type: 'number',
      min: 1,
      max: 5,
      required: true
    },
    { 
      name: 'comentario', 
      label: 'Comentario', 
      type: 'textarea',
      rows: 4
    }
  ];

  const handleView = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reseña?')) {
      await deleteItem('review', id);
      refresh();
    }
  };

  const handleSave = async (formData) => {
    try {
      // Aquí iría la llamada a la API para actualizar
      console.log('Actualizando reseña:', selectedReview?.id, formData);
      setShowModal(false);
      refresh();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.comentario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || review.estado === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.estado === 'aprobado').length,
    pending: reviews.filter(r => r.estado === 'pendiente').length,
    rejected: reviews.filter(r => r.estado === 'rechazado').length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + (r.calificacion || 0), 0) / reviews.length).toFixed(1)
      : 0
  };

  return (
    <div className="admin-reviews">
      <div className="admin-header">
        <h1>Gestión de Reseñas</h1>
        <div className="header-actions">
          <button 
            className="btn-refresh"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? '🔄 Actualizando...' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <span>⚠️ Error: {error}</span>
          <button onClick={refresh}>Reintentar</button>
        </div>
      )}

      {/* Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Total Reseñas</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Aprobadas</h3>
            <p className="stat-value">{stats.approved}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pendientes</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Promedio</h3>
            <p className="stat-value">{stats.averageRating}/5</p>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar reseñas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn-search">🔍</button>
        </div>
        
        <div className="filter-options">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los estados</option>
            <option value="aprobado">✅ Aprobadas</option>
            <option value="pendiente">⏳ Pendientes</option>
            <option value="rechazado">❌ Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Tabla de reseñas */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando reseñas...</p>
        </div>
      ) : (
        <AdminTable
          data={filteredReviews}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />
      )}

      {/* Modal para ver/editar */}
      {showModal && selectedReview && (
        <AdminModal
          title={`Reseña #${selectedReview.id}`}
          subtitle={`Producto: ${selectedReview.producto?.nombre || 'N/A'}`}
          initialData={selectedReview}
          fields={formFields}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setSelectedReview(null);
          }}
          readOnly={false}
        />
      )}

      {/* Estilos específicos - VERSION CORREGIDA */}
      <style>{`
        .admin-reviews {
          padding: 2rem;
          background: #f5f5f5;
          min-height: 100vh;
        }
        
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .admin-header h1 {
          color: #333;
          font-size: 1.8rem;
          margin: 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid #e0e0e0;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          border-color: #f97316;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .stat-icon {
          font-size: 2rem;
          background: #fed7aa;
          color: #f97316;
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-content h3 {
          color: #666;
          font-size: 0.9rem;
          margin: 0 0 0.5rem 0;
          font-weight: 500;
        }
        
        .stat-value {
          color: #333;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }
        
        .filters-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .search-box {
          display: flex;
          flex: 1;
          max-width: 400px;
        }
        
        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px 0 0 8px;
          background: white;
          color: #333;
          font-size: 0.9rem;
          outline: none;
        }
        
        .search-input:focus {
          border-color: #f97316;
        }
        
        .btn-search {
          background: #f97316;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-search:hover {
          background: #ea580c;
        }
        
        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          color: #333;
          font-size: 0.9rem;
          cursor: pointer;
          outline: none;
        }
        
        .filter-select:focus {
          border-color: #f97316;
        }
        
        .rating-stars {
          color: #fbbf24;
          font-size: 1.1rem;
          letter-spacing: 2px;
        }
        
        .rating-number {
          color: #666;
          font-size: 0.8rem;
          margin-left: 0.5rem;
        }
        
        .comment-preview {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-badge.aprobado {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .status-badge.pendiente {
          background: #fef9c3;
          color: #ca8a04;
        }
        
        .status-badge.rechazado {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .btn-refresh {
          background: #f97316;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-refresh:hover:not(:disabled) {
          background: #ea580c;
          transform: translateY(-1px);
        }
        
        .btn-refresh:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .error-alert {
          background: #fee2e2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #dc2626;
        }
        
        .error-alert button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: #666;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #e0e0e0;
          border-top-color: #f97316;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .admin-reviews {
            padding: 1rem;
          }
          
          .admin-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box {
            max-width: 100%;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminReviews;