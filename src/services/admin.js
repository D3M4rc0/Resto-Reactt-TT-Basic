import api from './api';

export const adminService = {
  // ========== USUARIOS ==========
  getUsers: () => api.get('/usuarios/'),
  createUser: (userData) => api.post('/usuarios/', userData),
  getUserById: (id) => api.get(`/usuarios/${id}`),
  updateUser: (id, userData) => api.put(`/usuarios/${id}`, userData),
  deleteUser: (id) => api.delete(`/usuarios/${id}`),
  searchUsers: (query) => api.get(`/usuarios/search/?q=${query}`),
  countUsers: () => api.get('/usuarios/count'),
  getUserByEmail: (email) => api.get(`/usuarios/email/${email}`),

  // ========== PRODUCTOS ==========
  getProducts: (page = 1, limit = 100) => api.get(`/productos/?page=${page}&limit=${limit}`),
  createProduct: (productData) => api.post('/productos/', productData),
  getProductById: (id) => api.get(`/productos/${id}`),
  updateProduct: (id, productData) => api.put(`/productos/${id}`, productData),
  deleteProduct: (id) => api.delete(`/productos/${id}`),
  searchProducts: (query) => api.get(`/productos/search/?q=${query}`),
  countProducts: () => api.get('/productos/count'),
  getProductsByCategory: (category) => api.get(`/productos/categoria/${category}`),
  getProductCategories: () => api.get('/productos/categorias/'),

  // ========== CATEGORÍAS ==========
  getCategories: () => api.get('/categorias/'),
  createCategory: (categoryData) => api.post('/categorias/', categoryData),
  getCategoryById: (id) => api.get(`/categorias/${id}`),
  updateCategory: (id, categoryData) => api.put(`/categorias/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categorias/${id}`),
  searchCategories: (query) => api.get(`/categorias/search/?q=${query}`),
  countCategories: () => api.get('/categorias/count'),

  // ========== PEDIDOS ==========
  getOrders: (page = 1, limit = 100) => api.get(`/pedidos/?page=${page}&limit=${limit}`),
  createOrder: (orderData) => api.post('/pedidos/', orderData),
  getOrderById: (id) => api.get(`/pedidos/${id}`),
  updateOrder: (id, orderData) => api.put(`/pedidos/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/pedidos/${id}`),
  searchOrders: (query) => api.get(`/pedidos/search/?q=${query}`),
  countOrders: () => api.get('/pedidos/count'),
  getUserOrders: (userId) => api.get(`/pedidos/usuario/${userId}`),
  updateOrderStatus: (id, estado) => api.put(`/pedidos/${id}/estado`, { estado }),

  // ========== CARRITO ==========
  getCarts: () => api.get('/carrito/'),
  createCart: (cartData) => api.post('/carrito/', cartData),
  getCartById: (id) => api.get(`/carrito/${id}`),
  updateCart: (id, cartData) => api.put(`/carrito/${id}`, cartData),
  deleteCart: (id) => api.delete(`/carrito/${id}`),
  searchCarts: (query) => api.get(`/carrito/search/?q=${query}`),
  countCarts: () => api.get('/carrito/count'),
  getUserCart: (userId) => api.get(`/carrito/usuario/${userId}`),
  clearUserCart: (userId) => api.delete(`/carrito/usuario/${userId}/clear`),

  // ========== PAGOS ==========
  getPayments: () => api.get('/pagos/'),
  createPayment: (paymentData) => api.post('/pagos/', paymentData),
  getPaymentById: (id) => api.get(`/pagos/${id}`),
  updatePayment: (id, paymentData) => api.put(`/pagos/${id}`, paymentData),
  deletePayment: (id) => api.delete(`/pagos/${id}`),
  searchPayments: (query) => api.get(`/pagos/search/?q=${query}`),
  countPayments: () => api.get('/pagos/count'),

  // ========== RESEÑAS ==========
  getReviews: () => api.get('/reseñas/'),
  createReview: (reviewData) => api.post('/reseñas/', reviewData),
  getReviewById: (id) => api.get(`/reseñas/${id}`),
  updateReview: (id, reviewData) => api.put(`/reseñas/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reseñas/${id}`),
  searchReviews: (query) => api.get(`/reseñas/search/?q=${query}`),
  countReviews: () => api.get('/reseñas/count'),

  // ========== DIRECCIONES ==========
  getAddresses: () => api.get('/direcciones/'),
  createAddress: (addressData) => api.post('/direcciones/', addressData),
  getAddressById: (id) => api.get(`/direcciones/${id}`),
  updateAddress: (id, addressData) => api.put(`/direcciones/${id}`, addressData),
  deleteAddress: (id) => api.delete(`/direcciones/${id}`),
  searchAddresses: (query) => api.get(`/direcciones/search/?q=${query}`),
  countAddresses: () => api.get('/direcciones/count'),

  // ========== CUPONES ==========
  getCoupons: () => api.get('/cupones/'),
  createCoupon: (couponData) => api.post('/cupones/', couponData),
  getCouponById: (id) => api.get(`/cupones/${id}`),
  updateCoupon: (id, couponData) => api.put(`/cupones/${id}`, couponData),
  deleteCoupon: (id) => api.delete(`/cupones/${id}`),
  searchCoupons: (query) => api.get(`/cupones/search/?q=${query}`),
  countCoupons: () => api.get('/cupones/count'),

  // ========== ESTADÍSTICAS COMPLETAS ==========
  getDashboardStats: async () => {
    try {
      const [
        usersRes,
        productsRes,
        categoriesRes,
        ordersRes,
        paymentsRes,
        reviewsRes,
        couponsRes,
        addressesRes
      ] = await Promise.all([
        adminService.getUsers().catch(() => ({ data: [] })),
        adminService.getProducts().catch(() => ({ data: [] })),
        adminService.getCategories().catch(() => ({ data: [] })),
        adminService.getOrders().catch(() => ({ data: [] })),
        adminService.getPayments().catch(() => ({ data: [] })),
        adminService.getReviews().catch(() => ({ data: [] })),
        adminService.getCoupons().catch(() => ({ data: [] })),
        adminService.getAddresses().catch(() => ({ data: [] }))
      ]);

      // Calcular total de ventas (sumando pagos)
      const totalSales = paymentsRes.data?.reduce((sum, payment) => 
        sum + (payment.monto || 0), 0
      ) || 0;

      // Calcular pedidos por estado
      const ordersByStatus = ordersRes.data?.reduce((acc, order) => {
        const status = order.estado || 'pendiente';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      return {
        totals: {
          users: usersRes.data?.length || 0,
          products: productsRes.data?.length || 0,
          categories: categoriesRes.data?.length || 0,
          orders: ordersRes.data?.length || 0,
          payments: paymentsRes.data?.length || 0,
          reviews: reviewsRes.data?.length || 0,
          coupons: couponsRes.data?.length || 0,
          addresses: addressesRes.data?.length || 0,
          sales: totalSales
        },
        recent: {
          users: Array.isArray(usersRes.data) ? usersRes.data.slice(-5).reverse() : [],
          products: Array.isArray(productsRes.data) ? productsRes.data.slice(-5).reverse() : [],
          orders: Array.isArray(ordersRes.data) ? ordersRes.data.slice(-5).reverse() : [],
          payments: Array.isArray(paymentsRes.data) ? paymentsRes.data.slice(-5).reverse() : []
        },
        analytics: {
          ordersByStatus: ordersByStatus || {},
          totalSales: totalSales,
          averageOrderValue: ordersRes.data?.length > 0 
            ? totalSales / ordersRes.data.length 
            : 0
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totals: {
          users: 0,
          products: 0,
          categories: 0,
          orders: 0,
          payments: 0,
          reviews: 0,
          coupons: 0,
          addresses: 0,
          sales: 0
        },
        recent: {
          users: [],
          products: [],
          orders: [],
          payments: []
        },
        analytics: {
          ordersByStatus: {},
          totalSales: 0,
          averageOrderValue: 0
        }
      };
    }
  },

  // ========== OPERACIONES BATCH ==========
  bulkDelete: async (entity, ids) => {
    const promises = ids.map(id => 
      adminService[`delete${entity}`](id).catch(() => null)
    );
    return Promise.all(promises);
  },

  bulkUpdate: async (entity, updates) => {
    const promises = updates.map(({ id, data }) => 
      adminService[`update${entity}`](id, data).catch(() => null)
    );
    return Promise.all(promises);
  }
};

export default adminService;