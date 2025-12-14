import { authService, userService } from './api'
import { handleApiError } from '../utils/apiHelpers'

// Servicio de autenticación mejorado
export const auth = {
  // Login con email y password
  login: async (credentials) => {
    try {
      const response = await authService.login(credentials)
      return {
        success: true,
        data: response.data,
        user: response.data.user
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  // Registro de nuevo usuario
  register: async (userData) => {
    try {
      const response = await authService.register(userData)
      return {
        success: true,
        data: response.data,
        user: response.data.user
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  // Verificar token
  verifyToken: async () => {
    try {
      const response = await authService.verifyToken()
      return {
        success: true,
        data: response.data,
        user: response.data.user
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  // Logout
  logout: async () => {
    try {
      await authService.logout()
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      // Aún así consideramos éxito para limpiar el estado local
      return { success: true }
    }
  },

  // Actualizar perfil
  updateProfile: async (userId, profileData) => {
    try {
      const response = await userService.updateProfile(userId, profileData)
      return {
        success: true,
        data: response.data,
        user: response.data
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  // Cambiar contraseña
  changePassword: async (userId, passwordData) => {
    try {
      // En una implementación real, tendrías un endpoint específico para cambiar contraseña
      const response = await userService.updateProfile(userId, { 
        password: passwordData.newPassword 
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const apiError = handleApiError(error)
      return {
        success: false,
        error: apiError.message,
        status: apiError.status
      }
    }
  },

  // Recuperar contraseña
  forgotPassword: async (email) => {
    try {
      // Simular envío de email de recuperación
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        success: true,
        message: 'Se ha enviado un email con instrucciones para recuperar tu contraseña'
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error enviando email de recuperación'
      }
    }
  },

  // Login social (preparado para implementación futura)
  socialLogin: async (provider, token) => {
    try {
      // Simular login social
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // En producción, integrarías con OAuth providers
      const mockUser = {
        id: Date.now(),
        nombre: 'Usuario Social',
        email: `social${Date.now()}@example.com`,
        rol: 'usuario'
      }
      
      return {
        success: true,
        user: mockUser
      }
    } catch (error) {
      return {
        success: false,
        error: `Error con ${provider} login`
      }
    }
  }
}

export default auth
