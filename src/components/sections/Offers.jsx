import React, { useState, useEffect } from 'react'
import { useAllProducts } from '../../hooks/useProducts'
import ProductCard from '../ui/ProductCard'
import Loading from '../ui/Loading'
import { formatPrice } from '../../utils/apiHelpers'

const Offers = () => {
  const { products, loading, error } = useAllProducts()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [offers, setOffers] = useState([])
  const [visibleOffers, setVisibleOffers] = useState([])

  // Filtrar productos en oferta y asignar descuentos aleatorios
  useEffect(() => {
    if (products.length > 0) {
      // Función para generar descuento aleatorio entre 5% y 30%
      const generateRandomDiscount = (productId) => {
        const seed = productId || 1;
        const random = (Math.sin(seed * 100) + 1) / 2;
        const minDiscount = 5;
        const maxDiscount = 30;
        return Math.floor(random * (maxDiscount - minDiscount + 1)) + minDiscount;
      };

      const offerProducts = products
        .filter(product => product.precio > 20)
        .map(product => {
          const discountPercentage = generateRandomDiscount(product.id);
          const discountPrice = product.precio * (1 - discountPercentage / 100);
          
          return {
            ...product,
            originalPrice: product.precio,
            discountPrice: discountPrice,
            discountPercentage: discountPercentage,
            onSale: true,
            saleDiscount: discountPercentage,  // Para que ProductCard lo use
            calculatedDiscountPrice: discountPrice // Para que ProductCard lo use
          }
        })
        .slice(0, 8)
      
      setOffers(offerProducts)
    }
  }, [products])

  // Mostrar 4 ofertas a la vez
  useEffect(() => {
    if (offers.length > 0) {
      const start = currentIndex
      const end = start + 4
      const visible = offers.slice(start, end)
      setVisibleOffers(visible)
    }
  }, [offers, currentIndex])

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev + 4 >= offers.length ? 0 : prev + 4
    )
  }

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev - 4 < 0 ? Math.max(0, offers.length - 4) : prev - 4
    )
  }

  if (error) {
    return (
      <section className="offers-section">
        <div className="container">
          <div className="section-error">
            <p>Error cargando ofertas: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="offers-section">
      <div className="container">
        <div className="offers-header">
          <div className="offers-title-container">
            <h2 className="section-title">Ofertas Especiales</h2>
            <div className="offers-badge">
              🔥 Por Tiempo Limitado
            </div>
          </div>
		  
          <p className="section-subtitle">
            Aprovecha nuestros descuentos exclusivos en platos seleccionados
          </p>
        </div>
		<div className="section-divider"></div>

        {loading ? (
          <Loading message="Cargando ofertas..." />
        ) : offers.length > 0 ? (
          <>
            <div className="offers-carousel">
              <button 
                className="carousel-btn carousel-btn--prev"
                onClick={prevSlide}
                aria-label="Ofertas anteriores"
              >
                ‹
              </button>

              <div className="offers-grid">
                {visibleOffers.map(offer => (
                  <div key={offer.id} className="offer-card">
                    {/* ===== SOLO EL ProductCard mostrará el badge ===== */}
                    {/* Se eliminó el badge manual <div className="offer-badge"> */}
                    
                    <ProductCard product={offer} />
                    
                    {/* Esta sección muestra la comparación de precios debajo de la tarjeta */}
                    <div className="offer-price-comparison">
                      <span className="offer-original-price">
                        {formatPrice(offer.originalPrice)}
                      </span>
                      <span className="offer-discount-price">
                        {formatPrice(offer.discountPrice)}
                      </span>
                    </div>

                    <div className="offer-timer">
                      <div className="timer-icon">⏰</div>
                      <span>Termina en 2:15:30</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="carousel-btn carousel-btn--next"
                onClick={nextSlide}
                aria-label="Siguientes ofertas"
              >
                ›
              </button>
            </div>

            {/* Indicadores del carousel */}
            <div className="carousel-indicators">
              {Array.from({ length: Math.ceil(offers.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  className={`carousel-indicator ${currentIndex / 4 === index ? 'carousel-indicator--active' : ''}`}
                  onClick={() => setCurrentIndex(index * 4)}
                />
              ))}
            </div>

            {/* Contador */}
            <div className="carousel-counter">
              <span>
                Oferta {Math.min(currentIndex + 1, offers.length)}-
                {Math.min(currentIndex + 4, offers.length)} de {offers.length}
              </span>
            </div>
          </>
        ) : (
          <div className="no-offers">
            <div className="no-offers-icon">💎</div>
            <h3>No hay ofertas disponibles en este momento</h3>
            <p>Vuelve pronto para descubrir nuestras promociones especiales</p>
          </div>
        )}

        {/* Banner de oferta adicional */}
        <div className="offers-banner">
          <div className="offers-banner-content">
            <div className="banner-text">
              <h3>🎉 Oferta de Bienvenida</h3>
              <p>20% de descuento en tu primer pedido con el código: <strong>BIENVENIDO20</strong></p>
            </div>
            <div className="banner-actions">
              <button className="btn btn-primary">
                Aplicar Código
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Offers