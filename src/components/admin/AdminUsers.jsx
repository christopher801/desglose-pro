import React, { useEffect, useMemo, useState } from 'react'

import {
  Avatar,
  DaysBadge,
  EmptyState,
  Pagination,
  formatDate,
  getDaysSince
} from './adminShared'

const PAGE_SIZE = 10

const USER_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'Activos' },
  { id: 'pending', label: 'Pendientes' },
  { id: 'full', label: 'Full Access' },
  { id: 'admin', label: 'Admins' }
]

const matchesFilter = (user, filter) => {
  switch (filter) {
    case 'active':
      return !!user.isActive
    case 'pending':
      return !user.isActive && user.role !== 'admin'
    case 'full':
      return !!user.fullAccess
    case 'admin':
      return user.role === 'admin'
    default:
      return true
  }
}

export default function AdminUsers({
  users,
  filter,
  onFilterChange,
  selectedId,
  onSelectUser,
  onUnlock,
  onLock,
  onGrantFullAccess,
  onRevokeFullAccess
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [search, filter])

  const counts = useMemo(
    () =>
      USER_FILTERS.reduce((acc, f) => {
        acc[f.id] = users.filter((u) => matchesFilter(u, f.id)).length
        return acc
      }, {}),
    [users]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    return users.filter((u) => {
      if (!matchesFilter(u, filter)) return false

      if (!q) return true

      return (
        (u.nombre || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      )
    })
  }, [users, filter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  return (
    <section className="adm-card">
      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="adm-toolbar">
        <div className="adm-search">
          <i className="bi bi-search" aria-hidden="true"></i>

          <input
            type="text"
            className="adm-input"
            placeholder="Buscar por nombre o email"
            aria-label="Buscar usuarios"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="adm-icon-btn adm-search__clear"
              onClick={() => setSearch('')}
              aria-label="Limpiar búsqueda"
            >
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          )}
        </div>

        <div className="adm-filters" role="group" aria-label="Filtrar usuarios">
          {USER_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`adm-filter${filter === f.id ? ' is-active' : ''}`}
              onClick={() => onFilterChange(f.id)}
              aria-pressed={filter === f.id}
            >
              {f.label}
              <span className="adm-filter__count">{counts[f.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      {filtered.length === 0 ? (
        <EmptyState
          icon="bi-search"
          title="No se encontraron usuarios"
          text="Prueba con otra búsqueda o cambia el filtro."
        />
      ) : (
        <>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acceso</th>
                  <th>Antigüedad</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map((u) => {
                  const isAdminUser = u.role === 'admin'
                  const isPending = !u.isActive && !isAdminUser

                  const rowClass = [
                    'is-clickable',
                    isPending ? 'is-pending' : '',
                    u.id === selectedId ? 'is-selected' : ''
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <tr
                      key={u.id}
                      className={rowClass}
                      onClick={() => onSelectUser(u.id)}
                    >
                      <td>
                        <button
                          type="button"
                          className="adm-user"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectUser(u.id)
                          }}
                        >
                          <Avatar name={u.nombre} email={u.email} />

                          <span className="adm-user__text">
                            <span className="adm-user__name">
                              {u.nombre || 'Sin nombre'}
                            </span>

                            <span className="adm-user__email">{u.email}</span>
                          </span>
                        </button>
                      </td>

                      <td>
                        <span
                          className={`adm-badge${
                            isAdminUser ? ' adm-badge--primary' : ''
                          }`}
                        >
                          {isAdminUser ? 'Admin' : 'Usuario'}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`adm-badge adm-badge--${
                            u.isActive ? 'success' : 'warning'
                          }`}
                        >
                          {u.isActive ? 'Activo' : 'Pendiente'}
                        </span>
                      </td>

                      <td>
                        {isAdminUser ? (
                          <span className="adm-muted">—</span>
                        ) : u.fullAccess ? (
                          <span className="adm-badge adm-badge--primary">
                            <i
                              className="bi bi-star-fill"
                              aria-hidden="true"
                            ></i>
                            Full Access
                          </span>
                        ) : (
                          <span className="adm-badge">Normal</span>
                        )}
                      </td>

                      <td>
                        {isAdminUser ? (
                          <span className="adm-muted">—</span>
                        ) : (
                          <DaysBadge days={getDaysSince(u.createdAt)} />
                        )}
                      </td>

                      <td className="adm-nowrap adm-muted">
                        {formatDate(u.createdAt)}
                      </td>

                      <td onClick={(e) => e.stopPropagation()}>
                        {isAdminUser ? (
                          <span className="adm-muted">—</span>
                        ) : (
                          <div className="adm-row-actions">
                            {u.isActive ? (
                              <button
                                type="button"
                                className="adm-btn adm-btn--warning adm-btn--sm"
                                onClick={() => onLock(u)}
                              >
                                <i
                                  className="bi bi-lock"
                                  aria-hidden="true"
                                ></i>
                                Bloquear
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="adm-btn adm-btn--success adm-btn--sm"
                                onClick={() => onUnlock(u)}
                              >
                                <i
                                  className="bi bi-unlock"
                                  aria-hidden="true"
                                ></i>
                                Activar
                              </button>
                            )}

                            <button
                              type="button"
                              className={`adm-icon-btn adm-icon-btn--star${
                                u.fullAccess ? ' is-on' : ''
                              }`}
                              onClick={() =>
                                u.fullAccess
                                  ? onRevokeFullAccess(u)
                                  : onGrantFullAccess(u)
                              }
                              title={
                                u.fullAccess
                                  ? 'Quitar Full Access'
                                  : 'Dar Full Access'
                              }
                              aria-label="Full Access"
                              aria-pressed={!!u.fullAccess}
                            >
                              <i
                                className={`bi ${
                                  u.fullAccess ? 'bi-star-fill' : 'bi-star'
                                }`}
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            page={currentPage}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            onChange={setPage}
            label="usuarios"
          />
        </>
      )}
    </section>
  )
}
