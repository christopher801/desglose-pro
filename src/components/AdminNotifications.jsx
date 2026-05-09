import React, { useState, useEffect } from 'react'
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications } from '../services/notificationService'

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = async () => {
    setLoading(true)
    const result = await getNotifications()
    if (result.success) {
      setNotifications(result.notifications)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkRead = async (id) => {
    await markNotificationAsRead(id)
    loadNotifications()
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead()
    loadNotifications()
  }

  const handleDelete = async (id) => {
    await deleteNotification(id)
    loadNotifications()
  }

  const handleDeleteAll = async () => {
    if (window.confirm('¿Eliminar todas las notificaciones?')) {
      await deleteAllNotifications()
      loadNotifications()
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_USER':
        return '👤'
      default:
        return '📌'
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'NEW_USER':
        return 'var(--success)'
      default:
        return 'var(--primary)'
    }
  }

  return (
    <div className="card-modern">
      <div className="p-4 border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">🔔 Notificaciones</h4>
          <div>
            {notifications.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllRead}
                  className="btn-professional btn-professional-outline me-2"
                  style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                >
                  Marcar todas como leídas
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="btn-professional btn-professional-outline"
                  style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                >
                  Eliminar todas
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-0">
        {loading ? (
          <div className="text-center py-5">Cargando...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No hay notificaciones
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--gray-100)',
                background: notif.read ? 'white' : 'var(--gray-50)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => handleMarkRead(notif.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ fontSize: '1.5rem' }}>{getNotificationIcon(notif.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{notif.title}</span>
                    {!notif.read && (
                      <span style={{
                        background: getNotificationColor(notif.type),
                        color: 'white',
                        fontSize: '0.65rem',
                        padding: '2px 8px',
                        borderRadius: '9999px'
                      }}>
                        Nueva
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '4px' }}>{notif.message}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '6px' }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '2px' }}>
                    Usuario: {notif.userEmail}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(notif.id)
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'var(--gray-400)',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--gray-200)'
                    e.target.style.color = 'var(--danger)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.color = 'var(--gray-400)'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminNotifications