import { useState, useEffect } from 'react'
import { productService, categoryService } from '../services/api'
import { formatProductData } from '../utils/apiHelpers'

export const useSearchData = () => {
  const [searchIndex, setSearchIndex] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        setLoading(true)

        // ===============================
        // 🔹 OBTENER PRODUCTOS
        // ===============================
        const productsResponse = await productService.getAllProducts()
        const rawProducts = productsResponse?.data

        const productsData = Array.isArray(rawProducts)
          ? rawProducts
          : Array.isArray(rawProducts?.data)
            ? rawProducts.data
            : Array.isArray(rawProducts?.data?.data)
              ? rawProducts.data.data
              : []

        if (!Array.isArray(productsData)) {
          console.error('❌ productsData NO es array:', productsData)
        }

        // ===============================
        // 🔹 OBTENER CATEGORÍAS
        // ===============================
        const categoriesResponse = await categoryService.getCategories()
        const rawCategories = categoriesResponse?.data

        const categoriesData = Array.isArray(rawCategories)
          ? rawCategories
          : Array.isArray(rawCategories?.data)
            ? rawCategories.data
            : Array.isArray(rawCategories?.data?.data)
              ? rawCategories.data.data
              : []

        if (!Array.isArray(categoriesData)) {
          console.error('❌ categoriesData NO es array:', categoriesData)
        }

        // ===============================
        // 🔹 CREAR ÍNDICE DE BÚSQUEDA
        // ===============================
        const index = []

        // -------------------------------
        // ➕ PRODUCTOS
        // -------------------------------
        const formattedProducts = Array.isArray(productsData)
          ? productsData
              .map(formatProductData)
              .filter(Boolean)
          : []

        formattedProducts.forEach(product => {
          if (!product?.nombre) return
          index.push({
            type: 'product',
            name: product.nombre,
            id: product.id,
            action: `/menu?search=${encodeURIComponent(product.nombre)}`
          })
        })

        // -------------------------------
        // ➕ CATEGORÍAS
        // -------------------------------
        if (Array.isArray(categoriesData)) {
          categoriesData.forEach(category => {
            if (!category?.nombre) return
            index.push({
              type: 'category',
              name: category.nombre,
              id: category.id,
              action: `/menu?category=${encodeURIComponent(category.nombre)}`
            })
          })
        }

        // -------------------------------
        // ➕ SECCIONES DEL SITIO
        // -------------------------------
        const siteSections = [
          { type: 'section', name: 'Contacto', action: '/#contacto' },
          { type: 'section', name: 'Ofertas', action: '/#ofertas' },
          { type: 'section', name: 'Especialidades', action: '/#especialidades' },
          { type: 'section', name: 'Nosotros', action: '/about' },
          { type: 'section', name: 'Reservas', action: '/reservations' },
          { type: 'section', name: 'Menú Completo', action: '/menu' },
          { type: 'section', name: 'Inicio', action: '/' }
        ]

        siteSections.forEach(section => index.push(section))

        setSearchIndex(index)
      } catch (error) {
        console.error('❌ Error loading search data:', error)
        setSearchIndex([])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchData()
  }, [])

  return { searchIndex, loading }
}
