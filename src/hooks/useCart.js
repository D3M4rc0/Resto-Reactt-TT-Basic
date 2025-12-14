import { useCart as useCartContext } from '../context/CartContext'
import { cartService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export const useCartOperations = () => {
  const { user } = useAuth()
  const { 
    items, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartTotal,
    getCartItemsCount 
  } = useCartContext()

  // Agregar producto al carrito con sync a API si el usuario está logueado
  const addToCartWithSync = async (product) => {
    addToCart(product)
    
    if (user) {
      try {
        // ===== MODIFICADO: Usar precio_final si existe =====
        const precioParaAPI = product.precio_final || product.precio;
        
        await cartService.addToCart({
          usuario_id: user.id,
          producto_id: product.id,
          cantidad: 1,
          precio_unitario: precioParaAPI // Usar precio con descuento
        })
      } catch (error) {
        console.error('Error syncing cart to API:', error)
      }
    }
  }

  // Actualizar cantidad con sync a API
  const updateQuantityWithSync = async (productId, quantity) => {
    updateQuantity(productId, quantity)
    
    if (user) {
      try {
        console.log('Quantity update would sync to API for user:', user.id)
      } catch (error) {
        console.error('Error syncing quantity to API:', error)
      }
    }
  }

  // Remover producto con sync a API
  const removeFromCartWithSync = async (productId) => {
    removeFromCart(productId)
    
    if (user) {
      try {
        console.log('Remove would sync to API for user:', user.id)
      } catch (error) {
        console.error('Error syncing remove to API:', error)
      }
    }
  }

  // Sincronizar carrito local con API al login
  const syncCartWithAPI = async () => {
    if (user && items.length > 0) {
      try {
        // Limpiar carrito remoto primero
        await cartService.clearCart(user.id)
        
        // Agregar todos los items del carrito local
        for (const item of items) {
          // ===== MODIFICADO: Usar precio_final si existe =====
          const precioParaAPI = item.precio_final || item.precio;
          
          await cartService.addToCart({
            usuario_id: user.id,
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: precioParaAPI // Usar precio con descuento
          })
        }
        
        console.log('Cart synced successfully with API')
      } catch (error) {
        console.error('Error syncing cart with API:', error)
      }
    }
  }

  return {
    items,
    addToCart: addToCartWithSync,
    removeFromCart: removeFromCartWithSync,
    updateQuantity: updateQuantityWithSync,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    syncCartWithAPI
  }
}

// Exportación adicional para mantener compatibilidad
export const useCart = useCartOperations