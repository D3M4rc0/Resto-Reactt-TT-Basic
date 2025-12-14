import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages/_admin-dashboard.scss';

const AdminSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    siteTitle: 'Mi Restaurante',
    siteDescription: 'El mejor restaurante de la ciudad',
    currency: 'USD',
    timezone: 'America/Lima',
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    smsNotifications: false,
    taxRate: 18,
    shippingFee: 5.99,
    minOrderAmount: 10
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('✅ Configuración guardada exitosamente');
      
      // Aquí iría la llamada a la API
      // await adminService.updateSettings(settings);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error al guardar configuración');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('¿Restaurar valores por defecto? Se perderán los cambios no guardados.')) {
      setSettings({
        siteTitle: 'Mi Restaurante',
        siteDescription: 'El mejor restaurante de la ciudad',
        currency: 'USD',
        timezone: 'America/Lima',
        maintenanceMode: false,
        allowRegistrations: true,
        emailNotifications: true,
        smsNotifications: false,
        taxRate: 18,
        shippingFee: 5.99,
        minOrderAmount: 10
      });
      setMessage('⚙️ Valores restaurados a predeterminados');
    }
  };

  const tabs = [
    { id: 'general', label: '⚙️ General', icon: '⚙️' },
    { id: 'commerce', label: '💰 Comercio', icon: '💰' },
    { id: 'notifications', label: '🔔 Notificaciones', icon: '🔔' },
    { id: 'security', label: '🔐 Seguridad', icon: '🔐' },
    { id: 'advanced', label: '⚡ Avanzado', icon: '⚡' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-section">
            <div className="form-group">
              <label>Título del Sitio</label>
              <input
                type="text"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Descripción del Sitio</label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label>Moneda</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="form-select"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="PEN">PEN (S/)</option>
                <option value="MXN">MXN ($)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Zona Horaria</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="form-select"
              >
                <option value="America/Lima">Lima, Perú (GMT-5)</option>
                <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                <option value="America/Bogota">Bogotá, Colombia (GMT-5)</option>
                <option value="America/Santiago">Santiago, Chile (GMT-4)</option>
              </select>
            </div>
          </div>
        );

      case 'commerce':
        return (
          <div className="settings-section">
            <div className="form-group">
              <label>Tasa de Impuesto (%)</label>
              <input
                type="number"
                name="taxRate"
                value={settings.taxRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="form-input"
              />
              <small>Porcentaje de impuesto aplicado a todas las órdenes</small>
            </div>
            
            <div className="form-group">
              <label>Costo de Envío ($)</label>
              <input
                type="number"
                name="shippingFee"
                value={settings.shippingFee}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Mínimo de Pedido ($)</label>
              <input
                type="number"
                name="minOrderAmount"
                value={settings.minOrderAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="form-input"
              />
              <small>Monto mínimo para realizar un pedido</small>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="form-checkbox"
              />
              <label htmlFor="maintenanceMode">
                Modo Mantenimiento
              </label>
              <small>El sitio será accesible solo para administradores</small>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="allowRegistrations"
                name="allowRegistrations"
                checked={settings.allowRegistrations}
                onChange={handleChange}
                className="form-checkbox"
              />
              <label htmlFor="allowRegistrations">
                Permitir Registros
              </label>
              <small>Permitir que nuevos usuarios se registren</small>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <div className="form-check">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="form-checkbox"
              />
              <label htmlFor="emailNotifications">
                Notificaciones por Email
              </label>
              <small>Enviar notificaciones por correo electrónico</small>
            </div>
            
            <div className="form-check">
              <input
                type="checkbox"
                id="smsNotifications"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleChange}
                className="form-checkbox"
              />
              <label htmlFor="smsNotifications">
                Notificaciones por SMS
              </label>
              <small>Enviar notificaciones por mensaje de texto</small>
            </div>
            
            <div className="notification-examples">
              <h4>Ejemplos de Notificaciones:</h4>
              <ul>
                <li>📧 Nuevo pedido recibido</li>
                <li>📦 Estado del pedido actualizado</li>
                <li>⭐ Nueva reseña publicada</li>
                <li>👤 Nuevo usuario registrado</li>
                <li>💰 Pago confirmado</li>
              </ul>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-section">
            <div className="security-info">
              <h4>🔐 Configuración de Seguridad</h4>
              <p>Estas opciones requieren verificación adicional.</p>
              
              <div className="security-actions">
                <button className="btn-secondary" disabled>
                  🔄 Forzar Cambio de Contraseñas
                </button>
                <button className="btn-secondary" disabled>
                  📋 Ver Registro de Actividad
                </button>
                <button className="btn-secondary" disabled>
                  🚫 Bloquear IPs Sospechosas
                </button>
              </div>
              
              <div className="security-stats">
                <div className="stat-card">
                  <h5>Sesiones Activas</h5>
                  <p>3</p>
                </div>
                <div className="stat-card">
                  <h5>Último Acceso</h5>
                  <p>Hace 5 minutos</p>
                </div>
                <div className="stat-card">
                  <h5>IP Actual</h5>
                  <p>192.168.1.1</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="settings-section">
            <div className="warning-alert">
              <h4>⚠️ Configuración Avanzada</h4>
              <p>Estas opciones pueden afectar el funcionamiento del sistema.</p>
            </div>
            
            <div className="form-group">
              <label>Limpiar Cache</label>
              <button className="btn-warning" onClick={() => alert('Cache limpiado')}>
                🗑️ Limpiar Ahora
              </button>
            </div>
            
            <div className="form-group">
              <label>Regenerar URLs</label>
              <button className="btn-warning" onClick={() => alert('URLs regeneradas')}>
                🔗 Regenerar
              </button>
            </div>
            
            <div className="form-group">
              <label>Restaurar Valores Predeterminados</label>
              <button className="btn-danger" onClick={resetToDefaults}>
                ⚙️ Restaurar
              </button>
              <small className="text-danger">Esta acción no se puede deshacer</small>
            </div>
            
            <div className="system-info">
              <h4>📊 Información del Sistema</h4>
              <ul>
                <li><strong>Versión:</strong> 1.0.0</li>
                <li><strong>Última Actualización:</strong> 2024-12-03</li>
                <li><strong>Base de Datos:</strong> PostgreSQL</li>
                <li><strong>API Status:</strong> <span className="status-online">✅ Online</span></li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-settings">
      <header className="settings-header">
        <h1>Configuración del Sistema</h1>
        <p className="header-subtitle">Gestiona las preferencias y ajustes de tu plataforma</p>
      </header>

      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : message.includes('❌') ? 'alert-error' : 'alert-info'}`}>
          {message}
        </div>
      )}

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="user-profile-card">
            <div className="profile-avatar">
              {user?.nombre?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="profile-info">
              <h4>{user?.nombre || 'Administrador'}</h4>
              <p className="profile-role">{user?.rol || 'admin'}</p>
              <p className="profile-email">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>

          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="settings-quick-actions">
            <h5>Acciones Rápidas</h5>
            <button className="btn-secondary" onClick={() => window.open('/admin', '_blank')}>
              👁️ Ver Sitio Público
            </button>
            <button className="btn-secondary" onClick={() => alert('Reporte generado')}>
              📊 Generar Reporte
            </button>
          </div>
        </div>

        <div className="settings-content">
          <form onSubmit={handleSubmit}>
            {renderTabContent()}
            
            <div className="settings-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? '💾 Guardando...' : '💾 Guardar Cambios'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMessage('Cambios descartados')}
              >
                ❌ Descartar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="settings-footer">
        <div className="system-status">
          <div className="status-indicator online"></div>
          <span>Sistema Operativo • Último Guardado: Hoy, 15:30</span>
        </div>
        <div className="version-info">
          v1.0.0 • © 2024 Mi Restaurante
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;