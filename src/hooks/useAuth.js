import { useState, useCallback } from 'react'
import { useAuth as useAuthContext } from '../context/AuthContext'
import { authService } from '../services/api'

// Exportar useAuth desde el contexto
export const useAuth = useAuthContext

export const useAuthOperations = () => {
  const { user, login: contextLogin, logout: contextLogout } = useAuthContext()
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  const login = useCallback(async (credentials) => {
    try {
      setAuthLoading(true)
      setAuthError(null)
      
      // Llamar al API de login
      const response = await authService.login(credentials)
      
      console.log('Login response:', response.data)
      
      let token = typeof response.data === 'string' 
        ? response.data 
        : response.data.access_token
      
      if (!token) {
        throw new Error('No se recibió token del servidor')
      }
      
      console.log('Token recibido:', token)
      
      localStorage.setItem('token', token)
      
      try {
        const userResponse = await authService.getMe()
        const userData = userResponse.data
        
        localStorage.setItem('user', JSON.stringify(userData))
        contextLogin(userData)
        
        // AÑADIR: Mostrar notificación de bienvenida
        if (typeof window !== 'undefined' && window.showNotification) {
          if (userData.rol === 'admin') {
            window.showNotification(`¡Bienvenido Administrador ${userData.nombre || ''}! 👑`, 'admin')
          } else {
            window.showNotification(`¡Bienvenido ${userData.nombre || 'Usuario'}!`, 'success')
          }
        } else {
          // Fallback: console log
          console.log(`¡Bienvenido ${userData.rol === 'admin' ? 'Administrador ' : ''}${userData.nombre || 'Usuario'}!`)
        }
        
        return { success: true, user: userData }
      } catch (meError) {
        console.error('Error obteniendo usuario:', meError)
        const basicUser = {
          email: credentials.email,
          nombre: credentials.email.split('@')[0],
          rol: 'usuario'
        }
        localStorage.setItem('user', JSON.stringify(basicUser))
        contextLogin(basicUser)
        
        // AÑADIR: Notificación para usuario básico
        if (typeof window !== 'undefined' && window.showNotification) {
          window.showNotification(`¡Bienvenido ${basicUser.nombre}!`, 'success')
        }
        
        return { success: true, user: basicUser }
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Error de autenticación. Verifica tus credenciales.'
      setAuthError(errorMessage)
      
      // AÑADIR: Notificación de error
      if (typeof window !== 'undefined' && window.showNotification) {
        window.showNotification(errorMessage, 'error')
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setAuthLoading(false)
    }
  }, [contextLogin])

  const register = useCallback(async (userData) => {
    try {
      setAuthLoading(true)
      setAuthError(null)
      
      const response = await authService.register(userData)
      const newUser = response.data
      
      const loginResult = await login({
        email: userData.email,
        password: userData.password
      })
      
      if (loginResult.success && typeof window !== 'undefined' && window.showNotification) {
        window.showNotification('¡Cuenta creada exitosamente! 🎉', 'success')
      }
      
      return loginResult
    } catch (error) {
      console.error('Register error:', error)
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Error en el registro'
      setAuthError(errorMessage)
      
      if (typeof window !== 'undefined' && window.showNotification) {
        window.showNotification(errorMessage, 'error')
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setAuthLoading(false)
    }
  }, [login])

  const logout = useCallback(async () => {
    try {
      setAuthLoading(true)
      
      // AÑADIR: Notificación de despedida ANTES de logout
      if (typeof window !== 'undefined' && window.showNotification) {
        window.showNotification(`¡Hasta pronto ${user?.nombre || ''}! 👋`, 'info')
      }
      
      await authService.logout()
    } catch (error) {
      console.error('Error during logout:', error)
      if (typeof window !== 'undefined' && window.showNotification) {
        window.showNotification('Error al cerrar sesión', 'error')
      }
    } finally {
      contextLogout()
      setAuthLoading(false)
    }
  }, [contextLogout, user])

  const updateProfile = useCallback(async (profileData) => {
    try {
      setAuthLoading(true)
      const response = await authService.updateMe(profileData)
      const updatedUser = response.data
      
      localStorage.setItem('user', JSON.stringify(updatedUser))
      contextLogin(updatedUser)
      
      // AÑADIR: Notificación de éxito
      if (typeof window !== 'undefined' && window.showNotification) {
        window.showNotification('Perfil actualizado exitosamente ✅', 'success')
      }
      
      return { success: true, user: updatedUser }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Error actualizando perfil'
      setAuthError(errorMessage)
      
      if (typeof window !== 'undefined' && window.showNotification) {
        window.showNotification(errorMessage, 'error')
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setAuthLoading(false)
    }
  }, [contextLogin])

  return {
    user,
    login,
    register,
    logout,
    updateProfile,
    authLoading,
    authError,
    setAuthError
  }
}