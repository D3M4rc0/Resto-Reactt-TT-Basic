import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import '../styles/pages/_admin-dashboard.scss';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    entities, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem,
    loadEntity,
    refresh 
  } = useAdmin();

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Verificar si es admin
  const isAdmin = user && user.rol === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadEntity('users');
    }
  }, [isAdmin, loadEntity]);

  // Si no es admin, redirigir
  if (!isAdmin) {
    navigate('/admin');
    return null;
  }

  const users = entities.users || [];

  // Configuración de columnas para la tabla
  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      sortable: true,
      width: '80px'
    },
    { 
      key: 'nombre', 
      label: 'Nombre', 
      sortable: true,
      render: (value, row) => (
        <div className="user-cell">
          <div className="user-avatar-small">
            {row.nombre?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <strong>{row.nombre} {row.apellido}</strong>
            <small>{row.email}</small>
          </div>
        </div>
      )
    },
    { 
      key: 'email', 
      label: 'Email', 
      sortable: true 
    },
    { 
      key: 'rol', 
      label: 'Rol', 
      sortable: true,
      render: (value) => (
        <span className={`role-badge ${value}`}>
          {value || 'usuario'}
        </span>
      )
    },
    { 
      key: 'telefono', 
      label: 'Teléfono' 
    },
    { 
      key: 'activo', 
      label: 'Estado',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    { 
      key: 'fecha_registro', 
      label: 'Registro',
      render: (value) => {
        if (!value) return 'N/A';
        return new Date(value).toLocaleDateString('es-ES');
      }
    }
  ];

  // Campos del formulario
  const formFields = [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el nombre'
    },
    {
      name: 'apellido',
      label: 'Apellido',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el apellido'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'usuario@ejemplo.com'
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      required: !selectedUser, // Solo requerida para nuevos usuarios
      placeholder: selectedUser ? 'Dejar en blanco para no cambiar' : 'Ingrese contraseña'
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'tel',
      placeholder: '+1234567890'
    },
    {
      name: 'direccion',
      label: 'Dirección',
      type: 'text',
      placeholder: 'Dirección completa'
    },
    {
      name: 'ciudad',
      label: 'Ciudad',
      type: 'text',
      placeholder: 'Ciudad'
    },
    {
      name: 'pais',
      label: 'País',
      type: 'text',
      placeholder: 'País'
    },
    {
      name: 'rol',
      label: 'Rol',
      type: 'select',
      options: [
        { value: 'admin', label: 'Administrador' },
        { value: 'usuario', label: 'Usuario' },
        { value: 'empleado', label: 'Empleado' }
      ],
      defaultValue: 'usuario'
    },
    {
      name: 'activo',
      label: 'Usuario Activo',
      type: 'checkbox',
      defaultValue: true
    }
  ];

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.nombre?.toLowerCase().includes(searchLower) ||
      user.apellido?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.telefono?.includes(searchTerm) ||
      user.rol?.toLowerCase().includes(searchLower)
    );
  });

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Manejar acciones
  const handleCreate = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await deleteItem('user', id);
        refresh();
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        // Actualizar usuario existente
        // Si no se proporcionó contraseña, no la enviamos
        if (!formData.password) {
          delete formData.password;
        }
        await updateItem('user', selectedUser.id, formData);
      } else {
        // Crear nuevo usuario
        await createItem('user', formData);
      }
      setShowModal(false);
      setSelectedUser(null);
      refresh();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert('Error al guardar usuario');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a primera página al buscar
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <main className="admin-main-content">
        <header className="admin-header">
          <div className="header-left">
            <h1>Gestión de Usuarios</h1>
            <p className="header-subtitle">
              Administra todos los usuarios del sistema ({users.length} registros)
            </p>
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
              
              <div className="user-menu">
                <span className="user-greeting">Hola, {user?.nombre || 'Admin'}</span>
                <div className="user-avatar-small">
                  {user?.nombre?.charAt(0)?.toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <div className="crud-container">
            {/* Barra de herramientas */}
            <div className="crud-toolbar">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
                <button className="btn-search">🔍</button>
              </div>
              
              <div className="toolbar-actions">
                <button 
                  className="btn-export"
                  title="Exportar a Excel"
                >
                  📊 Exportar
                </button>
                
                <button 
                  className="btn-create"
                  onClick={handleCreate}
                >
                  👤 + Nuevo Usuario
                </button>
              </div>
            </div>

            {/* Mensajes de error/éxito */}
            {error && (
              <div className="error-alert">
                <span>⚠️ Error: {error}</span>
                <button onClick={refresh}>Reintentar</button>
              </div>
            )}

            {/* Tabla de usuarios */}
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando usuarios...</p>
              </div>
            ) : (
              <>
                <AdminTable
                  data={paginatedUsers}
                  columns={columns}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  emptyMessage="No hay usuarios registrados"
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
                    
                    <div className="pagination-info">
                      Página {currentPage} de {totalPages}
                      <span className="pagination-count">
                        ({filteredUsers.length} usuarios)
                      </span>
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
        </div>

        {/* Modal para crear/editar */}
        {showModal && (
          <AdminModal
            title={selectedUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            initialData={selectedUser}
            fields={formFields}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setSelectedUser(null);
            }}
            submitText={selectedUser ? 'Actualizar Usuario' : 'Crear Usuario'}
            cancelText="Cancelar"
          />
        )}

        <footer className="admin-footer">
          <div className="footer-info">
            <span>Sistema E-commerce</span>
            <span>•</span>
            <span>{users.length} usuarios</span>
            <span>•</span>
            <span>{users.filter(u => u.rol === 'admin').length} administradores</span>
            <span>•</span>
            <span>{users.filter(u => u.activo).length} activos</span>
          </div>
          <div className="footer-status">
            <div className="status-dot online"></div>
            <span>Sistema operativo</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminUsers;