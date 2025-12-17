import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin';

export const useAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [entities, setEntities] = useState({
    users: [],
    products: [],
    categories: [],
    orders: [],
    payments: [],
    reviews: [],
    coupons: [],
    addresses: [],
    carts: []
  });

  ///// ========== CARGAR DATOS DEL DASHBOARD ==========
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [statsData, usersData, productsData, categoriesData, ordersData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUsers(),
        adminService.getProducts(1, 100),
        adminService.getCategories(),
        adminService.getOrders(1, 100)
      ]);

		setStats(statsData);
		setEntities(prev => ({
		  ...prev,
		  users: usersData.data || [],
		  products: productsData.data || [],
		  categories: (categoriesData.data || []).map(c => ({
			...c,
			activa: c.activa ?? c.activo ?? false
		  })),
		  orders: ordersData.data || []
		}));

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  }, []); ///// ← DEPENDENCIAS VACÍAS (IMPORTANTE)

  ///// ========== CARGAR ENTIDAD ESPECÍFICA ==========
  const loadEntity = useCallback(async (entityName, params = {}) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      switch (entityName) {
        case 'users':
          response = await adminService.getUsers();
          break;
        case 'products':
          response = await adminService.getProducts(params.page || 1, params.limit || 100);
          break;
        case 'categories':
          response = await adminService.getCategories();
          break;
        case 'orders':
          response = await adminService.getOrders(params.page || 1, params.limit || 100);
          break;
        case 'payments':
          response = await adminService.getPayments();
          break;
        case 'reviews':
          response = await adminService.getReviews();
          break;
        case 'coupons':
          response = await adminService.getCoupons();
          break;
        case 'addresses':
          response = await adminService.getAddresses();
          break;
        case 'carts':
          response = await adminService.getCarts();
          break;
        default:
          throw new Error(`Entidad desconocida: ${entityName}`);
      }

		setEntities(prev => ({
		  ...prev,
		  [entityName]:
			entityName === 'categories'
			  ? (response.data || []).map(c => ({
				  ...c,
				  activa: c.activa ?? c.activo ?? false
				}))
			  : response.data || []
		}));

      return response.data || [];
    } catch (err) {
      console.error(`Error loading ${entityName}:`, err);
      setError(`Error al cargar ${entityName}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []); ///// ← DEPENDENCIAS VACÍAS

  ///// ========== OPERACIONES CRUD ==========
  const createItem = useCallback(async (entityName, data) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      switch (entityName) {
        case 'user':
          response = await adminService.createUser(data);
          break;
        case 'product':
          response = await adminService.createProduct(data);
          break;
        case 'category':
          response = await adminService.createCategory(data);
          break;
        case 'order':
          response = await adminService.createOrder(data);
          break;
        case 'payment':
          response = await adminService.createPayment(data);
          break;
        case 'review':
          response = await adminService.createReview(data);
          break;
        case 'coupon':
          response = await adminService.createCoupon(data);
          break;
        case 'address':
          response = await adminService.createAddress(data);
          break;
        case 'cart':
          response = await adminService.createCart(data);
          break;
        default:
          throw new Error(`Operación no soportada para: ${entityName}`);
      }

      ///// Actualizar la lista de entidades
      await loadEntity(`${entityName}s`);

      return response.data;
    } catch (err) {
      console.error(`Error creating ${entityName}:`, err);
      setError(`Error al crear ${entityName}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadEntity]);

  const updateItem = useCallback(async (entityName, id, data) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      switch (entityName) {
        case 'user':
          response = await adminService.updateUser(id, data);
          break;
        case 'product':
          response = await adminService.updateProduct(id, data);
          break;
        case 'category':
          response = await adminService.updateCategory(id, data);
          break;
        case 'order':
          response = await adminService.updateOrder(id, data);
          break;
        case 'payment':
          response = await adminService.updatePayment(id, data);
          break;
        case 'review':
          response = await adminService.updateReview(id, data);
          break;
        case 'coupon':
          response = await adminService.updateCoupon(id, data);
          break;
        case 'address':
          response = await adminService.updateAddress(id, data);
          break;
        case 'cart':
          response = await adminService.updateCart(id, data);
          break;
        default:
          throw new Error(`Operación no soportada para: ${entityName}`);
      }

      ///// Actualizar la lista de entidades
      await loadEntity(`${entityName}s`);

      return response.data;
    } catch (err) {
      console.error(`Error updating ${entityName}:`, err);
      setError(`Error al actualizar ${entityName}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadEntity]);

  const deleteItem = useCallback(async (entityName, id) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      switch (entityName) {
        case 'user':
          response = await adminService.deleteUser(id);
          break;
        case 'product':
          response = await adminService.deleteProduct(id);
          break;
        case 'category':
          response = await adminService.deleteCategory(id);
          break;
        case 'order':
          response = await adminService.deleteOrder(id);
          break;
        case 'payment':
          response = await adminService.deletePayment(id);
          break;
        case 'review':
          response = await adminService.deleteReview(id);
          break;
        case 'coupon':
          response = await adminService.deleteCoupon(id);
          break;
        case 'address':
          response = await adminService.deleteAddress(id);
          break;
        case 'cart':
          response = await adminService.deleteCart(id);
          break;
        default:
          throw new Error(`Operación no soportada para: ${entityName}`);
      }

      ///// Actualizar la lista de entidades
      await loadEntity(`${entityName}s`);

      return response.data;
    } catch (err) {
      console.error(`Error deleting ${entityName}:`, err);
      setError(`Error al eliminar ${entityName}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadEntity]);

  ///// ========== BUSCAR ITEMS ==========
  const searchItems = useCallback(async (entityName, query) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      switch (entityName) {
        case 'users':
          response = await adminService.searchUsers(query);
          break;
        case 'products':
          response = await adminService.searchProducts(query);
          break;
        case 'categories':
          response = await adminService.searchCategories(query);
          break;
        case 'orders':
          response = await adminService.searchOrders(query);
          break;
        case 'payments':
          response = await adminService.searchPayments(query);
          break;
        case 'reviews':
          response = await adminService.searchReviews(query);
          break;
        case 'coupons':
          response = await adminService.searchCoupons(query);
          break;
        case 'addresses':
          response = await adminService.searchAddresses(query);
          break;
        default:
          throw new Error(`Búsqueda no soportada para: ${entityName}`);
      }

      return response.data || [];
    } catch (err) {
      console.error(`Error searching ${entityName}:`, err);
      setError(`Error al buscar ${entityName}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  ///// ========== CARGAR DATOS INICIALES ==========
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]); ///// ← loadDashboardData es estable gracias a useCallback

  return {
    ///// Estado
    loading,
    error,
    stats,
    entities,
    
    ///// Métodos de carga
    loadDashboardData,
    loadEntity,
    
    ///// CRUD
    createItem,
    updateItem,
    deleteItem,
    
    ///// Búsqueda
    searchItems,
    
    ///// Utilidades
    refresh: loadDashboardData,
    clearError: () => setError(null)
  };
};

export default useAdmin;