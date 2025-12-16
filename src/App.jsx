import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import CartPage from './pages/CartPage'
import Checkout from './pages/Checkout'
import ProductDetail from './pages/ProductDetail'
import AdminDashboard from './pages/AdminDashboard'  
import ScrollToTop from './components/ui/ScrollToTop'
import ChatBot from './components/ui/ChatBot'
import { NotificationContainer } from './components/ui/Notification'

///// 🆕 Importa TODAS las páginas admin
import AdminProducts from './pages/AdminProducts'
import AdminUsers from './pages/AdminUsers'
import AdminCategories from './pages/AdminCategories'
import AdminOrders from './pages/AdminOrders'
import AdminReviews from './pages/AdminReviews'
import AdminCoupons from './pages/AdminCoupons'
import AdminSettings from './pages/AdminSettings'

import './styles/index.scss'

///// 🆕 Componente para rutas protegidas de admin
import AdminRoute from './components/admin/AdminRoute'

function App() {
  return (
    <>
      <Routes>
        {/* Rutas del admin */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <Routes>
              <Route path="" element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="settings" element={<AdminSettings />} />
            </Routes>
          </AdminRoute>
        } />
        
        {/* Rutas públicas normales */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* Redirección para /admin */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </Layout>
        } />
      </Routes>
      
      {/* Componentes globales */}
      <ScrollToTop />
      <ChatBot />
    </>
  )
}

export default App