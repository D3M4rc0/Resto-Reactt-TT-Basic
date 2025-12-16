import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', path: '/admin', icon: '📊', label: 'Dashboard', color: 'blue' },
    { id: 'products', path: '/admin/products', icon: '🍔', label: 'Productos', color: 'green' },
    { id: 'categories', path: '/admin/categories', icon: '🏷️', label: 'Categorías', color: 'purple' },
    { id: 'users', path: '/admin/users', icon: '👥', label: 'Usuarios', color: 'orange' },
    { id: 'orders', path: '/admin/orders', icon: '📦', label: 'Pedidos', color: 'red' },
    { id: 'payments', path: '/admin/payments', icon: '💳', label: 'Pagos', color: 'teal' },
    { id: 'reviews', path: '/admin/reviews', icon: '⭐', label: 'Reseñas', color: 'yellow' },
    { id: 'coupons', path: '/admin/coupons', icon: '🎫', label: 'Cupones', color: 'pink' },
    { id: 'carts', path: '/admin/carts', icon: '🛒', label: 'Carritos', color: 'indigo' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToSite = () => {
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      {/* Header del Sidebar */}
      <div className="sidebar-header">
        <div className="admin-brand">
          <h2>🍽️ Admin Panel</h2>
          <div className="admin-badge">ADMIN</div>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            {user?.nombre?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="user-details">
            <strong>{user?.nombre || 'Administrador'}</strong>
            <small>{user?.email || 'admin@example.com'}</small>
            <div className="user-role">
              <span className="role-badge">{user?.rol || 'admin'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-title">Menú Principal</h3>
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
					style={({ isActive }) => {
					  ///// Usar la variable CSS del tema oscuro que YA tienes
					  const colorVar = `--color-${item.color}`;
					  const colorLightVar = `--color-${item.color}-light`;
					  
					  return {
						backgroundColor: isActive ? `var(${colorLightVar})` : 'transparent',
						borderLeftColor: isActive ? `var(${colorVar})` : 'transparent',
						///// Asegurar que la variable se establezca
						[colorVar]: isActive ? `var(${colorVar})` : undefined
					  };
					}}
									>
                  <span className="nav-icon" style={{ color: `var(--color-${item.color})` }}>
                    {item.icon}
                  </span>
                  <span className="nav-label">{item.label}</span>
                  {item.id === 'orders' && (
                    <span className="nav-badge">5</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Navegación Secundaria */}
        <div className="nav-section">
          <h3 className="nav-title">Configuración</h3>
          <ul className="nav-menu">
            <li>
              <NavLink to="/admin/settings" className="nav-link">
                <span className="nav-icon">⚙️</span>
                <span className="nav-label">Configuración</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/analytics" className="nav-link">
                <span className="nav-icon">📈</span>
                <span className="nav-label">Analíticas</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer del Sidebar */}
      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-indicator online"></div>
          <span>Sistema Operativo</span>
        </div>
        
        <div className="footer-actions">
          <button 
            onClick={handleBackToSite} 
            className="btn-back-site"
          >
            <span className="btn-icon">🏠</span>
            <span className="btn-label">Volver al Sitio</span>
          </button>
          
          <button 
            onClick={handleLogout} 
            className="btn-logout"
          >
            <span className="btn-icon">🚪</span>
            <span className="btn-label">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;