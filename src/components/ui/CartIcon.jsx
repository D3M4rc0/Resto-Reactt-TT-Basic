import React, { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import Cart from './Cart'

const CartIcon = () => {
  const [showCart, setShowCart] = useState(false)
  const { getCartItemsCount } = useCart()

  const itemCount = getCartItemsCount()

  return (
    <>
      <div className="cart-icon" onClick={() => setShowCart(true)}>
        <svg className="cart-icon__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h9" />
        </svg>
        
        {itemCount > 0 && (
          <span className="cart-icon__badge">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>

      {showCart && (
        <Cart onClose={() => setShowCart(false)} />
      )}
    </>
  )
}

export default CartIcon
