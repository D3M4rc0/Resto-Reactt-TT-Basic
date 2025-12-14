import axios from 'axios'

const API_BASE_URL = 'https://api-resto-datasuitepro-production.up.railway.app/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data)
    
    // Si el token expiró, limpiar localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    
    return Promise.reject(error)
  }
)

// Servicio de Productos
export const productService = {
  // Obtener todos los productos (27 productos)
  getAllProducts: () => api.get('/productos/?limit=27'),
  
  // Obtener productos paginados (9 por página)
  getProducts: (page = 1, limit = 9) => 
    api.get(`/productos/?page=${page}&limit=${limit}`),
  
  // Obtener producto por ID
  getProductById: (id) => 
    api.get(`/productos/${id}`),
  
  // Obtener productos por categoría
  getProductsByCategory: (category, page = 1, limit = 9) => 
    api.get(`/productos/?categoria=${category}&page=${page}&limit=${limit}`),
  
  // Buscar productos
  searchProducts: (query, page = 1, limit = 9) => 
    api.get(`/productos/?search=${query}&page=${page}&limit=${limit}`),
  
  // Obtener productos destacados (para especialidades del chef)
  getFeaturedProducts: () => 
    api.get('/productos/?limit=8'),
  
  // Obtener productos en oferta (para sección ofertas)
  getOffers: () => 
    api.get('/productos/?limit=8')
}

// Servicio de Categorías
export const categoryService = {
  // Obtener todas las categorías (13 categorías)
  getCategories: () => api.get('/categorias'),
  
  // Obtener categoría por ID
  getCategoryById: (id) => api.get(`/categorias/${id}`),
  
  // Obtener productos de una categoría específica
  getCategoryProducts: (categoryId) => 
    api.get(`/productos/?categoria_id=${categoryId}`)
}

// Servicio de Usuarios
export const userService = {
  // Obtener información del usuario actual
  getCurrentUser: () => api.get('/auth/me'),
  
  // Actualizar perfil de usuario
  updateProfile: (userData) => 
    api.put('/auth/me', userData),
  
  // Obtener todos los usuarios (12 usuarios - solo admin)
  getUsers: () => api.get('/usuarios')
}

// Servicio de Reseñas
export const reviewService = {
  // Obtener todas las reseñas (10 reseñas)
  getReviews: () => api.get('/reseñas'),
  
  // Obtener reseñas de un producto específico
  getProductReviews: (productId) => 
    api.get(`/reseñas/?producto_id=${productId}`),
  
  // Crear nueva reseña
  createReview: (reviewData) => 
    api.post('/reseñas', reviewData),
  
  // Obtener reseñas del usuario actual
  getUserReviews: (userId) => 
    api.get(`/reseñas/?usuario_id=${userId}`)
}

// Servicio de Carrito
export const cartService = {
  // Obtener carrito del usuario
  getCart: (userId) => 
    api.get(`/carrito/?usuario_id=${userId}`),
  
  // Agregar producto al carrito
  addToCart: (cartItem) => 
    api.post('/carrito', cartItem),
  
  // Actualizar item del carrito
  updateCartItem: (itemId, quantity) => 
    api.put(`/carrito/${itemId}`, { cantidad: quantity }),
  
  // Eliminar item del carrito
  removeFromCart: (itemId) => 
    api.delete(`/carrito/${itemId}`),
  
  // Limpiar carrito
  clearCart: (userId) => 
    api.delete(`/carrito/clear/${userId}`)
}

// Servicio de Pedidos
export const orderService = {
  // Obtener pedidos del usuario
  getUserOrders: (userId) => 
    api.get(`/pedidos/?usuario_id=${userId}`),
  
  // Crear nuevo pedido
  createOrder: (orderData) => 
    api.post('/pedidos', orderData),
  
  // Obtener detalles de un pedido
  getOrderById: (orderId) => 
    api.get(`/pedidos/${orderId}`),
  
  // Actualizar estado del pedido
  updateOrderStatus: (orderId, status) => 
    api.put(`/pedidos/${orderId}`, { estado: status })
}

// Servicio de Autenticación - CORREGIDO Y COMPLETO
export const authService = {
  // Login - La API espera FormData con username (email) y password
  login: (credentials) => {
    const formData = new URLSearchParams()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  
  // Registro - La API espera FormData
  register: (userData) => {
    const formData = new URLSearchParams()
    formData.append('nombre', userData.nombre)
    formData.append('apellido', userData.apellido)
    formData.append('email', userData.email)
    formData.append('password', userData.password)
    
    // Campos opcionales
    if (userData.telefono) formData.append('telefono', userData.telefono)
    if (userData.direccion) formData.append('direccion', userData.direccion)
    if (userData.ciudad) formData.append('ciudad', userData.ciudad)
    if (userData.pais) formData.append('pais', userData.pais)
    
    return api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  
  // Obtener información del usuario actual
  getMe: () => api.get('/auth/me'),
  
  // Actualizar perfil del usuario actual
  updateMe: (userData) => api.put('/auth/me', userData),
  
  // Refresh token
  refreshToken: (refreshToken) => 
    api.post(`/auth/refresh?refresh_token=${refreshToken}`),
  
  // Verificar token (si existe en tu API)
  verifyToken: () => api.get('/auth/verify'),
  
  // Logout - Tu API NO tiene este endpoint, así que lo manejamos localmente
  logout: () => {
    // Limpiar localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return Promise.resolve({ success: true })
  }
}

// Servicio de Cupones
export const couponService = {
  // Obtener todos los cupones
  getCoupons: () => api.get('/cupones'),
  
  // Validar cupón
  validateCoupon: (code) => 
    api.get(`/cupones/validate/${code}`),
  
  // Aplicar cupón
  applyCoupon: (orderData) => 
    api.post('/cupones/apply', orderData)
}

// Servicio de Pagos
export const paymentService = {
  // Procesar pago
  processPayment: (paymentData) => 
    api.post('/pagos', paymentData),
  
  // Obtener historial de pagos
  getPaymentHistory: (userId) => 
    api.get(`/pagos/?usuario_id=${userId}`)
}

export default api