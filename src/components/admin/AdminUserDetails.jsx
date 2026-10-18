import React, { useEffect, useMemo, useRef } from 'react'

import {
  Avatar,
  DaysBadge,
  EmptyState,
  formatDate,
  formatDateTime,
  getActionMeta,
  getDaysSince,
  timeAgo
} from './adminShared'

const TIMELINE_LIMIT = 8

export default function AdminUserDetails({
  user,
  actividad,
  onClose,
  onUnlock,
  onLock,
  onGrantFullAccess,
  onRevokeFullAccess
}) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const userActions = useMemo(
    () => actividad.filter((a) => a.uid === user.id),
    [actividad, user.id]
  )

  const usage = useMemo(
    () => ({
      total: userActions.length,
      logins: userActions.filter((a) => a.action === 'login').length,
      desglose: userActions.filter((a) => a.action === 'desglose').length
    }),
    [userActions]
  )

  const isAdminUser = user.role === 'admin'
  const days = getDaysSince(user.createdAt)

  return (
    <div className="adm-drawer-root">
      <div className="adm-backdrop" onClick={onClose}></div>

      <aside
        className="adm-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adm-drawer-title"
      >
        {/* =================================================
            HEAD
        ================================================= */}

        <header className="adm-drawer__head">
          <Avatar name={user.nombre} email={user.email} size={52} />

          <div className="adm-drawer__id">
            <h2 id="adm-drawer-title">{user.nombre || 'Sin nombre'}</h2>

            <p>{user.email}</p>

            <div className="adm-drawer__badges">
              <span
                className={`adm-badge${
                  isAdminUser ? ' adm-badge--primary' : ''
                }`}
              >
                {isAdminUser ? 'Admin' : 'Usuario'}
              </span>

              <span
                className={`adm-badge adm-badge--${
                  user.isActive ? 'success' : 'warning'
                }`}
              >
                {user.isActive ? 'Activo' : 'Pendiente'}
              </span>

              {!isAdminUser && user.fullAccess && (
                <span className="adm-badge adm-badge--primary">
                  <i className="bi bi-star-fill" aria-hidden="true"></i>
                  Full Access
                </span>
              )}
            </div>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="adm-icon-btn"
            onClick={onClose}
            aria-label="Cerrar detalles"
          >
            <i className="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </header>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="adm-drawer__body">
          <section>
            <h3 className="adm-section-title">Cuenta</h3>

            <dl className="adm-dl">
              <div className="adm-dl__row">
                <dt>Rol</dt>
                <dd>{isAdminUser ? 'Administrador' : 'Usuario'}</dd>
              </div>

              <div className="adm-dl__row">
                <dt>Estado</dt>
                <dd>{user.isActive ? 'Activo' : 'Pendiente de activación'}</dd>
              </div>

              {!isAdminUser && (
                <div className="adm-dl__row">
                  <dt>Acceso</dt>
                  <dd>{user.fullAccess ? 'Full Access' : 'Normal'}</dd>
                </div>
              )}

              <div className="adm-dl__row">
                <dt>Registro</dt>
                <dd>{formatDate(user.createdAt)}</dd>
              </div>

              {!isAdminUser && (
                <div className="adm-dl__row">
                  <dt>Antigüedad</dt>
                  <dd>
                    <DaysBadge days={days} />
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {!isAdminUser && (
            <section>
              <h3 className="adm-section-title">Acciones</h3>

              <div className="adm-actions">
                {user.isActive ? (
                  <button
                    type="button"
                    className="adm-btn adm-btn--warning adm-btn--block"
                    onClick={() => onLock(user)}
                  >
                    <i className="bi bi-lock" aria-hidden="true"></i>
                    Bloquear usuario
                  </button>
                ) : (
                  <button
                    type="button"
                    className="adm-btn adm-btn--success adm-btn--block"
                    onClick={() => onUnlock(user)}
                  >
                    <i className="bi bi-unlock" aria-hidden="true"></i>
                    Activar usuario
                  </button>
                )}

                {user.fullAccess ? (
                  <button
                    type="button"
                    className="adm-btn adm-btn--danger adm-btn--block"
                    onClick={() => onRevokeFullAccess(user)}
                  >
                    <i className="bi bi-star" aria-hidden="true"></i>
                    Quitar Full Access
                  </button>
                ) : (
                  <button
                    type="button"
                    className="adm-btn adm-btn--block"
                    onClick={() => onGrantFullAccess(user)}
                  >
                    <i className="bi bi-star-fill" aria-hidden="true"></i>
                    Dar Full Access
                  </button>
                )}
              </div>
            </section>
          )}

          <section>
            <h3 className="adm-section-title">Uso</h3>

            <div className="adm-mini-stats">
              <div className="adm-mini">
                <span className="adm-mini__value">{usage.total}</span>
                <span className="adm-mini__label">Acciones</span>
              </div>

              <div className="adm-mini">
                <span className="adm-mini__value">{usage.logins}</span>
                <span className="adm-mini__label">Logins</span>
              </div>

              <div className="adm-mini">
                <span className="adm-mini__value">{usage.desglose}</span>
                <span className="adm-mini__label">Desgloses</span>
              </div>
            </div>

            <p className="adm-footnote">
              Según los últimos {actividad.length} registros de actividad.
            </p>
          </section>

          <section>
            <h3 className="adm-section-title">Actividad reciente</h3>

            {userActions.length === 0 ? (
              <EmptyState
                icon="bi-clock-history"
                title="Sin actividad registrada"
                text="Este usuario no aparece en los registros cargados."
              />
            ) : (
              <ul className="adm-timeline">
                {userActions.slice(0, TIMELINE_LIMIT).map((a) => {
                  const meta = getActionMeta(a.action)

                  return (
                    <li key={a.id} className="adm-timeline__item">
                      <span
                        className="adm-chip-icon"
                        style={{ '--chip': meta.color }}
                      >
                        <i
                          className={`bi ${meta.icon}`}
                          aria-hidden="true"
                        ></i>
                      </span>

                      <div className="adm-item__main">
                        <div className="adm-item__title">{meta.label}</div>

                        {a.detail && (
                          <div className="adm-item__sub adm-item__sub--wrap">
                            {a.detail}
                          </div>
                        )}
                      </div>

                      <span
                        className="adm-item__time"
                        title={formatDateTime(a.fecha)}
                      >
                        {timeAgo(a.fecha)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>
      </aside>
    </div>
  )
}
