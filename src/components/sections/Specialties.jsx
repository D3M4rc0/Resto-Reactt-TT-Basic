import React, { useState, useEffect } from 'react'
import { useFeaturedProducts } from '../../hooks/useProducts'
import ProductCard from '../ui/ProductCard'
import Loading from '../ui/Loading'

const Specialties = () => {
  const { products, loading, error } = useFeaturedProducts()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleProducts, setVisibleProducts] = useState([])

  ///// Mostrar 4 productos a la vez (carousel de 8 productos)
  useEffect(() => {
    if (products.length > 0) {
      const start = currentIndex
      const end = start + 4
      const visible = products.slice(start, end)
      setVisibleProducts(visible)
    }
  }, [products, currentIndex])

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev + 4 >= products.length ? 0 : prev + 4
    )
  }

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev - 4 < 0 ? Math.max(0, products.length - 4) : prev - 4
    )
  }

  if (error) {
    return (
      <section className="specialties-section">
        <div className="container">
          <div className="section-error">
            <p>Error cargando especialidades: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="specialties-section">
      <div className="container">
        {/* ✅ CABECERA CON TU PATRÓN EXACTO */}
        <div className="specialties-header">
          <h2 className="section-title">Especialidades del Chef</h2>
          <p className="section-subtitle">
            Descubre nuestras creaciones exclusivas preparadas con pasión y maestría culinaria
          </p>
          <div className="section-divider"></div>
        </div>

        {loading ? (
          <Loading message="Cargando especialidades..." />
        ) : (
          <>
            <div className="specialties-carousel">
              <button 
                className="carousel-btn carousel-btn--prev"
                onClick={prevSlide}
                aria-label="Productos anteriores"
              >
                ‹
              </button>

              <div className="specialties-grid">
                {visibleProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <button 
                className="carousel-btn carousel-btn--next"
                onClick={nextSlide}
                aria-label="Siguientes productos"
              >
                ›
              </button>
            </div>

            {/* Indicadores del carousel */}
            <div className="carousel-indicators">
              {Array.from({ length: Math.ceil(products.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${currentIndex / 4 === index ? 'carousel-indicator--active' : ''}`}
                  onClick={() => setCurrentIndex(index * 4)}
                />
              ))}
            </div>

            {/* Contador de productos */}
            <div className="carousel-counter">
              <span>
                {Math.min(currentIndex + 1, products.length)}-
                {Math.min(currentIndex + 4, products.length)} de {products.length} productos
              </span>
            </div>
          </>
        )}

        {/* Llamada a la acción */}
        <div className="specialties-cta">
          <p>¿Quieres probar todas nuestras especialidades?</p>
          <button className="btn btn-outline">
            Ver Menú Completo
          </button>
        </div>
      </div>
    </section>
  )
}

export default Specialties