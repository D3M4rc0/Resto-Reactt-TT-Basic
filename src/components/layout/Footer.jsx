import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PrivacyModal from '../ui/PrivacyModal'
import TermsModal from '../ui/TermsModal'

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      checkRestaurantStatus()
    }, 60000) // Actualizar cada minuto

    checkRestaurantStatus()
    
    return () => clearInterval(timer)
  }, [])

  const checkRestaurantStatus = () => {
    const now = currentTime
    const hour = now.getHours()
    const day = now.getDay() // 0 = Domingo, 1 = Lunes, etc.
    
    // Horario: Lunes a Sábado 12:00-15:00 y 19:00-23:00
    const isLunchTime = hour >= 12 && hour < 15
    const isDinnerTime = hour >= 19 && hour < 23
    const isWeekend = day === 0 // Domingo cerrado
    
    setIsOpen(!isWeekend && (isLunchTime || isDinnerTime))
  }

  const getStatusText = () => {
    return isOpen ? 'Abierto ahora' : 'Cerrado ahora'
  }

  const getStatusClass = () => {
    return isOpen ? 'footer__status--open' : 'footer__status--closed'
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          
          {/* Sección Logo y Horarios */}
          <div className="footer__section">
            <div className="footer__logo">
              <div className="footer__logo-fallback">
                <span className="logo-icon">🍽️</span>
              </div>
              <div className="footer__logo-text">
                <h3>Le Marc Gourmet</h3>
                <div className={`footer__status ${getStatusClass()}`}>
                  <span className="footer__status-dot"></span>
                  {getStatusText()}
                </div>
              </div>
            </div>
            
            <div className="footer__schedule">
              <h4>Horarios</h4>
              <div className="footer__schedule-times">
                <div>Lunes a Sábado</div>
                <div>12:00 - 15:00</div>
                <div>19:00 - 23:00</div>
                <div>Domingo: Cerrado</div>
              </div>
            </div>

            {/* Aviso de Precios */}
			<div className="footer__price-notice">
			  <p>💰 Precios en <strong>pesos argentinos (ARS)</strong></p>
			  <small>Consultar precio en Pesos Dólares al momento del pedido</small>
			</div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="footer__section">
            <h4>Navegación</h4>
            <ul className="footer__links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/menu">Menú Completo</Link></li>
              <li><Link to="/about">Sobre Nosotros</Link></li>
              <li><Link to="/reservations">Reservas</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
            </ul>
          </div>

          {/* Categorías */}
          <div className="footer__section">
            <h4>Categorías</h4>
            <ul className="footer__links">
              <li><Link to="/menu?category=Comidas Saladas">Comidas Saladas</Link></li>
              <li><Link to="/menu?category=Comidas Dulces">Comidas Dulces</Link></li>
              <li><Link to="/menu?category=Bebidas">Bebidas</Link></li>
              <li><Link to="/menu?category=Entradas">Entradas</Link></li>
              <li><Link to="/menu?category=Postres">Postres</Link></li>
            </ul>
          </div>

          {/* Contacto y Redes */}
          <div className="footer__section">
            <h4>Contacto</h4>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <span className="footer__contact-icon">📍</span>
                <span>Av. Gourmet 123, Buenos Aires</span>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">📞</span>
                <span>+54 11 1234-5678</span>
              </div>
              <div className="footer__contact-item">
                <span className="footer__contact-icon">✉️</span>
                <span>info@lemarcgourmet.com</span>
              </div>
            </div>

            <div className="footer__social">
              <h4>Síguenos</h4>
              <div className="footer__social-links">
                <a href="#" className="footer__social-link" aria-label="Facebook">
                  <span>📘</span>
                </a>
                <a href="#" className="footer__social-link" aria-label="Instagram">
                  <span>📷</span>
                </a>
                <a href="#" className="footer__social-link" aria-label="Twitter">
                  <span>🐦</span>
                </a>
                <a href="#" className="footer__social-link" aria-label="WhatsApp">
                  <span>💚</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            Le Marc Gourmet © 2025. Todos los derechos reservados. Desarrollado por DeMarco.
          </div>
          <div className="footer__legal">
            <button 
              className="footer__legal-link"
              onClick={() => setShowPrivacyModal(true)}
            >
              Política de Privacidad
            </button>
            <button 
              className="footer__legal-link"
              onClick={() => setShowTermsModal(true)}
            >
              Términos de Servicio
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <PrivacyModal 
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </footer>
  )
}

export default Footer