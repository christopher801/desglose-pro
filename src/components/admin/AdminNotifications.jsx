import React, { useMemo, useState } from 'react'

import { EmptyState, formatDateTime } from './adminShared'

const TITLE_MAX = 120
const MESSAGE_MAX = 1000

export default function AdminNotifications({
  notifications,
  unreadCount,
  onMarkRead,
  onDelete,
  onSendAnnouncement
}) {
  const [filter, setFilter] = useState('all')

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const visible = useMemo(
    () =>
      filter === 'unread'
        ? notifications.filter((n) => !n.read)
        : notifications,
    [notifications, filter]
  )

  const canSend = !sending && title.trim() !== '' && message.trim() !== ''

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (sending) return

    const cleanTitle = title.trim()
    const cleanMessage = message.trim()

    if (!cleanTitle || !cleanMessage) return

    setSending(true)

    try {
      const ok = await onSendAnnouncement({
        title: cleanTitle,
        message: cleanMessage
      })

      if (ok) {
        setTitle('')
        setMessage('')
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="adm-split">
      {/* =================================================
          LIST
      ================================================= */}

      <section className="adm-card">
        <div className="adm-card__head">
          <div>
            <h2 className="adm-card__title">Bandeja</h2>
            <p className="adm-card__sub">Notificaciones de nuevos usuarios.</p>
          </div>

          <div className="adm-seg" role="group" aria-label="Filtrar notificaciones">
            <button
              type="button"
              className={filter === 'all' ? 'is-active' : ''}
              onClick={() => setFilter('all')}
              aria-pressed={filter === 'all'}
            >
              Todas ({notifications.length})
            </button>

            <button
              type="button"
              className={filter === 'unread' ? 'is-active' : ''}
              onClick={() => setFilter('unread')}
              aria-pressed={filter === 'unread'}
            >
              Sin leer ({unreadCount})
            </button>
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={filter === 'unread' ? 'bi-check2-all' : 'bi-bell-slash'}
            title={
              filter === 'unread'
                ? 'No tienes notificaciones sin leer'
                : 'No hay notificaciones'
            }
            text={
              filter === 'unread'
                ? 'Todo está al día.'
                : 'Los avisos de nuevos registros aparecerán aquí.'
            }
          />
        ) : (
          <ul className="adm-list">
            {visible.map((n) => (
              <li
                key={n.id}
                className={`adm-list__item adm-notif${
                  !n.read ? ' is-unread' : ''
                }`}
              >
                <span className="adm-chip-icon adm-chip-icon--primary">
                  <i
                    className={`bi ${
                      n.type === 'ANNOUNCEMENT' ? 'bi-megaphone' : 'bi-bell'
                    }`}
                    aria-hidden="true"
                  ></i>
                </span>

                <div className="adm-item__main">
                  <div className="adm-item__title adm-item__title--wrap">
                    {!n.read && (
                      <span
                        className="adm-unread-dot"
                        role="img"
                        aria-label="Sin leer"
                      ></span>
                    )}
                    {n.title}
                  </div>

                  <div className="adm-item__sub adm-item__sub--wrap">
                    {n.message}
                  </div>

                  <div className="adm-item__meta">
                    {formatDateTime(n.createdAt || n.timestamp)}
                  </div>
                </div>

                <div className="adm-notif__actions">
                  {!n.read && (
                    <button
                      type="button"
                      className="adm-btn adm-btn--ghost adm-btn--sm"
                      onClick={() => onMarkRead(n.id)}
                    >
                      <i className="bi bi-check2" aria-hidden="true"></i>
                      Marcar leída
                    </button>
                  )}

                  <button
                    type="button"
                    className="adm-icon-btn adm-icon-btn--danger"
                    onClick={() => onDelete(n.id)}
                    title="Eliminar notificación"
                    aria-label="Eliminar notificación"
                  >
                    <i className="bi bi-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* =================================================
          COMPOSER
      ================================================= */}

      <section className="adm-card adm-composer">
        <div className="adm-card__head">
          <div>
            <h2 className="adm-card__title">Enviar anuncio</h2>
            <p className="adm-card__sub">
              Le llega una notificación a todos los usuarios.
            </p>
          </div>
        </div>

        <form className="adm-card__body" onSubmit={handleSubmit}>
          <div className="adm-field">
            <label htmlFor="adm-ann-title">Título</label>

            <input
              id="adm-ann-title"
              type="text"
              className="adm-input"
              placeholder="Ej. Nueva actualización disponible"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TITLE_MAX}
              disabled={sending}
            />

            <span className="adm-field__count">
              {title.length}/{TITLE_MAX}
            </span>
          </div>

          <div className="adm-field">
            <label htmlFor="adm-ann-message">Mensaje</label>

            <textarea
              id="adm-ann-message"
              className="adm-input adm-textarea"
              placeholder="Escribe el mensaje que recibirán los usuarios"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MESSAGE_MAX}
              rows={5}
              disabled={sending}
            />

            <span className="adm-field__count">
              {message.length}/{MESSAGE_MAX}
            </span>
          </div>

          <button
            type="submit"
            className="adm-btn adm-btn--primary adm-btn--block"
            disabled={!canSend}
          >
            {sending ? (
              <>
                <span className="adm-spinner adm-spinner--sm"></span>
                Enviando
              </>
            ) : (
              <>
                <i className="bi bi-send" aria-hidden="true"></i>
                Enviar a todos
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  )
}
