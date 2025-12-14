import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

const Modal = ({ isOpen, onClose, title, children, className = '', size = 'medium' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // ===== AQUÍ ESTÁ EL CAMBIO CRÍTICO: Usar createPortal =====
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal modal--${size} ${className}`}>
        <div className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button className="modal__close" onClick={onClose}>×</button>
        </div>
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>,
    document.body // Renderiza directamente en el body
  )
}

export default Modal