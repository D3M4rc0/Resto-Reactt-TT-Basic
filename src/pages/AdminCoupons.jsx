import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import '../styles/pages/_admin-dashboard.scss';

const AdminCoupons = () => {
  const { user } = useAuth();
  const { entities, loading, error, createItem, updateItem, deleteItem, refresh } = useAdmin();
  
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const isAdmin = user && user.rol === 'admin';

  // Si no es admin, mostrar acceso denegado
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <h2>⛔ Acceso Restringido</h2>
          <p>Esta área está reservada exclusivamente para administradores.</p>
          <p>Tu rol actual: <strong>{user?.rol || 'usuario'}</strong></p>
        </div>
      </div>
    );
  }

  const coupons = entities.coupons || [];

  // Filtrar cupones por búsqueda
  const filteredCoupons = coupons.filter(coupon =>
    coupon.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

  // Columnas de la tabla
  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'codigo', label: 'Código', sortable: true },
    { key: 'descripcion', label: 'Descripción' },
    { 
      key: 'descuento', 
      label: 'Descuento', 
      sortable: true,
      render: (value) => `${value}%`
    },
    { 
      key: 'fecha_expiracion', 
      label: 'Expira', 
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString('es-ES') : 'Sin expiración'
    },
    { 
      key: 'activo', 
      label: 'Estado', 
      sortable: true,
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    { 
      key: 'usos', 
      label: 'Usos', 
      sortable: true,
      render: (value, item) => `${item.usos_actual || 0}/${item.usos_maximo || '∞'}`
    }
  ];

  // Campos del formulario
  const formFields = [
    { name: 'codigo', label: 'Código del Cupón', type: 'text', required: true, placeholder: 'EJEMPLO20' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', placeholder: 'Descuento especial para clientes' },
    { 
      name: 'descuento', 
      label: 'Porcentaje de Descuento', 
      type: 'number', 
      required: true, 
      min: 1, 
      max: 100,
      placeholder: '20'
    },
    { 
      name: 'tipo_descuento', 
      label: 'Tipo de Descuento', 
      type: 'select',
      options: [
        { value: 'porcentaje', label: 'Porcentaje (%)' },
        { value: 'monto_fijo', label: 'Monto Fijo ($)' }
      ]
    },
    { 
      name: 'fecha_expiracion', 
      label: 'Fecha de Expiración', 
      type: 'date',
      placeholder: 'Selecciona fecha'
    },
    { 
      name: 'usos_maximo', 
      label: 'Límite de Usos', 
      type: 'number', 
      min: 1,
      placeholder: 'Dejar en blanco para ilimitado'
    },
    { 
      name: 'monto_minimo', 
      label: 'Monto Mínimo de Compra', 
      type: 'number', 
      min: 0,
      placeholder: '0 (sin mínimo)'
    },
    { 
      name: 'activo', 
      label: 'Cupón Activo', 
      type: 'checkbox',
      defaultValue: true
    }
  ];

  const handleCreate = () => {
    setEditingCoupon(null);
    setShowModal(true);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cupón?')) {
      try {
        await deleteItem('coupon', id);
        refresh();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingCoupon) {
        // Actualizar cupón existente
        await updateItem('coupon', editingCoupon.id, formData);
      } else {
        // Crear nuevo cupón
        await createItem('coupon', formData);
      }
      setShowModal(false);
      refresh();
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <main className="admin-main-content">
        <header className="admin-header">
          <div className="header-left">
            <h1>Gestión de Cupones</h1>
            <p className="header-subtitle">Crea y administra cupones de descuento</p>
          </div>
          
          <div className="header-right">
            <div className="header-actions">
              <button 
                className="btn-refresh"
                onClick={refresh}
                disabled={loading}
              >
                {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
              </button>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {error && (
            <div className="error-alert">
              <span>⚠️ Error: {error}</span>
              <button onClick={refresh}>Reintentar</button>
            </div>
          )}

          <div className="crud-header">
            <div className="crud-actions">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar por código o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button className="btn-search">🔍</button>
              </div>
              
              <button 
                onClick={handleCreate} 
                className="btn-create"
                disabled={loading}
              >
                + Nuevo Cupón
              </button>
            </div>
            
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-label">Total Cupones:</span>
                <span className="stat-value">{coupons.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Activos:</span>
                <span className="stat-value">
                  {coupons.filter(c => c.activo).length}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Expirados:</span>
                <span className="stat-value">
                  {coupons.filter(c => c.fecha_expiracion && new Date(c.fecha_expiracion) < new Date()).length}
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando cupones...</p>
            </div>
          ) : (
            <>
              <AdminTable
                data={currentCoupons}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                emptyMessage="No hay cupones registrados"
              />

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    ← Anterior
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal para crear/editar cupón */}
        {showModal && (
          <AdminModal
            title={editingCoupon ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
            initialData={editingCoupon}
            fields={formFields}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
            submitText={editingCoupon ? 'Actualizar Cupón' : 'Crear Cupón'}
          />
        )}

        <footer className="admin-footer">
          <div className="footer-info">
            <span>Sistema E-commerce</span>
            <span>•</span>
            <span>{coupons.length} cupones</span>
            <span>•</span>
            <span>Página {currentPage} de {totalPages}</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminCoupons;