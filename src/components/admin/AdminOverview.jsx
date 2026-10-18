import React, { useMemo } from 'react'

import AdminStatCard from './AdminStatCard'
import {
  Avatar,
  DaysBadge,
  EmptyState,
  getActionMeta,
  getDaysSince,
  timeAgo
} from './adminShared'

const PENDING_PREVIEW = 5
const RECENT_PREVIEW = 6

export default function AdminOverview({
  stats,
  users,
  actividad,
  onActivate,
  onNavigate
}) {
  const pending = useMemo(
    () => users.filter((u) => !u.isActive && u.role !== 'admin'),
    [users]
  )

  const distribution = useMemo(() => {
    const admins = users.filter((u) => u.role === 'admin').length
    const active = users.filter(
      (u) => u.role !== 'admin' && u.isActive
    ).length
    const waiting = users.filter(
      (u) => u.role !== 'admin' && !u.isActive
    ).length

    return [
      {
        id: 'active',
        label: 'Activos',
        count: active,
        color: 'var(--adm-success)'
      },
      {
        id: 'pending',
        label: 'Pendientes',
        count: waiting,
        color: 'var(--adm-warning)'
      },
      {
        id: 'admin',
        label: 'Administradores',
        count: admins,
        color: 'var(--adm-primary)'
      }
    ]
  }, [users])

  const recent = actividad.slice(0, RECENT_PREVIEW)

  const diff = stats.actionsToday - stats.actionsYesterday

  const todayHint =
    diff === 0
      ? 'Igual que ayer'
      : `${diff > 0 ? '+' : ''}${diff} respecto a ayer`

  const activePct =
    stats.totalUsers > 0
      ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
      : 0

  return (
    <>
      {/* =================================================
          STATS
      ================================================= */}

      <section className="adm-stats" aria-label="Indicadores principales">
        <AdminStatCard
          icon="bi-people"
          label="Total usuarios"
          value={stats.totalUsers}
          hint={`${stats.fullAccessCount} con Full Access`}
          onClick={() => onNavigate('users', 'all')}
        />

        <AdminStatCard
          icon="bi-check-circle"
          label="Activos"
          value={stats.activeUsers}
          hint={`${activePct}% del total`}
          tone="success"
          onClick={() => onNavigate('users', 'active')}
        />

        <AdminStatCard
          icon="bi-hourglass-split"
          label="Pendientes"
          value={stats.pendingUsers}
          hint={
            stats.pendingUsers > 0
              ? 'Esperando activación'
              : 'Todo al día'
          }
          tone="warning"
          onClick={() => onNavigate('users', 'pending')}
        />

        <AdminStatCard
          icon="bi-bell"
          label="Sin leer"
          value={stats.unreadNotifs}
          hint={`${stats.totalNotifs} notificaciones en total`}
          tone="primary"
          onClick={() => onNavigate('notifications')}
        />

        <AdminStatCard
          icon="bi-activity"
          label="Acciones hoy"
          value={stats.actionsToday}
          hint={todayHint}
          onClick={() => onNavigate('activity')}
        />
      </section>

      {/* =================================================
          PENDING + DISTRIBUTION
      ================================================= */}

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card__head">
            <div>
              <h2 className="adm-card__title">Esperando activación</h2>
              <p className="adm-card__sub">
                Cuentas nuevas que aún no pueden usar la plataforma.
              </p>
            </div>

            {pending.length > 0 && (
              <span className="adm-badge adm-badge--warning">
                {pending.length}
              </span>
            )}
          </div>

          {pending.length === 0 ? (
            <EmptyState
              icon="bi-check2-circle"
              title="Todo al día"
              text="No hay cuentas esperando activación."
            />
          ) : (
            <>
              <ul className="adm-list">
                {pending.slice(0, PENDING_PREVIEW).map((u) => (
                  <li key={u.id} className="adm-list__item">
                    <Avatar name={u.nombre} email={u.email} />

                    <div className="adm-item__main">
                      <div className="adm-item__title">
                        {u.nombre || 'Sin nombre'}
                      </div>

                      <div className="adm-item__sub">{u.email}</div>
                    </div>

                    <span className="adm-item__time">
                      {timeAgo(u.createdAt)}
                    </span>

                    <DaysBadge days={getDaysSince(u.createdAt)} />

                    <button
                      type="button"
                      className="adm-btn adm-btn--success adm-btn--sm"
                      onClick={() => onActivate(u)}
                    >
                      <i className="bi bi-unlock" aria-hidden="true"></i>
                      Activar
                    </button>
                  </li>
                ))}
              </ul>

              {pending.length > PENDING_PREVIEW && (
                <div className="adm-card__foot">
                  <button
                    type="button"
                    className="adm-btn adm-btn--ghost adm-btn--sm"
                    onClick={() => onNavigate('users', 'pending')}
                  >
                    Ver los {pending.length} pendientes
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-card__head">
            <div>
              <h2 className="adm-card__title">Distribución de usuarios</h2>
              <p className="adm-card__sub">Por rol y estado de la cuenta.</p>
            </div>
          </div>

          <div className="adm-card__body">
            {stats.totalUsers === 0 ? (
              <EmptyState
                icon="bi-people"
                title="Sin usuarios todavía"
              />
            ) : (
              <>
                <div
                  className="adm-dist"
                  role="img"
                  aria-label={distribution
                    .map((d) => `${d.label}: ${d.count}`)
                    .join(', ')}
                >
                  {distribution
                    .filter((d) => d.count > 0)
                    .map((d) => (
                      <span
                        key={d.id}
                        className="adm-dist__seg"
                        style={{ flex: d.count, background: d.color }}
                      ></span>
                    ))}
                </div>

                <ul className="adm-legend">
                  {distribution.map((d) => (
                    <li key={d.id}>
                      <span
                        className="adm-legend__dot"
                        style={{ background: d.color }}
                      ></span>

                      <span>{d.label}</span>

                      <span className="adm-legend__count">{d.count}</span>

                      <span className="adm-legend__pct">
                        {Math.round((d.count / stats.totalUsers) * 100)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      </div>

      {/* =================================================
          RECENT ACTIVITY
      ================================================= */}

      <section className="adm-card">
        <div className="adm-card__head">
          <div>
            <h2 className="adm-card__title">Actividad reciente</h2>
            <p className="adm-card__sub">Las últimas acciones registradas.</p>
          </div>

          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm"
            onClick={() => onNavigate('activity')}
          >
            Ver toda la actividad
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon="bi-clock-history"
            title="Sin actividad registrada"
            text="Las acciones de los usuarios aparecerán aquí."
          />
        ) : (
          <ul className="adm-list">
            {recent.map((a) => {
              const meta = getActionMeta(a.action)

              return (
                <li key={a.id} className="adm-list__item">
                  <span
                    className="adm-chip-icon"
                    style={{ '--chip': meta.color }}
                  >
                    <i className={`bi ${meta.icon}`} aria-hidden="true"></i>
                  </span>

                  <div className="adm-item__main">
                    <div className="adm-item__title">
                      {a.nombre || a.email || 'Sistema'}{' '}
                      <span className="adm-item__action">{meta.label}</span>
                    </div>

                    <div className="adm-item__sub">{a.detail || '—'}</div>
                  </div>

                  <span className="adm-item__time">{timeAgo(a.fecha)}</span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
