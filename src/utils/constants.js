// Constantes de la aplicación
export const APP_CONFIG = {
  NAME: 'Le Marc Gourmet',
  DESCRIPTION: 'Restaurante de alta cocina con experiencia gastronómica única',
  API_BASE_URL: 'https://api-resto-datasuitepro-production.up.railway.app/api/v1',
  DEFAULT_PAGE_SIZE: 9,
  MAX_PAGE_SIZE: 27,
  CURRENCY: 'ARS',
  IVA_PERCENTAGE: 21,
  RESERVATION_HOURS: {
    LUNCH: ['12:00', '13:00', '14:00', '15:00'],
    DINNER: ['19:00', '20:00', '21:00', '22:00', '23:00']
  }
}

// Categorías del restaurante
export const CATEGORIES = {
  COMIDAS_SALADAS: 'Comidas Saladas',
  COMIDAS_DULCES: 'Comidas Dulces',
  BEBIDAS: 'Bebidas',
  ENTRADAS: 'Entradas',
  PLATO_PRINCIPAL: 'Plato Principal',
  POSTRES: 'Postres',
  BEBIDAS_ALCOHOLICAS: 'Bebidas Alcohólicas',
  BEBIDAS_SIN_ALCOHOL: 'Bebidas Sin Alcohol'
}

// Estados de pedidos
export const ORDER_STATUS = {
  PENDING: 'pendiente',
  CONFIRMED: 'confirmado',
  PREPARING: 'preparando',
  READY: 'listo',
  DELIVERED: 'entregado',
  CANCELLED: 'cancelado'
}

// Métodos de pago
export const PAYMENT_METHODS = {
  CASH: 'efectivo',
  CARD: 'tarjeta',
  MERCADO_PAGO: 'mercado_pago',
  TRANSFER: 'transferencia'
}

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'usuario',
  CHEF: 'chef',
  WAITER: 'mesero'
}

// Horario del restaurante
export const RESTAURANT_HOURS = {
  LUNCH: {
    OPEN: '12:00',
    CLOSE: '15:00'
  },
  DINNER: {
    OPEN: '19:00',
    CLOSE: '23:00'
  },
  DAYS: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
}

// URLs de assets
export const ASSET_PATHS = {
  LOGO: logoImage, // ✅ Usar la importación, no string
  PLACEHOLDER: placeholderImage, // ✅ Usar la importación
  BANNER_VIDEO: '/src/assets/videos/banner-video.webp',
  HERO_BG: '/src/assets/images/hero-bg.jpg' // ✅ Ruta corregida
}

// Configuración de cache
export const CACHE_CONFIG = {
  PRODUCTS_TTL: 10 * 60 * 1000, // 10 minutos
  CATEGORIES_TTL: 30 * 60 * 1000, // 30 minutos
  REVIEWS_TTL: 15 * 60 * 1000 // 15 minutos
}
