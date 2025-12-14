import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/pages/_admin-dashboard.scss"; 

const AdminModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  onConfirm,
  confirmText = 'Guardar',
  cancelText = 'Cancelar',
  isLoading = false,
  showActions = true
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <AnimatePresence>
      <div className="admin-modal-overlay">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop"
          onClick={onClose}
        />
        
        <div className="modal-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`modal-content ${sizes[size]}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h3 className="modal-title">{title}</h3>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="modal-close-btn"
                  disabled={isLoading}
                  aria-label="Cerrar modal"
                >
                  <svg className="close-icon" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {children}
            </div>

            {/* Modal Footer */}
            {showActions && (
              <div className="modal-footer">
                <button
                  onClick={onClose}
                  className="btn-cancel"
                  disabled={isLoading}
                >
                  {cancelText}
                </button>
                
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    className="btn-confirm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading-spinner-small"></span>
                    ) : (
                      confirmText
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

// Modal para confirmar eliminación
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  type = 'delete', // delete, warning, info, success
  isLoading = false
}) => {
  const typeStyles = {
    delete: {
      icon: '🗑️',
      color: 'var(--color-red)',
      bgColor: 'var(--color-red-light)'
    },
    warning: {
      icon: '⚠️',
      color: 'var(--color-orange)',
      bgColor: 'var(--color-orange-light)'
    },
    info: {
      icon: 'ℹ️',
      color: 'var(--color-blue)',
      bgColor: 'var(--color-blue-light)'
    },
    success: {
      icon: '✅',
      color: 'var(--color-green)',
      bgColor: 'var(--color-green-light)'
    }
  };

  const currentType = typeStyles[type] || typeStyles.delete;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      isLoading={isLoading}
    >
      <div className="confirm-modal-content">
        <div 
          className="confirm-icon"
          style={{ 
            backgroundColor: currentType.bgColor,
            color: currentType.color
          }}
        >
          {currentType.icon}
        </div>
        
        <p className="confirm-message">{message}</p>
        
        {type === 'delete' && (
          <div className="delete-warning">
            <strong>⚠️ Advertencia:</strong>
            <ul>
              <li>Los datos serán eliminados permanentemente</li>
              <li>Esta acción afectará todos los registros relacionados</li>
              <li>No podrás recuperar la información eliminada</li>
            </ul>
          </div>
        )}
      </div>
    </AdminModal>
  );
};

// Modal para formularios
export const FormModal = ({
  isOpen,
  onClose,
  title,
  formId,
  onSubmit,
  children,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  isLoading = false,
  size = 'lg'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      showActions={false}
    >
      <form id={formId} onSubmit={handleSubmit} className="form-modal-form">
        <div className="form-modal-body">
          {children}
        </div>
        
        <div className="form-modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn-cancel"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          
          <button
            type="submit"
            className="btn-confirm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner-small"></span>
                <span>Guardando...</span>
              </>
            ) : (
              submitText
            )}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

// Modal para vista previa/detalles
export const DetailModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  showCloseButton = true
}) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      showCloseButton={showCloseButton}
      showActions={false}
    >
      <div className="detail-modal-content">
        {children}
      </div>
    </AdminModal>
  );
};

export default AdminModal;