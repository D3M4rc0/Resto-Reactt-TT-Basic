import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import '../styles/pages/_admin-dashboard.scss';
import '../styles/pages/_admin-products.scss';

const AdminProducts = () => {
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
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Verificar si es admin
  const isAdmin = user && user.rol === 'admin';

  // Si no es admin, mostrar acceso denegado
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <h2>⛔ Acceso Restringido</h2>
          <p>Esta área está reservada exclusivamente para administradores.</p>
        </div>
      </div>
    );
  }

  const products = entities.products || [];

  // Columnas para la tabla - SEPARADA IMAGEN
  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true,
	  width: '80px',
      render: (value) => <span className="product-id">#{value}</span>
    },
    { 
      key: 'imagen_url', 
      label: 'Imagen',
	  width: '80px',
      render: (value) => (
        <div className="product-image-cell">
          {value ? (
            <img 
              src={value} 
              alt="Producto" 
              className="product-table-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/50';
                e.target.onerror = null;
              }}
            />
          ) : (
            <div className="no-image-placeholder">🖼️</div>
          )}
        </div>
      )
    },
    { 
      key: 'nombre', 
      label: 'Nombre', 
      sortable: true,
	  width: '200px',
      render: (value) => <span className="product-name">{value}</span>
    },
    { 
      key: 'descripcion', 
      label: 'Descripción',
      render: (value) => (
        <div className="truncate-text" title={value}>
          {value && value.length > 50 ? `${value.substring(0, 50)}...` : value || 'Sin descripción'}
        </div>
      )
    },
    { 
      key: 'precio', 
      label: 'Precio', 
      sortable: true,
      render: (value) => <span className="price">${parseFloat(value).toFixed(2)}</span>
    },
    { 
      key: 'stock', 
      label: 'Stock', 
      sortable: true,
      render: (value) => (
        <span className={`stock-badge ${value > 10 ? 'in-stock' : value > 0 ? 'low-stock' : 'out-of-stock'}`}>
          {value || 0}
        </span>
      )
    },
    { 
      key: 'categoria', 
      label: 'Categoría', 
      sortable: true,
	  width: '120px',
      render: (value) => <span className="category-tag">{value || 'Sin categoría'}</span>
    },
    { 
      key: 'activo', 
      label: 'Estado',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ];

  // Campos del formulario
  const formFields = [
    {
      name: 'nombre',
      label: 'Nombre del Producto',
      type: 'text',
      required: true,
      placeholder: 'Ej: Hamburguesa Clásica'
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Describe el producto...'
    },
    {
      name: 'precio',
      label: 'Precio ($)',
      type: 'number',
      required: true,
      min: 0,
      step: 0.01
    },
    {
      name: 'stock',
      label: 'Stock disponible',
      type: 'number',
      min: 0
    },
    {
      name: 'categoria',
      label: 'Categoría',
      type: 'text',
      placeholder: 'Ej: Hamburguesas, Bebidas, Postres'
    },
    {
      name: 'imagen',
      label: 'URL de la Imagen',
      type: 'text',
      placeholder: 'https://ejemplo.com/imagen.jpg'
    },
    {
      name: 'activo',
      label: 'Producto activo',
      type: 'checkbox',
      defaultValue: true
    }
  ];

  // Filtrar productos por búsqueda (desde el header)
  const filteredProducts = products.filter(product =>
    Object.values(product).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleCreate = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?\nEsta acción no se puede deshacer.')) {
      try {
        await deleteItem('product', productId);
        refresh();
        alert('✅ Producto eliminado correctamente');
      } catch (err) {
        alert('❌ Error al eliminar el producto: ' + err.message);
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedProduct) {
        // Actualizar producto existente
        await updateItem('product', selectedProduct.id, formData);
        alert('✅ Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        await createItem('product', formData);
        alert('✅ Producto creado correctamente');
      }
      setShowModal(false);
      refresh();
    } catch (err) {
      alert('❌ Error al guardar el producto: ' + err.message);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para exportar productos a CSV
  const handleExportCSV = () => {
    const csvContent = [
      ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría', 'Estado'],
      ...filteredProducts.map(p => [
        p.id,
        `"${p.nombre}"`,
        `"${p.descripcion || ''}"`,
        p.precio,
        p.stock,
        p.categoria,
        p.activo ? 'Activo' : 'Inactivo'
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <main className="admin-main-content">
        <header className="admin-header">
          <div className="header-left">
            <h1>Gestión de Productos</h1>
            <p className="header-subtitle">
              Administra todos los productos de tu restaurante
            </p>
          </div>
          
          <div className="header-right">
            <div className="header-actions">
              <button 
                onClick={handleExportCSV} 
                className="btn-export"
                title="Exportar a CSV"
              >
                📊 Exportar
              </button>
              
              <div className="user-menu">
                <span className="user-greeting">Hola, {user?.nombre || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {/* SOLO UN search box aquí - ELIMINA el de AdminTable */}
          <div className="crud-header">
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-label">Total Productos</span>
                <span className="stat-value">{products.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Activos</span>
                <span className="stat-value active">
                  {products.filter(p => p.activo).length}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Sin Stock</span>
                <span className="stat-value warning">
                  {products.filter(p => !p.stock || p.stock <= 0).length}
                </span>
              </div>
            </div>
            
            <div className="crud-actions">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar productos por nombre, categoría..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input"
                />
                <button className="btn-search">🔍</button>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="btn-clear-search"
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <button 
                onClick={handleCreate} 
                className="btn-create"
              >
                <span>+</span> Nuevo Producto
              </button>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <span>⚠️ Error: {error}</span>
              <button onClick={refresh}>Reintentar</button>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <>
              <div className="product-table-container">
                <div className="table-scroll-container">
                  <AdminTable
                    data={paginatedProducts}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    searchable={false} // IMPORTANTE: FALSE para evitar duplicación
                    pagination={false} // La paginación la manejamos fuera
                  />
                </div>
              </div>
              
              {filteredProducts.length > 0 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} de {filteredProducts.length} productos
                    {searchTerm && ` (filtrados por: "${searchTerm}")`}
                  </div>
                  
                  <div className="pagination-controls">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      ← Anterior
                    </button>
                    
                    <div className="page-numbers">
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Mostrar solo páginas cercanas
                        if (
                          pageNumber === 1 || 
                          pageNumber === totalPages || 
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 || 
                          pageNumber === currentPage + 2
                        ) {
                          return <span key={pageNumber} className="page-dots">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Siguiente →
                    </button>
                    
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        const newItemsPerPage = Number(e.target.value);
                        // Mantener la posición relativa
                        const newStartIndex = Math.floor(startIndex / itemsPerPage * newItemsPerPage);
                        const newPage = Math.floor(newStartIndex / newItemsPerPage) + 1;
                        setCurrentPage(newPage);
                      }}
                      className="items-per-page"
                    >
                      <option value={5}>5 por página</option>
                      <option value={10}>10 por página</option>
                      <option value={25}>25 por página</option>
                      <option value={50}>50 por página</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}

          {showModal && (
            <AdminModal
              title={selectedProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              initialData={selectedProduct}
              fields={formFields}
              onSave={handleSave}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;