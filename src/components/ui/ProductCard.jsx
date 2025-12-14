import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, generateStarRating, truncateText } from '../../utils/apiHelpers'
import Modal from './Modal'

const ProductCard = ({ product, onViewDetails, hideModal = false }) => {
  const [imageError, setImageError] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  // Generar descuento aleatorio entre 5% y 30%
  const generateRandomDiscount = (productId) => {
    const seed = productId || 1;
    const random = (Math.sin(seed * 100) + 1) / 2;
    
    const minDiscount = 5;
    const maxDiscount = 30;
    const discount = Math.floor(random * (maxDiscount - minDiscount + 1)) + minDiscount;
    
    return discount;
  };

  // Determinar si el producto está en oferta (todos con precio > 20)
  const isOnSale = product.precio > 20;
  
  // Calcular descuento aleatorio
  const saleDiscount = isOnSale ? generateRandomDiscount(product.id) : 0;
  
  // Calcular precio con descuento
  const discountPrice = isOnSale 
    ? product.precio * (1 - saleDiscount / 100)
    : product.precio;

  // Si hideModal es true, usa la función onViewDetails en lugar del modal local
  const handleCardClick = () => {
    if (hideModal && onViewDetails) {
      onViewDetails()
    } else {
      setShowModal(true)
    }
  }

  const handleAddToCart = (e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    const productWithDiscount = {
      ...product,
      precio_final: discountPrice,
      descuento_aplicado: saleDiscount,
      precio_original: product.precio
    }
    addToCart(productWithDiscount)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleAddToCartFromModal = () => {
    const productWithDiscount = {
      ...product,
      precio_final: discountPrice,
      descuento_aplicado: saleDiscount,
      precio_original: product.precio
    }
    addToCart(productWithDiscount)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setSelectedImage(product.imagen_url)
  }

  const handleCloseImageModal = (e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setSelectedImage(null)
  }

  return (
    <>
      <div className="product-card" onClick={handleCardClick}>
        <div className="product-card__image-container">
          <img
            src={imageError ? '/src/assets/images/placeholder-2.webp' : product.imagen_url}
            alt={product.nombre}
            className="product-card__image"
            onError={handleImageError}
            onClick={handleImageClick}
            loading="lazy"
          />
          {isOnSale && (
            <div className="product-card__badge product-card__badge--sale">
              -{saleDiscount}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="product-card__badge product-card__badge--out-of-stock">
              Agotado
            </div>
          )}
          <div className="product-card__overlay">
            <button 
              className="btn btn-primary product-card__quick-view"
              onClick={(e) => {
                e.stopPropagation()
                if (hideModal && onViewDetails) {
                  onViewDetails()
                } else {
                  setShowModal(true)
                }
              }}
            >
              Ver Detalles
            </button>
          </div>
        </div>

        <div className="product-card__content">
          <h3 className="product-card__title">{product.nombre}</h3>
          <p className="product-card__description">
            {truncateText(product.descripcion, 80)}
          </p>
          
          <div className="product-card__category">
            {product.categoria}
          </div>

          <div className="product-card__rating">
            <span className="product-card__stars">
              {generateStarRating(4.5).stars}
            </span>
            <span className="product-card__rating-text">(24)</span>
          </div>

          <div className="product-card__footer">
            <div className="product-card__price">
              {isOnSale ? (
                <>
                  <span className="product-card__price--old">
                    {formatPrice(product.precio)}
                  </span>
                  <span className="product-card__price--current">
                    {formatPrice(discountPrice.toFixed(2))}
                  </span>
                </>
              ) : (
                <span className="product-card__price--current">
                  {formatPrice(product.precio)}
                </span>
              )}
              <div className="product-card__currency-note">
                Precios en ARS, consultar en USD
              </div>
            </div>

            <button
              className={`btn ${
                product.stock === 0 
                  ? 'btn-disabled' 
                  : 'btn-primary'
              } product-card__add-btn`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Agotado' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>

      {!hideModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ProductModal 
            product={product} 
            onAddToCart={handleAddToCartFromModal} 
            onImageClick={handleImageClick}
            saleDiscount={saleDiscount}
            discountPrice={discountPrice}
            isOnSale={isOnSale}
          />
        </Modal>
      )}

      {/* Modal de imagen con createPortal */}
      {selectedImage && createPortal(
        <div 
          className="image-modal-overlay" 
          onClick={handleCloseImageModal}
        >
          <div 
            className="image-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="image-modal__close"
              onClick={handleCloseImageModal}
            >
              ×
            </button>
            <img src={selectedImage} alt={product.nombre} />
          </div>
        </div>,
        document.body
      )}

      {/* Alerta con createPortal */}
      {showAlert && createPortal(
        <div className="cart-alert">
          <div className="cart-alert__content">
            <span className="cart-alert__icon">✅</span>
            <span className="cart-alert__text">Producto agregado al carrito</span>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

const ProductModal = ({ product, onAddToCart, onImageClick, saleDiscount, discountPrice, isOnSale }) => {
  const [imageError, setImageError] = useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [inputError, setInputError] = useState('')
  const [showEmptyPlaceholder, setShowEmptyPlaceholder] = useState(false)

  const actualIsOnSale = isOnSale !== undefined ? isOnSale : (product.precio > 20);
  const actualSaleDiscount = saleDiscount !== undefined ? saleDiscount : 
    (actualIsOnSale ? Math.floor(Math.random() * 26) + 5 : 0);
  const actualDiscountPrice = discountPrice !== undefined ? discountPrice : 
    (actualIsOnSale ? product.precio * (1 - actualSaleDiscount / 100) : product.precio);

  const handleImageError = () => {
    setImageError(true)
  }

  const handleQuantityChange = (change) => {
    const currentValue = showEmptyPlaceholder ? 1 : selectedQuantity;
    const newQuantity = currentValue + change;
    
    if (newQuantity >= 1 && newQuantity <= (product.stock || 99)) {
      setSelectedQuantity(newQuantity);
      setShowEmptyPlaceholder(false);
      setInputError('');
    }
  }

  const handleQuantityInputChange = (e) => {
    const value = e.target.value;
    
    if (value === '') {
      setShowEmptyPlaceholder(true);
      setInputError('');
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    if (isNaN(numValue)) {
      setInputError('Por favor ingresa un número válido');
      setShowEmptyPlaceholder(false);
      return;
    }
    
    if (numValue < 1) {
      setInputError('La cantidad debe ser mayor a 0');
      setShowEmptyPlaceholder(false);
      setSelectedQuantity(1);
      return;
    }
    
    const maxStock = product.stock || 99;
    if (numValue > maxStock) {
      setInputError(`Solo ${maxStock} disponibles en stock`);
      setShowEmptyPlaceholder(false);
      setSelectedQuantity(maxStock);
      return;
    }
    
    setSelectedQuantity(numValue);
    setShowEmptyPlaceholder(false);
    setInputError('');
  }

  const handleInputBlur = () => {
    if (showEmptyPlaceholder) {
      // Se mantiene el placeholder visible
    }
  }

  const handleInputFocus = () => {
    setShowEmptyPlaceholder(false);
  }

  const handleQuickQuantity = (qty) => {
    if (qty >= 1 && qty <= (product.stock || 99)) {
      setSelectedQuantity(qty);
      setShowEmptyPlaceholder(false);
      setInputError('');
    }
  }

  const handleAddToCartWithQuantity = () => {
    const qty = showEmptyPlaceholder ? 1 : selectedQuantity;
    
    const productWithDiscount = {
      ...product,
      precio_final: actualDiscountPrice,
      descuento_aplicado: actualSaleDiscount,
      precio_original: product.precio
    }
    
    for (let i = 0; i < qty; i++) {
      onAddToCart(productWithDiscount);
    }
    
    if (showEmptyPlaceholder) {
      setSelectedQuantity(1);
      setShowEmptyPlaceholder(false);
    }
  }

  const handleModalImageClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onImageClick(e)
  }

  const priceToShow = actualIsOnSale ? actualDiscountPrice : product.precio;
  const displayQuantity = showEmptyPlaceholder ? 1 : selectedQuantity;
  const totalPrice = priceToShow * displayQuantity;

  const isValidQuantity = showEmptyPlaceholder || 
    (selectedQuantity >= 1 && selectedQuantity <= (product.stock || 99));

  return (
    <div className="product-modal">
      <div className="product-modal__image-wrapper">
        <div className="product-modal__image">
          <img
            src={imageError ? '/src/assets/images/placeholder-2.webp' : product.imagen_url}
            alt={product.nombre}
            onError={handleImageError}
            onClick={handleModalImageClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
        {actualIsOnSale && (
          <div className="product-modal__discount-badge">
            -{actualSaleDiscount}% OFF
          </div>
        )}
      </div>
      
      <div className="product-modal__content">
        <h2 className="product-modal__title">{product.nombre}</h2>
        
        <div className="product-modal__category">
          {product.categoria}
        </div>

        <div className="product-modal__rating">
          <span className="product-modal__stars">
            {generateStarRating(4.5).stars}
          </span>
          <span className="product-modal__rating-text">24 reseñas</span>
        </div>

        <p className="product-modal__description">
          {product.descripcion}
        </p>

        <div className="product-modal__details">
          <div className="product-modal__detail">
            <strong>Marca:</strong> {product.marca || "Chef's Delight"}
          </div>
          <div className="product-modal__detail">
            <strong>SKU:</strong> {product.sku || `RES-${product.id}`}
          </div>
          <div className="product-modal__detail">
            <strong>Disponibilidad:</strong> 
            <span className={product.stock > 0 ? 'text-success' : 'text-danger'}>
              {product.stock > 0 ? `En stock (${product.stock || 47})` : 'Agotado'}
            </span>
          </div>
        </div>

        <div className="product-modal__price">
          {actualIsOnSale ? (
            <div className="discount-price-container">
              <span className="original-price">
                {formatPrice(product.precio)}
              </span>
              <span className="current-price">
                {formatPrice(actualDiscountPrice)}
              </span>
              <span className="discount-percentage">
                Ahorras {actualSaleDiscount}%
              </span>
            </div>
          ) : (
            <span className="current-price">
              {formatPrice(product.precio)}
            </span>
          )}
          <div className="product-modal__currency-note">
            Precios en ARS, consultar en USD
          </div>
        </div>

        <div className="product-modal__actions">
          <div className="product-modal__quantity-section">
            <div className="product-modal__quantity-label">Cantidad:</div>
            <div className="product-modal__quantity">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={displayQuantity <= 1}
              >
                -
              </button>
              
              <div className="quantity-input-wrapper">
                <input
                  type="number"
                  className="quantity-input"
                  value={showEmptyPlaceholder ? '' : selectedQuantity}
                  onChange={handleQuantityInputChange}
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocus}
                  min="1"
                  max={product.stock || 99}
                />
                {showEmptyPlaceholder && (
                  <div className="quantity-input-placeholder">1</div>
                )}
              </div>
              
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={displayQuantity >= (product.stock || 99)}
              >
                +
              </button>
            </div>
            
            {inputError && (
              <div className="product-modal__input-error">
                {inputError}
              </div>
            )}
            
            <div className="product-modal__quick-quantities">
              <button 
                className="quick-quantity-btn"
                onClick={() => handleQuickQuantity(5)}
              >
                5
              </button>
              <button 
                className="quick-quantity-btn"
                onClick={() => handleQuickQuantity(10)}
              >
                10
              </button>
              <button 
                className="quick-quantity-btn"
                onClick={() => handleQuickQuantity(25)}
              >
                25
              </button>
              <button 
                className="quick-quantity-btn"
                onClick={() => handleQuickQuantity(50)}
              >
                50
              </button>
            </div>
            
            {isValidQuantity && displayQuantity > (product.stock || 0) && product.stock > 0 && (
              <div className="product-modal__stock-warning">
                Solo {product.stock} disponibles en stock
              </div>
            )}
          </div>

          <button
            className="btn btn-primary product-modal__add-btn"
            onClick={handleAddToCartWithQuantity}
            disabled={product.stock === 0 || !isValidQuantity}
          >
            Agregar al Carrito - {formatPrice(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard