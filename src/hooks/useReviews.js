import { useState, useEffect } from 'react'
import { reviewService } from '../services/api'
import { formatReviewData, calculateAverageRating } from '../utils/apiHelpers'

export const useReviews = (productId = null) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        let response
        
        if (productId) {
          response = await reviewService.getProductReviews(productId)
        } else {
          response = await reviewService.getReviews()
        }
        
        // Manejar diferentes formatos de respuesta
        let reviewsData = []
        if (response.data && Array.isArray(response.data)) {
          reviewsData = response.data
        } else if (response.data && response.data.data) {
          reviewsData = response.data.data
        } else if (response.data && response.data.reviews) {
          reviewsData = response.data.reviews
        }
        
        const formattedReviews = reviewsData.map(formatReviewData).filter(Boolean)
        setReviews(formattedReviews)
      } catch (err) {
        setError(err.message || 'Error al cargar reseñas')
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  const averageRating = calculateAverageRating(reviews)
  const approvedReviews = reviews.filter(review => review.aprobado !== false)

  return { 
    reviews: approvedReviews, 
    allReviews: reviews,
    averageRating, 
    loading, 
    error 
  }
}