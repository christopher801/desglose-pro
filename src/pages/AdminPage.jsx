import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react'
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
  logActividad,
  deleteActividad,
  deleteAllActividad
} from '../services/actividadService'

import Layout from '../components/Layout'

import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import AdminOverview from '../components/admin/AdminOverview'
import AdminUsers from '../components/admin/AdminUsers'
import AdminUserDetails from '../components/admin/AdminUserDetails'
import AdminUsage from '../components/admin/AdminUsage'
import AdminNotifications from '../components/admin/AdminNotifications'
import AdminActivity from '../components/admin/AdminActivity'

import '../styles/admin.css'

// =========================================================
// UTILIDADES
// =========================================================

const byFechaDesc = (a, b) => {
  const ta = new Date(a.fecha).getTime()
  const tb = new Date(b.fecha).getTime()

  return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta)
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
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const [section, setSection] = useState('overview')
  const [userFilter, setUserFilter] = useState('all')
  const [selectedUserId, setSelectedUserId] = useState(null)

  // =======================================================
  // MESSAGE (TOAST)
  // =======================================================

  const showMessage = useCallback((text, type = 'success') => {
    setToast({ text, type })

    clearTimeout(toastTimer.current)

    toastTimer.current = setTimeout(() => {
      setToast(null)
    }, 3500)
  }, [])

  useEffect(() => {
    return () => clearTimeout(toastTimer.current)
  }, [])

  // =======================================================
  // LOAD DATA
  // =======================================================

  const loadData = useCallback(async () => {
    setRefreshing(true)

    try {
      const [usersResult, notifsResult, actividadResult] =
        await Promise.all([
          getAllUsers(),
          getAdminNotifications(),
          getActividad(200)
        ])

      const failed = []

      if (usersResult.success) {
        setUsers(usersResult.users || [])
      } else {
        console.error('Error cargando usuarios:', usersResult.error)
        failed.push('usuarios')
      }

      if (notifsResult.success) {
        setNotifications(notifsResult.notifications || [])
      } else {
        console.error('Error cargando notificaciones:', notifsResult.error)
        setNotifications([])
        failed.push('notificaciones')
      }

      if (actividadResult.success) {
        setActividad(
          (actividadResult.actividad || []).slice().sort(byFechaDesc)
        )
      } else {
        console.error('Error cargando actividad:', actividadResult.error)
        failed.push('actividad')
      }

      if (failed.length > 0) {
        showMessage(`No se pudo cargar: ${failed.join(', ')}`, 'error')
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error cargando panel admin:', error)

      showMessage('Error al cargar los datos', 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [showMessage])

  useEffect(() => {
    if (isAdmin) loadData()
  }, [isAdmin, loadData])

  // =======================================================
  // USER ACTIONS
  // =======================================================

  const runUserAction = async ({
    action,
    target,
    detail,
    okMsg,
    errMsg
  }) => {
    const result = await action(target.id)

    if (result.success) {
      await logActividad({
        uid: user?.uid,
        nombre: userData?.nombre,
        email: userData?.email,
        action: 'admin_action',
        detail
      })

      showMessage(okMsg)

      await loadData()
    } else {
      showMessage(errMsg, 'error')
    }
  }

  const displayName = (target) => target.nombre || target.email

  const handleUnlock = (target) =>
    runUserAction({
      action: unlockUser,
      target,
      detail: `Activó al usuario: ${displayName(target)}`,
      okMsg: 'Usuario activado exitosamente',
      errMsg: 'Error al activar usuario'
    })

  const handleLock = (target) =>
    runUserAction({
      action: lockUser,
      target,
      detail: `Bloqueó al usuario: ${displayName(target)}`,
      okMsg: 'Usuario bloqueado',
      errMsg: 'Error al bloquear usuario'
    })

  const handleGrantFullAccess = (target) =>
    runUserAction({
      action: grantFullAccess,
      target,
      detail: `Full Access otorgado a: ${displayName(target)}`,
      okMsg: 'Full Access otorgado',
      errMsg: 'Error al otorgar Full Access'
    })

  const handleRevokeFullAccess = (target) =>
    runUserAction({
      action: revokeFullAccess,
      target,
      detail: `Full Access revocado a: ${displayName(target)}`,
      okMsg: 'Full Access revocado',
      errMsg: 'Error al revocar Full Access'
    })

  // =======================================================
  // NOTIFICATIONS
  // =======================================================

  const handleMarkRead = async (notifId) => {
    const result = await markAdminNotificationAsRead(notifId)

    if (result.success) {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notifId
            ? { ...notification, read: true }
            : notification
        )
      )

      showMessage('Notificación marcada como leída')
    } else {
      showMessage('Error al marcar la notificación', 'error')
    }
  }

  const handleDeleteNotif = async (notifId) => {
    const result = await deleteNotification(notifId)

    if (result.success) {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notifId)
      )

      showMessage('Notificación eliminada')
    } else {
      showMessage('Error al eliminar notificación', 'error')
    }
  }

  // =======================================================
  // ANNOUNCEMENT
  // Devuelve true si se envió bien (el formulario se limpia).
  // =======================================================

  const handleSendAnnouncement = async ({ title, message: messageText }) => {
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

        showMessage('Anuncio enviado a todos los usuarios')

        return true
      }

      showMessage(result.error || 'Error al enviar el anuncio', 'error')

      return false
    } catch (error) {
      console.error('Error enviando anuncio:', error)

      showMessage('Error al enviar el anuncio', 'error')

      return false
    }
  }

  // =======================================================
  // ACTIVIDAD
  // =======================================================

  const handleDeleteActividad = async (id) => {
    const result = await deleteActividad(id)

    if (result.success) {
      setActividad((prev) => prev.filter((item) => item.id !== id))

      showMessage('Registro eliminado')
    } else {
      showMessage('Error al eliminar registro', 'error')
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

    const result = await deleteAllActividad()

    if (result.success) {
      setActividad([])

      showMessage('Actividad eliminada')
    } else {
      showMessage('Error al eliminar actividad', 'error')
    }
  }

  // =======================================================
  // NAVIGATION
  // =======================================================

  const goTo = (id, usersFilter) => {
    if (usersFilter) setUserFilter(usersFilter)

    setSelectedUserId(null)
    setSection(id)
  }

  const closeDetails = useCallback(() => setSelectedUserId(null), [])

  // =======================================================
  // STATS
  // =======================================================

  const stats = useMemo(() => {
    const today = new Date().toDateString()

    const yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const yesterday = yesterdayDate.toDateString()

    let actionsToday = 0
    let actionsYesterday = 0

    actividad.forEach((a) => {
      const day = new Date(a.fecha).toDateString()

      if (day === today) actionsToday += 1
      else if (day === yesterday) actionsYesterday += 1
    })

    return {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive).length,
      pendingUsers: users.filter((u) => !u.isActive && u.role !== 'admin')
        .length,
      fullAccessCount: users.filter((u) => u.fullAccess).length,
      unreadNotifs: notifications.filter((n) => !n.read).length,
      totalNotifs: notifications.length,
      actionsToday,
      actionsYesterday
    }
  }, [users, notifications, actividad])

  const selectedUser = users.find((u) => u.id === selectedUserId) || null

  // =======================================================
  // ACCESS DENIED
  // =======================================================

  if (!isAdmin) {
    return (
      <Layout>
        <div className="adm-denied">
          <i className="bi bi-shield-exclamation" aria-hidden="true"></i>

          <h1>Acceso denegado</h1>

          <p>No tienes permisos de administrador.</p>
        </div>
      </Layout>
    )
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
      <div className="adm">
        <AdminSidebar
          section={section}
          onChange={goTo}
          adminName={userData?.nombre}
          adminEmail={userData?.email || user?.email}
          badges={{
            users: { count: stats.pendingUsers, tone: 'warning' },
            notifications: { count: stats.unreadNotifs, tone: 'primary' }
          }}
        />

        <div className="adm-main">
          <AdminHeader
            section={section}
            onRefresh={loadData}
            refreshing={refreshing}
            lastUpdated={lastUpdated}
            unreadCount={stats.unreadNotifs}
            onOpenNotifications={() => goTo('notifications')}
          />

          <main className="adm-content">
            {loading ? (
              <div className="adm-loading" role="status">
                <span className="adm-spinner"></span>
                Cargando datos
              </div>
            ) : (
              <>
                {section === 'overview' && (
                  <AdminOverview
                    stats={stats}
                    users={users}
                    actividad={actividad}
                    onActivate={handleUnlock}
                    onNavigate={goTo}
                  />
                )}

                {section === 'users' && (
                  <AdminUsers
                    users={users}
                    filter={userFilter}
                    onFilterChange={setUserFilter}
                    selectedId={selectedUserId}
                    onSelectUser={setSelectedUserId}
                    onUnlock={handleUnlock}
                    onLock={handleLock}
                    onGrantFullAccess={handleGrantFullAccess}
                    onRevokeFullAccess={handleRevokeFullAccess}
                  />
                )}

                {section === 'usage' && <AdminUsage actividad={actividad} />}

                {section === 'notifications' && (
                  <AdminNotifications
                    notifications={notifications}
                    unreadCount={stats.unreadNotifs}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDeleteNotif}
                    onSendAnnouncement={handleSendAnnouncement}
                  />
                )}

                {section === 'activity' && (
                  <AdminActivity
                    actividad={actividad}
                    users={users}
                    onDelete={handleDeleteActividad}
                    onDeleteAll={handleDeleteAllActividad}
                  />
                )}
              </>
            )}
          </main>
        </div>

        {selectedUser && (
          <AdminUserDetails
            user={selectedUser}
            actividad={actividad}
            onClose={closeDetails}
            onUnlock={handleUnlock}
            onLock={handleLock}
            onGrantFullAccess={handleGrantFullAccess}
            onRevokeFullAccess={handleRevokeFullAccess}
          />
        )}

        {toast && (
          <div
            className={`adm-toast adm-toast--${toast.type}`}
            role="status"
            aria-live="polite"
          >
            <i
              className={`bi ${
                toast.type === 'error'
                  ? 'bi-exclamation-circle'
                  : 'bi-check-circle'
              }`}
              aria-hidden="true"
            ></i>

            {toast.text}
          </div>
        )}
      </div>
  )
}
