import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

import {
  getAllUsers,
  unlockUser,
  lockUser,
  grantFullAccess,
  revokeFullAccess
} from '../services/userService'

import {
  getAdminNotifications,
  markAdminNotificationAsRead,
  deleteNotification,
  createAnnouncement
} from '../services/notificationService'

import {
  getActividad,
  getActionLabel,
  logActividad,
  deleteActividad,
  deleteAllActividad
} from '../services/actividadService'

import Layout from '../components/Layout'

// =========================================================
// UTILIDADES
// =========================================================

const getDaysSince = (createdAt) => {
  if (!createdAt) return null

  const date = new Date(createdAt)

  if (Number.isNaN(date.getTime())) return null

  return Math.floor(
    (new Date() - date) / (1000 * 60 * 60 * 24)
  )
}

// =========================================================
// BADGE DÍAS
// =========================================================

const DaysBadge = ({ days }) => {
  if (days === null) {
    return (
      <span className="badge badge-user">
        —
      </span>
    )
  }

  let bg
  let color

  if (days <= 30) {
    bg = '#dcfce7'
    color = '#166534'
  } else if (days <= 60) {
    bg = '#fef3c7'
    color = '#92400e'
  } else {
    bg = '#fee2e2'
    color = '#991b1b'
  }

  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: '11px',
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: '20px',
        whiteSpace: 'nowrap'
      }}
    >
      {days}d
    </span>
  )
}

// =========================================================
// ADMIN PAGE
// =========================================================

export default function AdminPage() {
  const { isAdmin, user, userData } = useAuth()

  // =======================================================
  // STATES
  // =======================================================

  const [users, setUsers] = useState([])
  const [notifications, setNotifications] = useState([])
  const [actividad, setActividad] = useState([])

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  const [tab, setTab] = useState('users')

  // Search users
  const [searchUsers, setSearchUsers] = useState('')

  // Filtros actividad
  const [filterUser, setFilterUser] = useState('')
  const [filterAction, setFilterAction] = useState('')

  // Announcement
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementMessage, setAnnouncementMessage] = useState('')
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false)

  // =======================================================
  // LOAD DATA
  // =======================================================

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)

    try {
      const [
        usersResult,
        notifsResult,
        actividadResult
      ] = await Promise.all([
        getAllUsers(),
        getAdminNotifications(),
        getActividad(200)
      ])

      if (usersResult.success) {
        setUsers(usersResult.users || [])
      }

      if (notifsResult.success) {
        setNotifications(notifsResult.notifications || [])
      } else {
        console.error(
          'Error cargando notificaciones:',
          notifsResult.error
        )
        setNotifications([])
      }

      if (actividadResult.success) {
        setActividad(actividadResult.actividad || [])
      }
    } catch (error) {
      console.error('Error cargando panel admin:', error)

      showMessage(
        '❌ Error al cargar los datos'
      )
    } finally {
      setLoading(false)
    }
  }

  // =======================================================
  // MESSAGE
  // =======================================================

  const showMessage = (msg) => {
    setMessage(msg)

    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  // =======================================================
  // USER ACTIONS
  // =======================================================

  const handleUnlock = async (userId, userName) => {
    const result = await unlockUser(userId)

    if (result.success) {
      await logActividad({
        uid: user?.uid,
        nombre: userData?.nombre,
        email: userData?.email,
        action: 'admin_action',
        detail: `Activó al usuario: ${userName}`
      })

      showMessage(
        '✅ Usuario activado exitosamente'
      )

      await loadData()
    } else {
      showMessage(
        '❌ Error al activar usuario'
      )
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

      showMessage(
        '🔒 Usuario bloqueado'
      )

      await loadData()
    } else {
      showMessage(
        '❌ Error al bloquear usuario'
      )
    }
  }

  const handleGrantFullAccess = async (
    userId,
    userName
  ) => {
    const result = await grantFullAccess(userId)

    if (result.success) {
      await logActividad({
        uid: user?.uid,
        nombre: userData?.nombre,
        email: userData?.email,
        action: 'admin_action',
        detail: `Full Access otorgado a: ${userName}`
      })

      showMessage(
        '⭐ Full Access otorgado'
      )

      await loadData()
    } else {
      showMessage(
        '❌ Error al otorgar Full Access'
      )
    }
  }

  const handleRevokeFullAccess = async (
    userId,
    userName
  ) => {
    const result = await revokeFullAccess(userId)

    if (result.success) {
      await logActividad({
        uid: user?.uid,
        nombre: userData?.nombre,
        email: userData?.email,
        action: 'admin_action',
        detail: `Full Access revocado a: ${userName}`
      })

      showMessage(
        '🔒 Full Access revocado'
      )

      await loadData()
    } else {
      showMessage(
        '❌ Error al revocar Full Access'
      )
    }
  }

  // =======================================================
  // NOTIFICATIONS
  // =======================================================

  const handleMarkRead = async (notifId) => {
    const result =
      await markAdminNotificationAsRead(
        notifId
      )

    if (result.success) {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notifId
            ? {
                ...notification,
                read: true
              }
            : notification
        )
      )

      showMessage(
        '✅ Notificación marcada como leída'
      )
    } else {
      showMessage(
        '❌ Error al marcar la notificación'
      )
    }
  }

  const handleDeleteNotif = async (notifId) => {
    const result =
      await deleteNotification(notifId)

    if (result.success) {
      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            notification.id !== notifId
        )
      )

      showMessage(
        '✅ Notificación eliminada'
      )
    } else {
      showMessage(
        '❌ Error al eliminar notificación'
      )
    }
  }

  // =======================================================
  // ANNOUNCEMENT
  // =======================================================

  const handleSendAnnouncement = async (event) => {
    event.preventDefault()

    if (sendingAnnouncement) return

    const title = announcementTitle.trim()
    const messageText =
      announcementMessage.trim()

    if (!title) {
      showMessage(
        '❌ Escribe un título para el anuncio'
      )
      return
    }

    if (!messageText) {
      showMessage(
        '❌ Escribe el mensaje del anuncio'
      )
      return
    }

    setSendingAnnouncement(true)

    try {
      const result = await createAnnouncement({
        title,
        message: messageText,
        type: 'ANNOUNCEMENT',
        createdBy: user?.uid || null
      })

      if (result.success) {
        await logActividad({
          uid: user?.uid,
          nombre: userData?.nombre,
          email: userData?.email,
          action: 'admin_action',
          detail: `Envió un anuncio a todos los usuarios: ${title}`
        })

        setAnnouncementTitle('')
        setAnnouncementMessage('')

        showMessage(
          '✅ Anuncio enviado a todos los usuarios'
        )

        setTab('notifs')
      } else {
        showMessage(
          `❌ ${result.error || 'Error al enviar el anuncio'}`
        )
      }
    } catch (error) {
      console.error(
        'Error enviando anuncio:',
        error
      )

      showMessage(
        '❌ Error al enviar el anuncio'
      )
    } finally {
      setSendingAnnouncement(false)
    }
  }

  // =======================================================
  // ACTIVIDAD
  // =======================================================

  const handleDeleteActividad = async (id) => {
    const result =
      await deleteActividad(id)

    if (result.success) {
      setActividad((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      )

      showMessage(
        '✅ Registro eliminado'
      )
    } else {
      showMessage(
        '❌ Error al eliminar registro'
      )
    }
  }

  const handleDeleteAllActividad = async () => {
    if (
      !window.confirm(
        '¿Seguro que deseas eliminar toda la actividad? Esta acción no se puede deshacer.'
      )
    ) {
      return
    }

    const result =
      await deleteAllActividad()

    if (result.success) {
      setActividad([])

      showMessage(
        '✅ Actividad eliminada'
      )
    } else {
      showMessage(
        '❌ Error al eliminar actividad'
      )
    }
  }

  // =======================================================
  // ACCESS DENIED
  // =======================================================

  if (!isAdmin) {
    return (
      <Layout>
        <div className="page-content">
          <div className="card-modern text-center p-5">
            <i
              className="bi bi-shield-exclamation"
              style={{ fontSize: '3rem' }}
            ></i>

            <h4 style={{ marginTop: '1rem' }}>
              Acceso denegado
            </h4>

            <p className="text-muted">
              No tienes permisos de administrador
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  // =======================================================
  // STATS
  // =======================================================

  const totalUsers =
    users.length

  const activeUsers =
    users.filter(
      (u) => u.isActive
    ).length

  const pendingUsers =
    users.filter(
      (u) =>
        !u.isActive &&
        u.role !== 'admin'
    ).length

  const unreadNotifs =
    notifications.filter(
      (n) => !n.read
    ).length

  // =======================================================
  // USER SEARCH
  // =======================================================

  const filteredUsers =
    users.filter((u) => {
      if (!searchUsers) return true

      const q =
        searchUsers.toLowerCase()

      return (
        (u.nombre || '')
          .toLowerCase()
          .includes(q) ||
        (u.email || '')
          .toLowerCase()
          .includes(q)
      )
    })

  // =======================================================
  // ACTIVIDAD FILTER
  // =======================================================

  const actividadFiltrada =
    actividad.filter((a) => {
      const matchUser =
        filterUser === '' ||
        a.uid === filterUser

      const matchAction =
        filterAction === '' ||
        a.action === filterAction

      return (
        matchUser &&
        matchAction
      )
    })

  // =======================================================
  // TOP USERS
  // =======================================================

  const loginCounts =
    actividad
      .filter(
        (a) => a.action === 'login'
      )
      .reduce((acc, a) => {
        acc[a.uid] = {
          count:
            (acc[a.uid]?.count || 0) +
            1,
          nombre: a.nombre,
          email: a.email
        }

        return acc
      }, {})

  const topUsers =
    Object.entries(loginCounts)
      .sort(
        (a, b) =>
          b[1].count -
          a[1].count
      )
      .slice(0, 5)

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <Layout unreadCount={unreadNotifs}>
      <div className="page-content">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-header">
          <h1 className="page-title">
            <i
              className="bi bi-shield-lock"
              style={{
                marginRight: '8px'
              }}
            ></i>

            Panel de administración
          </h1>

          <button
            className="btn-secondary-sm"
            onClick={loadData}
            disabled={loading}
          >
            <i
              className="bi bi-arrow-clockwise"
              style={{
                marginRight: '6px'
              }}
            ></i>

            Actualizar
          </button>
        </div>

        {/* =================================================
            PENDING USERS
        ================================================= */}

        {pendingUsers > 0 && (
          <div className="notif-strip">
            <i
              className="bi bi-bell"
              style={{
                marginRight: '6px'
              }}
            ></i>

            <strong>
              {pendingUsers}
            </strong>{' '}

            usuario
            {pendingUsers > 1
              ? 's'
              : ''}{' '}

            esperando activación
          </div>
        )}

        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <div className="alert-info">
            {message}
          </div>
        )}

        {/* =================================================
            STATS
        ================================================= */}

        <div className="dashboard-stats mb-4">

          <div className="stat-card">
            <div className="stat-card-title">
              <i
                className="bi bi-people"
                style={{
                  marginRight: '4px'
                }}
              ></i>
              Total usuarios
            </div>

            <div className="stat-card-value">
              {totalUsers}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-title">
              <i
                className="bi bi-check-circle"
                style={{
                  marginRight: '4px'
                }}
              ></i>
              Activos
            </div>

            <div
              className="stat-card-value"
              style={{
                color: 'var(--success)'
              }}
            >
              {activeUsers}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-title">
              <i
                className="bi bi-clock-history"
                style={{
                  marginRight: '4px'
                }}
              ></i>
              Pendientes
            </div>

            <div
              className="stat-card-value"
              style={{
                color: 'var(--warning)'
              }}
            >
              {pendingUsers}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-title">
              <i
                className="bi bi-bell"
                style={{
                  marginRight: '4px'
                }}
              ></i>
              Notificaciones
            </div>

            <div
              className="stat-card-value"
              style={{
                color: 'var(--primary)'
              }}
            >
              {unreadNotifs}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-title">
              <i
                className="bi bi-activity"
                style={{
                  marginRight: '4px'
                }}
              ></i>
              Acciones hoy
            </div>

            <div className="stat-card-value">
              {
                actividad.filter(
                  (a) =>
                    new Date(
                      a.fecha
                    ).toDateString() ===
                    new Date().toDateString()
                ).length
              }
            </div>
          </div>

        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="admin-tabs">

          <button
            className={`admin-tab ${
              tab === 'users'
                ? 'admin-tab-active'
                : ''
            }`}
            onClick={() =>
              setTab('users')
            }
          >
            <i
              className="bi bi-people"
              style={{
                marginRight: '6px'
              }}
            ></i>

            Usuarios ({totalUsers})
          </button>

          <button
            className={`admin-tab ${
              tab === 'notifs'
                ? 'admin-tab-active'
                : ''
            }`}
            onClick={() =>
              setTab('notifs')
            }
          >
            <i
              className="bi bi-bell"
              style={{
                marginRight: '6px'
              }}
            ></i>

            Notificaciones{' '}

            {unreadNotifs > 0 &&
              `(${unreadNotifs})`}
          </button>

          <button
            className={`admin-tab ${
              tab === 'actividad'
                ? 'admin-tab-active'
                : ''
            }`}
            onClick={() =>
              setTab('actividad')
            }
          >
            <i
              className="bi bi-bar-chart-line"
              style={{
                marginRight: '6px'
              }}
            ></i>

            Actividad
          </button>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="loading-state">
            Cargando...
          </div>
        ) : (
          <>

            {/* =================================================
                TAB USUARIOS
            ================================================= */}

            {tab === 'users' && (
              <div className="card-modern">

                {/* SEARCH */}

                <div
                  style={{
                    marginBottom: '1rem'
                  }}
                >
                  <div
                    style={{
                      position: 'relative'
                    }}
                  >
                    <i
                      className="bi bi-search"
                      style={{
                        position:
                          'absolute',
                        left: '10px',
                        top: '50%',
                        transform:
                          'translateY(-50%)',
                        color:
                          'var(--gray-400)',
                        fontSize: '14px'
                      }}
                    ></i>

                    <input
                      type="text"
                      className="auth-input"
                      placeholder="Buscar por nombre o email..."
                      value={searchUsers}
                      onChange={(e) =>
                        setSearchUsers(
                          e.target.value
                        )
                      }
                      style={{
                        paddingLeft:
                          '32px'
                      }}
                    />
                  </div>
                </div>

                <div className="table-responsive">

                  <table className="admin-table">

                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acceso</th>
                        <th>Días</th>
                        <th>Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="9"
                            style={{
                              textAlign:
                                'center',
                              padding:
                                '1.5rem',
                              color:
                                'var(--gray-400)'
                            }}
                          >
                            No se encontraron usuarios
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map(
                          (u, idx) => {
                            const days =
                              getDaysSince(
                                u.createdAt
                              )

                            return (
                              <tr
                                key={u.id}
                                className={
                                  !u.isActive &&
                                  u.role !==
                                    'admin'
                                    ? 'row-pending'
                                    : ''
                                }
                              >

                                <td>
                                  {idx + 1}
                                </td>

                                <td>
                                  {u.nombre ||
                                    '—'}
                                </td>

                                <td className="td-email">
                                  {u.email}
                                </td>

                                <td>
                                  <span
                                    className={`badge ${
                                      u.role ===
                                      'admin'
                                        ? 'badge-admin'
                                        : 'badge-user'
                                    }`}
                                  >
                                    {u.role ===
                                    'admin'
                                      ? 'Admin'
                                      : 'Usuario'}
                                  </span>
                                </td>

                                <td>
                                  <span
                                    className={`badge ${
                                      u.isActive
                                        ? 'badge-active'
                                        : 'badge-inactive'
                                    }`}
                                  >
                                    {u.isActive
                                      ? 'Activo'
                                      : 'Pendiente'}
                                  </span>
                                </td>

                                <td>
                                  {u.role !==
                                    'admin' && (
                                    u.fullAccess ? (
                                      <span className="badge badge-admin">
                                        <i
                                          className="bi bi-star-fill"
                                          style={{
                                            marginRight:
                                              '4px'
                                          }}
                                        ></i>

                                        Full Access
                                      </span>
                                    ) : (
                                      <span className="badge badge-user">
                                        Normal
                                      </span>
                                    )
                                  )}
                                </td>

                                <td>
                                  {u.role !==
                                    'admin' && (
                                    <DaysBadge
                                      days={days}
                                    />
                                  )}
                                </td>

                                <td className="td-date">
                                  {u.createdAt
                                    ? new Date(
                                        u.createdAt
                                      ).toLocaleDateString(
                                        'es-DO'
                                      )
                                    : '—'}
                                </td>

                                <td>
                                  {u.role !==
                                    'admin' && (
                                    <div
                                      style={{
                                        display:
                                          'flex',
                                        gap:
                                          '4px',
                                        flexWrap:
                                          'wrap'
                                      }}
                                    >

                                      {!u.isActive ? (
                                        <button
                                          className="btn-success-sm"
                                          onClick={() =>
                                            handleUnlock(
                                              u.id,
                                              u.nombre
                                            )
                                          }
                                        >
                                          <i
                                            className="bi bi-unlock"
                                            style={{
                                              marginRight:
                                                '4px'
                                            }}
                                          ></i>

                                          Activar
                                        </button>
                                      ) : (
                                        <button
                                          className="btn-warning-sm"
                                          onClick={() =>
                                            handleLock(
                                              u.id,
                                              u.nombre
                                            )
                                          }
                                        >
                                          <i
                                            className="bi bi-lock"
                                            style={{
                                              marginRight:
                                                '4px'
                                            }}
                                          ></i>

                                          Bloquear
                                        </button>
                                      )}

                                      {u.fullAccess ? (
                                        <button
                                          className="btn-danger-sm"
                                          onClick={() =>
                                            handleRevokeFullAccess(
                                              u.id,
                                              u.nombre
                                            )
                                          }
                                        >
                                          <i
                                            className="bi bi-star"
                                            style={{
                                              marginRight:
                                                '4px'
                                            }}
                                          ></i>

                                          Revocar
                                        </button>
                                      ) : (
                                        <button
                                          className="btn-ghost-sm"
                                          onClick={() =>
                                            handleGrantFullAccess(
                                              u.id,
                                              u.nombre
                                            )
                                          }
                                        >
                                          <i
                                            className="bi bi-star-fill"
                                            style={{
                                              marginRight:
                                                '4px'
                                            }}
                                          ></i>

                                          Full Access
                                        </button>
                                      )}

                                    </div>
                                  )}
                                </td>

                              </tr>
                            )
                          }
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                <div className="table-footer">
                  {searchUsers
                    ? `${filteredUsers.length} de ${totalUsers} usuarios`
                    : `Total: ${totalUsers} usuarios`}
                </div>

              </div>
            )}

            {/* =================================================
                TAB NOTIFICACIONES
            ================================================= */}

            {tab === 'notifs' && (
              <div>

                {/* =================================================
                    SEND ANNOUNCEMENT
                ================================================= */}

                <div
                  className="card-modern mb-4"
                  style={{
                    border:
                      '1px solid var(--gray-200)'
                  }}
                >

                  <div
                    style={{
                      display:
                        'flex',
                      alignItems:
                        'center',
                      gap: '10px',
                      marginBottom:
                        '1rem'
                    }}
                  >
                    <div
                      style={{
                        width:
                          '40px',
                        height:
                          '40px',
                        borderRadius:
                          '10px',
                        display:
                          'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'center',
                        background:
                          '#eff6ff',
                        color:
                          'var(--primary)'
                      }}
                    >
                      <i className="bi bi-megaphone"></i>
                    </div>

                    <div>
                      <h5
                        style={{
                          margin:
                            0,
                          fontSize:
                            '15px',
                          fontWeight:
                            700
                        }}
                      >
                        Enviar anuncio
                      </h5>

                      <p
                        style={{
                          margin:
                            '3px 0 0',
                          fontSize:
                            '12px',
                          color:
                            'var(--gray-500)'
                        }}
                      >
                        Envía una notificación a todos los usuarios.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={
                      handleSendAnnouncement
                    }
                  >

                    <div
                      style={{
                        marginBottom:
                          '12px'
                      }}
                    >
                      <label
                        style={{
                          display:
                            'block',
                          fontSize:
                            '12px',
                          fontWeight:
                            600,
                          marginBottom:
                            '6px'
                        }}
                      >
                        Título
                      </label>

                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Ej. Nueva actualización disponible"
                        value={
                          announcementTitle
                        }
                        onChange={(e) =>
                          setAnnouncementTitle(
                            e.target.value
                          )
                        }
                        maxLength={120}
                        disabled={
                          sendingAnnouncement
                        }
                      />
                    </div>

                    <div
                      style={{
                        marginBottom:
                          '12px'
                      }}
                    >
                      <label
                        style={{
                          display:
                            'block',
                          fontSize:
                            '12px',
                          fontWeight:
                            600,
                          marginBottom:
                            '6px'
                        }}
                      >
                        Mensaje
                      </label>

                      <textarea
                        className="auth-input"
                        placeholder="Escribe el mensaje que recibirán los usuarios..."
                        value={
                          announcementMessage
                        }
                        onChange={(e) =>
                          setAnnouncementMessage(
                            e.target.value
                          )
                        }
                        maxLength={1000}
                        rows={4}
                        disabled={
                          sendingAnnouncement
                        }
                        style={{
                          resize:
                            'vertical',
                          minHeight:
                            '100px'
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display:
                          'flex',
                        justifyContent:
                          'flex-end'
                      }}
                    >
                      <button
                        type="submit"
                        className="btn-primary-sm"
                        disabled={
                          sendingAnnouncement ||
                          !announcementTitle.trim() ||
                          !announcementMessage.trim()
                        }
                      >
                        {sendingAnnouncement ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              style={{
                                marginRight:
                                  '6px'
                              }}
                              role="status"
                              aria-hidden="true"
                            ></span>

                            Enviando...
                          </>
                        ) : (
                          <>
                            <i
                              className="bi bi-send"
                              style={{
                                marginRight:
                                  '6px'
                              }}
                            ></i>

                            Enviar a todos
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>

                {/* =================================================
                    NOTIFICATION LIST
                ================================================= */}

                <div className="card-modern">

                  <div
                    style={{
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'space-between',
                      gap: '10px',
                      marginBottom:
                        '1rem'
                    }}
                  >
                    <div>
                      <h5
                        style={{
                          margin:
                            0,
                          fontSize:
                            '15px',
                          fontWeight:
                            700
                        }}
                      >
                        Notificaciones
                      </h5>

                      <p
                        style={{
                          margin:
                            '3px 0 0',
                          fontSize:
                            '12px',
                          color:
                            'var(--gray-500)'
                        }}
                      >
                        Notificaciones de nuevos usuarios.
                      </p>
                    </div>

                    {unreadNotifs > 0 && (
                      <span className="badge badge-active">
                        {unreadNotifs} sin leer
                      </span>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="empty-state">
                      No hay notificaciones
                    </p>
                  ) : (
                    <div className="notif-list">

                      {notifications.map(
                        (n) => (
                          <div
                            key={n.id}
                            className={`notif-item ${
                              !n.read
                                ? 'notif-unread'
                                : ''
                            }`}
                          >

                            <div className="notif-item-body">

                              <div className="notif-item-title">
                                {n.title}
                              </div>

                              <div className="notif-item-msg">
                                {n.message}
                              </div>

                              <div className="notif-item-date">
                                {n.createdAt
                                  ? new Date(
                                      n.createdAt
                                    ).toLocaleString(
                                      'es-DO'
                                    )
                                  : n.timestamp
                                    ? new Date(
                                        n.timestamp
                                      ).toLocaleString(
                                        'es-DO'
                                      )
                                    : '—'}
                              </div>

                            </div>

                            <div className="notif-item-actions">

                              {!n.read && (
                                <button
                                  className="btn-ghost-sm"
                                  onClick={() =>
                                    handleMarkRead(
                                      n.id
                                    )
                                  }
                                >
                                  <i
                                    className="bi bi-check-circle"
                                    style={{
                                      marginRight:
                                        '4px'
                                    }}
                                  ></i>

                                  Marcar leída
                                </button>
                              )}

                              <button
                                className="btn-danger-sm"
                                onClick={() =>
                                  handleDeleteNotif(
                                    n.id
                                  )
                                }
                              >
                                <i
                                  className="bi bi-trash"
                                  style={{
                                    marginRight:
                                      '4px'
                                  }}
                                ></i>

                                Eliminar
                              </button>

                            </div>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>
            )}

            {/* =================================================
                TAB ACTIVIDAD
            ================================================= */}

            {tab === 'actividad' && (
              <div>

                {/* =================================================
                    TOP USERS
                ================================================= */}

                {topUsers.length > 0 && (
                  <div className="card-modern mb-4">

                    <h3 className="info-card-title">
                      <i
                        className="bi bi-trophy"
                        style={{
                          marginRight:
                            '6px',
                          color:
                            'var(--warning)'
                        }}
                      ></i>

                      Usuarios más activos
                    </h3>

                    {topUsers.map(
                      ([uid, data], idx) => (
                        <div
                          key={uid}
                          className="info-row"
                        >

                          <div
                            style={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap: '8px'
                            }}
                          >

                            <span
                              style={{
                                width:
                                  '22px',
                                height:
                                  '22px',
                                borderRadius:
                                  '50%',
                                background:
                                  idx === 0
                                    ? '#fbbf24'
                                    : idx === 1
                                      ? '#94a3b8'
                                      : idx === 2
                                        ? '#b45309'
                                        : 'var(--gray-200)',
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                fontSize:
                                  '11px',
                                fontWeight:
                                  700,
                                color:
                                  'white',
                                flexShrink:
                                  0
                              }}
                            >
                              {idx + 1}
                            </span>

                            <div>

                              <div
                                style={{
                                  fontSize:
                                    '13px',
                                  fontWeight:
                                    600
                                }}
                              >
                                {data.nombre ||
                                  '—'}
                              </div>

                              <div
                                style={{
                                  fontSize:
                                    '11px',
                                  color:
                                    'var(--gray-500)'
                                }}
                              >
                                {data.email}
                              </div>

                            </div>

                          </div>

                          <span className="badge badge-active">
                            {data.count}{' '}
                            logins
                          </span>

                        </div>
                      )
                    )}

                  </div>
                )}

                {/* =================================================
                    FILTERS
                ================================================= */}

                <div className="card-modern mb-4">

                  <div
                    style={{
                      display:
                        'flex',
                      gap: '12px',
                      flexWrap:
                        'wrap',
                      alignItems:
                        'center'
                    }}
                  >

                    <select
                      className="auth-input"
                      style={{
                        width:
                          'auto',
                        minWidth:
                          '160px'
                      }}
                      value={
                        filterUser
                      }
                      onChange={(e) =>
                        setFilterUser(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Todos los usuarios
                      </option>

                      {users.map(
                        (u) => (
                          <option
                            key={u.id}
                            value={u.id}
                          >
                            {u.nombre ||
                              u.email}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      className="auth-input"
                      style={{
                        width:
                          'auto',
                        minWidth:
                          '160px'
                      }}
                      value={
                        filterAction
                      }
                      onChange={(e) =>
                        setFilterAction(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Todas las acciones
                      </option>

                      <option value="login">
                        Login
                      </option>

                      <option value="logout">
                        Logout
                      </option>

                      <option value="desglose">
                        Desglose
                      </option>

                      <option value="admin_action">
                        Acción admin
                      </option>
                    </select>

                    {(filterUser ||
                      filterAction) && (
                      <button
                        className="btn-ghost-sm"
                        onClick={() => {
                          setFilterUser('')
                          setFilterAction('')
                        }}
                      >
                        <i
                          className="bi bi-x-circle"
                          style={{
                            marginRight:
                              '4px'
                          }}
                        ></i>

                        Limpiar
                      </button>
                    )}

                    <span
                      style={{
                        fontSize:
                          '12px',
                        color:
                          'var(--gray-500)'
                      }}
                    >
                      {
                        actividadFiltrada.length
                      }{' '}
                      registros
                    </span>

                    <button
                      className="btn-danger-sm"
                      style={{
                        marginLeft:
                          'auto'
                      }}
                      onClick={
                        handleDeleteAllActividad
                      }
                    >
                      <i
                        className="bi bi-trash"
                        style={{
                          marginRight:
                            '4px'
                        }}
                      ></i>

                      Borrar todo
                    </button>

                  </div>

                </div>

                {/* =================================================
                    ACTIVITY LIST
                ================================================= */}

                <div
                  className="card-modern"
                  style={{
                    padding: 0,
                    overflow:
                      'hidden'
                  }}
                >

                  {actividadFiltrada.length === 0 ? (
                    <p className="empty-state">
                      No hay actividad registrada
                    </p>
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
                            <th></th>
                          </tr>
                        </thead>

                        <tbody>

                          {actividadFiltrada.map(
                            (a) => {
                              const {
                                label,
                                icon,
                                color
                              } =
                                getActionLabel(
                                  a.action
                                )

                              const fecha =
                                new Date(
                                  a.fecha
                                )

                              return (
                                <tr
                                  key={
                                    a.id
                                  }
                                >

                                  <td>

                                    <div
                                      style={{
                                        fontSize:
                                          '13px',
                                        fontWeight:
                                          600
                                      }}
                                    >
                                      {a.nombre ||
                                        '—'}
                                    </div>

                                    <div className="td-email">
                                      {a.email}
                                    </div>

                                  </td>

                                  <td>

                                    <span
                                      style={{
                                        display:
                                          'flex',
                                        alignItems:
                                          'center',
                                        gap:
                                          '5px',
                                        color
                                      }}
                                    >

                                      <i
                                        className={`bi ${icon}`}
                                      ></i>

                                      <span
                                        style={{
                                          fontSize:
                                            '12px',
                                          fontWeight:
                                            600
                                        }}
                                      >
                                        {label}
                                      </span>

                                    </span>

                                  </td>

                                  <td
                                    style={{
                                      fontSize:
                                        '12px',
                                      color:
                                        'var(--gray-600)'
                                    }}
                                  >
                                    {a.detail ||
                                      '—'}
                                  </td>

                                  <td className="td-date">
                                    {fecha.toLocaleDateString(
                                      'es-DO'
                                    )}
                                  </td>

                                  <td className="td-date">
                                    {fecha.toLocaleTimeString(
                                      'es-DO',
                                      {
                                        hour:
                                          '2-digit',
                                        minute:
                                          '2-digit'
                                      }
                                    )}
                                  </td>

                                  <td>

                                    <button
                                      className="btn-danger-sm"
                                      onClick={() =>
                                        handleDeleteActividad(
                                          a.id
                                        )
                                      }
                                      title="Eliminar"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>

                                  </td>

                                </tr>
                              )
                            }
                          )}

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