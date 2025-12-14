import React, { useState } from 'react'
import { useAuthOperations } from '../../hooks/useAuth'
import { validateEmail, validatePassword, validatePhone } from '../../utils/validators'

const Register = ({ onSuccess, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const { register } = useAuthOperations()

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

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.apellido || formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres'
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.telefono && !validatePhone(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido'
    }

    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const { confirmPassword, ...userData } = formData
    const result = await register(userData)
    
    if (result.success) {
      onSuccess()
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__row">
        <div className="auth-form__group">
          <label htmlFor="nombre" className="auth-form__label">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`auth-form__input ${errors.nombre ? 'auth-form__input--error' : ''}`}
            placeholder="Tu nombre"
            disabled={loading}
          />
          {errors.nombre && <span className="auth-form__error">{errors.nombre}</span>}
        </div>

        <div className="auth-form__group">
          <label htmlFor="apellido" className="auth-form__label">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={`auth-form__input ${errors.apellido ? 'auth-form__input--error' : ''}`}
            placeholder="Tu apellido"
            disabled={loading}
          />
          {errors.apellido && <span className="auth-form__error">{errors.apellido}</span>}
        </div>
      </div>

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
        <label htmlFor="telefono" className="auth-form__label">Teléfono (Opcional)</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={`auth-form__input ${errors.telefono ? 'auth-form__input--error' : ''}`}
          placeholder="+54 11 1234-5678"
          disabled={loading}
        />
        {errors.telefono && <span className="auth-form__error">{errors.telefono}</span>}
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

      <div className="auth-form__group">
        <label htmlFor="confirmPassword" className="auth-form__label">Confirmar Contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`auth-form__input ${errors.confirmPassword ? 'auth-form__input--error' : ''}`}
          placeholder="••••••••"
          disabled={loading}
        />
        {errors.confirmPassword && <span className="auth-form__error">{errors.confirmPassword}</span>}
      </div>

      <div className="auth-form__terms">
        <label className="auth-form__remember">
          <input type="checkbox" required disabled={loading} />
          Acepto los <a href="/terms">Términos de Servicio</a> y la <a href="/privacy">Política de Privacidad</a>
        </label>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary auth-form__submit"
        disabled={loading}
      >
        {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
      </button>
    </form>
  )
}

export default Register
