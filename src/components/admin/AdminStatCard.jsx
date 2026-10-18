import React from 'react'

// tone: 'neutral' | 'primary' | 'success' | 'warning'
export default function AdminStatCard({
  icon,
  label,
  value,
  hint,
  tone = 'neutral',
  onClick,
  compact = false
}) {
  const Tag = onClick ? 'button' : 'div'
  const extraProps = onClick ? { type: 'button', onClick } : {}

  const className = [
    'adm-stat',
    `adm-stat--${tone}`,
    compact ? 'adm-stat--compact' : '',
    onClick ? 'adm-stat--action' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={className} {...extraProps}>
      <span className="adm-stat__top">
        <span className="adm-stat__label">{label}</span>

        <span className="adm-stat__icon">
          <i className={`bi ${icon}`} aria-hidden="true"></i>
        </span>
      </span>

      <span className="adm-stat__value">{value}</span>

      {hint && <span className="adm-stat__hint">{hint}</span>}
    </Tag>
  )
}
