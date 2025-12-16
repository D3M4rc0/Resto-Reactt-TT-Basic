import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardCard, { GrowthCard, KpiCard, ComparisonCard } from '../components/admin/DashboardCard';
import '../styles/pages/_admin-dashboard.scss';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    loading, 
    error, 
    stats, 
    entities, 
    refresh
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');

  ///// Verificar si es admin
  const isAdmin = user && user.rol === 'admin';

  ///// Si no es admin, mostrar acceso denegado
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <h2>⛔ Acceso Restringido</h2>
          <p>Esta área está reservada exclusivamente para administradores.</p>
          <p>Tu rol actual: <strong>{user?.rol || 'usuario'}</strong></p>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  ///// Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  ///// Renderizar contenido según la pestaña activa
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Grid de Estadísticas Principales */}
            <div className="stats-grid">
              <DashboardCard
                title="Usuarios Totales"
                value={stats?.totals?.users || 0}
                icon="👥"
                color="blue"
                change="+12%"
                trend="up"
                description="Usuarios registrados"
              />
              
              <GrowthCard
                title="Ventas Totales"
                current={stats?.totals?.sales || 0}
                previous={10000}
                icon="💰"
                color="green"
              />
              
              <KpiCard
                title="Productos Activos"
                value={stats?.totals?.products || 0}
                target={200}
                icon="🍔"
                color="orange"
              />
              
              <ComparisonCard
                title="Pedidos Este Mes"
                value={stats?.totals?.orders || 0}
                comparisonValue={45}
                comparisonLabel="Mes anterior"
                icon="📦"
                color="purple"
              />
              
              <DashboardCard
                title="Reseñas Totales"
                value={stats?.totals?.reviews || 0}
                icon="⭐"
                color="yellow"
                change="+8"
                trend="up"
                description="Feedback de clientes"
              />
              
              <DashboardCard
                title="Cupones Activos"
                value={stats?.totals?.coupons || 0}
                icon="🎫"
                color="pink"
                change="-2"
                trend="down"
                description="Descuentos disponibles"
              />
            </div>

            {/* Sección de Actividad Reciente */}
            <div className="recent-activity-section">
              <div className="section-header">
                <h3>Actividad Reciente</h3>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="time-selector"
                >
                  <option value="day">Hoy</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mes</option>
                  <option value="year">Este Año</option>
                </select>
              </div>
              
              <div className="activity-grid">
                <div className="activity-card">
                  <h4>📈 Ventas</h4>
                  <p>${stats?.analytics?.totalSales?.toLocaleString() || '0'}</p>
                  <small>Total acumulado</small>
                </div>
                
                <div className="activity-card">
                  <h4>📊 Tasa de Conversión</h4>
                  <p>{stats?.totals?.users ? ((stats?.totals?.orders / stats?.totals?.users) * 100).toFixed(1) : '0'}%</p>
                  <small>Órdenes por usuario</small>
                </div>
                
                <div className="activity-card">
                  <h4>⭐ Valoración Promedio</h4>
                  <p>4.8/5.0</p>
                  <small>Basado en {stats?.totals?.reviews || 0} reseñas</small>
                </div>
                
                <div className="activity-card">
                  <h4>🚚 Tiempo de Entrega</h4>
                  <p>35 min</p>
                  <small>Promedio estimado</small>
                </div>
              </div>
            </div>

            {/* Tabla de Usuarios Recientes */}
            <div className="recent-table-section">
              <h3>Usuarios Recientes</h3>
              {entities.users.length > 0 ? (
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entities.users.slice(0, 5).map(user => (
                        <tr key={user.id}>
                          <td>#{user.id}</td>
                          <td>{user.nombre} {user.apellido}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.rol}`}>
                              {user.rol || 'usuario'}
                            </span>
                          </td>
                          <td>{formatDate(user.fecha_registro || user.created_at)}</td>
                          <td className="actions">
                            <button className="btn-icon" title="Ver">👁️</button>
                            <button className="btn-icon" title="Editar">✏️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-data">No hay usuarios registrados</p>
              )}
            </div>
          </>
        );

      case 'analytics':
        return (
          <div className="analytics-section">
            <h3>Analíticas Detalladas</h3>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>📈 Ventas por Mes</h4>
                <p>Gráfico de ventas mensuales aquí</p>
              </div>
              <div className="analytics-card">
                <h4>📊 Productos Más Vendidos</h4>
                <p>Top 10 productos aquí</p>
              </div>
              <div className="analytics-card">
                <h4>👥 Nuevos Usuarios</h4>
                <p>Tasa de crecimiento de usuarios</p>
              </div>
              <div className="analytics-card">
                <h4>⭐ Satisfacción</h4>
                <p>Promedio de reseñas por producto</p>
              </div>
            </div>
          </div>
        );

      case 'recent':
        return (
          <div className="recent-items-section">
            <div className="section-header">
              <h3>Elementos Recientes</h3>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn-search">🔍</button>
              </div>
            </div>
            
            <div className="recent-grid">
              <div className="recent-list">
                <h4>Últimos Pedidos</h4>
                {stats?.recent?.orders?.map(order => (
                  <div key={order.id} className="recent-item">
                    <span className="item-icon">📦</span>
                    <div className="item-info">
                      <strong>Pedido #{order.id}</strong>
                      <small>${order.total || 0} - {order.estado || 'pendiente'}</small>
                    </div>
                    <span className="item-time">{formatDate(order.fecha)}</span>
                  </div>
                )) || <p className="no-data">No hay pedidos recientes</p>}
              </div>
              
              <div className="recent-list">
                <h4>Últimos Pagos</h4>
                {stats?.recent?.payments?.map(payment => (
                  <div key={payment.id} className="recent-item">
                    <span className="item-icon">💳</span>
                    <div className="item-info">
                      <strong>${payment.monto || 0}</strong>
                      <small>{payment.metodo || 'No especificado'}</small>
                    </div>
                    <span className="item-time">{formatDate(payment.fecha)}</span>
                  </div>
                )) || <p className="no-data">No hay pagos recientes</p>}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="welcome-section">
            <h2>👋 ¡Bienvenido al Panel de Administración!</h2>
            <p>Selecciona una opción del menú lateral para comenzar.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <main className="admin-main-content">
        <header className="admin-header">
          <div className="header-left">
            <h1>Panel de Administración</h1>
            <p className="header-subtitle">
              {activeTab === 'overview' ? 'Resumen general del sistema' : 
               activeTab === 'analytics' ? 'Estadísticas y análisis' : 
               'Gestión de contenido'}
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

        <nav className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Resumen
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analíticas
          </button>
          <button 
            className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            ⏰ Reciente
          </button>
        </nav>

        <div className="admin-content">
          {error && (
            <div className="error-alert">
              <span>⚠️ Error: {error}</span>
              <button onClick={refresh}>Reintentar</button>
            </div>
          )}

          {loading && activeTab === 'overview' ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando datos del dashboard...</p>
            </div>
          ) : (
            renderContent()
          )}
        </div>

        <footer className="admin-footer">
          <div className="footer-info">
            <span>Sistema E-commerce</span>
            <span>•</span>
            <span>{stats?.totals?.users || 0} usuarios</span>
            <span>•</span>
            <span>{stats?.totals?.products || 0} productos</span>
            <span>•</span>
            <span>{stats?.totals?.orders || 0} pedidos</span>
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

export default AdminDashboard;