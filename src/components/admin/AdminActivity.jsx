import React, { useEffect, useMemo, useState } from 'react'

import {
  EmptyState,
  Pagination,
  formatDate,
  formatTime,
  getActionMeta
} from './adminShared'

const PAGE_SIZE = 15

export default function AdminActivity({
  actividad,
  users,
  onDelete,
  onDeleteAll
}) {
  const [filterUser, setFilterUser] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [filterUser, filterAction])

  const actionOptions = useMemo(
    () =>
      Array.from(new Set(actividad.map((a) => a.action).filter(Boolean))).map(
        (value) => ({ value, label: getActionMeta(value).label })
      ),
    [actividad]
  )

  const filtered = useMemo(
    () =>
      actividad.filter(
        (a) =>
          (filterUser === '' || a.uid === filterUser) &&
          (filterAction === '' || a.action === filterAction)
      ),
    [actividad, filterUser, filterAction]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const hasFilters = filterUser !== '' || filterAction !== ''

  return (
    <section className="adm-card">
      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="adm-toolbar">
        <select
          className="adm-input adm-select"
          aria-label="Filtrar por usuario"
          value={filterUser}
          onChange={(e) => setFilterUser(e.target.value)}
        >
          <option value="">Todos los usuarios</option>

          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre || u.email}
            </option>
          ))}
        </select>

        <select
          className="adm-input adm-select"
          aria-label="Filtrar por acción"
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
        >
          <option value="">Todas las acciones</option>

          {actionOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm"
            onClick={() => {
              setFilterUser('')
              setFilterAction('')
            }}
          >
            <i className="bi bi-x-circle" aria-hidden="true"></i>
            Limpiar filtros
          </button>
        )}

        <span className="adm-toolbar__count">
          {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
        </span>

        <button
          type="button"
          className="adm-btn adm-btn--danger adm-btn--sm adm-toolbar__end"
          onClick={onDeleteAll}
          disabled={actividad.length === 0}
        >
          <i className="bi bi-trash" aria-hidden="true"></i>
          Borrar todo
        </button>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      {filtered.length === 0 ? (
        <EmptyState
          icon="bi-clock-history"
          title={
            hasFilters
              ? 'Ningún registro coincide con los filtros'
              : 'No hay actividad registrada'
          }
          text={
            hasFilters
              ? 'Cambia o limpia los filtros para ver más resultados.'
              : 'Las acciones de los usuarios aparecerán aquí.'
          }
        />
      ) : (
        <>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Detalle</th>
                  <th>Fecha</th>
                  <th>
                    <span className="adm-sr-only">Eliminar</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map((a) => {
                  const meta = getActionMeta(a.action)

                  return (
                    <tr key={a.id}>
                      <td>
                        <div className="adm-user__name">{a.nombre || '—'}</div>
                        <div className="adm-user__email">{a.email}</div>
                      </td>

                      <td>
                        <span
                          className="adm-action"
                          style={{ '--chip': meta.color }}
                        >
                          <i
                            className={`bi ${meta.icon}`}
                            aria-hidden="true"
                          ></i>
                          {meta.label}
                        </span>
                      </td>

                      <td className="adm-cell-detail">{a.detail || '—'}</td>

                      <td className="adm-nowrap">
                        <div>{formatDate(a.fecha)}</div>
                        <div className="adm-muted">{formatTime(a.fecha)}</div>
                      </td>

                      <td className="adm-cell-end">
                        <button
                          type="button"
                          className="adm-icon-btn adm-icon-btn--danger"
                          onClick={() => onDelete(a.id)}
                          title="Eliminar registro"
                          aria-label="Eliminar registro"
                        >
                          <i className="bi bi-trash" aria-hidden="true"></i>
                        </button>
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
            label="registros"
          />
        </>
      )}
    </section>
  )
}
