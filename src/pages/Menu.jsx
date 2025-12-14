import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts, useCategories } from '../hooks/useProducts'
import ProductCard from '../components/ui/ProductCard'
import Loading from '../components/ui/Loading'
import Pagination from '../components/ui/Pagination'

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')
  
  // ✅ CORREGIR: OBTENER TODOS LOS PRODUCTOS SIN PAGINACIÓN PARA FILTRADO
  const { products: allProducts, loading, error } = useProducts(1, 100) // Obtener muchos productos
  const { categories } = useCategories()

  // ✅ FILTRAR SOLO CATEGORÍAS RELEVANTES - MÁS FLEXIBLE
  const relevantCategories = categories.filter(cat => {
    const catName = cat.nombre?.toLowerCase() || '';
    return (
      catName.includes('salada') || 
      catName.includes('dulce') || 
      catName.includes('bebida') ||
      catName === 'comidas saladas' ||
      catName === 'comidas dulces' ||
      catName === 'bebidas'
    );
  });

  // Sync URL params with state
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1
    const category = searchParams.get('category') || 'todos'
    const search = searchParams.get('search') || ''
    
    setCurrentPage(page)
    setSelectedCategory(category)
    setSearchQuery(search)
  }, [searchParams])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSearchParams(prev => {
      prev.set('page', page.toString())
      return prev
    })
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    setSearchParams(prev => {
      prev.set('category', category)
      prev.set('page', '1')
      if (searchQuery) prev.delete('search')
      return prev
    })
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
    setSearchParams(prev => {
      if (query) {
        prev.set('search', query)
      } else {
        prev.delete('search')
      }
      prev.set('page', '1')
      return prev
    })
  }

  // ✅ CORREGIR: FILTRAR TODOS LOS PRODUCTOS Y LUEGO PAGINAR
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'todos' || 
                           product.categoria?.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = !searchQuery || 
                         product.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  // ✅ PAGINACIÓN MANUAL SOBRE PRODUCTOS FILTRADOS
  const productsPerPage = 9;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  if (error) {
    return (
      <div className="menu-page">
        <div className="container">
          <div className="error-message">
            <h2>Error al cargar el menú</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="menu-page">
      {/* ✅ BANNER CORREGIDO - FUERA DEL CONTAINER */}
      <div className="menu-page__banner">
        <div className="menu-page__banner-overlay"></div>
        {/* ✅ QUITAMOS EL container de aquí para ancho completo */}
        <div className="menu-page__header">
          <h1 className="menu-page__title">Nuestro Menú Completo</h1>
          <p className="menu-page__subtitle">
            Descubre nuestra exquisita selección de platos preparados con los mejores ingredientes
          </p>
          <div className="menu-page__title-line"></div>
        </div>
      </div>

      <div className="container">
        {/* Filtros y Búsqueda */}
        <div className="menu-page__filters">
          <div className="menu-page__categories">
            <button
              className={`menu-page__category-btn ${selectedCategory === 'todos' ? 'menu-page__category-btn--active' : ''}`}
              onClick={() => handleCategoryChange('todos')}
            >
              Todos
            </button>
            
            {/* ✅ MOSTRAR CATEGORÍAS RELEVANTES */}
            {relevantCategories.length > 0 ? (
              relevantCategories.map(category => (
                <button
                  key={category.id}
                  className={`menu-page__category-btn ${selectedCategory === category.nombre ? 'menu-page__category-btn--active' : ''}`}
                  onClick={() => handleCategoryChange(category.nombre)}
                >
                  {category.nombre}
                </button>
              ))
            ) : (
              // ✅ FALLBACK POR SI NO HAY CATEGORÍAS DE LA API
              <>
                <button
                  className={`menu-page__category-btn ${selectedCategory === 'Comidas Saladas' ? 'menu-page__category-btn--active' : ''}`}
                  onClick={() => handleCategoryChange('Comidas Saladas')}
                >
                  Comidas Saladas
                </button>
                <button
                  className={`menu-page__category-btn ${selectedCategory === 'Comidas Dulces' ? 'menu-page__category-btn--active' : ''}`}
                  onClick={() => handleCategoryChange('Comidas Dulces')}
                >
                  Comidas Dulces
                </button>
                <button
                  className={`menu-page__category-btn ${selectedCategory === 'Bebidas' ? 'menu-page__category-btn--active' : ''}`}
                  onClick={() => handleCategoryChange('Bebidas')}
                >
                  Bebidas
                </button>
              </>
            )}
          </div>

          {/* ✅ BÚSQUEDA CON ESTILOS CORRECTOS */}
          <div className="navbar-secondary__search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="navbar-secondary__search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery)
                  }
                }}
              />
              <button 
                onClick={() => handleSearch(searchQuery)}
                className="navbar-secondary__search-btn"
                aria-label="Buscar"
                type="button"
              >
                <span className="search-icon">🔍</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resultados de Búsqueda */}
        {searchQuery && (
          <div className="menu-page__search-results">
            <p>
              {filteredProducts.length > 0 
                ? `Se encontraron ${filteredProducts.length} productos para "${searchQuery}"`
                : `No se encontraron productos para "${searchQuery}"`
              }
            </p>
            <button 
              className="menu-page__clear-search"
              onClick={() => handleSearch('')}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Grid de Productos */}
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="menu-page__products">
              <div className="products-grid">
                {/* ✅ USAR PRODUCTOS PAGINADOS CORRECTAMENTE */}
                {currentProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* ✅ PAGINACIÓN CORRECTA */}
            {filteredProducts.length > productsPerPage && (
              <div className="menu-page__pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Mensaje sin resultados */}
            {filteredProducts.length === 0 && !loading && (
              <div className="menu-page__empty">
                <div className="menu-page__empty-icon">🍽️</div>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otra categoría o término de búsqueda</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedCategory('todos')
                    setSearchQuery('')
                    setSearchParams({})
                  }}
                >
                  Ver todos los productos
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Menu