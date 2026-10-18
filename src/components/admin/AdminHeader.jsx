import React from 'react'

import { formatTime } from './adminShared'

const SECTION_META = {
  overview: {
    title: 'Resumen',
    description: 'Estado general de usuarios, accesos y actividad.'
  },
  users: {
    title: 'Usuarios',
    description: 'Activa cuentas, bloquea accesos y administra Full Access.'
  },
  usage: {
    title: 'Uso',
    description: 'Cómo usan la plataforma tus usuarios.'
  },
  notifications: {
    title: 'Notificaciones',
    description: 'Avisos de nuevos usuarios y anuncios para todos.'
  },
  activity: {
    title: 'Actividad',
    description: 'Registro de acciones en la plataforma.'
  }
}

export default function AdminHeader({
  section,
  onRefresh,
  refreshing,
  lastUpdated,
  unreadCount,
  onOpenNotifications
}) {
  const meta = SECTION_META[section] || SECTION_META.overview

  return (
    <header className="adm-header">
      <div className="adm-header__titles">
        <h1 className="adm-header__title">{meta.title}</h1>
        <p className="adm-header__desc">{meta.description}</p>
      </div>

      <div className="adm-header__actions">
        {lastUpdated && (
          <span className="adm-header__updated">
            Actualizado {formatTime(lastUpdated)}
          </span>
        )}

        <button
          type="button"
          className="adm-btn"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <i
            className={`bi bi-arrow-clockwise${
              refreshing ? ' is-spinning' : ''
            }`}
            aria-hidden="true"
          ></i>

          Actualizar
        </button>

        <button
          type="button"
          className="adm-icon-btn adm-icon-btn--bordered adm-bell"
          onClick={onOpenNotifications}
          aria-label={
            unreadCount > 0
              ? `Notificaciones, ${unreadCount} sin leer`
              : 'Notificaciones'
          }
        >
          <i className="bi bi-bell" aria-hidden="true"></i>

          {unreadCount > 0 && (
            <span className="adm-bell__count">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
