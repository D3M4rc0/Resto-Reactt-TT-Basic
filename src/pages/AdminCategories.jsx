import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import AdminForm from '../components/admin/AdminForm';
import '../styles/pages/_admin-dashboard.scss';

const AdminCategories = () => {
  const { user } = useAuth();
  const { 
    entities, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem, 
    refresh 
  } = useAdmin();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  // Verificar si es admin
  const isAdmin = user && user.rol === 'admin';

  // Si no es admin, mostrar acceso denegado
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <h2>⛔ Acceso Restringido</h2>
          <p>Esta área está reservada exclusivamente para administradores.</p>
          <button onClick={() => window.location.href = '/'} className="btn-primary">
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Configuración de columnas para la tabla
  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true,
      render: (value) => <span className="text-muted">#{value}</span>
    },
    { 
      key: 'nombre', 
      label: 'Nombre', 
      sortable: true,
      render: (value) => <strong>{value}</strong>
    },
    { 
      key: 'descripcion', 
      label: 'Descripción',
      render: (value) => value || <span className="text-muted">Sin descripción</span>
    },
    { 
      key: 'productos_count', 
      label: 'Productos',
      render: (value) => <span className="badge">{value || 0}</span>
    },
    { 
      key: 'activa', 
      label: 'Estado',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Activa' : 'Inactiva'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Creada',
      render: (value) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        return date.toLocaleDateString('es-ES');
      }
    }
  ];

  // Campos del formulario
  const formFields = [
    {
      name: 'nombre',
      label: 'Nombre de la Categoría',
      type: 'text',
      required: true,
      placeholder: 'Ej: Hamburguesas, Bebidas, Postres',
      validation: (value) => {
        if (!value || value.trim().length < 3) {
          return 'El nombre debe tener al menos 3 caracteres';
        }
        return null;
      }
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Descripción opcional de la categoría',
      rows: 3
    },
    {
      name: 'activa',
      label: 'Categoría Activa',
      type: 'checkbox',
      defaultValue: true
    },
    {
      name: 'icono',
      label: 'Ícono (emoji o URL)',
      type: 'text',
      placeholder: '🍔 o https://ejemplo.com/icono.png'
    },
    {
      name: 'color',
      label: 'Color de la Categoría',
      type: 'color',
      defaultValue: '#F97316'
    }
  ];

  // Filtrar y ordenar categorías
  const filteredCategories = (entities.categories || [])
    .filter(category => {
      if (!searchTerm) return true;
      return (
        category.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Manejar crear categoría
  const handleCreate = () => {
    setSelectedCategory(null);
    setModalType('create');
    setShowModal(true);
  };

  // Manejar editar categoría
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalType('edit');
    setShowModal(true);
  };

  // Manejar eliminar categoría
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?\nLos productos asociados NO se eliminarán.')) {
      return;
    }

    try {
      await deleteItem('category', id);
      refresh();
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      alert('Error al eliminar la categoría');
    }
  };

  // Manejar guardar categoría
  const handleSave = async (formData) => {
    try {
      if (modalType === 'edit' && selectedCategory) {
        await updateItem('category', selectedCategory.id, formData);
      } else {
        await createItem('category', formData);
      }
      setShowModal(false);
      refresh();
    } catch (error) {
      console.error('Error guardando categoría:', error);
      alert('Error al guardar la categoría');
    }
  };

  // Manejar ordenación
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calcular estadísticas
  const stats = {
    total: entities.categories?.length || 0,
    active: entities.categories?.filter(c => c.activa)?.length || 0,
    inactive: entities.categories?.filter(c => !c.activa)?.length || 0,
    withProducts: entities.categories?.filter(c => c.productos_count > 0)?.length || 0
  };

  return (
    <div className="admin-page">
      {/* Header de la página */}
      <div className="page-header">
        <div className="header-left">
          <h1>Gestión de Categorías</h1>
          <p className="page-subtitle">
            Administra las categorías de productos del restaurante
          </p>
        </div>
        <div className="header-right">
          <button 
            className="btn-create"
            onClick={handleCreate}
          >
            + Nueva Categoría
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="quick-stats">
        <div className="stat-card">
          <span className="stat-icon">📁</span>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Categorías Totales</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Activas</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏸️</span>
          <div className="stat-content">
            <h3>{stats.inactive}</h3>
            <p>Inactivas</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🍔</span>
          <div className="stat-content">
            <h3>{stats.withProducts}</h3>
            <p>Con Productos</p>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="search-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn-search">🔍</button>
        </div>
        
        <div className="filter-options">
          <select 
            className="filter-select"
            onChange={(e) => {
              if (e.target.value === 'all') setSearchTerm('');
              else setSearchTerm(e.target.value);
            }}
          >
            <option value="all">Todas las categorías</option>
            <option value="activa:true">Solo activas</option>
            <option value="activa:false">Solo inactivas</option>
          </select>
          
          <button 
            className="btn-refresh"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? '🔄 Actualizando...' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-alert">
          <span>⚠️ Error: {error}</span>
          <button onClick={refresh}>Reintentar</button>
        </div>
      )}

      {/* Tabla de categorías */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando categorías...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No hay categorías</h3>
          <p>Crea tu primera categoría para organizar los productos</p>
          <button className="btn-create" onClick={handleCreate}>
            + Crear Primera Categoría
          </button>
        </div>
      ) : (
        <AdminTable
          data={filteredCategories}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          sortConfig={sortConfig}
          onSort={handleSort}
          actions={true}
        />
      )}

      {/* Modal para crear/editar */}
      {showModal && (
        <AdminModal
          title={modalType === 'create' ? 'Crear Nueva Categoría' : 'Editar Categoría'}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={selectedCategory}
        >
          <AdminForm
            fields={formFields}
            initialData={selectedCategory}
            onSubmit={handleSave}
            submitText={modalType === 'create' ? 'Crear Categoría' : 'Actualizar Categoría'}
          />
        </AdminModal>
      )}

      {/* Pie de página informativo */}
      <div className="page-footer-info">
        <p>
          <strong>💡 Consejo:</strong> Las categorías inactivas no se mostrarán en el menú público.
          Puedes desactivar categorías temporalmente sin eliminar los productos.
        </p>
        <p>
          <strong>⚠️ Importante:</strong> No elimines categorías con productos asignados.
          Mejor desactívalas.
        </p>
      </div>
    </div>
  );
};

export default AdminCategories;