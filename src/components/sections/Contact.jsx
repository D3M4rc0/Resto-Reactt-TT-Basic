import React, { useState } from 'react'
import { validateEmail, validatePhone } from '../../utils/validators'

const Contact = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
    tipoConsulta: 'general'
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
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
      newErrors.nombre = 'Nombre requerido'
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (formData.telefono && !validatePhone(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido'
    }

    if (!formData.asunto || formData.asunto.trim().length < 5) {
      newErrors.asunto = 'Asunto muy corto'
    }

    if (!formData.mensaje || formData.mensaje.trim().length < 10) {
      newErrors.mensaje = 'Mensaje muy corto'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aquí integraría con Formspree o tu backend
      console.log('Formulario enviado:', formData)
      
      setIsSubmitted(true)
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: '',
        tipoConsulta: 'general'
      })
      
    } catch (error) {
      console.error('Error enviando formulario:', error)
      setErrors({ submit: 'Error enviando el mensaje. Intenta nuevamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: '📍',
      title: 'Dirección',
      content: 'Av. Corrientes 3247, CABA',
      description: 'Abasto de Buenos Aires'
    },
    {
      icon: '📞',
      title: 'Teléfono',
      content: '+54 11 1234-5678',
      description: 'Lun-Sáb 10:00-14:00 / 19:00-02:00'
    },
    {
      icon: '✉️',
      title: 'Email',
      content: 'info@lemarourgourmet.com',
      description: 'Respondemos en 24h'
    },
    {
      icon: '🕒',
      title: 'Horarios',
      content: 'Lun-Sáb: 10:00-14:00 / 19:00-02:00',
      description: 'Domingo: Cerrado'
    }
  ]

  const serviciosExclusivos = [
    {
      icon: '🎉',
      title: 'Eventos Privados',
      description: 'Cenas ejecutivas, aniversarios y celebraciones especiales'
    },
    {
      icon: '💼',
      title: 'Catering Empresarial',
      description: 'Servicio premium para empresas y reuniones corporativas'
    },
    {
      icon: '👨‍🍳',
      title: 'Chef a Domicilio',
      description: 'Experiencia gastronómica exclusiva en tu hogar'
    },
    {
      icon: '🍷',
      title: 'Degustaciones',
      description: 'Catas de vinos y menús degustación exclusivos'
    }
  ]

  if (isSubmitted) {
    return (
      <section className="contact-section">
        <div className="container">
          <div className="contact-success">
            <div className="success-icon">✅</div>
            <h2>¡Mensaje Enviado Exitosamente!</h2>
            <p>
              Gracias por contactarnos. Hemos recibido tu mensaje y te 
              responderemos dentro de las próximas 24 horas.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsSubmitted(false)}
            >
              Enviar Otro Mensaje
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2 className="section-title">Contáctanos</h2>
          <p className="section-subtitle">
            ¿Tienes preguntas, comentarios o quieres hacer una reserva en <strong>Le Marc Gourmet</strong>? 
            Estamos aquí para ayudarte.
          </p>
        </div>
		<div className="section-divider"></div>
		

        <div className="contact-content">

          <div className="contact-left-column">

            <div className="exclusive-services-card">
              <div className="exclusive-header">
                <div className="exclusive-icon">✨</div>
                <h3>Consulta y Reservas Exclusivas</h3>
                <p className="exclusive-subtitle">
                  Servicios premium para clientes exigentes
                </p>
              </div>
              
              <div className="exclusive-services-grid">
                {serviciosExclusivos.map((servicio, index) => (
                  <div key={index} className="exclusive-service-item">
                    <div className="service-icon">{servicio.icon}</div>
                    <div className="service-details">
                      <h4>{servicio.title}</h4>
                      <p>{servicio.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="exclusive-benefits">
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>Reserva prioritaria</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>Atención personalizada</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <span>Menús personalizables</span>
                </div>
              </div>
            </div>


            <div className="contact-form-container">
              <div className="form-header">
                <h3>Envíanos tu Consulta</h3>
                <p>Todos los campos marcados con * son obligatorios</p>
              </div>
              
              <form 
                className="contact-form" 
                onSubmit={handleSubmit}
                action="https://formspree.io/f/xdkzerdy" 
                method="POST"
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre *</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={errors.nombre ? 'error' : ''}
                      placeholder="Tu nombre completo"
                      required
                    />
                    {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="tu@email.com"
                      required
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono (Opcional)</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className={errors.telefono ? 'error' : ''}
                    placeholder="+54 11 1234-5678"
                  />
                  {errors.telefono && <span className="error-text">{errors.telefono}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="asunto">Asunto *</label>
                  <select
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleInputChange}
                    className={errors.asunto ? 'error' : ''}
                    required
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="reserva">Reserva de Mesa</option>
                    <option value="evento">Evento Privado</option>
                    <option value="catering">Servicio de Catering</option>
                    <option value="consulta">Consulta General</option>
                    <option value="sugerencia">Sugerencia o Comentario</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.asunto && <span className="error-text">{errors.asunto}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje *</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleInputChange}
                    className={errors.mensaje ? 'error' : ''}
                    placeholder="Describe tu consulta, reserva o comentario..."
                    rows="5"
                    required
                  />
                  {errors.mensaje && <span className="error-text">{errors.mensaje}</span>}
                </div>

                {errors.submit && (
                  <div className="error-message">
                    {errors.submit}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary contact-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>
          </div>


          <div className="contact-right-column">
            <div className="contact-info-card">
              <div className="card-header">
                <h3>Le Marc Gourmet</h3>
                <p className="card-subtitle">Tu experiencia gourmet de confianza</p>
              </div>
              
              <div className="contact-info-grid">
                {contactInfo.map((item, index) => (
                  <div key={index} className="contact-info-item">
                    <div className="contact-icon">{item.icon}</div>
                    <div className="contact-details">
                      <h4>{item.title}</h4>
                      <p className="contact-content">{item.content}</p>
                      <p className="contact-description">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>


              <div className="whatsapp-contact">
                <a 
                  href="https://wa.me/5491112345678" 
                  className="whatsapp-button" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <span className="whatsapp-icon">💚</span>
                  <span className="whatsapp-text">
                    <span className="whatsapp-title">Contactar por WhatsApp</span>
                    <span className="whatsapp-subtitle">Respuesta inmediata</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="contact-map-card">
              <div className="card-header">
                <h4>Nuestra Ubicación</h4>
                <p className="card-subtitle">Visítanos en el corazón de Buenos Aires</p>
              </div>
              
              <div className="mapa">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.011300354605!2d-58.41356462488473!3d-34.60387575750543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca8c854bd13f%3A0xfc0cf5c054da4aa1!2sAbasto%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1749588419497!5m2!1sen!2sar" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Le Marc Gourmet - Abasto de Buenos Aires"
                  aria-label="Mapa mostrando la ubicación de Le Marc Gourmet en Abasto de Buenos Aires"
                >
                </iframe>
              </div>
              
              <div className="map-info">
                <div className="map-info-item">
                  <span className="map-icon">🚗</span>
                  <span>Estacionamiento disponible</span>
                </div>
                <div className="map-info-item">
                  <span className="map-icon">🚇</span>
                  <span>A 100m del Subte</span>
                </div>
                <div className="map-info-item">
                  <span className="map-icon">♿</span>
                  <span>Accesible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact