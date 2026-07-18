import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllUsers, unlockUser, lockUser } from '../services/userService'
import { getNotifications, markNotificationAsRead, deleteNotification } from '../services/notificationService'
import { getActividad, getActionLabel, logActividad } from '../services/actividadService'
import Layout from '../components/Layout'

export default function AdminPage() {
  const { isAdmin, user, userData } = useAuth()
  const [users, setUsers] = useState([])
  const [notifications, setNotifications] = useState([])
  const [actividad, setActividad] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState('users')

  // Filtro aktivite
  const [filterUser, setFilterUser] = useState('')
  const [filterAction, setFilterAction] = useState('')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const [usersResult, notifsResult, actividadResult] = await Promise.all([
      getAllUsers(),
      getNotifications(),
      getActividad(200)
    ])
    if (usersResult.success) setUsers(usersResult.users)
    if (notifsResult.success) setNotifications(notifsResult.notifications)
    if (actividadResult.success) setActividad(actividadResult.actividad)
    setLoading(false)
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleUnlock = async (userId, userName) => {
    const result = await unlockUser(userId)
    if (result.success) {
      // Track aksyon admin
      await logActividad({
        uid: user?.uid,
        nombre: userData?.nombre,
        email: userData?.email,
        action: 'admin_action',
        detail: `Activó al usuario: ${userName}`
      })
      showMessage('✅ Usuario activado exitosamente')
      loadData()
    } else {
      showMessage('❌ Error al activar usuario')
    }
  }

  const handleLock = async (userId, userName) => {
    const result = await lockUser(userId)
    if (result.success) {
      await logActividad({
        uid: user?.uid,
        nombre: userData?.nombre,
        email: userData?.email,
        action: 'admin_action',
        detail: `Bloqueó al usuario: ${userName}`
      })
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
            <i className="bi bi-shield-exclamation" style={{ fontSize: '3rem' }}></i>
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

  // Filtro aktivite
  const actividadFiltrada = actividad.filter(a => {
    const matchUser = filterUser === '' || a.uid === filterUser
    const matchAction = filterAction === '' || a.action === filterAction
    return matchUser && matchAction
  })

  // Users ki pi aktif (login count)
  const loginCounts = actividad
    .filter(a => a.action === 'login')
    .reduce((acc, a) => {
      acc[a.uid] = { count: (acc[a.uid]?.count || 0) + 1, nombre: a.nombre, email: a.email }
      return acc
    }, {})
  const topUsers = Object.entries(loginCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)

  return (
    <Layout unreadCount={unreadNotifs}>
      <div className="page-content">

        <div className="admin-header">
          <h1 className="page-title">
            <i className="bi bi-shield-lock" style={{ marginRight: '8px' }}></i>Panel de administración
          </h1>
          <button className="btn-secondary-sm" onClick={loadData}>
            <i className="bi bi-arrow-clockwise" style={{ marginRight: '6px' }}></i>Actualizar
          </button>
        </div>

        {pendingUsers > 0 && (
          <div className="notif-strip">
            <i className="bi bi-bell" style={{ marginRight: '6px' }}></i>
            <strong>{pendingUsers}</strong> usuario{pendingUsers > 1 ? 's' : ''} esperando activación
          </div>
        )}

        {message && <div className="alert-info">{message}</div>}

        <div className="dashboard-stats mb-4">
          <div className="stat-card">
            <div className="stat-card-title">
              <i className="bi bi-people" style={{ marginRight: '4px' }}></i>Total usuarios
            </div>
            <div className="stat-card-value">{totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">
              <i className="bi bi-check-circle" style={{ marginRight: '4px' }}></i>Activos
            </div>
            <div className="stat-card-value" style={{ color: 'var(--success)' }}>{activeUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">
              <i className="bi bi-clock-history" style={{ marginRight: '4px' }}></i>Pendientes
            </div>
            <div className="stat-card-value" style={{ color: 'var(--warning)' }}>{pendingUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">
              <i className="bi bi-bell" style={{ marginRight: '4px' }}></i>Notificaciones
            </div>
            <div className="stat-card-value" style={{ color: 'var(--primary)' }}>{unreadNotifs}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">
              <i className="bi bi-activity" style={{ marginRight: '4px' }}></i>Acciones hoy
            </div>
            <div className="stat-card-value">
              {actividad.filter(a => {
                const hoy = new Date().toDateString()
                return new Date(a.fecha).toDateString() === hoy
              }).length}
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'users' ? 'admin-tab-active' : ''}`}
            onClick={() => setTab('users')}
          >
            <i className="bi bi-people" style={{ marginRight: '6px' }}></i>Usuarios ({totalUsers})
          </button>
          <button
            className={`admin-tab ${tab === 'notifs' ? 'admin-tab-active' : ''}`}
            onClick={() => setTab('notifs')}
          >
            <i className="bi bi-bell" style={{ marginRight: '6px' }}></i>Notificaciones {unreadNotifs > 0 && `(${unreadNotifs})`}
          </button>
          <button
            className={`admin-tab ${tab === 'actividad' ? 'admin-tab-active' : ''}`}
            onClick={() => setTab('actividad')}
          >
            <i className="bi bi-bar-chart-line" style={{ marginRight: '6px' }}></i>Actividad
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
                                <button className="btn-success-sm" onClick={() => handleUnlock(u.id, u.nombre)}>
                                  <i className="bi bi-unlock" style={{ marginRight: '4px' }}></i>Activar
                                </button>
                              ) : (
                                <button className="btn-warning-sm" onClick={() => handleLock(u.id, u.nombre)}>
                                  <i className="bi bi-lock" style={{ marginRight: '4px' }}></i>Bloquear
                                </button>
                              )
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-footer">Total: {totalUsers} usuarios</div>
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
                              <i className="bi bi-check-circle" style={{ marginRight: '4px' }}></i>Marcar leída
                            </button>
                          )}
                          <button className="btn-danger-sm" onClick={() => handleDeleteNotif(n.id)}>
                            <i className="bi bi-trash" style={{ marginRight: '4px' }}></i>Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab actividad */}
            {tab === 'actividad' && (
              <div>
                {/* Top users */}
                {topUsers.length > 0 && (
                  <div className="card-modern mb-4">
                    <h3 className="info-card-title">
                      <i className="bi bi-trophy" style={{ marginRight: '6px', color: 'var(--warning)' }}></i>
                      Usuarios más activos
                    </h3>
                    {topUsers.map(([uid, data], idx) => (
                      <div key={uid} className="info-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '22px', height: '22px', borderRadius: '50%',
                            background: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--gray-200)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', fontWeight: 700, color: 'white', flexShrink: 0
                          }}>
                            {idx + 1}
                          </span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600 }}>{data.nombre || '—'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>{data.email}</div>
                          </div>
                        </div>
                        <span className="badge badge-active">{data.count} logins</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Filtros */}
                <div className="card-modern mb-4">
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <select
                      className="auth-input"
                      style={{ width: 'auto', minWidth: '160px' }}
                      value={filterUser}
                      onChange={e => setFilterUser(e.target.value)}
                    >
                      <option value="">Todos los usuarios</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre || u.email}</option>
                      ))}
                    </select>
                    <select
                      className="auth-input"
                      style={{ width: 'auto', minWidth: '160px' }}
                      value={filterAction}
                      onChange={e => setFilterAction(e.target.value)}
                    >
                      <option value="">Todas las acciones</option>
                      <option value="login">Login</option>
                      <option value="logout">Logout</option>
                      <option value="desglose">Desglose</option>
                      <option value="admin_action">Acción admin</option>
                    </select>
                    {(filterUser || filterAction) && (
                      <button className="btn-ghost-sm" onClick={() => { setFilterUser(''); setFilterAction('') }}>
                        <i className="bi bi-x-circle" style={{ marginRight: '4px' }}></i>Limpiar filtros
                      </button>
                    )}
                    <span style={{ fontSize: '12px', color: 'var(--gray-500)', marginLeft: 'auto' }}>
                      {actividadFiltrada.length} registros
                    </span>
                  </div>
                </div>

                {/* Lista actividad */}
                <div className="card-modern" style={{ padding: 0, overflow: 'hidden' }}>
                  {actividadFiltrada.length === 0 ? (
                    <p className="empty-state">No hay actividad registrada</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Acción</th>
                            <th>Detalle</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                          </tr>
                        </thead>
                        <tbody>
                          {actividadFiltrada.map((a) => {
                            const { label, icon, color } = getActionLabel(a.action)
                            const fecha = new Date(a.fecha)
                            return (
                              <tr key={a.id}>
                                <td>
                                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{a.nombre || '—'}</div>
                                  <div className="td-email">{a.email}</div>
                                </td>
                                <td>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color }}>
                                    <i className={`bi ${icon}`}></i>
                                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{label}</span>
                                  </span>
                                </td>
                                <td style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{a.detail || '—'}</td>
                                <td className="td-date">{fecha.toLocaleDateString('es-DO')}</td>
                                <td className="td-date">{fecha.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
