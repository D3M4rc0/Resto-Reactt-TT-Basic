import { useState, useEffect } from 'react'
import { productService, categoryService } from '../services/api'

export const useSearchData = () => {
  const [searchIndex, setSearchIndex] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        setLoading(true)
        
        // ✅ OBTENER 27 PRODUCTOS COMPLETOS
        const productsResponse = await productService.getAllProducts()
        const productsData = productsResponse.data?.data || productsResponse.data || []
        
        // ✅ OBTENER CATEGORÍAS
        const categoriesResponse = await categoryService.getCategories()
        const categoriesData = categoriesResponse.data?.data || categoriesResponse.data || []

        // ✅ CREAR ÍNDICE DE BÚSQUEDA
        const index = []

        // Agregar productos
        productsData.forEach(product => {
          index.push({
            type: 'product',
            name: product.nombre,
            id: product.id,
            action: `/menu?search=${encodeURIComponent(product.nombre)}`
          })
        })

        // Agregar categorías
        categoriesData.forEach(category => {
          index.push({
            type: 'category',
            name: category.nombre,
            id: category.id,
            action: `/menu?category=${encodeURIComponent(category.nombre)}`
          })
        })

        // ✅ AGREGAR SECCIONES DEL SITIO
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
        console.error('Error loading search data:', error)
        setSearchIndex([])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchData()
  }, [])

  return { searchIndex, loading }
}