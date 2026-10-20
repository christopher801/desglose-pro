import React, { useState } from 'react'
import GlassSvgViewer from '../glass/GlassSvgViewer'

const formatDate = (iso) => {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('es-DO') +
    ' ' +
    d.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
  )
}

const unitLabel = (unit) => (!unit || unit === 'in' ? '"' : ` ${unit}`)

function getSummary(entry) {
  const piezas = entry?.piezas || []
  const sheets = entry?.resultado?.sheets || []
  const noUbicadas = entry?.resultado?.piezasNoUbicadas?.length || 0

  const totalPiezas = piezas.reduce(
    (sum, p) => sum + (Number(p.cantidad ?? p.qty ?? 1) || 1),
    0
  )

  return {
    piezas,
    totalPiezas,
    totalSheets: sheets.length,
    noUbicadas,
    optimizado: sheets.length > 0,
  }
}

export default function CroquisVidriosHistorial({ entries, search, onDelete }) {
  const [selectedId, setSelectedId] = useState(null)

  const selected = entries.find((e) => e.id === selectedId) || null

  const q = search.toLowerCase().trim()
  const filtered = entries.filter((entry) => {
    if (!q) return true

    const text = [
      entry.proyecto?.cliente,
      entry.proyecto?.obra,
      entry.proyecto?.color,
      entry.configuracion?.tipoVidrio,
      new Date(entry.fecha).toLocaleDateString('es-DO'),
    ]
      .join(' ')
      .toLowerCase()

    return text.includes(q)
  })

  if (entries.length === 0) {
    return (
      <div
        className="card-modern text-center"
        style={{
          padding: '3rem',
          color: 'var(--gray-500)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <i
          className="bi bi-grid-3x3-gap"
          style={{
            fontSize: '3rem',
            display: 'block',
            marginBottom: '1rem',
            color: 'var(--gray-300)',
          }}
        ></i>

        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          No hay croquis de vidrios guardados
        </div>

        <div style={{ fontSize: '13px' }}>
          Los croquis de vidrios que guardes aparecerán aquí
        </div>
      </div>
    )
  }

  const detailSummary = selected ? getSummary(selected) : null
  const cfg = selected?.configuracion || {}

  return (
    <div className={`historial-layout ${selected ? 'has-detail' : ''}`}>
      {/* =========================
          LISTA
      ========================= */}
      <div className="historial-list">
        {filtered.length === 0 ? (
          <div
            className="card-modern text-center"
            style={{ padding: '2rem', color: 'var(--gray-500)' }}
          >
            No se encontraron resultados para "{search}"
          </div>
        ) : (
          filtered.map((entry) => {
            const summary = getSummary(entry)
            const entryCfg = entry.configuracion || {}

            return (
              <div
                key={entry.id}
                className="card-modern historial-entry"
                style={{
                  cursor: 'pointer',
                  border:
                    selectedId === entry.id
                      ? '2px solid var(--primary)'
                      : '1px solid var(--gray-200)',
                  transition: 'all 0.15s',
                  minWidth: 0,
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
                onClick={() => setSelectedId(entry.id)}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      flexShrink: 0,
                      background: '#f0f9ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <i
                      className="bi bi-grid-3x3-gap"
                      style={{ fontSize: '18px', color: 'var(--primary)' }}
                    ></i>
                  </div>

                  <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '14px',
                        color: 'var(--gray-900)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.proyecto?.cliente || 'Sin cliente'}
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--gray-500)',
                        marginTop: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {entry.proyecto?.obra || 'Sin nombre'}
                      {entryCfg.tipoVidrio ? ` · ${entryCfg.tipoVidrio}` : ''}
                      {entryCfg.espesor ? ` ${entryCfg.espesor}` : ''}
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--gray-400)',
                        marginTop: '2px',
                      }}
                    >
                      <i
                        className="bi bi-calendar3"
                        style={{ marginRight: '4px' }}
                      ></i>
                      {formatDate(entry.fecha)}

                      <span style={{ marginLeft: '10px' }}>
                        <i
                          className="bi bi-layers"
                          style={{ marginRight: '4px' }}
                        ></i>
                        {summary.optimizado
                          ? `${summary.totalSheets} plancha${
                              summary.totalSheets !== 1 ? 's' : ''
                            }`
                          : 'Sin optimizar'}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{ display: 'flex', gap: '6px', flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn-danger-sm"
                      onClick={() => onDelete(entry.id)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* =========================
          DETALLE
      ========================= */}
      {selected && (
        <div
          className="card-modern historial-detail"
          style={{
            alignSelf: 'flex-start',
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              Detalle del croquis de vidrios
            </h3>

            <button
              onClick={() => setSelectedId(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                cursor: 'pointer',
                color: 'var(--gray-500)',
                flexShrink: 0,
              }}
              title="Cerrar detalle"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Info del proyecto */}
          <div
            className="historial-project-info"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '8px',
              background: '#f0f9ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '1rem',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          >
            {[
              ['Cliente', selected.proyecto?.cliente],
              ['Obra', selected.proyecto?.obra],
              ['Tipo de vidrio', cfg.tipoVidrio],
              ['Espesor', cfg.espesor],
              ['Color', selected.proyecto?.color],
              [
                'Plancha',
                cfg.anchoPlancha && cfg.altoPlancha
                  ? `${cfg.anchoPlancha} × ${cfg.altoPlancha}${unitLabel(
                      cfg.unidad
                    )}`
                  : '',
              ],
              ['Piezas', detailSummary.totalPiezas],
              [
                'Planchas usadas',
                detailSummary.optimizado ? detailSummary.totalSheets : '—',
              ],
            ].map(([label, value]) => (
              <div key={label}>
                <span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>
                  {label}
                </span>
                <div style={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                  {value || value === 0 ? value : '—'}
                </div>
              </div>
            ))}
          </div>

          {selected.notas && (
            <div
              style={{
                marginBottom: '1rem',
                fontSize: '12px',
                color: '#92400e',
                background: '#fffbeb',
                padding: '5px 8px',
                borderRadius: '6px',
                overflowWrap: 'anywhere',
              }}
            >
              <i className="bi bi-sticky" style={{ marginRight: '4px' }}></i>
              {selected.notas}
            </div>
          )}

          {detailSummary.noUbicadas > 0 && (
            <div
              style={{
                marginBottom: '1rem',
                fontSize: '12px',
                color: '#b91c1c',
                background: '#fef2f2',
                padding: '6px 9px',
                borderRadius: '6px',
              }}
            >
              <i
                className="bi bi-exclamation-triangle"
                style={{ marginRight: '4px' }}
              ></i>
              {detailSummary.noUbicadas} pieza(s) no pudieron ubicarse.
            </div>
          )}

          {/* Piezas */}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--gray-500)',
              marginBottom: '8px',
            }}
          >
            {detailSummary.piezas.length} pieza
            {detailSummary.piezas.length !== 1 ? 's' : ''}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            {detailSummary.piezas.map((p, idx) => (
              <div
                key={p.id || idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto auto',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 0',
                  borderBottom: '1px solid var(--gray-100)',
                  fontSize: '13px',
                }}
              >
                <span
                  style={{
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.etiqueta || p.label || p.nombre || `Pieza ${idx + 1}`}
                </span>

                <span
                  style={{
                    fontFamily: 'monospace',
                    color: 'var(--gray-600)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.ancho} × {p.alto}
                  {unitLabel(cfg.unidad)}
                </span>

                <span
                  style={{
                    color: 'var(--gray-500)',
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  x{p.cantidad ?? p.qty ?? 1}
                </span>
              </div>
            ))}
          </div>

          {/* Croquis (planchas) */}
          {detailSummary.optimizado ? (
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
              <GlassSvgViewer sheets={selected.resultado.sheets} />
            </div>
          ) : (
            <div
              style={{
                padding: '12px',
                borderRadius: '9px',
                background: '#f8fafc',
                border: '1px solid var(--gray-200)',
                color: 'var(--gray-400)',
                fontSize: '11px',
                textAlign: 'center',
              }}
            >
              Este proyecto se guardó sin optimizar, por eso no hay croquis.
            </div>
          )}

          <div
            style={{
              marginTop: '1rem',
              fontSize: '11px',
              color: 'var(--gray-400)',
              textAlign: 'center',
            }}
          >
            Guardado el {formatDate(selected.fecha)}
          </div>
        </div>
      )}
    </div>
  )
}