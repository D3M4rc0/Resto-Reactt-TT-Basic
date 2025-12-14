import React, { useEffect, useState } from 'react'

const Notification = ({ 
  message, 
  type = 'info', 
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) setTimeout(onClose, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [message, duration, onClose])

  if (!isVisible || !message) return null

  const typeConfig = {
    success: { icon: '✅', color: '#10b981' },
    error: { icon: '❌', color: '#ef4444' },
    warning: { icon: '⚠️', color: '#f59e0b' },
    info: { icon: 'ℹ️', color: '#3b82f6' },
    cart: { icon: '🛒', color: '#8b5cf6' },
    admin: { icon: '👑', color: '#f97316' }
  }

  const config = typeConfig[type] || typeConfig.info

  return (
    <div 
      className="notification"
      style={{ 
        borderLeft: `4px solid ${config.color}`,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div className="notification__content">
        <span className="notification__icon">{config.icon}</span>
        <span className="notification__message">{message}</span>
        <button 
          className="notification__close"
          onClick={() => {
            setIsVisible(false)
            if (onClose) setTimeout(onClose, 300)
          }}
        >
          ×
        </button>
      </div>
      <div 
        className="notification__progress"
        style={{ 
          animation: `shrink ${duration}ms linear`,
          backgroundColor: config.color 
        }}
      />
    </div>
  )
}

// Sistema global de notificaciones
let notificationId = 0
const notifications = []
const subscribers = []

const notify = (message, type = 'info', duration = 3000) => {
  const id = ++notificationId
  const notification = { id, message, type, duration }
  notifications.push(notification)
  
  // Notificar a todos los suscriptores
  subscribers.forEach(callback => callback(notifications))
  
  // Auto-remover
  setTimeout(() => {
    const index = notifications.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.splice(index, 1)
      subscribers.forEach(callback => callback([...notifications]))
    }
  }, duration + 300)
  
  return id
}

// Registrar función global
if (typeof window !== 'undefined') {
  window.showNotification = notify
}

// Hook para usar notificaciones
export const useNotifications = () => {
  const [notificationsList, setNotificationsList] = useState([])

  useEffect(() => {
    const callback = (newNotifications) => {
      setNotificationsList(newNotifications)
    }
    
    subscribers.push(callback)
    setNotificationsList([...notifications])
    
    return () => {
      const index = subscribers.indexOf(callback)
      if (index > -1) subscribers.splice(index, 1)
    }
  }, [])

  return {
    notifications: notificationsList,
    showNotification: notify,
    clearAll: () => {
      notifications.length = 0
      subscribers.forEach(callback => callback([]))
    }
  }
}

// Componente contenedor
export const NotificationContainer = () => {
  const { notifications } = useNotifications()

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => {
            const index = notifications.findIndex(n => n.id === notification.id)
            if (index > -1) {
              notifications.splice(index, 1)
              subscribers.forEach(callback => callback([...notifications]))
            }
          }}
        />
      ))}
    </div>
  )
}

export default Notification