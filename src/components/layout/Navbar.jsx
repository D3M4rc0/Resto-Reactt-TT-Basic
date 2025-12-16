import React, { useState, useEffect, useRef } from 'react';
import { useCategories } from '../../hooks/useProducts';
import { useSearchData } from '../../hooks/useSearchData'; 
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]); 
  const [currentScroll, setCurrentScroll] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const { categories: apiCategories } = useCategories();
  const { searchIndex, loading } = useSearchData(); 


  useEffect(() => {
    if (searchTerm.trim() === '' || loading) {
      setSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = searchIndex.filter(item => 
      item.name.toLowerCase().includes(term)
    ).slice(0, 8); ///// Mostrar máximo 8 sugerencias

    setSuggestions(results);
  }, [searchTerm, searchIndex, loading]);


  const performSmartSearch = (term) => {
    const lowerTerm = term.toLowerCase();
    
    ///// Buscar coincidencia exacta primero
    const exactMatch = searchIndex.find(item => 
      item.name.toLowerCase() === lowerTerm
    );
    
    if (exactMatch) {
      navigate(exactMatch.action);
    } else {
      ///// Si no hay coincidencia exacta, buscar parcial
      const partialMatch = searchIndex.find(item => 
        item.name.toLowerCase().includes(lowerTerm)
      );
      
      if (partialMatch) {
        navigate(partialMatch.action);
      } else {
        ///// Búsqueda general
        navigate(`/menu?search=${encodeURIComponent(term)}`);
      }
    }
    
    setSearchTerm('');
    setIsSearchFocused(false);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSmartSearch(searchTerm);
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };


  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.action);
    setSearchTerm('');
    setIsSearchFocused(false);
  };


  useEffect(() => {
    if (apiCategories.length > 0) {
      const restaurantCategories = apiCategories.filter(cat => {
        const categoryName = cat.nombre?.toLowerCase() || '';
        const foodKeywords = [
          'comida', 'bebida', 'postre', 'entrada', 'plato', 'principal',
          'salada', 'dulce', 'ensalada', 'sopa', 'carne', 'pescado',
          'pasta', 'arroz', 'vegetariano', 'vegano', 'aperitivo'
        ];
        
        return foodKeywords.some(keyword => 
          categoryName.includes(keyword)
        ) || [
          'Comidas Saladas',
          'Comidas Dulces', 
          'Bebidas',
          'Entradas',
          'Platos Principales',
          'Postres',
          'Especialidades',
          'Ofertas'
        ].includes(cat.nombre);
      });
      
      const finalCategories = restaurantCategories.length > 0 
        ? restaurantCategories.slice(0, 13)
        : [
            { id: 1, nombre: 'Comidas Saladas' },
            { id: 2, nombre: 'Comidas Dulces' },
            { id: 3, nombre: 'Bebidas' },
            { id: 4, nombre: 'Entradas' },
            { id: 5, nombre: 'Platos Principales' },
            { id: 6, nombre: 'Postres' },
            { id: 7, nombre: 'Especialidades' },
            { id: 8, nombre: 'Ofertas' },
            { id: 9, nombre: 'Ensaladas' },
            { id: 10, nombre: 'Carnes' },
            { id: 11, nombre: 'Pescados' },
            { id: 12, nombre: 'Pastas' },
            { id: 13, nombre: 'Vegetarianos' }
          ];
      
      setCategories(finalCategories);
    }
  }, [apiCategories]);


  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const canScrollLeft = currentScroll > 0;
  const canScrollRight = scrollContainerRef.current && 
    currentScroll < (scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth);

  const handleCategoryClick = (categoryName) => {
    navigate(`/menu?category=${encodeURIComponent(categoryName)}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setIsSearchFocused(false), 200);
  };

  return (
    <nav className="navbar-secondary">
      <div className="container">
        <div className="navbar-secondary__content">

          <div className="navbar-secondary__categories">
            <div className="categories-scroll-container">
              {/* Botón izquierdo */}
              {categories.length > 5 && (
                <button 
                  className={`scroll-indicator scroll-indicator--left ${!canScrollLeft ? 'scroll-indicator--disabled' : ''}`}
                  onClick={scrollLeft}
                  aria-label="Desplazar categorías a la izquierda"
                  disabled={!canScrollLeft}
                >
                  ‹
                </button>
              )}

              {/* Contenedor de categorías con scroll */}
              <div 
                className="categories-scroll"
                ref={scrollContainerRef}
                onScroll={(e) => setCurrentScroll(e.target.scrollLeft)}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className="navbar-secondary__category-btn"
                    onClick={() => handleCategoryClick(category.nombre)}
                  >
                    {category.nombre}
                  </button>
                ))}
              </div>

              {/* Botón derecho */}
              {categories.length > 5 && (
                <button 
                  className={`scroll-indicator scroll-indicator--right ${!canScrollRight ? 'scroll-indicator--disabled' : ''}`}
                  onClick={scrollRight}
                  aria-label="Desplazar categorías a la derecha"
                  disabled={!canScrollRight}
                >
                  ›
                </button>
              )}
            </div>
          </div>


          <div className="navbar-secondary__search-container">
            <form className="navbar-secondary__search" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar productos, categorías, contacto..."
                  className="navbar-secondary__search-input"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  type="submit" 
                  className="navbar-secondary__search-btn"
                  aria-label="Buscar"
                >
                  <span className="search-icon">🔍</span>
                </button>
              </div>


              {isSearchFocused && suggestions.length > 0 && (
                <div className="search-suggestions">
                  <div className="suggestions-list">
                    {suggestions.map((item, index) => (
                      <button
                        key={`${item.type}-${item.id || index}`}
                        className={`suggestion-item suggestion-item--${item.type}`}
                        onClick={() => handleSuggestionClick(item)}
                        onMouseDown={(e) => e.preventDefault()} ///// Evitar blur del input
                      >
                        <span className={`suggestion-icon suggestion-icon--${item.type}`}>
                          {item.type === 'product' && '🍽️'}
                          {item.type === 'category' && '📁'}
                          {item.type === 'section' && '📍'}
                        </span>
                        <span className="suggestion-text">
                          {item.name}
                          <span className="suggestion-type">({item.type})</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}


              {isSearchFocused && searchTerm === '' && !loading && (
                <div className="search-suggestions">
                  <div className="suggestions-header">
                    <span>Búsquedas populares</span>
                  </div>
                  <div className="suggestions-list">
                    {[
                      { name: 'Contacto', type: 'section' },
                      { name: 'Ofertas', type: 'section' },
                      { name: 'Especialidades', type: 'section' },
                      { name: 'Comidas Saladas', type: 'category' },
                      { name: 'Bebidas', type: 'category' }
                    ].map((item, index) => (
                      <button
                        key={index}
                        className={`suggestion-item suggestion-item--${item.type}`}
                        onClick={() => {
                          const action = item.type === 'section' 
                            ? (item.name === 'Contacto' ? '/contact' : 
                               item.name === 'Ofertas' ? '/menu?category=Ofertas' : 
                               item.name === 'Especialidades' ? '/menu?category=Especialidades' : '/')
                            : `/menu?category=${encodeURIComponent(item.name)}`;
                          navigate(action);
                          setSearchTerm('');
                          setIsSearchFocused(false);
                        }}
                      >
                        <span className={`suggestion-icon suggestion-icon--${item.type}`}>
                          {item.type === 'product' && '🍽️'}
                          {item.type === 'category' && '📁'}
                          {item.type === 'section' && '📍'}
                        </span>
                        <span className="suggestion-text">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>


          <div className="navbar-secondary__quick-actions">
            <button 
              className="quick-action-btn"
              onClick={() => navigate('/menu?category=Ofertas')}
              aria-label="Ver ofertas"
            >
              <span className="action-icon">🎁</span>
              <span className="action-text">Ofertas</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => navigate('/menu?category=Especialidades')}
              aria-label="Ver especiales"
            >
              <span className="action-icon">⭐</span>
              <span className="action-text">Especiales</span>
            </button>
          </div>
        </div>


        {(location.search.includes('category=') || location.search.includes('search=')) && (
          <div className="navbar-secondary__active-filters">
            <span className="filters-label">Filtros activos:</span>
            
            {new URLSearchParams(location.search).get('category') && (
              <span className="active-filter">
                Categoría: {new URLSearchParams(location.search).get('category')}
                <button 
                  onClick={() => navigate('/menu')}
                  className="filter-remove"
                >
                  ×
                </button>
              </span>
            )}
            
            {new URLSearchParams(location.search).get('search') && (
              <span className="active-filter">
                Búsqueda: "{new URLSearchParams(location.search).get('search')}"
                <button 
                  onClick={() => navigate('/menu')}
                  className="filter-remove"
                >
                  ×
                </button>
              </span>
            )}

            <button 
              onClick={() => navigate('/menu')}
              className="clear-all-filters"
            >
              Limpiar todos
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;