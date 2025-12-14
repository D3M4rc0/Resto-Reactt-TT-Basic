// Validar email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validar teléfono
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

// Validar contraseña
export const validatePassword = (password) => {
  return password && password.length >= 6
}

// Validar datos de producto
export const validateProduct = (product) => {
  const errors = {}
  
  if (!product.nombre || product.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres'
  }
  
  if (!product.precio || parseFloat(product.precio) <= 0) {
    errors.precio = 'El precio debe ser mayor a 0'
  }
  
  if (!product.categoria || product.categoria.trim().length === 0) {
    errors.categoria = 'La categoría es requerida'
  }
  
  if (product.stock !== undefined && parseInt(product.stock) < 0) {
    errors.stock = 'El stock no puede ser negativo'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validar datos de usuario
export const validateUser = (user) => {
  const errors = {}
  
  if (!user.nombre || user.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres'
  }
  
  if (!user.email || !validateEmail(user.email)) {
    errors.email = 'Email inválido'
  }
  
  if (user.telefono && !validatePhone(user.telefono)) {
    errors.telefono = 'Teléfono inválido'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validar datos de reseña
export const validateReview = (review) => {
  const errors = {}
  
  if (!review.calificacion || review.calificacion < 1 || review.calificacion > 5) {
    errors.calificacion = 'La calificación debe ser entre 1 y 5 estrellas'
  }
  
  if (!review.comentario || review.comentario.trim().length < 10) {
    errors.comentario = 'El comentario debe tener al menos 10 caracteres'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validar datos de reserva
export const validateReservation = (reservation) => {
  const errors = {}
  const now = new Date()
  const reservationDate = new Date(reservation.fecha)
  
  if (!reservation.nombre || reservation.nombre.trim().length < 2) {
    errors.nombre = 'El nombre es requerido'
  }
  
  if (!reservation.email || !validateEmail(reservation.email)) {
    errors.email = 'Email inválido'
  }
  
  if (!reservation.telefono || !validatePhone(reservation.telefono)) {
    errors.telefono = 'Teléfono inválido'
  }
  
  if (!reservation.fecha || reservationDate < now) {
    errors.fecha = 'La fecha debe ser futura'
  }
  
  if (!reservation.personas || reservation.personas < 1 || reservation.personas > 10) {
    errors.personas = 'El número de personas debe ser entre 1 y 10'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Sanitizar input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Validar número de tarjeta (Luhn algorithm)
export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s+/g, '')
  
  if (!/^\d+$/.test(cleaned)) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// Validar fecha de expiración
export const validateExpiryDate = (month, year) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  
  const expMonth = parseInt(month)
  const expYear = parseInt(year)
  
  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false
  if (expMonth < 1 || expMonth > 12) return false
  
  return true
}
