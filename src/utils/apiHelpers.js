// Helper para formatear datos de productos - CORREGIDO
export const formatProductData = (product) => {
  if (!product) return null
  
  // Múltiples formatos posibles de la API
  const productData = product.data || product.attributes || product
  
  return {
    id: productData.id || productData.producto_id || Math.random(),
    nombre: productData.nombre || productData.title || 'Producto sin nombre',
    descripcion: productData.descripcion || productData.description || 'Descripción no disponible',
    precio: parseFloat(productData.precio || productData.price || 0),
    categoria: productData.categoria || productData.category || 'Sin categoría',
    marca: productData.marca || productData.brand || 'Marca no especificada',
    stock: parseInt(productData.stock || productData.quantity || 0),
    sku: productData.sku || 'SKU-000',
    imagen_url: productData.imagen_url || productData.image_url || productData.imagen || '/src/assets/images/placeholder-2.webp',
    activo: productData.activo !== false,
    fecha_creacion: productData.fecha_creacion || productData.created_at,
    // Campos calculados
    en_oferta: parseFloat(productData.precio || productData.price || 0) > 50,
    es_nuevo: isProductNew(productData.fecha_creacion || productData.created_at),
    calificacion: parseFloat(productData.calificacion || productData.rating || 0)
  }
}

// Helper para formatear datos de reseñas - CORREGIDO
export const formatReviewData = (review) => {
  if (!review) return null
  
  const reviewData = review.data || review.attributes || review
  
  return {
    id: reviewData.id || reviewData.review_id || Math.random(),
    usuario_id: reviewData.usuario_id || reviewData.user_id,
    producto_id: reviewData.producto_id || reviewData.product_id,
    calificacion: parseInt(reviewData.calificacion || reviewData.rating || 0),
    comentario: reviewData.comentario || reviewData.comment || 'Sin comentario',
    aprobado: reviewData.aprobado !== false,
    fecha_review: reviewData.fecha_review || reviewData.created_at,
    usuario_nombre: reviewData.usuario_nombre || reviewData.user_name || reviewData.author || 'Usuario Anónimo'
  }
}

// Helper para formatear datos de categorías - CORREGIDO
export const formatCategoryData = (category) => {
  if (!category) return null
  
  const categoryData = category.data || category.attributes || category
  
  return {
    id: categoryData.id || categoryData.category_id,
    nombre: categoryData.nombre || categoryData.name || 'Categoría sin nombre',
    descripcion: categoryData.descripcion || categoryData.description || 'Descripción no disponible',
    imagen_url: categoryData.imagen_url || categoryData.image_url || '/src/assets/images/placeholder-2.webp',
    activo: categoryData.activo !== false,
    fecha_creacion: categoryData.fecha_creacion,
    producto_count: categoryData.producto_count || 0
  }
}

// Helper para formatear datos de usuarios - CORREGIDO
export const formatUserData = (user) => {
  if (!user) return null
  
  const userData = user.data || user.attributes || user
  
  return {
    id: userData.id || userData.user_id,
    nombre: userData.nombre || userData.name || '',
    apellido: userData.apellido || userData.last_name || '',
    email: userData.email || '',
    telefono: userData.telefono || userData.phone || '',
    direccion: userData.direccion || userData.address || '',
    ciudad: userData.ciudad || userData.city || '',
    pais: userData.pais || userData.country || '',
    rol: userData.rol || userData.role || 'usuario',
    activo: userData.activo !== false,
    fecha_registro: userData.fecha_registro || userData.created_at,
    nombre_completo: `${userData.nombre || ''} ${userData.apellido || ''}`.trim() || userData.name || 'Usuario'
  }
}

// Verificar si un producto es nuevo (menos de 30 días)
export const isProductNew = (fechaCreacion) => {
  if (!fechaCreacion) return false
  
  const fechaProducto = new Date(fechaCreacion)
  const hoy = new Date()
  const diferenciaDias = (hoy - fechaProducto) / (1000 * 60 * 60 * 24)
  
  return diferenciaDias <= 30
}

// Calcular promedios de calificaciones
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0
  
  const reviewsAprobadas = reviews.filter(review => review.aprobado !== false)
  if (reviewsAprobadas.length === 0) return 0
  
  const sum = reviewsAprobadas.reduce((total, review) => total + (review.calificacion || 0), 0)
  return parseFloat((sum / reviewsAprobadas.length).toFixed(1))
}

// Generar estrellas para display
export const generateStarRating = (rating) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  // Estrellas llenas
  for (let i = 0; i < fullStars; i++) {
    stars.push('★')
  }
  
  // Media estrella
  if (hasHalfStar) {
    stars.push('½')
  }
  
  // Estrellas vacías
  const emptyStars = 5 - stars.length
  for (let i = 0; i < emptyStars; i++) {
    stars.push('☆')
  }
  
  return {
    stars: stars.join(''),
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars,
    numeric: rating
  }
}

// Filtrar productos por categoría
export const filterProductsByCategory = (products, categoryName) => {
  if (!products || !Array.isArray(products)) return []
  if (!categoryName || categoryName === 'todos') return products
  
  return products.filter(product => 
    product.categoria && product.categoria.toLowerCase() === categoryName.toLowerCase()
  )
}

// Buscar productos por texto
export const searchProducts = (products, searchTerm) => {
  if (!products || !Array.isArray(products)) return []
  if (!searchTerm) return products
  
  const term = searchTerm.toLowerCase()
  return products.filter(product => 
    product.nombre?.toLowerCase().includes(term) ||
    product.descripcion?.toLowerCase().includes(term) ||
    product.categoria?.toLowerCase().includes(term) ||
    product.marca?.toLowerCase().includes(term)
  )
}

// Ordenar productos
export const sortProducts = (products, sortBy = 'nombre') => {
  if (!products || !Array.isArray(products)) return []
  
  const sortedProducts = [...products]
  
  switch (sortBy) {
    case 'precio_asc':
      return sortedProducts.sort((a, b) => (a.precio || 0) - (b.precio || 0))
    
    case 'precio_desc':
      return sortedProducts.sort((a, b) => (b.precio || 0) - (a.precio || 0))
    
    case 'nombre_asc':
      return sortedProducts.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''))
    
    case 'nombre_desc':
      return sortedProducts.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''))
    
    case 'nuevos_primero':
      return sortedProducts.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
    
    default:
      return sortedProducts
  }
}

// Paginar array de productos
export const paginateProducts = (products, page = 1, limit = 9) => {
  if (!products || !Array.isArray(products)) return { data: [], totalPages: 1 }
  
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = products.slice(startIndex, endIndex)
  const totalPages = Math.ceil(products.length / limit)
  
  return {
    data: paginatedData,
    totalPages,
    currentPage: page,
    totalProducts: products.length,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }
}

// Calcular total del carrito CON DESCUENTOS - MODIFICADO
export const calculateCartTotals = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) {
    return { subtotal: 0, iva: 0, total: 0, itemsCount: 0, ahorroTotal: 0 }
  }
  
  // Usar precio_final si existe (precio con descuento), si no usar precio original
  const subtotal = cartItems.reduce((sum, item) => {
    const precio = item.precio_final || item.precio || item.price || 0;
    const cantidad = item.quantity || item.cantidad || 0;
    return sum + (precio * cantidad);
  }, 0);
  
  // Calcular ahorro total por descuentos
  const ahorroTotal = cartItems.reduce((sum, item) => {
    if (item.precio_original && item.precio_final) {
      const ahorroPorItem = (item.precio_original - item.precio_final) * (item.quantity || 1);
      return sum + ahorroPorItem;
    }
    return sum;
  }, 0);
  
  const iva = subtotal * 0.21; // 21% IVA
  const total = subtotal + iva;
  const itemsCount = cartItems.reduce((count, item) => count + (item.quantity || item.cantidad || 0), 0);
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    iva: parseFloat(iva.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    itemsCount,
    ahorroTotal: parseFloat(ahorroTotal.toFixed(2))
  };
};

// Validación robusta de email
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validación robusta de teléfono
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  const cleanedPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  
  if (!/^\d+$/.test(cleanedPhone)) return false;
  if (cleanedPhone.length < 9 || cleanedPhone.length > 13) return false;
  if (cleanedPhone.startsWith('0')) return false;
  
  const patterns = [
    /^549\d{8,10}$/,      // +54 9 11 1234-5678
    /^54\d{9,11}$/,        // +54 11 1234-5678  
    /^9\d{8,10}$/,         // 9 11 1234-5678
    /^\d{6,10}$/           // 11 1234-5678
  ];
  
  return patterns.some(pattern => pattern.test(cleanedPhone));
};

// Formateo seguro de teléfono
export const formatPhoneInput = (value) => {
  if (!value) return '';
  let cleaned = value.replace(/[^\d\+]/g, '');
  if (cleaned.length > 15) cleaned = cleaned.substring(0, 15);
  if (cleaned.startsWith('+')) {
    const numbers = cleaned.substring(1);
    return '+' + numbers;
  }
  return cleaned;
};

// Validación de nombre/apellido
export const validateName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const cleaned = name.trim();
  if (cleaned.length < 2 || cleaned.length > 50) return false;
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s']+$/;
  return nameRegex.test(cleaned);
};

// Validación de dirección
export const validateAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  const cleaned = address.trim();
  if (cleaned.length < 5 || cleaned.length > 100) return false;
  const addressRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\#\.\,]+$/;
  return addressRegex.test(cleaned);
};

// Validación de ciudad
export const validateCity = (city) => {
  if (!city || typeof city !== 'string') return false;
  const cleaned = city.trim();
  if (cleaned.length < 2 || cleaned.length > 50) return false;
  const cityRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-]+$/;
  return cityRegex.test(cleaned);
};

// Validación de código postal
export const validatePostalCode = (postalCode) => {
  if (!postalCode || typeof postalCode !== 'string') return false;
  const cleaned = postalCode.trim();
  if (cleaned.length < 4 || cleaned.length > 10) return false;
  const postalRegex = /^[a-zA-Z0-9\s\-]+$/;
  return postalRegex.test(cleaned);
};

// Validación de tarjeta de crédito
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') return false;
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length !== 16) return false;
  if (!/^\d+$/.test(cleaned)) return false;
  
  // Algoritmo de Luhn
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Validación de fecha de expiración
export const validateExpirationDate = (date) => {
  if (!date || typeof date !== 'string') return false;
  const dateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!dateRegex.test(date)) return false;
  
  const [month, year] = date.split('/');
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);
  
  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  return true;
};

// Validación de CVV
export const validateCVV = (cvv) => {
  if (!cvv || typeof cvv !== 'string') return false;
  if (cvv.length !== 3 && cvv.length !== 4) return false;
  return /^\d+$/.test(cvv);
};

// Sanitización de texto
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '') // Remover tags HTML
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .substring(0, 500); // Limitar longitud
};

// Manejar errores de API
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (error.response) {
    // El servidor respondió con un código de error
    const status = error.response.status
    let message = error.response.data?.message || 'Error del servidor'
    
    // Mensajes personalizados por código de estado
    switch (status) {
      case 400:
        message = 'Solicitud incorrecta'
        break
      case 401:
        message = 'No autorizado - por favor inicia sesión'
        break
      case 403:
        message = 'Acceso denegado'
        break
      case 404:
        message = 'Recurso no encontrado'
        break
      case 500:
        message = 'Error interno del servidor'
        break
      default:
        message = `Error ${status}: ${message}`
    }
    
    return {
      status,
      message,
      data: error.response.data,
      isServerError: true
    }
  } else if (error.request) {
    // La petición fue hecha pero no se recibió respuesta
    return {
      status: 0,
      message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      data: null,
      isNetworkError: true
    }
  } else {
    // Algo pasó al preparar la petición
    return {
      status: -1,
      message: error.message || 'Error desconocido',
      data: null,
      isClientError: true
    }
  }
}

// Validar datos de producto antes de enviar
export const validateProductData = (productData) => {
  const errors = []
  
  if (!productData.nombre || productData.nombre.trim().length < 2) {
    errors.push('El nombre del producto debe tener al menos 2 caracteres')
  }
  
  if (!productData.precio || parseFloat(productData.precio) <= 0) {
    errors.push('El precio debe ser mayor a 0')
  }
  
  if (!productData.categoria || productData.categoria.trim().length === 0) {
    errors.push('La categoría es requerida')
  }
  
  if (productData.stock !== undefined && parseInt(productData.stock) < 0) {
    errors.push('El stock no puede ser negativo')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Cache para datos de API
export const createCache = (defaultTTL = 5 * 60 * 1000) => {
  const cache = new Map()

  return {
    set: (key, value, ttl = defaultTTL) => {
      cache.set(key, {
        value,
        expiry: Date.now() + ttl,
        timestamp: Date.now()
      })
    },
    
    get: (key) => {
      const item = cache.get(key)
      if (!item) return null
      
      if (Date.now() > item.expiry) {
        cache.delete(key)
        return null
      }
      
      return item.value
    },
    
    delete: (key) => {
      cache.delete(key)
    },
    
    clear: () => {
      cache.clear()
    },
    
    getSize: () => cache.size,
    
    getKeys: () => Array.from(cache.keys()),
    
    // Limpiar elementos expirados
    cleanup: () => {
      const now = Date.now()
      for (const [key, item] of cache.entries()) {
        if (now > item.expiry) {
          cache.delete(key)
        }
      }
    }
  }
}

// Caches globales
export const productCache = createCache(10 * 60 * 1000) // 10 minutos
export const categoryCache = createCache(30 * 60 * 1000) // 30 minutos
export const reviewCache = createCache(15 * 60 * 1000) // 15 minutos

// Helper para formatear precios
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(price)
}

// Helper para formatear fechas
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Debounce para búsquedas
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Función para truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};