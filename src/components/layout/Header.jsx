import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAuthOperations } from '../../hooks/useAuth'
import CartIcon from '../ui/CartIcon'
import AuthModal from '../auth/AuthModal'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState('login')
  const [isOpen, setIsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { user } = useAuth()
  const { logout } = useAuthOperations()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      checkRestaurantStatus()
    }, 60000)

    checkRestaurantStatus()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timer)
    }
  }, [])

  const checkRestaurantStatus = () => {
    const now = currentTime
    const hour = now.getHours()
    const day = now.getDay()
    
    const isLunchTime = hour >= 12 && hour < 15
    const isDinnerTime = hour >= 19 && hour < 23
    const isWeekend = day === 0
    
    setIsOpen(!isWeekend && (isLunchTime || isDinnerTime))
  }

  const getStatusText = () => {
    return isOpen ? 'Abierto ahora' : 'Cerrado ahora'
  }

  const getStatusClass = () => {
    return isOpen ? 'header__status--open' : 'header__status--closed'
  }

  const handleLoginClick = () => {
    setAuthType('login')
    setShowAuthModal(true)
  }

  const handleRegisterClick = () => {
    setAuthType('register')
    setShowAuthModal(true)
  }

  const handleLogout = () => {
    logout()
  }

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  const handleDashboardClick = () => {
    navigate('/admin/dashboard')
  }

  return (
    <>
      <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="header__top">
          <div className="container">
            <div className="header__content">
              {/* Logo */}
              <Link to="/" className="header__logo">
                <div className="header__logo-fallback">
                  <span className="logo-icon">🍽️</span>
                </div>
                <div className="header__logo-text">
                  <span className="header__logo-name">Le Marc Gourmet</span>
                  <div className={`header__status ${getStatusClass()}`}>
                    <span className="header__status-dot"></span>
                    {getStatusText()}
                  </div>
                </div>
              </Link>

              {/* Navegación Principal - CORREGIDO */}
              <nav className="header__nav">
                <Link 
                  to="/" 
                  className={`header__nav-link ${isActiveLink('/') ? 'header__nav-link--active' : ''}`}
                >
                  Inicio
                </Link>
                <Link 
                  to="/menu" 
                  className={`header__nav-link ${isActiveLink('/menu') ? 'header__nav-link--active' : ''}`}
                >
                  Menú
                </Link>
                <Link 
                  to="/about" 
                  className={`header__nav-link ${isActiveLink('/about') ? 'header__nav-link--active' : ''}`}
                >
                  Nosotros
                </Link>
                <Link 
                  to="/reservations" 
                  className={`header__nav-link ${isActiveLink('/reservations') ? 'header__nav-link--active' : ''}`}
                >
                  Reservas
                </Link>
                
                {/* Enlace Dashboard para Admin - ESTILOS CORREGIDOS */}
                {user && user.rol === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`header__nav-link ${isActiveLink('/admin/dashboard') ? 'header__nav-link--active' : ''} header__nav-link--dashboard`}
                    title="Panel de Administración"
                  >
                    <span className="dashboard-icon">📊</span>
                    Dashboard
                  </Link>
                )}
              </nav>

              {/* Acciones del Usuario */}
              <div className="header__actions">
                <CartIcon />
                
                {user ? (
                  <div className="header__user">
                    <div className="header__user-info">
                      <span className="header__user-name">
                        Hola, {user.nombre || 'Usuario'}
                        {user.rol === 'admin' && (
                          <span className="user-badge admin-badge">👑</span>
                        )}
                      </span>
                    </div>
                    <button 
                      className="header__logout-btn"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="header__auth">
                    <button 
                      className="header__login-btn"
                      onClick={handleLoginClick}
                    >
                      Iniciar Sesión
                    </button>
                    <button 
                      className="header__register-btn"
                      onClick={handleRegisterClick}
                    >
                      Registrarse
                    </button>
                  </div>
                )}
              </div>

              {/* Menú móvil */}
              <div className="header__mobile-menu">
                <button className="mobile-menu-btn">
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authType}
        onSwitchType={() => setAuthType(authType === 'login' ? 'register' : 'login')}
      />
    </>
  )
}

export default Header