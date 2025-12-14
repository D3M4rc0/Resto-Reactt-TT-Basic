import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProductDetail } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { useReviews } from '../hooks/useReviews'
import { formatPrice, generateStarRating } from '../utils/apiHelpers'
import Loading from '../components/ui/Loading'
import ProductCard from '../components/ui/ProductCard'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, reviews, loading, error } = useProductDetail(id)
  const { addToCart } = useCart()
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    if (product) {
      // Simular productos relacionados (en producción vendría de la API)
      const mockRelated = [
        { ...product, id: product.id + 1, nombre: `${product.nombre} Especial` },
        { ...product, id: product.id + 2, nombre: `Variación ${product.nombre}` },
        { ...product, id: product.id + 3, nombre: `Combo ${product.nombre}` }
      ]
      setRelatedProducts(mockRelated)
    }
  }, [product])

  const handleQuantityChange = (change) => {
    const newQuantity = selectedQuantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setSelectedQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    for (let i = 0; i < selectedQuantity; i++) {
      addToCart(product)
    }
    
    // Mostrar feedback (podría ser un toast)
    alert(`¡${selectedQuantity} ${product.nombre} agregado(s) al carrito!`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <Loading message="Cargando producto..." />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-error">
            <h1>Producto no encontrado</h1>
            <p>{error || 'El producto que buscas no existe.'}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/menu')}
            >
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    )
  }

  const starRating = generateStarRating(4.5) // Hardcodeado por ahora

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')}>Inicio</button>
          <span>›</span>
          <button onClick={() => navigate('/menu')}>Menú</button>
          <span>›</span>
          <button onClick={() => navigate(`/menu?category=${product.categoria}`)}>
            {product.categoria}
          </button>
          <span>›</span>
          <span className="breadcrumb-current">{product.nombre}</span>
        </nav>

        {/* Producto Principal */}
        <div className="product-detail">
          <div className="product-detail__gallery">
            <div className="product-main-image">
              <img 
                src={product.imagen_url || '/src/assets/images/placeholder-2.webp'} 
                alt={product.nombre}
                onError={(e) => {
                  e.target.src = '/src/assets/images/placeholder-2.webp'
                }}
              />
            </div>
          </div>

          <div className="product-detail__info">
            <div className="product-header">
              <h1 className="product-title">{product.nombre}</h1>
              
              <div className="product-rating">
                <div className="product-stars">
                  {starRating.stars}
                </div>
                <span className="product-rating-text">
                  {starRating.numeric} ({reviews.length} reseñas)
                </span>
              </div>

              <div className="product-price">
                {formatPrice(product.precio)}
              </div>

              <div className="product-meta">
                <div className="product-meta-item">
                  <strong>Categoría:</strong> {product.categoria}
                </div>
                <div className="product-meta-item">
                  <strong>Marca:</strong> {product.marca}
                </div>
                <div className="product-meta-item">
                  <strong>SKU:</strong> {product.sku}
                </div>
                <div className="product-meta-item">
                  <strong>Disponibilidad:</strong>
                  <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                    {product.stock > 0 ? `En stock (${product.stock})` : 'Agotado'}
                  </span>
                </div>
              </div>
            </div>

            <div className="product-description-short">
              <p>{product.descripcion}</p>
            </div>

            {/* Cantidad y Acciones */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={selectedQuantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{selectedQuantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={selectedQuantity >= (product.stock || 10)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-primary btn--add-to-cart"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  🛒 Agregar al Carrito
                </button>
                <button
                  className="btn btn-secondary btn--buy-now"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                >
                  Comprar Ahora
                </button>
              </div>
            </div>

            {/* Información de Entrega */}
            <div className="delivery-info">
              <div className="delivery-item">
                <span className="delivery-icon">🚚</span>
                <div>
                  <strong>Envío gratis</strong>
                  <p>En pedidos superiores a $5000</p>
                </div>
              </div>
              <div className="delivery-item">
                <span className="delivery-icon">⏰</span>
                <div>
                  <strong>Entrega rápida</strong>
                  <p>30-45 minutos</p>
                </div>
              </div>
              <div className="delivery-item">
                <span className="delivery-icon">💳</span>
                <div>
                  <strong>Pago seguro</strong>
                  <p>Múltiples métodos de pago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Información */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Descripción
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reseñas ({reviews.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'ingredients' ? 'tab-btn--active' : ''}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredientes
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-panel">
                <h3>Descripción Detallada</h3>
                <p>{product.descripcion}</p>
                <p>
                  Este producto forma parte de nuestra selección premium, elaborado 
                  con los mejores ingredientes y técnicas culinarias tradicionales 
                  combinadas con innovación gastronómica.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-panel">
                <h3>Opiniones de Clientes</h3>
                
                {reviews.length === 0 ? (
                  <div className="no-reviews">
                    <p>Este producto aún no tiene reseñas.</p>
                    <button className="btn btn-outline">
                      Sé el primero en opinar
                    </button>
                  </div>
                ) : (
                  <div className="reviews-list">
                    {reviews.map(review => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="review-rating">
                            {generateStarRating(review.calificacion).stars}
                          </div>
                          <div className="review-meta">
                            <strong>Usuario {review.usuario_id}</strong>
                            <span>{new Date(review.fecha_review).toLocaleDateString('es-AR')}</span>
                          </div>
                        </div>
                        <p className="review-comment">{review.comentario}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="tab-panel">
                <h3>Ingredientes y Alérgenos</h3>
                <div className="ingredients-list">
                  <h4>Ingredientes Principales:</h4>
                  <ul>
                    <li>Ingrediente fresco de primera calidad</li>
                    <li>Especias seleccionadas</li>
                    <li>Aceite de oliva extra virgen</li>
                    <li>Sal marina</li>
                    <li>Hierbas aromáticas</li>
                  </ul>
                  
                  <h4>Información Nutricional (por porción):</h4>
                  <div className="nutrition-facts">
                    <div className="nutrition-item">
                      <span>Calorías:</span>
                      <span>250 kcal</span>
                    </div>
                    <div className="nutrition-item">
                      <span>Proteínas:</span>
                      <span>15g</span>
                    </div>
                    <div className="nutrition-item">
                      <span>Carbohidratos:</span>
                      <span>20g</span>
                    </div>
                    <div className="nutrition-item">
                      <span>Grasas:</span>
                      <span>12g</span>
                    </div>
                  </div>

                  <div className="allergens">
                    <h4>Contiene:</h4>
                    <div className="allergen-tags">
                      <span className="allergen-tag">🌾 Gluten</span>
                      <span className="allergen-tag">🥛 Lácteos</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>Productos Relacionados</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct} 
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
