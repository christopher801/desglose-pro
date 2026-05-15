import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllUsers, unlockUser, lockUser } from '../services/userService'
import { getNotifications, markNotificationAsRead, deleteNotification } from '../services/notificationService'
import Layout from '../components/Layout'

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState('users')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [usersResult, notifsResult] = await Promise.all([
      getAllUsers(),
      getNotifications()
    ])
    if (usersResult.success) setUsers(usersResult.users)
    if (notifsResult.success) setNotifications(notifsResult.notifications)
    setLoading(false)
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleUnlock = async (userId) => {
    const result = await unlockUser(userId)
    if (result.success) {
      showMessage('✅ Usuario activado exitosamente')
      loadData()
    } else {
      showMessage('❌ Error al activar usuario')
    }
  }

  const handleLock = async (userId) => {
    const result = await lockUser(userId)
    if (result.success) {
      showMessage('🔒 Usuario bloqueado')
      loadData()
    } else {
      showMessage('❌ Error al bloquear usuario')
    }
  }

  const handleMarkRead = async (notifId) => {
    await markNotificationAsRead(notifId)
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n))
  }

  const handleDeleteNotif = async (notifId) => {
    await deleteNotification(notifId)
    setNotifications(prev => prev.filter(n => n.id !== notifId))
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="page-content">
          <div className="card-modern text-center p-5">
            <div style={{ fontSize: '3rem' }}>⛔</div>
            <h4 style={{ marginTop: '1rem' }}>Acceso denegado</h4>
            <p className="text-muted">No tienes permisos de administrador</p>
          </div>
        </div>
      </Layout>
    )
  }

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.isActive).length
  const pendingUsers = users.filter(u => !u.isActive && u.role !== 'admin').length
  const unreadNotifs = notifications.filter(n => !n.read).length

  return (
    <Layout unreadCount={unreadNotifs}>
      <div className="page-content">

        <div className="admin-header">
          <h1 className="page-title">Panel de administración</h1>
          <button className="btn-secondary-sm" onClick={loadData}>↺ Actualizar</button>
        </div>

        {/* Notif pendientes */}
        {pendingUsers > 0 && (
          <div className="notif-strip">
            🔔 <strong>{pendingUsers}</strong> usuario{pendingUsers > 1 ? 's' : ''} esperando activación
          </div>
        )}

        {message && <div className="alert-info">{message}</div>}

        {/* Stats */}
        <div className="dashboard-stats mb-4">
          <div className="stat-card">
            <div className="stat-card-title">Total usuarios</div>
            <div className="stat-card-value">{totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">Activos</div>
            <div className="stat-card-value" style={{ color: 'var(--success)' }}>{activeUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">Pendientes</div>
            <div className="stat-card-value" style={{ color: 'var(--warning)' }}>{pendingUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">Notificaciones</div>
            <div className="stat-card-value" style={{ color: 'var(--primary)' }}>{unreadNotifs}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'users' ? 'admin-tab-active' : ''}`}
            onClick={() => setTab('users')}
          >
            👥 Usuarios ({totalUsers})
          </button>
          <button
            className={`admin-tab ${tab === 'notifs' ? 'admin-tab-active' : ''}`}
            onClick={() => setTab('notifs')}
          >
            🔔 Notificaciones {unreadNotifs > 0 && `(${unreadNotifs})`}
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Cargando...</div>
        ) : (
          <>
            {/* Tab usuarios */}
            {tab === 'users' && (
              <div className="card-modern">
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, idx) => (
                        <tr key={u.id} className={!u.isActive && u.role !== 'admin' ? 'row-pending' : ''}>
                          <td>{idx + 1}</td>
                          <td>{u.nombre || '—'}</td>
                          <td className="td-email">{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                              {u.role === 'admin' ? 'Admin' : 'Usuario'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${u.isActive ? 'badge-active' : 'badge-inactive'}`}>
                              {u.isActive ? 'Activo' : 'Pendiente'}
                            </span>
                          </td>
                          <td className="td-date">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-DO') : '—'}
                          </td>
                          <td>
                            {u.role !== 'admin' && (
                              !u.isActive ? (
                                <button className="btn-success-sm" onClick={() => handleUnlock(u.id)}>
                                  Activar
                                </button>
                              ) : (
                                <button className="btn-warning-sm" onClick={() => handleLock(u.id)}>
                                  Bloquear
                                </button>
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-footer">
                  Total: {totalUsers} usuarios
                </div>
              </div>
            )}

            {/* Tab notificaciones */}
            {tab === 'notifs' && (
              <div className="card-modern">
                {notifications.length === 0 ? (
                  <p className="empty-state">No hay notificaciones</p>
                ) : (
                  <div className="notif-list">
                    {notifications.map((n) => (
                      <div key={n.id} className={`notif-item ${!n.read ? 'notif-unread' : ''}`}>
                        <div className="notif-item-body">
                          <div className="notif-item-title">{n.title}</div>
                          <div className="notif-item-msg">{n.message}</div>
                          <div className="notif-item-date">
                            {new Date(n.createdAt).toLocaleString('es-DO')}
                          </div>
                        </div>
                        <div className="notif-item-actions">
                          {!n.read && (
                            <button className="btn-ghost-sm" onClick={() => handleMarkRead(n.id)}>
                              Marcar leída
                            </button>
                          )}
                          <button className="btn-danger-sm" onClick={() => handleDeleteNotif(n.id)}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
