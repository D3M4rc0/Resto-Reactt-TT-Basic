import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdmin } from '../hooks/useAdmin';
import AdminSidebar from '../components/admin/AdminSidebar';
import '../styles/pages/_admin-dashboard.scss';

const AdminOrders = () => {
  const { user } = useAuth();
  const { entities, loading, error, updateItem, refresh } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Verificar si es admin
  const isAdmin = user && user.rol === 'admin';

  // Cargar órdenes
  useEffect(() => {
    if (entities.orders && entities.orders.length > 0) {
      setOrders(entities.orders);
      setFilteredOrders(entities.orders);
    }
  }, [entities.orders]);

  // Filtrar órdenes
  useEffect(() => {
    let filtered = orders;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().includes(searchTerm) ||
        (order.usuario_nombre && order.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.usuario_email && order.usuario_email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.estado === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // Estados disponibles
  const statusOptions = [
    { value: 'pendiente', label: '⏳ Pendiente', color: 'yellow' },
    { value: 'confirmado', label: '✅ Confirmado', color: 'green' },
    { value: 'preparando', label: '👨‍🍳 Preparando', color: 'blue' },
    { value: 'en_camino', label: '🚚 En Camino', color: 'orange' },
    { value: 'entregado', label: '📦 Entregado', color: 'purple' },
    { value: 'cancelado', label: '❌ Cancelado', color: 'red' }
  ];

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price || 0);
  };

  // Cambiar estado de la orden
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateItem('order', orderId, { estado: newStatus });
      refresh();
    } catch (err) {
      console.error('Error actualizando estado:', err);
    }
  };

  // Ver detalles de la orden
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Si no es admin
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

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <main className="admin-main-content">
        <header className="admin-header">
          <div className="header-left">
            <h1>📦 Gestión de Pedidos</h1>
            <p className="header-subtitle">Administra y monitorea todos los pedidos del sistema</p>
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

        {/* Filtros y búsqueda */}
        <div className="admin-filters">
          <div className="filter-group">
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Buscar por ID, nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">📋 Todos los estados</option>
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              
              <div className="stats-summary">
                <span className="stat-item">
                  Total: <strong>{orders.length}</strong>
                </span>
                <span className="stat-item">
                  Filtrados: <strong>{filteredOrders.length}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="admin-content">
          {error && (
            <div className="error-alert">
              <span>⚠️ Error: {error}</span>
              <button onClick={refresh}>Reintentar</button>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando pedidos...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="no-data-message">
              <p>📭 No se encontraron pedidos</p>
            </div>
          ) : (
            <div className="orders-table-container">
              <table className="admin-table orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Método Pago</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="order-row">
                      <td className="order-id">#{order.id}</td>
                      <td className="order-customer">
                        <div className="customer-info">
                          <strong>{order.usuario_nombre || 'Cliente'}</strong>
                          <small>{order.usuario_email || 'No email'}</small>
                        </div>
                      </td>
                      <td className="order-date">
                        {formatDate(order.fecha_creacion || order.created_at)}
                      </td>
                      <td className="order-total">
                        <strong>{formatPrice(order.total)}</strong>
                      </td>
                      <td className="order-status">
                        <div className="status-control">
                          <select
                            value={order.estado || 'pendiente'}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`status-select status-${order.estado || 'pendiente'}`}
                          >
                            {statusOptions.map(status => (
                              <option 
                                key={status.value} 
                                value={status.value}
                                className={`status-option status-${status.value}`}
                              >
                                {status.label}
                              </option>
                            ))}
                          </select>
                          <span className={`status-badge status-${order.estado || 'pendiente'}`}>
                            {order.estado || 'pendiente'}
                          </span>
                        </div>
                      </td>
                      <td className="order-payment">
                        {order.metodo_pago || 'No especificado'}
                      </td>
                      <td className="order-actions">
                        <button 
                          className="btn-action view-btn"
                          onClick={() => handleViewDetails(order)}
                          title="Ver detalles"
                        >
                          👁️
                        </button>
                        <button 
                          className="btn-action print-btn"
                          onClick={() => window.print()}
                          title="Imprimir"
                        >
                          🖨️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Resumen de estados */}
          <div className="status-summary">
            <h3>📊 Resumen por Estado</h3>
            <div className="status-cards">
              {statusOptions.map(status => {
                const count = orders.filter(o => o.estado === status.value).length;
                const percentage = orders.length > 0 ? (count / orders.length * 100).toFixed(1) : 0;
                
                return (
                  <div key={status.value} className={`status-card status-${status.value}`}>
                    <div className="status-header">
                      <span className="status-icon">{status.label.split(' ')[0]}</span>
                      <span className="status-count">{count}</span>
                    </div>
                    <div className="status-info">
                      <span className="status-label">{status.label.split(' ').slice(1).join(' ')}</span>
                      <div className="status-progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="status-percentage">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="admin-footer">
          <div className="footer-info">
            <span>📦 Sistema de Pedidos</span>
            <span>•</span>
            <span>{orders.length} pedidos totales</span>
            <span>•</span>
            <span>Actualizado: {new Date().toLocaleTimeString('es-ES')}</span>
          </div>
        </footer>
      </main>

      {/* Modal de detalles */}
      {showDetails && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 Detalles del Pedido #{selectedOrder.id}</h3>
              <button className="modal-close" onClick={() => setShowDetails(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="order-details-grid">
                <div className="detail-section">
                  <h4>👤 Información del Cliente</h4>
                  <p><strong>Nombre:</strong> {selectedOrder.usuario_nombre || 'No especificado'}</p>
                  <p><strong>Email:</strong> {selectedOrder.usuario_email || 'No especificado'}</p>
                  <p><strong>Teléfono:</strong> {selectedOrder.usuario_telefono || 'No especificado'}</p>
                </div>
                
                <div className="detail-section">
                  <h4>📦 Información del Pedido</h4>
                  <p><strong>Fecha:</strong> {formatDate(selectedOrder.fecha_creacion)}</p>
                  <p><strong>Estado:</strong> 
                    <span className={`status-badge status-${selectedOrder.estado}`}>
                      {selectedOrder.estado}
                    </span>
                  </p>
                  <p><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
                  <p><strong>Método de pago:</strong> {selectedOrder.metodo_pago || 'No especificado'}</p>
                </div>
                
                <div className="detail-section">
                  <h4>📍 Dirección de Entrega</h4>
                  <p>{selectedOrder.direccion_entrega || 'No especificada'}</p>
                </div>
              </div>
              
              {/* Aquí irían los items del pedido si tu API los incluye */}
              <div className="order-items-section">
                <h4>🛒 Items del Pedido</h4>
                <p className="no-items-message">
                  Los detalles de los items no están disponibles en esta vista.
                  Para ver los productos específicos, revisa la API de pedidos.
                </p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetails(false)}>
                Cerrar
              </button>
              <button className="btn-primary">
                🖨️ Imprimir Comprobante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;