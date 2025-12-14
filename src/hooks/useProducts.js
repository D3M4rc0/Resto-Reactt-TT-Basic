import { useState, useEffect } from 'react'
import { productService, categoryService, reviewService } from '../services/api'
import { formatProductData } from '../utils/apiHelpers'

export const useProducts = (page = 1, limit = 9) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await productService.getProducts(page, limit)
        
        // Manejar diferentes formatos de respuesta
        let productsData = []
        if (response.data && Array.isArray(response.data)) {
          productsData = response.data
        } else if (response.data && response.data.data) {
          productsData = response.data.data
        } else if (response.data && response.data.products) {
          productsData = response.data.products
        }
        
        const formattedProducts = productsData.map(formatProductData).filter(Boolean)
        setProducts(formattedProducts)
        
        // Calcular total de páginas
        const totalProducts = response.data?.total || response.data?.count || 27
        setTotalPages(Math.ceil(totalProducts / limit))
      } catch (err) {
        setError(err.message || 'Error al cargar productos')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, limit])

  return { products, loading, error, totalPages }
}

export const useAllProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await productService.getAllProducts()
        
        let productsData = []
        if (response.data && Array.isArray(response.data)) {
          productsData = response.data
        } else if (response.data && response.data.data) {
          productsData = response.data.data
        }
        
        const formattedProducts = productsData.map(formatProductData).filter(Boolean)
        setProducts(formattedProducts)
      } catch (err) {
        setError(err.message || 'Error al cargar todos los productos')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllProducts()
  }, [])

  return { products, loading, error }
}

export const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await categoryService.getCategories()
        
        let categoriesData = []
        if (response.data && Array.isArray(response.data)) {
          categoriesData = response.data
        } else if (response.data && response.data.data) {
          categoriesData = response.data.data
        }
        
        setCategories(categoriesData)
      } catch (err) {
        setError(err.message || 'Error al cargar categorías')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Obtener producto
        const productResponse = await productService.getProductById(productId)
        const productData = productResponse.data?.data || productResponse.data
        setProduct(formatProductData(productData))
        
        // Obtener reseñas del producto
        const reviewsResponse = await reviewService.getProductReviews(productId)
        const reviewsData = reviewsResponse.data?.data || reviewsResponse.data || []
        setReviews(reviewsData)
        
      } catch (err) {
        setError(err.message || 'Error al cargar detalle del producto')
        setProduct(null)
        setReviews([])
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductDetail()
    } else {
      setProduct(null)
      setReviews([])
      setLoading(false)
    }
  }, [productId])

  return { product, reviews, loading, error }
}

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await productService.getFeaturedProducts()
        
        let productsData = []
        if (response.data && Array.isArray(response.data)) {
          productsData = response.data
        } else if (response.data && response.data.data) {
          productsData = response.data.data
        }
        
        const formattedProducts = productsData.map(formatProductData).filter(Boolean)
        setProducts(formattedProducts)
      } catch (err) {
        setError(err.message || 'Error al cargar productos destacados')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return { products, loading, error }
}

export const useProductSearch = (query, page = 1, limit = 9) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const searchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await productService.searchProducts(query, page, limit)
        
        let productsData = []
        if (response.data && Array.isArray(response.data)) {
          productsData = response.data
        } else if (response.data && response.data.data) {
          productsData = response.data.data
        }
        
        const formattedProducts = productsData.map(formatProductData).filter(Boolean)
        setProducts(formattedProducts)
        
        const totalProducts = response.data?.total || response.data?.count || formattedProducts.length
        setTotalPages(Math.ceil(totalProducts / limit))
      } catch (err) {
        setError(err.message || 'Error en la búsqueda')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (query && query.trim().length > 0) {
      searchProducts()
    } else {
      setProducts([])
      setLoading(false)
      setError(null)
    }
  }, [query, page, limit])

  return { products, loading, error, totalPages }
}