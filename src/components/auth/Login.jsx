import React, { useState } from 'react'
import { useAuthOperations } from '../../hooks/useAuth'
import { validateEmail, validatePassword } from '../../utils/validators'

const Login = ({ onSuccess, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const { login } = useAuthOperations()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const result = await login(formData)
    
    if (result.success) {
      onSuccess()
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__group">
        <label htmlFor="email" className="auth-form__label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`auth-form__input ${errors.email ? 'auth-form__input--error' : ''}`}
          placeholder="tu@email.com"
          disabled={loading}
        />
        {errors.email && <span className="auth-form__error">{errors.email}</span>}
      </div>

      <div className="auth-form__group">
        <label htmlFor="password" className="auth-form__label">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
          placeholder="••••••••"
          disabled={loading}
        />
        {errors.password && <span className="auth-form__error">{errors.password}</span>}
      </div>

      <div className="auth-form__options">
        <label className="auth-form__remember">
          <input type="checkbox" disabled={loading} />
          Recordarme
        </label>
        <button type="button" className="auth-form__forgot" disabled={loading}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary auth-form__submit"
        disabled={loading}
      >
        {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}

export default Login
