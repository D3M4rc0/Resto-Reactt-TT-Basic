import React, { useState, useEffect, useCallback } from 'react'
import { useReviews } from '../../hooks/useReviews'
import { generateStarRating, formatDate } from '../../utils/apiHelpers'
import Loading from '../ui/Loading'

const ReviewsSection = () => {
  const { reviews, averageRating, loading, error } = useReviews()
  const [displayedReviews, setDisplayedReviews] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (reviews.length > 0 && displayedReviews.length === 0) {
      setDisplayedReviews(reviews.slice(0, 6))
    }
  }, [reviews, displayedReviews.length])

  const nextReview = useCallback(() => {
    setCurrentIndex(prev => 
      prev >= Math.max(0, displayedReviews.length - 3) ? 0 : prev + 1
    )
  }, [displayedReviews.length])

  const prevReview = useCallback(() => {
    setCurrentIndex(prev => 
      prev <= 0 ? Math.max(0, displayedReviews.length - 3) : prev - 1
    )
  }, [displayedReviews.length])

  const visibleReviews = displayedReviews.length > 0 
    ? displayedReviews.slice(
        currentIndex, 
        Math.min(currentIndex + 3, displayedReviews.length)
      )
    : []

  if (error) {
    return (
      <section className="reviews-section fade-in">
        <div className="container">
          <div className="section-error">
            <p>Error cargando reseñas: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="reviews-section fade-in">
      <div className="container">
        <div className="reviews-header">
          <div className="reviews-title-container">
            <h2 className="section-title hover-glow">Lo que Dicen Nuestros Clientes</h2>
          </div>
          {reviews.length > 0 && (
            <div className="reviews-rating-summary">
              <span className="average-rating">{averageRating.toFixed(1)}</span>
              <div className="rating-stars-large">
                {generateStarRating(averageRating).stars}
              </div>
              <span className="reviews-count">Basado en {reviews.length} reseñas</span>
            </div>
          )}
          <p className="section-subtitle">
            Descubre las experiencias de quienes ya han disfrutado de nuestra cocina
          </p>
        </div>

        {loading ? (
          <Loading message="Cargando reseñas..." />
        ) : reviews.length > 0 ? (
          <>
            <div className="reviews-carousel">
              <button 
                className="carousel-btn carousel-btn--prev hover-lift"
                onClick={prevReview}
                aria-label="Reseñas anteriores"
                disabled={displayedReviews.length <= 3}
              >
                ‹
              </button>

              <div className="reviews-grid">
                {visibleReviews.map((review, index) => (
                  <div 
                    key={review.id} 
                    className="review-card hover-lift"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Header con nombre y fecha */}
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {(review.usuario_nombre || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div className="reviewer-details">
                          <div className="reviewer-name">
                            {review.usuario_nombre || 'Cliente'}
                          </div>
                          <div className="review-date">
                            {formatDate(review.fecha_review)}
                          </div>
                        </div>
                      </div>
                      <div className="review-badge-verified">
                        ✓
                      </div>
                    </div>
                    
                    {/* Rating con estrellas */}
                    <div className="review-rating-container">
                      <div className="review-rating">
                        {generateStarRating(review.calificacion).stars}
                      </div>
                      <span className="review-rating-number">
                        {review.calificacion}.0
                      </span>
                    </div>
                    
                    {/* Comentario */}
                    <div className="review-comment-container">
                      <p className="review-comment transition-colors">
                        {review.comentario}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="carousel-btn carousel-btn--next hover-lift"
                onClick={nextReview}
                aria-label="Siguientes reseñas"
                disabled={displayedReviews.length <= 3}
              >
                ›
              </button>
            </div>

            {/* Indicadores */}
            {displayedReviews.length > 3 && (
              <div className="carousel-indicators">
                {Array.from({ 
                  length: Math.max(1, displayedReviews.length - 2) 
                }).map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-indicator transition-all ${
                      currentIndex === index ? 'carousel-indicator--active' : ''
                    }`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Ir a reseña ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Rating breakdown */}
            <div className="rating-breakdown-container">
              <h3 className="breakdown-title">Distribución de Calificaciones</h3>
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = reviews.filter(r => r.calificacion === rating).length
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  
                  return (
                    <div key={rating} className="rating-bar-row">
                      <div className="rating-stars-small">
                        {generateStarRating(rating).stars}
                      </div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="rating-count">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="no-reviews fade-in">
            <div className="no-reviews-icon">💬</div>
            <h3>Aún no hay reseñas</h3>
            <p>Sé el primero en compartir tu experiencia</p>
            <button className="btn btn-primary hover-lift">
              ✍️ Escribir Reseña
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="reviews-cta-banner">
          <div className="cta-content">
            <div className="cta-text">
              <h3>¿Ya probaste nuestros platos?</h3>
              <p>Comparte tu experiencia y ayuda a otros a descubrir la excelencia</p>
            </div>
            <div className="cta-actions">
              <button className="btn btn-primary hover-lift pulse">
                ✍️ Escribir Reseña
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection