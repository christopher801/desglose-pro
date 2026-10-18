import React from 'react'

import { getActionLabel } from '../../services/actividadService'

// =========================================================
// FECHAS
// =========================================================

const toDate = (value) => {
  if (!value) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
}

export const getDaysSince = (createdAt) => {
  const date = toDate(createdAt)

  if (!date) return null

  return Math.floor((new Date() - date) / (1000 * 60 * 60 * 24))
}

export const formatDate = (value) => {
  const date = toDate(value)

  return date ? date.toLocaleDateString('es-DO') : '—'
}

export const formatTime = (value) => {
  const date = toDate(value)

  return date
    ? date.toLocaleTimeString('es-DO', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—'
}

export const formatDateTime = (value) => {
  const date = toDate(value)

  return date ? date.toLocaleString('es-DO') : '—'
}

export const timeAgo = (value) => {
  const date = toDate(value)

  if (!date) return '—'

  const minutes = Math.floor(Math.max(0, Date.now() - date.getTime()) / 60000)

  if (minutes < 1) return 'Hace un momento'
  if (minutes < 60) return `Hace ${minutes} min`

  const hours = Math.floor(minutes / 60)

  if (hours < 24) return `Hace ${hours} h`

  const days = Math.floor(hours / 24)

  if (days < 7) return `Hace ${days} d`

  return formatDate(value)
}

// =========================================================
// ACCIONES DE ACTIVIDAD
// =========================================================

export const getActionMeta = (action) => {
  const meta = getActionLabel(action) || {}

  return {
    label: meta.label || action || 'Acción',
    icon: meta.icon || 'bi-circle',
    color: meta.color || 'var(--adm-muted)'
  }
}

// =========================================================
// AVATAR
// =========================================================

export const getInitials = (name, email) => {
  const source = (name || email || '?').trim()
  const parts = source.split(/[\s@._-]+/).filter(Boolean)

  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()

  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const hueFrom = (text = '') => {
  let hash = 0

  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 360
  }

  return hash
}

export function Avatar({ name, email, size = 36 }) {
  const hue = hueFrom(email || name || '')

  return (
    <span
      className="adm-avatar"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        background: `hsl(${hue} 60% 92%)`,
        color: `hsl(${hue} 45% 28%)`
      }}
    >
      {getInitials(name, email)}
    </span>
  )
}

// =========================================================
// BADGE DÍAS
// =========================================================

export function DaysBadge({ days }) {
  if (days === null) {
    return <span className="adm-badge">—</span>
  }

  const tone =
    days <= 30 ? 'success' : days <= 60 ? 'warning' : 'danger'

  return <span className={`adm-badge adm-badge--${tone}`}>{days}d</span>
}

// =========================================================
// ESTADO VACÍO
// =========================================================

export function EmptyState({ icon = 'bi-inbox', title, text }) {
  return (
    <div className="adm-empty">
      <i className={`bi ${icon}`} aria-hidden="true"></i>

      <span className="adm-empty__title">{title}</span>

      {text && <span>{text}</span>}
    </div>
  )
}

// =========================================================
// PAGINACIÓN
// =========================================================

export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  label = 'registros'
}) {
  if (total === 0) return null

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="adm-pagination">
      <span>
        {from}–{to} de {total} {label}
      </span>

      {totalPages > 1 && (
        <div className="adm-pagination__controls">
          <button
            type="button"
            className="adm-icon-btn"
            onClick={() => onChange(page - 1)}
            disabled={page <= 1}
            aria-label="Página anterior"
          >
            <i className="bi bi-chevron-left" aria-hidden="true"></i>
          </button>

          <span className="adm-pagination__page">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            className="adm-icon-btn"
            onClick={() => onChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Página siguiente"
          >
            <i className="bi bi-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      )}
    </div>
  )
}
