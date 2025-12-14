import React from 'react'
import { useNavigate } from 'react-router-dom'

const CategoryCard = ({ category }) => {
  const navigate = useNavigate()

  const handleCategoryClick = () => {
    navigate(`/menu?category=${encodeURIComponent(category.nombre)}`)
  }

  return (
    <div className="category-card" onClick={handleCategoryClick}>
      <div className="category-card__image">
        <img 
          src={category.imagen_url || '/src/assets/images/placeholder-2.webp'} 
          alt={category.nombre}
          onError={(e) => {
            e.target.src = '/src/assets/images/placeholder-2.webp'
          }}
        />
        <div className="category-card__overlay"></div>
      </div>
      
      <div className="category-card__content">
        <h3 className="category-card__title">{category.nombre}</h3>
        <p className="category-card__description">
          {category.descripcion || 'Descubre nuestros deliciosos platos'}
        </p>
        <div className="category-card__count">
          {category.producto_count || '10+'} productos
        </div>
        <button className="category-card__btn">
          Ver Categoría
        </button>
      </div>
    </div>
  )
}

export default CategoryCard
