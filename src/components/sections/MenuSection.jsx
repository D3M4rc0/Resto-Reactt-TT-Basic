import React, { useState, useEffect } from 'react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../ui/ProductCard'
import Loading from '../ui/Loading'
import { useNavigate } from 'react-router-dom'

const MenuSection = () => {
  const { products, loading, error } = useProducts(1, 9) ///// 9 productos para 3x3 grid
  const navigate = useNavigate()
  const [displayedProducts, setDisplayedProducts] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      setDisplayedProducts(products.slice(0, 9)) ///// Mostrar primeros 9 productos
    }
  }, [products])

  const handleViewFullMenu = () => {
    navigate('/menu')
  }

  if (error) {
    return (
      <section className="menu-section">
        <div className="container">
          <div className="section-error">
            <p>Error cargando el menú: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="menu-section">
      <div className="container">
        <div className="menu-section-header">
          <div className="menu-title-container">
            <h2 className="section-title">Nuestro Menú</h2>
            <div className="menu-badge">
              🍽️ 40+ Platos
            </div>
          </div>
          <p className="section-subtitle">
            Explora nuestra cuidadosa selección de platos, desde entradas clásicas 
            hasta creaciones innovadoras del chef
          </p>
        </div>
		<div className="section-divider"></div>
		

        {loading ? (
          <Loading message="Cargando menú..." />
        ) : (
          <>
            {/* Grid de productos 3x3 */}
            <div className="menu-grid">
              {displayedProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`menu-grid-item ${index % 3 === 1 ? 'menu-grid-item--featured' : ''}`}
                >
                  <ProductCard product={product} />
                  
                  {/* Badge especial para productos destacados */}
                  {index % 3 === 1 && (
                    <div className="featured-badge">
                      ⭐ Más Popular
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Estadísticas del menú */}
            <div className="menu-stats">
              <div className="menu-stat">
                <span className="menu-stat-number">27+</span>
                <span className="menu-stat-label">Platos Únicos</span>
              </div>
              <div className="menu-stat">
                <span className="menu-stat-number">8</span>
                <span className="menu-stat-label">Categorías</span>
              </div>
              <div className="menu-stat">
                <span className="menu-stat-number">15+</span>
                <span className="menu-stat-label">Ingredientes Premium</span>
              </div>
              <div className="menu-stat">
                <span className="menu-stat-number">4.9</span>
                <span className="menu-stat-label">Rating Promedio</span>
              </div>
            </div>

            {/* Llamada a la acción */}
            <div className="menu-cta">
              <div className="cta-content">
                <h3 className="cta-title">¿No encuentras lo que buscas?</h3>
                <p className="cta-description">
                  Explora nuestro menú completo con más de 40 platos cuidadosamente 
                  seleccionados para todos los gustos y ocasiones.
                </p>
                <button 
                  className="btn btn-primary cta-button"
                  onClick={handleViewFullMenu}
                >
                  Ver Menú Completo
                </button>
              </div>
              
              <div className="cta-features">
                <div className="cta-feature">
                  <span className="feature-icon">📱</span>
                  <span>Pedido Online Fácil</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">🚚</span>
                  <span>Envío Gratis +$5000</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">💳</span>
                  <span>Pago Seguro</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">⭐</span>
                  <span>Calidad Garantizada</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default MenuSection
