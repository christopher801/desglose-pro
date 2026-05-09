import React, { useState, useEffect, useRef } from 'react'
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, getUnreadCount } from '../services/notificationService'

// Fonksyon pou jwe son
const playNotificationSound = () => {
  try {
    // Kreye yon son senp ak Web Audio API (pa bezwen fichye ekstèn)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 880 // Son aigu
    gainNode.gain.value = 0.3 // Volim modere
    
    oscillator.start()
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5)
    oscillator.stop(audioContext.currentTime + 0.5)
    
    // Re-lanse AudioContext si li sispann
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }
  } catch (error) {
    console.log('Audio not supported:', error)
  }
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)
  const previousCountRef = useRef(0)

  const loadNotifications = async () => {
    setLoading(true)
    const result = await getNotifications()
    if (result.success) {
      setNotifications(result.notifications)
      const newUnreadCount = result.notifications.filter(n => !n.read).length
      
      // Si gen nouvo notifikasyon epi kantite ogmante, jwe son
      if (newUnreadCount > previousCountRef.current && previousCountRef.current !== 0) {
        playNotificationSound()
      }
      
      previousCountRef.current = newUnreadCount
      setUnreadCount(newUnreadCount)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadNotifications()
    
    // Rechaje chak 30 segonn
    const interval = setInterval(loadNotifications, 30000)
    
    // Fèmen dropdown lè klike deyò
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNotificationClick = async (notificationId) => {
    await markNotificationAsRead(notificationId)
    loadNotifications()
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead()
    loadNotifications()
  }

  const handleDelete = async (notificationId, e) => {
    e.stopPropagation()
    await deleteNotification(notificationId)
    loadNotifications()
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_USER':
        return '👤'
      default:
        return '📌'
    }
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'transparent',
          border: 'none',
          position: 'relative',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = 'var(--gray-100)'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: 'var(--danger)',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: '9999px',
            minWidth: '18px'
          }}>
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '380px',
          maxWidth: 'calc(100vw - 20px)',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
          border: '1px solid var(--gray-200)',
          zIndex: 1000,
          marginTop: '8px'
        }}>
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid var(--gray-200)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h6 style={{ margin: 0, fontWeight: 600 }}>Notificaciones</h6>
            {notifications.some(n => !n.read) && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '12px',
                  color: 'var(--primary)',
                  cursor: 'pointer'
                }}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid var(--gray-200)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto'
                }} />
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>
                No hay notificaciones
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--gray-100)',
                    cursor: 'pointer',
                    background: notif.read ? 'white' : 'var(--gray-50)',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = notif.read ? 'white' : 'var(--gray-50)'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem' }}>{getNotificationIcon(notif.type)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{notif.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '2px' }}>{notif.message}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                        {new Date(notif.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(notif.id, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: 'var(--gray-400)',
                        padding: '4px'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--danger)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--gray-400)'}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default NotificationBell