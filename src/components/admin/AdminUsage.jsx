import React, { useMemo, useState } from 'react'

import AdminStatCard from './AdminStatCard'
import { Avatar, EmptyState, getActionMeta } from './adminShared'

const CHART_DAYS = 14
const RANKING_LIMIT = 5

const RANKING_METRICS = [
  { id: 'logins', label: 'Logins', unit: 'logins' },
  { id: 'desglose', label: 'Desgloses', unit: 'desgloses' },
  { id: 'total', label: 'Todas', unit: 'acciones' }
]

const dayKey = (date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

export default function AdminUsage({ actividad }) {
  const [metric, setMetric] = useState('logins')

  // =======================================================
  // DAILY SERIES (last 14 days)
  // =======================================================

  const series = useMemo(() => {
    const todayKey = dayKey(new Date())

    const days = Array.from({ length: CHART_DAYS }, (_, index) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (CHART_DAYS - 1 - index))

      return {
        key: dayKey(date),
        date,
        count: 0,
        isToday: dayKey(date) === todayKey
      }
    })

    const byKey = new Map(days.map((d) => [d.key, d]))

    actividad.forEach((a) => {
      const date = new Date(a.fecha)

      if (Number.isNaN(date.getTime())) return

      const slot = byKey.get(dayKey(date))

      if (slot) slot.count += 1
    })

    return days
  }, [actividad])

  const maxCount = Math.max(...series.map((d) => d.count), 0)
  const chartTotal = series.reduce((sum, d) => sum + d.count, 0)

  // =======================================================
  // KPIs
  // =======================================================

  const kpis = useMemo(() => {
    const since = new Date()
    since.setHours(0, 0, 0, 0)
    since.setDate(since.getDate() - 6)

    const recent = actividad.filter((a) => {
      const date = new Date(a.fecha)

      return !Number.isNaN(date.getTime()) && date >= since
    })

    const uniqueUsers = new Set(
      recent.map((a) => a.uid).filter(Boolean)
    ).size

    const hours = Array(24).fill(0)

    actividad.forEach((a) => {
      const date = new Date(a.fecha)

      if (!Number.isNaN(date.getTime())) hours[date.getHours()] += 1
    })

    const peakCount = Math.max(...hours)
    const peakHour = hours.indexOf(peakCount)

    return {
      actions7: recent.length,
      uniqueUsers,
      average: Math.round((recent.length / 7) * 10) / 10,
      peak:
        peakCount > 0 ? `${String(peakHour).padStart(2, '0')}:00` : '—'
    }
  }, [actividad])

  // =======================================================
  // BREAKDOWN BY ACTION
  // =======================================================

  const breakdown = useMemo(() => {
    const counts = actividad.reduce((acc, a) => {
      const key = a.action || 'otro'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .map(([action, count]) => ({
        action,
        count,
        meta: getActionMeta(action)
      }))
      .sort((a, b) => b.count - a.count)
  }, [actividad])

  // =======================================================
  // RANKING
  // =======================================================

  const ranking = useMemo(() => {
    const byUser = actividad.reduce((acc, a) => {
      if (!a.uid) return acc

      if (!acc[a.uid]) {
        acc[a.uid] = {
          uid: a.uid,
          nombre: a.nombre,
          email: a.email,
          logins: 0,
          desglose: 0,
          total: 0
        }
      }

      acc[a.uid].total += 1

      if (a.action === 'login') acc[a.uid].logins += 1
      if (a.action === 'desglose') acc[a.uid].desglose += 1

      return acc
    }, {})

    return Object.values(byUser)
      .filter((u) => u[metric] > 0)
      .sort((a, b) => b[metric] - a[metric])
      .slice(0, RANKING_LIMIT)
  }, [actividad, metric])

  const activeMetric = RANKING_METRICS.find((m) => m.id === metric)

  if (actividad.length === 0) {
    return (
      <section className="adm-card">
        <EmptyState
          icon="bi-graph-up"
          title="Todavía no hay datos de uso"
          text="Cuando los usuarios empiecen a usar la plataforma, verás aquí las estadísticas."
        />
      </section>
    )
  }

  return (
    <>
      {/* =================================================
          KPIs
      ================================================= */}

      <section className="adm-stats" aria-label="Indicadores de uso">
        <AdminStatCard
          compact
          icon="bi-lightning-charge"
          label="Acciones"
          value={kpis.actions7}
          hint="Últimos 7 días"
          tone="primary"
        />

        <AdminStatCard
          compact
          icon="bi-person-check"
          label="Usuarios activos"
          value={kpis.uniqueUsers}
          hint="Últimos 7 días"
          tone="success"
        />

        <AdminStatCard
          compact
          icon="bi-speedometer2"
          label="Promedio diario"
          value={kpis.average}
          hint="Acciones por día"
        />

        <AdminStatCard
          compact
          icon="bi-clock"
          label="Hora pico"
          value={kpis.peak}
          hint="Más acciones registradas"
        />
      </section>

      {/* =================================================
          DAILY CHART
      ================================================= */}

      <section className="adm-card adm-block">
        <div className="adm-card__head">
          <div>
            <h2 className="adm-card__title">Acciones por día</h2>
            <p className="adm-card__sub">Últimos {CHART_DAYS} días.</p>
          </div>

          <span className="adm-badge">{chartTotal} en total</span>
        </div>

        <div className="adm-card__body">
          {chartTotal === 0 ? (
            <EmptyState
              icon="bi-bar-chart-line"
              title={`Sin actividad en los últimos ${CHART_DAYS} días`}
            />
          ) : (
            <div
              className="adm-chart"
              role="img"
              aria-label={`Acciones por día durante los últimos ${CHART_DAYS} días`}
            >
              {series.map((d) => {
                const ratio =
                  maxCount > 0 && d.count > 0
                    ? Math.max(d.count / maxCount, 0.03)
                    : 0

                return (
                  <div
                    key={d.key}
                    className={`adm-chart__col${d.isToday ? ' is-today' : ''}`}
                    title={`${d.date.toLocaleDateString('es-DO', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}: ${d.count} ${d.count === 1 ? 'acción' : 'acciones'}`}
                  >
                    <div className="adm-chart__plot">
                      <span className="adm-chart__value">
                        {d.count > 0 ? d.count : ''}
                      </span>

                      <span
                        className="adm-chart__bar"
                        style={{
                          height: `calc((var(--adm-chart-h) - 22px) * ${ratio})`
                        }}
                      ></span>
                    </div>

                    <span className="adm-chart__label">
                      {d.date.getDate()}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          BREAKDOWN + RANKING
      ================================================= */}

      <div className="adm-grid-2 adm-grid-2--even">
        <section className="adm-card">
          <div className="adm-card__head">
            <div>
              <h2 className="adm-card__title">Tipos de acción</h2>
              <p className="adm-card__sub">
                Qué hacen los usuarios en la plataforma.
              </p>
            </div>
          </div>

          <div className="adm-card__body">
            <div className="adm-hbar">
              {breakdown.map((item) => {
                const pct = Math.round((item.count / actividad.length) * 100)

                return (
                  <div key={item.action} className="adm-hbar__row">
                    <div className="adm-hbar__top">
                      <span
                        className="adm-hbar__label"
                        style={{ '--chip': item.meta.color }}
                      >
                        <i
                          className={`bi ${item.meta.icon}`}
                          aria-hidden="true"
                        ></i>
                        {item.meta.label}
                      </span>

                      <span className="adm-hbar__value">
                        {item.count}
                        <span className="adm-muted"> ({pct}%)</span>
                      </span>
                    </div>

                    <div className="adm-hbar__track">
                      <div
                        className="adm-hbar__fill"
                        style={{
                          width: `${pct}%`,
                          '--chip': item.meta.color
                        }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card__head">
            <div>
              <h2 className="adm-card__title">Usuarios más activos</h2>
              <p className="adm-card__sub">Top {RANKING_LIMIT} por actividad.</p>
            </div>

            <div className="adm-seg" role="group" aria-label="Ordenar ranking">
              {RANKING_METRICS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={metric === m.id ? 'is-active' : ''}
                  onClick={() => setMetric(m.id)}
                  aria-pressed={metric === m.id}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {ranking.length === 0 ? (
            <EmptyState
              icon="bi-trophy"
              title="Sin datos para este criterio"
            />
          ) : (
            <ul className="adm-list">
              {ranking.map((u, index) => (
                <li key={u.uid} className="adm-list__item">
                  <span className="adm-rank">{index + 1}</span>

                  <Avatar name={u.nombre} email={u.email} size={32} />

                  <div className="adm-item__main">
                    <div className="adm-item__title">
                      {u.nombre || 'Sin nombre'}
                    </div>

                    <div className="adm-item__sub">{u.email}</div>
                  </div>

                  <span className="adm-badge adm-badge--success">
                    {u[metric]} {activeMetric.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="adm-footnote">
        Basado en los últimos {actividad.length} registros de actividad.
      </p>
    </>
  )
}
