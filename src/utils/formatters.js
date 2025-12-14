import { APP_CONFIG } from './constants'

// Formatear precio
export const formatPrice = (price) => {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0
  }
  
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: APP_CONFIG.CURRENCY,
    minimumFractionDigits: 2
  }).format(price)
}

// Formatear fecha
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return new Date(dateString).toLocaleDateString('es-AR', {
    ...defaultOptions,
    ...options
  })
}

// Formatear hora
export const formatTime = (timeString) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear nombre de usuario
export const formatUserName = (user) => {
  if (!user) return 'Usuario'
  
  if (user.nombre_completo) {
    return user.nombre_completo
  }
  
  if (user.nombre && user.apellido) {
    return `${user.nombre} ${user.apellido}`
  }
  
  if (user.nombre) {
    return user.nombre
  }
  
  return user.email?.split('@')[0] || 'Usuario'
}

// Formatear dirección
export const formatAddress = (address) => {
  if (!address) return 'Dirección no especificada'
  
  const { direccion, ciudad, codigo_postal, pais } = address
  const parts = [direccion]
  
  if (ciudad) parts.push(ciudad)
  if (codigo_postal) parts.push(codigo_postal)
  if (pais) parts.push(pais)
  
  return parts.join(', ')
}

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  
  return text.substring(0, maxLength).trim() + '...'
}

// Generar SKU único
export const generateSKU = (category, id) => {
  const prefix = category ? category.substring(0, 3).toUpperCase() : 'PRO'
  return `${prefix}-${String(id).padStart(5, '0')}`
}

// Calcular tiempo estimado de entrega
export const calculateDeliveryTime = (orderType) => {
  const baseTime = orderType === 'delivery' ? 40 : 25 // minutos
  const randomVariation = Math.floor(Math.random() * 10) // ±5 minutos
  return baseTime + randomVariation
}
