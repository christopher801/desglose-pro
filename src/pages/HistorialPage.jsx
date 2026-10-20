import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import {
  getHistorial,
  deleteDesglose
} from '../services/historialService'
import CroquisVidriosHistorial from '../components/historial/CroquisVidriosHistorial'
// CAMBIO: istwa croquis de barras
import {
  getCroquisHistorial,
  deleteCroquis,
  deleteAllCroquis
} from '../services/croquisHistorialService'
import { formatMeasurement } from '../utils/barras/barraUnits'

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

// CAMBIO: rezime yon croquis (barras, cortes, desperdicio, eficiencia)
function getCroquisSummary(entry) {
  const bars = entry?.result?.bars || []

  const totalBars = bars.length
  const totalCuts = bars.reduce((sum, bar) => sum + (bar.cuts?.length || 0), 0)
  const totalWaste = bars.reduce((sum, bar) => sum + (Number(bar.waste) || 0), 0)
  const totalUsed = bars.reduce((sum, bar) => sum + (Number(bar.usedLength) || 0), 0)
  const totalLength = bars.reduce((sum, bar) => sum + (Number(bar.barLength) || 0), 0)
  const efficiency = totalLength > 0 ? (totalUsed / totalLength) * 100 : 0
  const materials = [...new Set(bars.map((bar) => bar.material).filter(Boolean))]

  return { totalBars, totalCuts, totalWaste, efficiency, materials }
}

// Antre ki sòti nan Croquis de vidrios (GlassOptimizer)
const isVidrio = (entry) => entry?.tipo === 'croquis-vidrios'

export default function HistorialPage() {
  const navigate = useNavigate()

  const [historial, setHistorial] = useState([]) // desgloses (san vidrios)
  const [vidrios, setVidrios] = useState([]) // croquis de vidrios
  const [selected, setSelected] = useState(null)
  const [showDeleteAll, setShowDeleteAll] = useState(false)
  const [search, setSearch] = useState('')

  // CAMBIO: onglet + istwa croquis
  const [tab, setTab] = useState('desgloses')
  const [croquisHistorial, setCroquisHistorial] = useState([])
  const [selectedCroquis, setSelectedCroquis] = useState(null)

  const refreshHistorial = () => {
    const all = getHistorial()
    setHistorial(all.filter((e) => !isVidrio(e)))
    setVidrios(all.filter(isVidrio))
  }

  useEffect(() => {
    refreshHistorial()
    setCroquisHistorial(getCroquisHistorial())
  }, [])

  const handleTabChange = (nextTab) => {
    setTab(nextTab)
    setSearch('')
    setShowDeleteAll(false)
  }

  const handleDelete = (id) => {
    deleteDesglose(id)
    refreshHistorial()

    if (selected?.id === id) {
      setSelected(null)
    }
  }

  const handleDeleteVidrio = (id) => {
    deleteDesglose(id)
    refreshHistorial()
  }

  // CAMBIO
  const handleDeleteCroquis = (id) => {
    deleteCroquis(id)
    setCroquisHistorial(getCroquisHistorial())

    if (selectedCroquis?.id === id) {
      setSelectedCroquis(null)
    }
  }

  // CAMBIO: efase selon onglet ki aktif la
  const handleDeleteAll = () => {
    if (tab === 'croquis') {
      deleteAllCroquis()
      setCroquisHistorial([])
      setSelectedCroquis(null)
    } else if (tab === 'vidrios') {
      vidrios.forEach((e) => deleteDesglose(e.id))
      refreshHistorial()
    } else {
      historial.forEach((e) => deleteDesglose(e.id))
      refreshHistorial()
      setSelected(null)
    }

    setShowDeleteAll(false)
  }

  const filteredHistorial = historial.filter((entry) => {
    const q = search.toLowerCase().trim()

    return (
      (entry.proyecto?.cliente || '').toLowerCase().includes(q) ||
      (entry.proyecto?.obra || '').toLowerCase().includes(q) ||
      (entry.sistema || '').toLowerCase().includes(q)
    )
  })

  // CAMBIO: rechèch pou croquis (materyèl, etikèt, dat)
  const filteredCroquis = croquisHistorial.filter((entry) => {
    const q = search.toLowerCase().trim()
    if (!q) return true

    const bars = entry?.result?.bars || []
    const materials = bars.map((bar) => bar.material || '').join(' ')
    const labels = bars
      .flatMap((bar) => (bar.cuts || []).map((cut) => cut.label || ''))
      .join(' ')
    const date = new Date(entry.fecha).toLocaleDateString('es-DO')

    return `${materials} ${labels} ${date}`.toLowerCase().includes(q)
  })

  const formatDate = (iso) => {
    const d = new Date(iso)

    return (
      d.toLocaleDateString('es-DO') +
      ' ' +
      d.toLocaleTimeString('es-DO', {
        hour: '2-digit',
        minute: '2-digit'
      })
    )
  }

  /* =========================
     MATERIALES
  ========================= */

  const getMaterialName = (material) => {
    return (
      material?.material ||
      material?.perfil ||
      material?.nombre ||
      'Material'
    )
  }

  const getMaterialPieces = (material) => {
    return Number(
      material?.piezas ??
      material?.cantidad ??
      0
    )
  }

  const getMaterialFeet = (material) => {
    if (
      material?.pies === undefined ||
      material?.pies === null
    ) {
      return null
    }

    return Number(material.pies)
  }

  const getMaterialBars = (material) => {
    if (
      material?.barras === undefined ||
      material?.barras === null
    ) {
      return null
    }

    return Number(material.barras)
  }

  const hasNewMaterialFormat = (materials = []) => {
    return materials.some(
      (material) =>
        material?.material !== undefined ||
        material?.piezas !== undefined ||
        material?.pies !== undefined ||
        material?.barras !== undefined
    )
  }

  const formatNumber = (value, decimals = 2) => {
    const number = Number(value)

    if (!Number.isFinite(number)) {
      return '0'
    }

    return number.toLocaleString('es-DO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    })
  }

  const calculateMaterialTotals = (materials = []) => {
    return materials.reduce(
      (totals, material) => {
        totals.piezas += getMaterialPieces(material)

        const pies = getMaterialFeet(material)
        const barras = getMaterialBars(material)

        if (pies !== null) {
          totals.pies += pies
        }

        if (barras !== null) {
          totals.barras += barras
        }

        return totals
      },
      {
        piezas: 0,
        pies: 0,
        barras: 0
      }
    )
  }

  // CAMBIO: valè pou ensèsyon sou onglet aktif la
  const currentCount =
    tab === 'croquis'
      ? croquisHistorial.length
      : tab === 'vidrios'
      ? vidrios.length
      : historial.length

  return (
    <Layout>
      <div className="page-content historial-page">

        {/* =========================
            HEADER
        ========================= */}
        <div className="admin-header historial-header">
          <h1 className="page-title">
            <i
              className="bi bi-clock-history"
              style={{ marginRight: '8px' }}
            ></i>
            {tab === 'croquis'
              ? 'Historial de croquis'
              : tab === 'vidrios'
              ? 'Historial de vidrios'
              : 'Historial de desgloses'}
          </h1>

          {currentCount > 0 && (
            <button
              className="btn-danger-sm"
              onClick={() => setShowDeleteAll(true)}
            >
              <i
                className="bi bi-trash"
                style={{ marginRight: '6px' }}
              ></i>
              Borrar todo
            </button>
          )}
        </div>

        {/* =========================
            TABS (CAMBIO)
        ========================= */}
        <div className="historial-tabs">
          <button
            type="button"
            className={`historial-tab ${tab === 'desgloses' ? 'active' : ''}`}
            onClick={() => handleTabChange('desgloses')}
          >
            <i className="bi bi-layers" style={{ marginRight: '6px' }}></i>
            Desgloses
            <span className="historial-tab-count">{historial.length}</span>
          </button>

          <button
            type="button"
            className={`historial-tab ${tab === 'croquis' ? 'active' : ''}`}
            onClick={() => handleTabChange('croquis')}
          >
            <i className="bi bi-scissors" style={{ marginRight: '6px' }}></i>
            Croquis de barras
            <span className="historial-tab-count">{croquisHistorial.length}</span>
          </button>

          <button
            type="button"
            className={`historial-tab ${tab === 'vidrios' ? 'active' : ''}`}
            onClick={() => handleTabChange('vidrios')}
          >
            <i className="bi bi-grid-3x3-gap" style={{ marginRight: '6px' }}></i>
            Croquis de vidrios
            <span className="historial-tab-count">{vidrios.length}</span>
          </button>
        </div>

        {/* =========================
            SEARCH
        ========================= */}
        {currentCount > 0 && (
          <div
            style={{
              position: 'relative',
              marginBottom: '1rem',
              width: '100%'
            }}
          >
            <i
              className="bi bi-search"
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--gray-400)',
                fontSize: '14px',
                zIndex: 1
              }}
            ></i>

            <input
              type="text"
              className="auth-input"
              placeholder={
                tab === 'croquis'
                  ? 'Buscar por material, etiqueta o fecha...'
                  : tab === 'vidrios'
                  ? 'Buscar por cliente, obra o tipo de vidrio...'
                  : 'Buscar por cliente, obra o sistema...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: '32px',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {/* =====================================================
            TAB: DESGLOSES (sin cambios)
        ===================================================== */}
        {tab === 'desgloses' && (
          <>
            {/* =========================
                EMPTY STATE
            ========================= */}
            {historial.length === 0 ? (
              <div
                className="card-modern text-center"
                style={{
                  padding: '3rem',
                  color: 'var(--gray-500)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <i
                  className="bi bi-clock-history"
                  style={{
                    fontSize: '3rem',
                    display: 'block',
                    marginBottom: '1rem',
                    color: 'var(--gray-300)'
                  }}
                ></i>

                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: '0.5rem'
                  }}
                >
                  No hay desgloses guardados
                </div>

                <div style={{ fontSize: '13px' }}>
                  Los desgloses que guardes aparecerán aquí
                </div>

                <button
                  className="btn-primary-sm"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => navigate('/desglose')}
                >
                  <i
                    className="bi bi-plus-circle"
                    style={{ marginRight: '6px' }}
                  ></i>
                  Nuevo desglose
                </button>
              </div>
            ) : (
              <>
                {/* =========================
                    MAIN RESPONSIVE LAYOUT
                ========================= */}
                <div
                  className={`historial-layout ${
                    selected ? 'has-detail' : ''
                  }`}
                >

                  {/* =========================
                      LISTA
                  ========================= */}
                  <div className="historial-list">

                    {filteredHistorial.length === 0 ? (
                      <div
                        className="card-modern text-center"
                        style={{
                          padding: '2rem',
                          color: 'var(--gray-500)'
                        }}
                      >
                        No se encontraron resultados para "{search}"
                      </div>
                    ) : (
                      filteredHistorial.map((entry) => (
                        <div
                          key={entry.id}
                          className="card-modern historial-entry"
                          style={{
                            cursor: 'pointer',
                            border:
                              selected?.id === entry.id
                                ? '2px solid var(--primary)'
                                : '1px solid var(--gray-200)',
                            transition: 'all 0.15s',
                            minWidth: 0,
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                          }}
                          onClick={() => setSelected(entry)}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              minWidth: 0
                            }}
                          >

                            {/* Icon */}
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '10px',
                                flexShrink: 0,
                                background:
                                  SISTEMA_COLORS[entry.sistema] ||
                                  '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <i
                                className={`bi ${
                                  SISTEMA_ICONS[entry.sistema] ||
                                  'bi-layers'
                                }`}
                                style={{
                                  fontSize: '18px',
                                  color: 'var(--primary)'
                                }}
                              ></i>
                            </div>

                            {/* Info */}
                            <div
                              style={{
                                flex: 1,
                                minWidth: 0,
                                overflow: 'hidden'
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: '14px',
                                  color: 'var(--gray-900)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {entry.proyecto?.cliente ||
                                  'Sin cliente'}
                              </div>

                              <div
                                style={{
                                  fontSize: '12px',
                                  color: 'var(--gray-500)',
                                  marginTop: '2px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {entry.sistema}

                                {entry.proyecto?.obra
                                  ? ` · ${entry.proyecto.obra}`
                                  : ''}
                              </div>

                              <div
                                style={{
                                  fontSize: '11px',
                                  color: 'var(--gray-400)',
                                  marginTop: '2px'
                                }}
                              >
                                <i
                                  className="bi bi-calendar3"
                                  style={{
                                    marginRight: '4px'
                                  }}
                                ></i>

                                {formatDate(entry.fecha)}

                                <span
                                  style={{
                                    marginLeft: '10px'
                                  }}
                                >
                                  <i
                                    className="bi bi-layers"
                                    style={{
                                      marginRight: '4px'
                                    }}
                                  ></i>

                                  {entry.results?.length || 0}{' '}
                                  hueco
                                  {(entry.results?.length || 0) !== 1
                                    ? 's'
                                    : ''}
                                </span>
                              </div>
                            </div>

                            {/* Delete */}
                            <div
                              style={{
                                display: 'flex',
                                gap: '6px',
                                flexShrink: 0
                              }}
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                            >
                              <button
                                className="btn-danger-sm"
                                onClick={() =>
                                  handleDelete(entry.id)
                                }
                                title="Eliminar"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>

                          {/* Extra project info */}
                          {(entry.proyecto?.color ||
                            entry.proyecto?.notas) && (
                            <div
                              style={{
                                marginTop: '8px',
                                fontSize: '11px',
                                color: 'var(--gray-500)',
                                overflow: 'hidden'
                              }}
                            >
                              {entry.proyecto?.color && (
                                <>
                                  <i
                                    className="bi bi-palette"
                                    style={{
                                      marginRight: '4px'
                                    }}
                                  ></i>

                                  {entry.proyecto.color}
                                </>
                              )}

                              {entry.proyecto?.notas && (
                                <span
                                  style={{
                                    marginLeft: '10px'
                                  }}
                                >
                                  <i
                                    className="bi bi-sticky"
                                    style={{
                                      marginRight: '4px'
                                    }}
                                  ></i>

                                  {entry.proyecto.notas}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))
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
                        position: 'relative'
                      }}
                    >

                      {/* Detail header */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '1rem'
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: 700
                          }}
                        >
                          Detalle
                        </h3>

                        <button
                          onClick={() => setSelected(null)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            color: 'var(--gray-500)',
                            flexShrink: 0
                          }}
                          title="Cerrar detalle"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>

                      {/* =========================
                          PROJECT INFO
                      ========================= */}
                      <div
                        style={{
                          background: '#f0f9ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '10px',
                          padding: '12px',
                          marginBottom: '1rem',
                          boxSizing: 'border-box',
                          width: '100%'
                        }}
                      >
                        <div
                          className="historial-project-info"
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(2, minmax(0, 1fr))',
                            gap: '8px',
                            fontSize: '13px'
                          }}
                        >
                          <div>
                            <span
                              style={{
                                color: 'var(--gray-500)',
                                fontSize: '11px'
                              }}
                            >
                              Cliente
                            </span>

                            <div
                              style={{
                                fontWeight: 600,
                                overflowWrap: 'anywhere'
                              }}
                            >
                              {selected.proyecto?.cliente ||
                                '—'}
                            </div>
                          </div>

                          <div>
                            <span
                              style={{
                                color: 'var(--gray-500)',
                                fontSize: '11px'
                              }}
                            >
                              Obra
                            </span>

                            <div
                              style={{
                                fontWeight: 600,
                                overflowWrap: 'anywhere'
                              }}
                            >
                              {selected.proyecto?.obra ||
                                '—'}
                            </div>
                          </div>

                          <div>
                            <span
                              style={{
                                color: 'var(--gray-500)',
                                fontSize: '11px'
                              }}
                            >
                              Color
                            </span>

                            <div
                              style={{
                                fontWeight: 600,
                                overflowWrap: 'anywhere'
                              }}
                            >
                              {selected.proyecto?.color ||
                                '—'}
                            </div>
                          </div>

                          <div>
                            <span
                              style={{
                                color: 'var(--gray-500)',
                                fontSize: '11px'
                              }}
                            >
                              Sistema
                            </span>

                            <div
                              style={{
                                fontWeight: 600,
                                overflowWrap: 'anywhere'
                              }}
                            >
                              {selected.sistema}
                            </div>
                          </div>
                        </div>

                        {selected.proyecto?.notas && (
                          <div
                            style={{
                              marginTop: '8px',
                              fontSize: '12px',
                              color: '#92400e',
                              background: '#fffbeb',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              overflowWrap: 'anywhere'
                            }}
                          >
                            <i
                              className="bi bi-sticky"
                              style={{
                                marginRight: '4px'
                              }}
                            ></i>

                            {selected.proyecto.notas}
                          </div>
                        )}
                      </div>

                      {/* =========================
                          HUECOS
                      ========================= */}
                      <div
                        style={{
                          marginBottom: '1.25rem',
                          minWidth: 0
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'var(--gray-500)',
                            marginBottom: '8px'
                          }}
                        >
                          {selected.results?.length || 0}{' '}
                          hueco
                          {(selected.results?.length || 0) !== 1
                            ? 's'
                            : ''}
                        </div>

                        {selected.results?.map((row, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'minmax(0, 1fr) auto auto',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '7px 0',
                              borderBottom:
                                '1px solid var(--gray-100)',
                              fontSize: '13px',
                              minWidth: 0
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 500,
                                minWidth: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {row.hueco}
                            </span>

                            <span
                              style={{
                                fontFamily: 'monospace',
                                color: 'var(--gray-600)',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {row.ancho} × {row.alto}
                            </span>

                            <span
                              style={{
                                color: 'var(--gray-500)',
                                fontSize: '11px',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {row.hojas ||
                                row.tipo ||
                                '—'}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* =========================
                          MATERIALES
                      ========================= */}
                      {selected.materiales &&
                        selected.materiales.length > 0 && (
                          <div
                            style={{
                              width: '100%',
                              minWidth: 0
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '10px',
                                marginBottom: '8px'
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                  color: 'var(--gray-500)'
                                }}
                              >
                                <i
                                  className="bi bi-box-seam"
                                  style={{
                                    marginRight: '5px'
                                  }}
                                ></i>

                                Materiales
                              </div>

                              <span
                                style={{
                                  fontSize: '10px',
                                  color: 'var(--gray-400)',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {selected.materiales.length}{' '}
                                tipos
                              </span>
                            </div>

                            {/* Scroll SOLO del table */}
                            <div
                              style={{
                                width: '100%',
                                maxWidth: '100%',
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                WebkitOverflowScrolling: 'touch',
                                border:
                                  '1px solid var(--gray-200)',
                                borderRadius: '10px',
                                background: '#fff'
                              }}
                            >
                              <div
                                style={{
                                  minWidth: '380px'
                                }}
                              >

                                {/* Table header */}
                                <div
                                  style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                      'minmax(150px, 1fr) 60px 70px 70px',
                                    gap: '4px',
                                    padding: '8px 10px',
                                    background: '#f8fafc',
                                    borderBottom:
                                      '1px solid var(--gray-200)',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: 'var(--gray-500)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.03em'
                                  }}
                                >
                                  <span>Material</span>

                                  <span
                                    style={{
                                      textAlign: 'center'
                                    }}
                                  >
                                    Piezas
                                  </span>

                                  <span
                                    style={{
                                      textAlign: 'center'
                                    }}
                                  >
                                    Pies
                                  </span>

                                  <span
                                    style={{
                                      textAlign: 'center'
                                    }}
                                  >
                                    Barras
                                  </span>
                                </div>

                                {/* Material rows */}
                                {selected.materiales.map(
                                  (material, idx) => {
                                    const pieces =
                                      getMaterialPieces(
                                        material
                                      )

                                    const feet =
                                      getMaterialFeet(
                                        material
                                      )

                                    const bars =
                                      getMaterialBars(
                                        material
                                      )

                                    return (
                                      <div
                                        key={idx}
                                        style={{
                                          display: 'grid',
                                          gridTemplateColumns:
                                            'minmax(150px, 1fr) 60px 70px 70px',
                                          gap: '4px',
                                          alignItems: 'center',
                                          padding:
                                            '9px 10px',
                                          borderBottom:
                                            idx ===
                                            selected.materiales
                                              .length -
                                              1
                                              ? 'none'
                                              : '1px solid var(--gray-100)',
                                          fontSize: '11px'
                                        }}
                                      >
                                        {/* Material */}
                                        <span
                                          style={{
                                            fontWeight: 600,
                                            color:
                                              'var(--gray-800)',
                                            lineHeight: 1.3,
                                            overflowWrap:
                                              'anywhere'
                                          }}
                                        >
                                          {getMaterialName(
                                            material
                                          )}
                                        </span>

                                        {/* Piezas */}
                                        <span
                                          style={{
                                            textAlign:
                                              'center',
                                            fontWeight: 700,
                                            color:
                                              'var(--primary)'
                                          }}
                                        >
                                          {formatNumber(
                                            pieces,
                                            0
                                          )}
                                        </span>

                                        {/* Pies */}
                                        <span
                                          style={{
                                            textAlign:
                                              'center',
                                            color:
                                              'var(--gray-600)',
                                            fontFamily:
                                              'monospace'
                                          }}
                                        >
                                          {feet !== null
                                            ? `${formatNumber(
                                                feet,
                                                2
                                              )}'`
                                            : '—'}
                                        </span>

                                        {/* Barras */}
                                        <span
                                          style={{
                                            textAlign:
                                              'center'
                                          }}
                                        >
                                          {bars !== null ? (
                                            <span
                                              style={{
                                                display:
                                                  'inline-flex',
                                                alignItems:
                                                  'center',
                                                justifyContent:
                                                  'center',
                                                minWidth:
                                                  '28px',
                                                padding:
                                                  '3px 6px',
                                                borderRadius:
                                                  '5px',
                                                background:
                                                  '#eff6ff',
                                                color:
                                                  '#1d4ed8',
                                                fontWeight: 700,
                                                fontSize:
                                                  '10px'
                                              }}
                                            >
                                              {formatNumber(
                                                bars,
                                                0
                                              )}
                                            </span>
                                          ) : (
                                            '—'
                                          )}
                                        </span>
                                      </div>
                                    )
                                  }
                                )}

                                {/* Totals */}
                                {hasNewMaterialFormat(
                                  selected.materiales
                                ) && (
                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns:
                                        'minmax(150px, 1fr) 60px 70px 70px',
                                      gap: '4px',
                                      alignItems: 'center',
                                      padding:
                                        '9px 10px',
                                      background:
                                        '#f8fafc',
                                      borderTop:
                                        '1px solid var(--gray-200)',
                                      fontSize: '11px',
                                      fontWeight: 700
                                    }}
                                  >
                                    <span
                                      style={{
                                        color:
                                          'var(--gray-700)'
                                      }}
                                    >
                                      TOTAL
                                    </span>

                                    {(() => {
                                      const totals =
                                        calculateMaterialTotals(
                                          selected.materiales
                                        )

                                      return (
                                        <>
                                          <span
                                            style={{
                                              textAlign:
                                                'center',
                                              color:
                                                'var(--primary)'
                                            }}
                                          >
                                            {formatNumber(
                                              totals.piezas,
                                              0
                                            )}
                                          </span>

                                          <span
                                            style={{
                                              textAlign:
                                                'center',
                                              fontFamily:
                                                'monospace',
                                              color:
                                                'var(--gray-700)'
                                            }}
                                          >
                                            {formatNumber(
                                              totals.pies,
                                              2
                                            )}'
                                          </span>

                                          <span
                                            style={{
                                              textAlign:
                                                'center',
                                              color:
                                                'var(--gray-700)'
                                            }}
                                          >
                                            {formatNumber(
                                              totals.barras,
                                              0
                                            )}
                                          </span>
                                        </>
                                      )
                                    })()}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Material info */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '6px',
                                marginTop: '8px',
                                padding: '7px 9px',
                                background: '#f8fafc',
                                borderRadius: '7px',
                                fontSize: '10px',
                                color: 'var(--gray-500)',
                                lineHeight: 1.4
                              }}
                            >
                              <i
                                className="bi bi-info-circle"
                                style={{
                                  color:
                                    'var(--gray-400)',
                                  flexShrink: 0
                                }}
                              ></i>

                              <span>
                                {hasNewMaterialFormat(
                                  selected.materiales
                                )
                                  ? 'Materiales agrupados y calculados utilizando barras de 21 pies (252").'
                                  : 'Materiales guardados con el formato anterior.'}
                              </span>
                            </div>
                          </div>
                        )}

                      {/* No materials */}
                      {(!selected.materiales ||
                        selected.materiales.length === 0) && (
                        <div
                          style={{
                            padding: '12px',
                            borderRadius: '9px',
                            background: '#f8fafc',
                            border:
                              '1px solid var(--gray-200)',
                            color: 'var(--gray-400)',
                            fontSize: '11px',
                            textAlign: 'center'
                          }}
                        >
                          <i
                            className="bi bi-box-seam"
                            style={{
                              fontSize: '16px',
                              display: 'block',
                              marginBottom: '4px'
                            }}
                          ></i>

                          No hay materiales registrados
                          para este desglose.
                        </div>
                      )}

                      {/* Footer */}
                      <div
                        style={{
                          marginTop: '1rem',
                          fontSize: '11px',
                          color: 'var(--gray-400)',
                          textAlign: 'center'
                        }}
                      >
                        Guardado el{' '}
                        {formatDate(selected.fecha)}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* =====================================================
            TAB: CROQUIS DE BARRAS (CAMBIO: nouvo)
        ===================================================== */}
        {tab === 'croquis' && (
          <>
            {croquisHistorial.length === 0 ? (
              <div
                className="card-modern text-center"
                style={{
                  padding: '3rem',
                  color: 'var(--gray-500)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <i
                  className="bi bi-scissors"
                  style={{
                    fontSize: '3rem',
                    display: 'block',
                    marginBottom: '1rem',
                    color: 'var(--gray-300)'
                  }}
                ></i>

                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                  No hay croquis guardados
                </div>

                <div style={{ fontSize: '13px' }}>
                  Los croquis que guardes aparecerán aquí
                </div>
              </div>
            ) : (
              <div
                className={`historial-layout ${
                  selectedCroquis ? 'has-detail' : ''
                }`}
              >
                {/* =========================
                    LISTA CROQUIS
                ========================= */}
                <div className="historial-list">
                  {filteredCroquis.length === 0 ? (
                    <div
                      className="card-modern text-center"
                      style={{ padding: '2rem', color: 'var(--gray-500)' }}
                    >
                      No se encontraron resultados para "{search}"
                    </div>
                  ) : (
                    filteredCroquis.map((entry) => {
                      const summary = getCroquisSummary(entry)
                      const entryUnit = entry.unit || 'in'

                      return (
                        <div
                          key={entry.id}
                          className="card-modern historial-entry"
                          style={{
                            cursor: 'pointer',
                            border:
                              selectedCroquis?.id === entry.id
                                ? '2px solid var(--primary)'
                                : '1px solid var(--gray-200)',
                            transition: 'all 0.15s',
                            minWidth: 0,
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                          }}
                          onClick={() => setSelectedCroquis(entry)}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              minWidth: 0
                            }}
                          >
                            {/* Icon */}
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '10px',
                                flexShrink: 0,
                                background: '#eff6ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <i
                                className="bi bi-scissors"
                                style={{
                                  fontSize: '18px',
                                  color: 'var(--primary)'
                                }}
                              ></i>
                            </div>

                            {/* Info */}
                            <div
                              style={{
                                flex: 1,
                                minWidth: 0,
                                overflow: 'hidden'
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: '14px',
                                  color: 'var(--gray-900)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {summary.totalBars} barra
                                {summary.totalBars !== 1 ? 's' : ''} ·{' '}
                                {summary.totalCuts} corte
                                {summary.totalCuts !== 1 ? 's' : ''}
                              </div>

                              <div
                                style={{
                                  fontSize: '12px',
                                  color: 'var(--gray-500)',
                                  marginTop: '2px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {summary.materials.length > 0
                                  ? summary.materials.join(', ')
                                  : 'Sin material'}
                                {' · '}
                                Barra: {formatMeasurement(entry.barLength, entryUnit)}
                              </div>

                              <div
                                style={{
                                  fontSize: '11px',
                                  color: 'var(--gray-400)',
                                  marginTop: '2px'
                                }}
                              >
                                <i
                                  className="bi bi-calendar3"
                                  style={{ marginRight: '4px' }}
                                ></i>

                                {formatDate(entry.fecha)}

                                <span style={{ marginLeft: '10px' }}>
                                  <i
                                    className="bi bi-graph-up"
                                    style={{ marginRight: '4px' }}
                                  ></i>
                                  {formatNumber(summary.efficiency, 1)}%
                                </span>
                              </div>
                            </div>

                            {/* Delete */}
                            <div
                              style={{
                                display: 'flex',
                                gap: '6px',
                                flexShrink: 0
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="btn-danger-sm"
                                onClick={() => handleDeleteCroquis(entry.id)}
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
                    DETALLE CROQUIS
                ========================= */}
                {selectedCroquis && (() => {
                  const summary = getCroquisSummary(selectedCroquis)
                  const entryUnit = selectedCroquis.unit || 'in'
                  const bars = selectedCroquis.result?.bars || []

                  return (
                    <div
                      className="card-modern historial-detail"
                      style={{
                        alignSelf: 'flex-start',
                        width: '100%',
                        minWidth: 0,
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        position: 'relative'
                      }}
                    >
                      {/* Header */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '1rem'
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '1rem',
                            fontWeight: 700
                          }}
                        >
                          Detalle del croquis
                        </h3>

                        <button
                          onClick={() => setSelectedCroquis(null)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            color: 'var(--gray-500)',
                            flexShrink: 0
                          }}
                          title="Cerrar detalle"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>

                      {/* Resumen */}
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
                          boxSizing: 'border-box'
                        }}
                      >
                        <div>
                          <span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>
                            Barras
                          </span>
                          <div style={{ fontWeight: 600 }}>{summary.totalBars}</div>
                        </div>

                        <div>
                          <span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>
                            Cortes
                          </span>
                          <div style={{ fontWeight: 600 }}>{summary.totalCuts}</div>
                        </div>

                        <div>
                          <span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>
                            Desperdicio total
                          </span>
                          <div style={{ fontWeight: 600 }}>
                            {formatMeasurement(summary.totalWaste, entryUnit)}
                          </div>
                        </div>

                        <div>
                          <span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>
                            Eficiencia
                          </span>
                          <div style={{ fontWeight: 600, color: 'var(--primary)' }}>
                            {formatNumber(summary.efficiency, 1)}%
                          </div>
                        </div>

                        <div>
                          <span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>
                            Largo de barra
                          </span>
                          <div style={{ fontWeight: 600 }}>
                            {formatMeasurement(selectedCroquis.barLength, entryUnit)}
                          </div>
                        </div>

                        <div>
                          <span style={{ color: 'var(--gray-500)', fontSize: '11px' }}>
                            Sierra
                          </span>
                          <div style={{ fontWeight: 600 }}>
                            {formatMeasurement(selectedCroquis.saw, entryUnit)}
                          </div>
                        </div>
                      </div>

                      {/* Barras */}
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--gray-500)',
                          marginBottom: '8px'
                        }}
                      >
                        <i className="bi bi-layout-text-sidebar-reverse" style={{ marginRight: '5px' }}></i>
                        Distribución por barra
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {bars.map((bar, index) => (
                          <div key={bar.id || index} style={{ minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                marginBottom: '6px',
                                fontSize: '12px'
                              }}
                            >
                              <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>
                                Barra {index + 1}
                                {bar.material && (
                                  <span
                                    style={{
                                      marginLeft: '8px',
                                      fontWeight: 500,
                                      fontSize: '10px',
                                      color: 'var(--gray-500)',
                                      background: 'var(--gray-100)',
                                      padding: '2px 8px',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    {bar.material}
                                  </span>
                                )}
                              </span>

                              <span style={{ fontSize: '10px', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
                                Desp.: {formatMeasurement(bar.waste, entryUnit)}
                              </span>
                            </div>

                            {/* Mini barra visual */}
                            <div
                              style={{
                                display: 'flex',
                                height: '22px',
                                borderRadius: '5px',
                                overflow: 'hidden',
                                background: 'var(--gray-100)'
                              }}
                            >
                              {(bar.cuts || []).map((cut, cutIndex) => {
                                const pct =
                                  bar.barLength > 0
                                    ? Math.min(
                                        (Number(cut.lengthWithSaw ?? cut.length) / bar.barLength) * 100,
                                        100
                                      )
                                    : 0

                                return (
                                  <div
                                    key={cut.instanceId || cutIndex}
                                    title={`${cut.label} — ${formatMeasurement(cut.length, entryUnit)}`}
                                    style={{
                                      width: `${pct}%`,
                                      background: 'var(--primary)',
                                      borderRight: '1px solid rgba(255,255,255,0.6)'
                                    }}
                                  />
                                )
                              })}
                            </div>

                            {/* Lista de cortes */}
                            <div
                              style={{
                                marginTop: '6px',
                                fontSize: '11px',
                                color: 'var(--gray-600)',
                                lineHeight: 1.5,
                                overflowWrap: 'anywhere'
                              }}
                            >
                              {(bar.cuts || []).map((cut, cutIndex) => (
                                <span key={cut.instanceId || cutIndex}>
                                  {cutIndex > 0 && ' · '}
                                  {cut.label}{' '}
                                  <strong>{formatMeasurement(cut.length, entryUnit)}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div
                        style={{
                          marginTop: '1rem',
                          fontSize: '11px',
                          color: 'var(--gray-400)',
                          textAlign: 'center'
                        }}
                      >
                        Guardado el {formatDate(selectedCroquis.fecha)}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </>
        )}

        {tab === 'vidrios' && (
          <CroquisVidriosHistorial
            entries={vidrios}
            search={search}
            onDelete={handleDeleteVidrio}
          />
        )}
      </div>

      {/* =========================
          MODAL BORRAR TODO
      ========================= */}
      {showDeleteAll && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setShowDeleteAll(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <i
                className="bi bi-trash"
                style={{
                  fontSize: '1.4rem',
                  color: '#ef4444'
                }}
              ></i>
            </div>

            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}
            >
              {tab === 'croquis'
                ? '¿Borrar todos los croquis?'
                : tab === 'vidrios'
                ? '¿Borrar todos los croquis de vidrios?'
                : '¿Borrar todo el historial?'}
            </h3>

            <p
              style={{
                fontSize: '13px',
                color: 'var(--gray-500)',
                marginBottom: '1.5rem',
                lineHeight: 1.6
              }}
            >
              Se eliminarán los{' '}
              {currentCount}{' '}
              {tab === 'croquis' ? 'croquis' : tab === 'vidrios' ? 'croquis de vidrios' : 'desgloses'}{' '}
              guardados. Esta acción no se puede
              deshacer.
            </p>

            <button
              onClick={handleDeleteAll}
              style={{
                width: '100%',
                padding: '11px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '0.75rem'
              }}
            >
              Sí, borrar todo
            </button>

            <button
              onClick={() =>
                setShowDeleteAll(false)
              }
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border:
                  '1px solid var(--gray-300)',
                borderRadius: '10px',
                fontSize: '13px',
                color: 'var(--gray-600)',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* =========================
          RESPONSIVE CSS
      ========================= */}
      <style>{`
        .historial-page {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* CAMBIO: onglets */
        .historial-tabs {
          display: flex;
          gap: 6px;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--gray-200);
          overflow-x: auto;
        }

        .historial-tab {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          padding: 10px 14px;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: var(--gray-500);
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          margin-bottom: -1px;
        }

        .historial-tab:hover {
          color: var(--gray-800);
        }

        .historial-tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .historial-tab-count {
          margin-left: 6px;
          padding: 1px 7px;
          border-radius: 10px;
          background: var(--gray-100);
          color: var(--gray-600);
          font-size: 10px;
          font-weight: 700;
        }

        .historial-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1rem;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .historial-layout > * {
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }

        .historial-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          min-width: 0;
          max-width: 100%;
        }

        .historial-detail {
          width: 100%;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
        }

        @media (min-width: 900px) {
          .historial-layout.has-detail {
            grid-template-columns:
              minmax(0, 1fr)
              minmax(0, 1fr);
          }

          .historial-detail {
            position: sticky !important;
            top: 80px;
          }
        }

        @media (max-width: 899px) {
          .historial-layout {
            grid-template-columns:
              minmax(0, 1fr);
          }

          .historial-detail {
            position: relative !important;
            top: auto !important;
          }
        }

        @media (max-width: 576px) {
          .historial-header {
            gap: 10px;
          }

          .historial-header .page-title {
            font-size: 1.05rem;
          }

          .historial-entry {
            padding: 12px !important;
          }

          .historial-project-info {
            grid-template-columns:
              minmax(0, 1fr) !important;
          }

          .historial-detail {
            padding: 14px !important;
            border-radius: 12px;
          }

          .historial-entry .btn-danger-sm {
            width: 34px;
            height: 34px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        @media (max-width: 380px) {
          .historial-header {
            align-items: flex-start;
          }

          .historial-header .page-title {
            font-size: 0.95rem;
          }

          .historial-header .btn-danger-sm {
            font-size: 11px;
            padding: 7px 9px;
          }

          .historial-entry {
            padding: 10px !important;
          }

          .historial-entry > div:first-child {
            gap: 8px !important;
          }

          .historial-entry > div:first-child > div:first-child {
            width: 36px !important;
            height: 36px !important;
          }

          .historial-entry > div:first-child > div:first-child i {
            font-size: 16px !important;
          }
        }
      `}</style>
    </Layout>
  )
}