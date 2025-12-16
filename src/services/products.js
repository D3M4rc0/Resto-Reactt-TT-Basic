import { productService, categoryService, reviewService } from './api'
import { handleApiError, productCache, categoryCache } from '../utils/apiHelpers'

///// Servicio de productos mejorado con cache
export const products = {
  ///// Obtener todos los productos
  getAllProducts: async (useCache = true) => {
    const cacheKey = 'all-products'
    
    if (useCache) {
      const cached = productCache.get(cacheKey)
      if (cached) {
        console.log('📦 Using cached products')
        return { success: true, data: cached, fromCache: true }
      }
    }

    try {
      const response = await productService.getAllProducts()
      const productsData = response.data.data || []
      
      ///// Guardar en cache
      productCache.set(cacheKey, productsData)
      
      return {
        success: true,
        data: productsData,
        fromCache: false
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  ///// Obtener productos paginados
  getProducts: async (page = 1, limit = 9) => {
    const cacheKey = `products-page-${page}-limit-${limit}`
    
    try {
      const response = await productService.getProducts(page, limit)
      const productsData = response.data.data || []
      const metadata = response.data.metadata || {}
      
      ///// Cachear resultados paginados
      productCache.set(cacheKey, { products: productsData, metadata })
      
      return {
        success: true,
        data: productsData,
        metadata,
        currentPage: page,
        totalPages: Math.ceil((metadata.record_count || 27) / limit)
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  ///// Obtener producto por ID
  getProductById: async (id) => {
    const cacheKey = `product-${id}`
    
    const cached = productCache.get(cacheKey)
    if (cached) {
      return { success: true, data: cached, fromCache: true }
    }

    try {
      const response = await productService.getProductById(id)
      const productData = response.data
      
      productCache.set(cacheKey, productData)
      
      return {
        success: true,
        data: productData,
        fromCache: false
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  ///// Buscar productos
  searchProducts: async (query, page = 1, limit = 9) => {
    const cacheKey = `search-${query}-page-${page}`
    
    try {
      const response = await productService.searchProducts(query, page, limit)
      const productsData = response.data.data || []
      
      ///// Cachear búsquedas por 2 minutos
      productCache.set(cacheKey, productsData, 2 * 60 * 1000)
      
      return {
        success: true,
        data: productsData,
        query,
        currentPage: page
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  ///// Obtener productos por categoría
  getProductsByCategory: async (category, page = 1, limit = 9) => {
    const cacheKey = `category-${category}-page-${page}`
    
    const cached = productCache.get(cacheKey)
    if (cached) {
      return { success: true, data: cached, fromCache: true }
    }

    try {
      const response = await productService.getProductsByCategory(category, page, limit)
      const productsData = response.data.data || []
      
      productCache.set(cacheKey, productsData)
      
      return {
        success: true,
        data: productsData,
        category,
        currentPage: page
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  ///// Obtener categorías
  getCategories: async () => {
    const cacheKey = 'all-categories'
    
    const cached = categoryCache.get(cacheKey)
    if (cached) {
      return { success: true, data: cached, fromCache: true }
    }

    try {
      const response = await categoryService.getCategories()
      const categoriesData = response.data.data || []
      
      categoryCache.set(cacheKey, categoriesData)
      
      return {
        success: true,
        data: categoriesData,
        fromCache: false
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  ///// Obtener reseñas de producto
  getProductReviews: async (productId) => {
    const cacheKey = `reviews-${productId}`
    
    try {
      const response = await reviewService.getProductReviews(productId)
      const reviewsData = response.data.data || []
      
      ///// Cachear reseñas por 5 minutos
      productCache.set(cacheKey, reviewsData, 5 * 60 * 1000)
      
      return {
        success: true,
        data: reviewsData,
        productId
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  ///// Agregar reseña
  addReview: async (reviewData) => {
    try {
      const response = await reviewService.createReview(reviewData)
      
      ///// Invalidar cache de reseñas para este producto
      productCache.delete(`reviews-${reviewData.producto_id}`)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  ///// Limpiar cache
  clearCache: () => {
    productCache.clear()
    categoryCache.clear()
    console.log('🧹 Product cache cleared')
  },

  ///// Obtener productos destacados
  getFeaturedProducts: async () => {
    const cacheKey = 'featured-products'
    
    const cached = productCache.get(cacheKey)
    if (cached) {
      return { success: true, data: cached, fromCache: true }
    }

    try {
      const response = await productService.getFeaturedProducts()
      const productsData = response.data.data || []
      
      productCache.set(cacheKey, productsData)
      
      return {
        success: true,
        data: productsData,
        fromCache: false
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  }
}

export default products
