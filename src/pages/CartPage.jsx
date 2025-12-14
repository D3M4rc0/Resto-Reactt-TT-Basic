import React from 'react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { formatPrice, calculateCartTotals } from '../utils/apiHelpers'

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const { subtotal, iva, total, itemsCount } = calculateCartTotals(items)

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
  }

  const handleCheckout = () => {
    if (!user) {
      // Redirigir a login si no está autenticado
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  const handleContinueShopping = () => {
    navigate('/menu')
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-page__empty">
            <div className="cart-page__empty-icon">🛒</div>
            <h1 className="cart-page__empty-title">Tu carrito está vacío</h1>
            <p className="cart-page__empty-text">
              Parece que aún no has agregado productos a tu carrito.
            </p>
            <button 
              className="btn btn-primary cart-page__empty-btn"
              onClick={handleContinueShopping}
            >
              Explorar Menú
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">Mi Carrito</h1>
          <p className="cart-page__subtitle">
            Revisa tus productos antes de proceder al pago
          </p>
        </div>

        <div className="cart-page__content">
          {/* Lista de Productos */}
          <div className="cart-page__items">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item cart-item--page">
                  <div className="cart-item__image">
                    <img 
                      src={item.imagen_url || '/src/assets/images/placeholder-2.webp'} 
                      alt={item.nombre}
                      onError={(e) => {
                        e.target.src = '/src/assets/images/placeholder-2.webp'
                      }}
                    />
                  </div>
                  
                  <div className="cart-item__details">
                    <h3 className="cart-item__name">{item.nombre}</h3>
                    <p className="cart-item__category">{item.categoria}</p>
                    <p className="cart-item__description">
                      {item.descripcion?.substring(0, 100)}...
                    </p>
                    <div className="cart-item__price-single">
                      {formatPrice(item.precio)} c/u
                    </div>
                  </div>

                  <div className="cart-item__quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">
                      {item.quantity}
                    </span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item__total">
                    <div className="cart-item__total-amount">
                      {formatPrice(item.precio * item.quantity)}
                    </div>
                    <button
                      className="cart-item__remove"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Acciones del Carrito */}
            <div className="cart-page__actions">
              <button
                className="btn btn-outline cart-page__clear-btn"
                onClick={clearCart}
              >
                Vaciar Carrito
              </button>
              <button
                className="btn btn-outline cart-page__continue-btn"
                onClick={handleContinueShopping}
              >
                Seguir Comprando
              </button>
            </div>
          </div>

          {/* Resumen del Pedido */}
          <div className="cart-page__summary">
            <div className="order-summary">
              <h3 className="order-summary__title">Resumen del Pedido</h3>
              
              <div className="order-summary__details">
                <div className="order-summary__row">
                  <span>Productos ({itemsCount}):</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="order-summary__row">
                  <span>Envío:</span>
                  <span className="text-success">Gratis</span>
                </div>
                <div className="order-summary__row">
                  <span>IVA (21%):</span>
                  <span>{formatPrice(iva)}</span>
                </div>
                <div className="order-summary__divider"></div>
                <div className="order-summary__row order-summary__row--total">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="order-summary__actions">
                <button
                  className="btn btn-primary order-summary__checkout-btn"
                  onClick={handleCheckout}
                >
                  {user ? 'Proceder al Pago' : 'Iniciar Sesión para Pagar'}
                </button>
              </div>

              {!user && (
                <div className="order-summary__login-notice">
                  <p>💡 <strong>Inicia sesión</strong> para:</p>
                  <ul>
                    <li>Guardar tu carrito</li>
                    <li>Acumular puntos</li>
                    <li>Historial de pedidos</li>
                  </ul>
                </div>
              )}

              {/* Beneficios */}
              <div className="order-summary__benefits">
                <h4>Beneficios de tu compra:</h4>
                <div className="benefits-list">
                  <div className="benefit">
                    <span className="benefit__icon">🚚</span>
                    <span>Envío gratis en pedidos +$5000</span>
                  </div>
                  <div className="benefit">
                    <span className="benefit__icon">⏰</span>
                    <span>Entrega en 30-45 minutos</span>
                  </div>
                  <div className="benefit">
                    <span className="benefit__icon">💳</span>
                    <span>Múltiples métodos de pago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
