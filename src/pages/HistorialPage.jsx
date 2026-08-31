import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getHistorial, deleteDesglose, deleteAllDesgloses } from '../services/historialService'

const SISTEMA_ICONS = {
  'Ventana P-92': 'bi-window',
  'Ventana P-65': 'bi-window',
  'Ventana Tradicional': 'bi-window',
  'Ventana P-40 Proyectada': 'bi-window-dock',
  'Puerta Comercial': 'bi-door-open',
  'Puerta P40': 'bi-door-open',
}

const SISTEMA_COLORS = {
  'Ventana P-92': '#eff6ff',
  'Ventana P-65': '#f0fdf4',
  'Ventana Tradicional': '#fefce8',
  'Ventana P-40 Proyectada': '#fdf4ff',
  'Puerta Comercial': '#fff7ed',
  'Puerta P40': '#fff1f2',
}

export default function HistorialPage() {
  const navigate = useNavigate()
  const [historial, setHistorial] = useState([])
  const [selected, setSelected] = useState(null)
  const [showDeleteAll, setShowDeleteAll] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setHistorial(getHistorial())
  }, [])

  const handleDelete = (id) => {
    deleteDesglose(id)
    setHistorial(getHistorial())
    if (selected?.id === id) setSelected(null)
  }

  const handleDeleteAll = () => {
    deleteAllDesgloses()
    setHistorial([])
    setSelected(null)
    setShowDeleteAll(false)
  }

  const handlePrint = (entry) => {
    alert('Para imprimir, abre el desglose desde el módulo correspondiente.')
  }

  const filteredHistorial = historial.filter(entry => {
    const q = search.toLowerCase()
    return (
      (entry.proyecto?.cliente || '').toLowerCase().includes(q) ||
      (entry.proyecto?.obra || '').toLowerCase().includes(q) ||
      (entry.sistema || '').toLowerCase().includes(q)
    )
  })

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-DO') + ' ' + d.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Layout>
      <div className="page-content">

        {/* Header */}
        <div className="admin-header">
          <h1 className="page-title">
            <i className="bi bi-clock-history" style={{ marginRight: '8px' }}></i>Historial de desgloses
          </h1>
          {historial.length > 0 && (
            <button className="btn-danger-sm" onClick={() => setShowDeleteAll(true)}>
              <i className="bi bi-trash" style={{ marginRight: '6px' }}></i>Borrar todo
            </button>
          )}
        </div>

        {/* Searchbar */}
        {historial.length > 0 && (
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <i className="bi bi-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', fontSize: '14px' }}></i>
            <input
              type="text"
              className="auth-input"
              placeholder="Buscar por cliente, obra o sistema..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>
        )}

        {historial.length === 0 ? (
          <div className="card-modern text-center" style={{ padding: '3rem', color: 'var(--gray-500)' }}>
            <i className="bi bi-clock-history" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem', color: 'var(--gray-300)' }}></i>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No hay desgloses guardados</div>
            <div style={{ fontSize: '13px' }}>Los desgloses que guardes aparecerán aquí</div>
            <button className="btn-primary-sm" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/desglose')}>
              <i className="bi bi-plus-circle" style={{ marginRight: '6px' }}></i>Nuevo desglose
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1rem' }}>

            {/* Lista */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredHistorial.length === 0 ? (
                <div className="card-modern text-center" style={{ padding: '2rem', color: 'var(--gray-500)' }}>
                  No se encontraron resultados para "{search}"
                </div>
              ) : (
                filteredHistorial.map(entry => (
                  <div
                    key={entry.id}
                    className="card-modern"
                    style={{
                      cursor: 'pointer',
                      border: selected?.id === entry.id ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                      transition: 'all 0.15s',
                    }}
                    onClick={() => setSelected(entry)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Icon */}
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                        background: SISTEMA_COLORS[entry.sistema] || '#f1f5f9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className={`bi ${SISTEMA_ICONS[entry.sistema] || 'bi-layers'}`} style={{ fontSize: '18px', color: 'var(--primary)' }}></i>
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--gray-900)' }}>
                          {entry.proyecto?.cliente || 'Sin cliente'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '2px' }}>
                          {entry.sistema} {entry.proyecto?.obra ? `· ${entry.proyecto.obra}` : ''}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--gray-400)', marginTop: '2px' }}>
                          <i className="bi bi-calendar3" style={{ marginRight: '4px' }}></i>
                          {formatDate(entry.fecha)}
                          <span style={{ marginLeft: '10px' }}>
                            <i className="bi bi-layers" style={{ marginRight: '4px' }}></i>
                            {entry.results?.length || 0} hueco{(entry.results?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                        <button
                          className="btn-danger-sm"
                          onClick={() => handleDelete(entry.id)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>

                    {/* Color badge */}
                    {entry.proyecto?.color && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--gray-500)' }}>
                        <i className="bi bi-palette" style={{ marginRight: '4px' }}></i>
                        {entry.proyecto.color}
                        {entry.proyecto?.notas && (
                          <span style={{ marginLeft: '10px' }}>
                            <i className="bi bi-sticky" style={{ marginRight: '4px' }}></i>
                            {entry.proyecto.notas}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Detalle */}
            {selected && (
              <div className="card-modern" style={{ alignSelf: 'flex-start', position: 'sticky', top: '80px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Detalle</h3>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: 'var(--gray-500)' }}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {/* Info proyecto */}
                <div style={{ background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px', marginBottom: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
                    <div><span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>Cliente</span><div style={{ fontWeight: 600 }}>{selected.proyecto?.cliente}</div></div>
                    <div><span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>Obra</span><div style={{ fontWeight: 600 }}>{selected.proyecto?.obra || '—'}</div></div>
                    <div><span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>Color</span><div style={{ fontWeight: 600 }}>{selected.proyecto?.color || '—'}</div></div>
                    <div><span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>Sistema</span><div style={{ fontWeight: 600 }}>{selected.sistema}</div></div>
                  </div>
                  {selected.proyecto?.notas && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#92400e', background: '#fffbeb', padding: '5px 8px', borderRadius: '6px' }}>
                      <i className="bi bi-sticky" style={{ marginRight: '4px' }}></i>{selected.proyecto.notas}
                    </div>
                  )}
                </div>

                {/* Huecos */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: '8px' }}>
                    {selected.results?.length} hueco{selected.results?.length !== 1 ? 's' : ''}
                  </div>
                  {selected.results?.map((row, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '13px' }}>
                      <span style={{ fontWeight: 500 }}>{row.hueco}</span>
                      <span style={{ fontFamily: 'monospace', color: 'var(--gray-600)' }}>{row.ancho} × {row.alto}</span>
                      <span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>{row.hojas || row.tipo || '—'}</span>
                    </div>
                  ))}
                </div>

                {/* Materiales */}
                {selected.materiales && selected.materiales.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: '8px' }}>
                      Materiales
                    </div>
                    {selected.materiales.map((m, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--gray-100)', fontSize: '12px' }}>
                        <span>{m.perfil}</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{m.cantidad} uds</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '1rem', fontSize: '11px', color: 'var(--gray-400)', textAlign: 'center' }}>
                  Guardado el {formatDate(selected.fecha)}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal borrar todo */}
      {showDeleteAll && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowDeleteAll(false)}
        >
          <div
            style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', maxWidth: '340px', width: '100%', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <i className="bi bi-trash" style={{ fontSize: '1.4rem', color: '#ef4444' }}></i>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>¿Borrar todo el historial?</h3>
            <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Se eliminarán los {historial.length} desgloses guardados. Esta acción no se puede deshacer.
            </p>
            <button
              onClick={handleDeleteAll}
              style={{ width: '100%', padding: '11px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBottom: '0.75rem' }}
            >
              Sí, borrar todo
            </button>
            <button
              onClick={() => setShowDeleteAll(false)}
              style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--gray-300)', borderRadius: '10px', fontSize: '13px', color: 'var(--gray-600)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
