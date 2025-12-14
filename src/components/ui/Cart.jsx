import React, { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, calculateCartTotals } from '../../utils/apiHelpers'
import { useNavigate } from 'react-router-dom'

const Cart = ({ onClose }) => {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { subtotal, iva, total, itemsCount, ahorroTotal } = calculateCartTotals(items)

  const [editingQuantities, setEditingQuantities] = useState({})

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleManualQuantityChange = (productId, value) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      updateQuantity(productId, numValue)
    }
  }

  const handleQuantityInputChange = (productId, e) => {
    const value = e.target.value
    if (value === '') {
      setEditingQuantities(prev => ({ ...prev, [productId]: '' }))
      return
    }

    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      setEditingQuantities(prev => ({ ...prev, [productId]: numValue }))
    }
  }

  const handleQuantityInputBlur = (productId) => {
    const value = editingQuantities[productId]
    if (value !== undefined) {
      if (value === '' || value < 1) {
        // Restaurar la cantidad actual
        const currentItem = items.find(item => item.id === productId)
        if (currentItem) {
          setEditingQuantities(prev => ({ ...prev, [productId]: currentItem.quantity }))
        }
      } else {
        handleManualQuantityChange(productId, value)
        setEditingQuantities(prev => ({ ...prev, [productId]: undefined }))
      }
    }
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
  }

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  const handleContinueShopping = () => {
    onClose()
  }

  if (items.length === 0) {
    return (
      <div className="cart-overlay">
        <div className="cart">
          <div className="cart__header">
            <h2 className="cart__title">Carrito de Compras</h2>
            <button className="cart__close" onClick={onClose}>×</button>
          </div>
          
          <div className="cart__empty">
            <div className="cart__empty-icon">🛒</div>
            <h3 className="cart__empty-title">Tu carrito está vacío</h3>
            <p className="cart__empty-text">Agrega algunos productos deliciosos</p>
            <button className="btn btn-primary" onClick={handleContinueShopping}>
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-overlay">
      <div className="cart">
        <div className="cart__header">
          <h2 className="cart__title">
            Tu Carrito <span className="cart__item-count">({itemsCount} items)</span>
          </h2>
          <button className="cart__close" onClick={onClose}>×</button>
        </div>

        <div className="cart__content">
          <div className="cart__items">
            {items.map((item) => {
              const precioFinal = item.precio_final || item.precio;
              const precioOriginal = item.precio_original || item.precio;
              const tieneDescuento = item.descuento_aplicado && item.descuento_aplicado > 0;
              const displayQuantity = editingQuantities[item.id] !== undefined ? editingQuantities[item.id] : item.quantity;
              
              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item__image">
                    <img 
                      src={item.imagen_url || '/src/assets/images/placeholder-2.webp'} 
                      alt={item.nombre}
                      onError={(e) => {
                        e.target.src = '/src/assets/images/placeholder-2.webp'
                      }}
                    />
                  </div>
                  
                  <div className="cart-item__info">
                    <div className="cart-item__details">
                      <h4 className="cart-item__name">{item.nombre}</h4>
                      <p className="cart-item__category">{item.categoria}</p>
                      
                      <div className="cart-item__prices">
                        {tieneDescuento ? (
                          <div className="cart-item__price-with-discount">
                            <span className="cart-item__price-original">
                              {formatPrice(precioOriginal)}
                            </span>
                            <div className="cart-item__price-final-container">
                              <span className="cart-item__price-final">
                                {formatPrice(precioFinal)}
                              </span>
                              <span className="cart-item__discount-percentage">
                                -{item.descuento_aplicado}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="cart-item__price-single">
                            {formatPrice(precioFinal)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="cart-item__controls">
                      <div className="cart-item__quantity">
                        <button
                          className="quantity-btn quantity-btn--small"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        
                        {/* INPUT PARA CANTIDAD MANUAL */}
                        <input
                          type="number"
                          className="cart-quantity-input"
                          value={displayQuantity}
                          onChange={(e) => handleQuantityInputChange(item.id, e)}
                          onBlur={() => handleQuantityInputBlur(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleQuantityInputBlur(item.id)
                            }
                          }}
                          min="1"
                        />
                        
                        <button
                          className="quantity-btn quantity-btn--small"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item__total-price">
                        {formatPrice(precioFinal * item.quantity)}
                      </div>
                    </div>
                  </div>

                  <button
                    className="cart-item__remove"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Eliminar producto"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart__summary">
            {/* Ahorro total */}
            {ahorroTotal > 0 && (
              <div className="cart__summary-row cart__summary-row--savings">
                <span>Ahorro total:</span>
                <span className="cart__savings-amount">-{formatPrice(ahorroTotal)}</span>
              </div>
            )}
            
            <div className="cart__summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="cart__summary-row">
              <span>IVA (21%):</span>
              <span>{formatPrice(iva)}</span>
            </div>
            <div className="cart__summary-row cart__summary-row--total">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="cart__actions">
              <button
                className="btn btn-outline cart__clear-btn"
                onClick={clearCart}
              >
                Vaciar Carrito
              </button>
              
              <button
                className="btn btn-primary cart__checkout-btn"
                onClick={handleCheckout}
              >
                Proceder al Pago
              </button>
            </div>

            {!user && (
              <div className="cart__login-notice">
                <p>💡 <a href="/login">Inicia sesión</a> para guardar tu carrito</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart