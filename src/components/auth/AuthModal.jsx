import React, { useState, useEffect } from 'react' // ✅ Agregar useEffect
import { useAuthOperations } from '../../hooks/useAuth'
import Modal from '../ui/Modal'
import Login from './Login'
import Register from './Register'

const AuthModal = ({ isOpen, onClose, type = 'login', onSwitchType }) => {
  const [currentType, setCurrentType] = useState(type)
  const { authLoading, authError, setAuthError } = useAuthOperations()

  // ✅ EFECTO PARA SINCRONIZAR CON EL PROP TYPE
  useEffect(() => {
    setCurrentType(type)
  }, [type])

  const handleSwitchType = () => {
    const newType = currentType === 'login' ? 'register' : 'login'
    setCurrentType(newType)
    setAuthError(null)
    if (onSwitchType) onSwitchType(newType)
  }

  const handleClose = () => {
    setAuthError(null)
    onClose()
  }

  const handleAuthSuccess = () => {
    setAuthError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="auth-modal">
      <div className="auth-modal__content">
        <div className="auth-modal__header">
          <h2 className="auth-modal__title">
            {currentType === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <button className="auth-modal__close" onClick={handleClose}>×</button>
        </div>

        {authError && (
          <div className="auth-modal__error">
            {authError}
          </div>
        )}

        <div className="auth-modal__body">
          {currentType === 'login' ? (
            <Login 
              onSuccess={handleAuthSuccess}
              loading={authLoading}
            />
          ) : (
            <Register 
              onSuccess={handleAuthSuccess}
              loading={authLoading}
            />
          )}
        </div>

        <div className="auth-modal__footer">
          <p className="auth-modal__switch-text">
            {currentType === 'login' 
              ? '¿No tienes una cuenta?' 
              : '¿Ya tienes una cuenta?'
            }
            <button 
              className="auth-modal__switch-btn"
              onClick={handleSwitchType}
              disabled={authLoading}
            >
              {currentType === 'login' ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>

          <div className="auth-modal__divider">
            <span>o continúa con</span>
          </div>

          <div className="auth-modal__social">
            <button className="btn btn-social btn-social--google" disabled={authLoading}>
              <span className="btn-social__icon">G</span>
              Google
            </button>
            <button className="btn btn-social btn-social--facebook" disabled={authLoading}>
              <span className="btn-social__icon">f</span>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AuthModal