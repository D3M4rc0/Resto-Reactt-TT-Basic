import React, { useState, useEffect, useRef } from 'react'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [conversationStep, setConversationStep] = useState(null)
  const messagesEndRef = useRef(null)

  // Cargar mensajes desde sessionStorage al inicializar
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('chatbot_messages')
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages)
        // Convertir strings de fecha a objetos Date
        const messagesWithDates = parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        setMessages(messagesWithDates)
      } catch (error) {
        console.error('Error cargando mensajes:', error)
        sessionStorage.removeItem('chatbot_messages')
      }
    }
  }, [])

  // Guardar mensajes en sessionStorage cuando cambian
  useEffect(() => {
    if (messages.length > 0) {
      // Convertir objetos Date a strings ISO para serialización
      const messagesToSave = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }))
      sessionStorage.setItem('chatbot_messages', JSON.stringify(messagesToSave))
    } else {
      // Si no hay mensajes, asegurarse de que sessionStorage esté limpio
      sessionStorage.removeItem('chatbot_messages')
    }
  }, [messages])

  // Guardar conversationStep también
  useEffect(() => {
    if (conversationStep) {
      sessionStorage.setItem('chatbot_conversationStep', conversationStep)
    } else {
      sessionStorage.removeItem('chatbot_conversationStep')
    }
  }, [conversationStep])

  // Cargar conversationStep al inicializar
  useEffect(() => {
    const savedStep = sessionStorage.getItem('chatbot_conversationStep')
    if (savedStep) {
      setConversationStep(savedStep)
    }
  }, [])

  // Auto scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mensaje de bienvenida automático - SOLO cuando se abre por primera vez en la sesión
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const hasShownWelcome = sessionStorage.getItem('chatbot_welcome_shown')
      
      if (!hasShownWelcome) {
        setTimeout(() => {
          const welcomeMessages = [
            {
              id: 1,
              text: '¡Hola! 👋 Soy el asistente gourmet de **Le Marc Gourmet**.',
              isBot: true,
              timestamp: new Date()
            },
            {
              id: 2,
              text: '¿En qué puedo ayudarte hoy? Puedo asistirte con: \n\n• 📋 **Menú y especialidades**\n• 🕒 **Horarios y reservas**\n• 🎉 **Eventos y celebraciones**\n• 📍 **Ubicación y contacto**',
              isBot: true,
              timestamp: new Date()
            }
          ]
          
          setMessages(welcomeMessages)
          sessionStorage.setItem('chatbot_welcome_shown', 'true')
        }, 500)
      }
    }
  }, [isOpen, messages.length])

  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim()) return

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userMsg = inputMessage.toLowerCase()
    setInputMessage('')

    // Simular respuesta del bot después de un delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMsg)
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }, 800)
  }

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    // Sistema de flujo de conversación
    if (conversationStep === 'reserva_confirmacion') {
      setConversationStep(null)
      return '✅ **¡Perfecto! Tu consulta ha sido registrada.**\n\nNuestro equipo se contactará contigo en las próximas 24 horas para confirmar todos los detalles.\n\n¿Hay algo más en lo que pueda ayudarte?'
    }

    if (conversationStep === 'reserva_detalles') {
      setConversationStep('reserva_confirmacion')
      return '📝 **¡Excelente elección!**\n\nPara agilizar el proceso, ¿podrías proporcionarnos:\n\n1. 📧 Tu correo electrónico\n2. 📱 Un número de teléfono de contacto\n3. 📅 Fecha y hora preferida\n\nO si prefieres, puedes usar nuestro formulario de contacto en la página.'
    }

    // Respuestas según palabras clave con flujo de conversación
    if (message.includes('reserva') || message.includes('reservar') || message.includes('mesa')) {
      setConversationStep('reserva_detalles')
      return '🎯 **¡Claro! Para hacer una reserva en Le Marc Gourmet:**\n\n• 📞 **Teléfono:** +54 11 1234-5678\n• 💬 **WhatsApp:** +54 11 1234-5678\n• 📧 **Email:** reservas@lemarcgourmet.com\n\n¿Para cuántas personas y qué fecha tienes en mente?'
    }
    
    if (message.includes('menú') || message.includes('plato') || message.includes('comida') || message.includes('carta')) {
      return '🍽️ **Nuestro menú gourmet incluye:**\n\n• **Especialidades de chef** 🧑‍🍳\n• **Mariscos frescos** 🦞\n• **Cortes premium** 🥩\n• **Opción vegetariana** 🌱\n• **Postres artesanales** 🍰\n\n¿Te interesa alguna categoría en particular o prefieres ver el menú completo en la sección "Menú"?'
    }
    
    if (message.includes('precio') || message.includes('costo') || message.includes('caro')) {
      return '💰 **Tenemos opciones para cada ocasión:**\n\n• **Menú ejecutivo:** $2.500 - $3.500\n• **Cena gourmet:** $4.000 - $6.000\n• **Degustación premium:** $7.500+\n\n*Los precios incluyen entrada, plato principal y postre.*\n\n¿Buscas algo específico para una celebración especial?'
    }
    
    if (message.includes('horario') || message.includes('abierto') || message.includes('cierra') || message.includes('hora')) {
      return '🕒 **Nuestros horarios exclusivos:**\n\n📅 **Lunes a Sábado:**\n• Almuerzo: 12:00 - 15:00\n• Cena: 19:00 - 02:00\n\n📅 **Domingos:**\n• Cerrado (solo eventos privados)\n\n*Recomendamos reserva previa para garantizar tu mesa.*'
    }
    
    if (message.includes('ubicación') || message.includes('dirección') || message.includes('lugar') || message.includes('mapa')) {
      return '📍 **Nos encontramos en:**\n\n**Av. Corrientes 3247, CABA**\n(Abasto de Buenos Aires)\n\n🚗 **Estacionamiento:** Disponible\n🚇 **Subte:** Línea B - Estación Carlos Gardel\n\n¿Necesitas indicaciones específicas?'
    }
    
    if (message.includes('evento') || message.includes('celebración') || message.includes('fiesta') || message.includes('privado')) {
      setConversationStep('reserva_detalles')
      return '🎉 **¡Perfecto para eventos especiales!**\n\nOrganizamos:\n• **Cenas empresariales** 💼\n• **Aniversarios** 💕\n• **Cumpleaños** 🎂\n• **Degustaciones privadas** 🍷\n\nContamos con salones privados y menús personalizados. ¿Para cuántas personas y qué fecha tienes en mente?'
    }
    
    if (message.includes('delivery') || message.includes('envío') || message.includes('domicilio') || message.includes('pedido')) {
      return '🚚 **Servicio de delivery premium:**\n\n• **Zonas:** Palermo, Recoleta, Centro, Abasto\n• **Tiempo:** 30-45 minutos\n• **Mínimo:** $5.000 (envío gratis)\n• **Horario:** 19:00 - 23:00\n\n*El menú de delivery es diferente al del restaurante.*'
    }
    
    if (message.includes('vegetariano') || message.includes('vegano') || message.includes('celíaco') || message.includes('alergia')) {
      return '🌱 **Opciones especiales disponibles:**\n\n• **Menú vegetariano completo**\n• **Platos veganos certificados**\n• **Opción sin gluten (celíacos)**\n• **Atención a alergias alimentarias**\n\n*Informa a tu mesero sobre cualquier restricción.*'
    }
    
    if (message.includes('recomendación') || message.includes('recomiendan') || message.includes('especial')) {
      return '🌟 **Recomendaciones del chef:**\n\n1. **Lomo Wellington** - Nuestra especialidad\n2. **Risotto de hongos silvestres**\n3. **Tiradito de corvina**\n4. **Volcán de chocolate 70%**\n\n*Todas las recomendaciones incluyen maridaje sugerido.*'
    }
    
    if (message.includes('gracias') || message.includes('thank you') || message.includes('genial')) {
      return '🙏 **¡Es un placer ayudarte!**\n\nNo dudes en consultarme si necesitas más información.\n\n¡Esperamos verte pronto en **Le Marc Gourmet**! 🍷'
    }
    
    if (message.includes('hola') || message.includes('buenas') || message.includes('hello')) {
      return '¡Hola de nuevo! 😊\n\n¿En qué más puedo asistirte? ¿Menú, reservas, horarios o algo específico?'
    }
    
    // Si no entiende, sugiere opciones
    return '🤔 **No estoy seguro de entender completamente.**\n\nPuedo ayudarte mejor con:\n\n📋 **Opciones del menú y especialidades**\n🎯 **Reservas y eventos privados**\n🕒 **Horarios y ubicación**\n💰 **Precios y promociones**\n\n¿Cuál de estos temas te interesa?'
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleQuickReply = (reply) => {
    setInputMessage(reply)
    setTimeout(() => {
      // Simular envío automático
      const userMessage = {
        id: Date.now(),
        text: reply,
        isBot: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      
      setTimeout(() => {
        const botResponse = generateBotResponse(reply)
        const botMessage = {
          id: Date.now() + 1,
          text: botResponse,
          isBot: true,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      }, 800)
    }, 100)
  }

  // Función para limpiar el chat
  const clearChat = () => {
    // Limpiar estado local
    setMessages([])
    setConversationStep(null)
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('chatbot_messages')
    sessionStorage.removeItem('chatbot_conversationStep')
    sessionStorage.removeItem('chatbot_welcome_shown')
    
    // Mostrar mensaje de bienvenida nuevamente
    setTimeout(() => {
      const welcomeMessages = [
        {
          id: 1,
          text: '¡Hola! 👋 Soy el asistente gourmet de **Le Marc Gourmet**.',
          isBot: true,
          timestamp: new Date()
        },
        {
          id: 2,
          text: '¿En qué puedo ayudarte hoy? Puedo asistirte con: \n\n• 📋 **Menú y especialidades**\n• 🕒 **Horarios y reservas**\n• 🎉 **Eventos y celebraciones**\n• 📍 **Ubicación y contacto**',
          isBot: true,
          timestamp: new Date()
        }
      ]
      
      setMessages(welcomeMessages)
      sessionStorage.setItem('chatbot_welcome_shown', 'true')
    }, 500)
  }

  const quickReplies = [
    '¿Hacen reservas?',
    '¿Cuál es el menú del día?',
    '¿Tienen opciones vegetarianas?',
    '¿Horarios de atención?',
    '¿Ubicación y estacionamiento?',
    '¿Eventos privados?'
  ]

  return (
    <>
      {/* Botón flotante del chat */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'chatbot-toggle--active' : ''}`}
        onClick={toggleChat}
        aria-label="Abrir chat de asistencia"
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && <span className="chatbot-notification"></span>}
      </button>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-avatar">🍷</span>
              <div className="chatbot-info">
                <h4>Le Marc Gourmet</h4>
                <span className="chatbot-status">
                  <span className="status-dot"></span>
                  Asistente gourmet
                </span>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <button 
                onClick={clearChat}
                aria-label="Limpiar chat"
                title="Limpiar conversación"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#666',
                  transition: 'all 0.2s ease',
                  backgroundColor: 'transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.color = '#e74c3c';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#666';
                }}
              >
                🗑️
              </button>
              <button 
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat"
              >
                ×
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`chat-message ${message.isBot ? 'chat-message--bot' : 'chat-message--user'}`}
              >
                <div className="message-content">
                  <div className="message-bubble">
                    {message.text.split('\n').map((line, index) => {
                      if (line.includes('**') && line.includes('**')) {
                        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        return <p key={index} dangerouslySetInnerHTML={{ __html: boldText }} />
                      }
                      return <p key={index}>{line}</p>
                    })}
                  </div>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('es-AR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Respuestas rápidas */}
          {messages.length <= 4 && (
            <div className="chatbot-quick-replies">
              <p className="quick-replies-title">Preguntas frecuentes:</p>
              <div className="quick-replies-grid">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="quick-reply-btn"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu consulta gourmet..."
              className="chatbot-input-field"
              autoFocus
            />
            <button 
              type="submit" 
              className="chatbot-send-btn"
              disabled={!inputMessage.trim()}
              aria-label="Enviar mensaje"
            >
              <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatBot