import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Verificando permisos...</p>
      </div>
    );
  }

  // Verificar si el usuario es admin
  if (!user || user.rol !== 'admin') {
    // Redirigir al inicio si no es admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;