import React from 'react';
import { motion } from 'framer-motion';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue',
  change = null,
  trend = 'up',
  description = '',
  onClick = null,
  loading = false 
}) => {
  const colors = {
    blue: { bg: 'var(--color-blue-light)', text: 'var(--color-blue)', border: 'var(--color-blue)' },
    green: { bg: 'var(--color-green-light)', text: 'var(--color-green)', border: 'var(--color-green)' },
    red: { bg: 'var(--color-red-light)', text: 'var(--color-red)', border: 'var(--color-red)' },
    orange: { bg: 'var(--color-orange-light)', text: 'var(--color-orange)', border: 'var(--color-orange)' },
    purple: { bg: 'var(--color-purple-light)', text: 'var(--color-purple)', border: 'var(--color-purple)' },
    teal: { bg: 'var(--color-teal-light)', text: 'var(--color-teal)', border: 'var(--color-teal)' },
    yellow: { bg: 'var(--color-yellow-light)', text: 'var(--color-yellow)', border: 'var(--color-yellow)' },
    pink: { bg: 'var(--color-pink-light)', text: 'var(--color-pink)', border: 'var(--color-pink)' },
    indigo: { bg: 'var(--color-indigo-light)', text: 'var(--color-indigo)', border: 'var(--color-indigo)' }
  };

  const selectedColor = colors[color] || colors.blue;

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
      return val.toLocaleString();
    }
    return val;
  };

  if (loading) {
    return (
      <motion.div 
        className="dashboard-card loading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="card-skeleton">
          <div className="skeleton-icon"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-value"></div>
          <div className="skeleton-change"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`dashboard-card ${onClick ? 'clickable' : ''}`}
      style={{
        '--card-bg': selectedColor.bg,
        '--card-text': selectedColor.text,
        '--card-border': selectedColor.border
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      onClick={onClick}
    >
      <div className="card-header">
        <div 
          className="card-icon-container"
          style={{ backgroundColor: selectedColor.bg, color: selectedColor.text }}
        >
          <span className="card-icon">{icon}</span>
        </div>
        
        {change !== null && (
          <div className={`card-change ${trend}`}>
            <span className="change-icon">
              {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
            </span>
            <span className="change-value">{change}</span>
          </div>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-value" style={{ color: selectedColor.text }}>
          {formatValue(value)}
        </h3>
        <h4 className="card-title">{title}</h4>
        
        {description && (
          <p className="card-description">{description}</p>
        )}
      </div>

      <div className="card-footer">
        <div className="card-progress">
          <div 
            className="progress-bar" 
            style={{ 
              width: trend === 'up' ? '75%' : trend === 'down' ? '40%' : '60%',
              backgroundColor: selectedColor.text
            }}
          ></div>
        </div>
        
        <div className="card-actions">
          <button className="card-action-btn" title="Ver detalles">
            👁️
          </button>
          <button className="card-action-btn" title="Exportar">
            📤
          </button>
        </div>
      </div>

      {/* Efecto de brillo al hacer hover */}
      <div className="card-glow"></div>
    </motion.div>
  );
};

// Componente para estadísticas de crecimiento
const GrowthCard = ({ title, current, previous, icon, color }) => {
  const growth = previous > 0 ? ((current - previous) / previous * 100).toFixed(1) : 100;
  const trend = growth > 0 ? 'up' : growth < 0 ? 'down' : 'neutral';

  return (
    <DashboardCard
      title={title}
      value={current}
      icon={icon}
      color={color}
      change={`${Math.abs(growth)}%`}
      trend={trend}
      description={`vs. período anterior: ${previous}`}
    />
  );
};

// Componente para KPI simple
const KpiCard = ({ title, value, target, icon, color }) => {
  const percentage = target > 0 ? (value / target * 100).toFixed(1) : 0;
  const status = percentage >= 100 ? 'achieved' : percentage >= 80 ? 'close' : 'needs-work';

  return (
    <DashboardCard
      title={title}
      value={value}
      icon={icon}
      color={color}
      change={`${percentage}% del objetivo`}
      trend={status === 'achieved' ? 'up' : status === 'close' ? 'neutral' : 'down'}
      description={`Objetivo: ${target}`}
    />
  );
};

// Componente para métrica con comparación
const ComparisonCard = ({ title, value, comparisonValue, comparisonLabel, icon, color }) => {
  const difference = value - comparisonValue;
  const trend = difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral';

  return (
    <DashboardCard
      title={title}
      value={value}
      icon={icon}
      color={color}
      change={`${difference > 0 ? '+' : ''}${difference}`}
      trend={trend}
      description={`${comparisonLabel}: ${comparisonValue}`}
    />
  );
};

export default DashboardCard;
export { GrowthCard, KpiCard, ComparisonCard };