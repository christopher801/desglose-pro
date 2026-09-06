import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import FractionUtils from '../../utils/fraction'
import ProyectoModal from './components/ProyectoModal'
import MaterialPuertaP40 from './components/MaterialPuertaP40'
import { saveDesglose } from '../../services/historialService'

import {
  calcularResumenMaterialesPuertaP40,
  calcularTotalesMaterialesPuertaP40
} from '../../utils/puertaP40Materials'

const calcular = (ancho, alto) => ({
  cabMarco: ancho - (1 / 8),
  latMarco: alto - (1 / 8),
  cabezal: ancho - (3 + 3 / 4),
  alfeizar: ancho - (8 + 15 / 16),
  jambas: alto - 2,
  vidrioAncho: ancho - (9 + 1 / 4),
  vidrioAlto: alto - (8 + 1 / 8)
})

const buildPrintHtml = (proyecto, results) => {
  const date = new Date().toLocaleDateString('es-DO')

  const materiales =
    calcularResumenMaterialesPuertaP40(results)

  const totales =
    calcularTotalesMaterialesPuertaP40(materiales)

  const rows = results
    .map(
      (row) => `
        <tr>
          <td>${row.hueco || '—'}</td>
          <td>${row.ancho}</td>
          <td>${row.alto}</td>
          <td>${row.cabMarco}</td>
          <td>${row.latMarco}</td>
          <td>${row.cabezal}</td>
          <td>${row.alfeizar}</td>
          <td>${row.jambas}</td>
          <td>${row.vidrioAncho}</td>
          <td>${row.vidrioAlto}</td>
        </tr>
      `
    )
    .join('')

  const materialRows = materiales
    .map(
      (item) => `
        <tr>
          <td style="text-align:left;font-family:Arial,Helvetica,sans-serif;">
            ${item.material}
          </td>
          <td>${item.piezas}</td>
          <td>${item.pies.toFixed(2)}</td>
          <td>
            <span class="barra-badge">
              ${item.barras}
            </span>
          </td>
        </tr>
      `
    )
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <title>PUERTA P40</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: .5in;
      background: white;
      color: #1e293b;
    }

    h1 {
      font-size: 18px;
      text-align: center;
      color: #1e2b3c;
      margin: 0 0 4px;
    }

    h2 {
      font-size: 11px;
      text-align: center;
      color: #64748b;
      font-weight: 400;
      margin: 0 0 14px;
    }

    h3 {
      font-size: 13px;
      color: #1e2b3c;
      margin: 20px 0 8px;
      border-bottom: 2px solid #1e2b3c;
      padding-bottom: 5px;
    }

    .info {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      font-size: 11px;
      margin-bottom: 14px;
      background: #f8f9fa;
      padding: 9px 10px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-bottom: 16px;
    }

    th {
      background: #1e2b3c;
      color: white;
      padding: 6px 5px;
      border: 1px solid #2c3e50;
      text-align: center;
      font-weight: 700;
    }

    th[colspan] {
      background: #2c3e50;
    }

    td {
      padding: 5px;
      border: 1px solid #cbd5e1;
      text-align: center;
      font-family: monospace;
    }

    tr:nth-child(even) td {
      background: #f8f9fa;
    }

    .material-section {
      margin-top: 24px;
      page-break-inside: avoid;
    }

    .material-info {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 10px;
      font-size: 10px;
      color: #64748b;
      margin-bottom: 8px;
    }

    .material-table {
      margin-bottom: 10px;
    }

    .material-table td {
      font-family: Arial, Helvetica, sans-serif;
    }

    .barra-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      padding: 3px 7px;
      border-radius: 5px;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 700;
    }

    .total-row td {
      background: #e2e8f0 !important;
      font-weight: 700;
      color: #0f172a;
    }

    .summary {
      display: flex;
      gap: 10px;
      margin-top: 10px;
      margin-bottom: 16px;
    }

    .summary-box {
      flex: 1;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 8px;
      text-align: center;
    }

    .summary-label {
      font-size: 9px;
      color: #64748b;
      margin-bottom: 3px;
    }

    .summary-value {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
    }

    .footer {
      margin-top: 24px;
      font-size: 9px;
      color: #888;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #ddd;
      padding-top: 6px;
    }

    @media print {
      body {
        margin: .4in;
      }

      th,
      .barra-badge {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .material-section {
        page-break-inside: avoid;
      }

      table {
        page-break-inside: auto;
      }

      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    }
  </style>
</head>

<body>

  <h1>PUERTA P40</h1>
  <h2>SISTEMA PROFESIONAL DE CÁLCULO</h2>

  <div class="info">
    <span>
      <strong>Cliente:</strong>
      ${proyecto?.cliente || '—'}
    </span>

    <span>
      <strong>Obra:</strong>
      ${proyecto?.obra || '—'}
    </span>

    <span>
      <strong>Color:</strong>
      ${proyecto?.color || '—'}
    </span>
  </div>

  <h3>MEDIDAS Y CORTES</h3>

  <table>
    <thead>
      <tr>
        <th rowspan="2">Hueco</th>
        <th rowspan="2">Ancho</th>
        <th rowspan="2">Alto</th>

        <th colspan="2">Marco</th>
        <th colspan="3">Hoja</th>
        <th colspan="2">Vidrio</th>
      </tr>

      <tr>
        <th>Cab-marco</th>
        <th>Lat-marco</th>

        <th>Cabezal</th>
        <th>Alféizar</th>
        <th>Jambas</th>

        <th>Ancho</th>
        <th>Alto</th>
      </tr>
    </thead>

    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="material-section">

    <h3>MATERIALES PUERTA P-40</h3>

    <div class="material-info">
      Material calculado para todas las medidas agregadas.
      <strong style="float:right;">
        Barra: 21 pies (252")
      </strong>
    </div>

    <table class="material-table">
      <thead>
        <tr>
          <th>Material</th>
          <th>Piezas</th>
          <th>Pies</th>
          <th>Barras</th>
        </tr>
      </thead>

      <tbody>
        ${materialRows}
      </tbody>

      <tfoot>
        <tr class="total-row">
          <td style="text-align:left;">
            TOTAL
          </td>

          <td>
            ${totales.piezas}
          </td>

          <td>
            ${totales.pies.toFixed(2)}
          </td>

          <td>
            ${totales.barras}
          </td>
        </tr>
      </tfoot>
    </table>

    <div class="summary">

      <div class="summary-box">
        <div class="summary-label">
          TOTAL PIEZAS
        </div>

        <div class="summary-value">
          ${totales.piezas}
        </div>
      </div>

      <div class="summary-box">
        <div class="summary-label">
          TOTAL PIES
        </div>

        <div class="summary-value">
          ${totales.pies.toFixed(2)}
        </div>
      </div>

      <div class="summary-box">
        <div class="summary-label">
          TOTAL BARRAS
        </div>

        <div class="summary-value">
          ${totales.barras}
        </div>
      </div>

    </div>

  </div>

  <div class="footer">
    <span>© 2026 - Desglose Pro</span>
    <span>${date}</span>
  </div>

</body>
</html>
`
}

export default function NuevoPuertaP40() {
  const navigate = useNavigate()

  const [step, setStep] = useState('proyecto')

  const [proyecto, setProyecto] = useState(null)

  const [form, setForm] = useState({
    hueco: '',
    ancho: '',
    alto: ''
  })

  const [results, setResults] = useState([])

  const [error, setError] = useState('')

  const [savedMsg, setSavedMsg] = useState('')

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleAdd = () => {
    setError('')

    if (!form.ancho || !form.alto) {
      setError('❌ Ingresa ANCHO y ALTO')
      return
    }

    const anchoDec =
      FractionUtils.parseFraction(form.ancho)

    const altoDec =
      FractionUtils.parseFraction(form.alto)

    if (
      anchoDec <= 0 ||
      altoDec <= 0
    ) {
      setError(
        '❌ Las medidas deben ser mayores a 0'
      )
      return
    }

    const calc =
      calcular(
        anchoDec,
        altoDec
      )

    setResults([
      ...results,
      {
        id: Date.now(),

        hueco:
          form.hueco ||
          `H-${results.length + 1}`,

        ancho: form.ancho,
        alto: form.alto,

        // Valores numéricos para el cálculo de materiales
        anchoDec,
        altoDec,
        hojasNum: 1,

        cabMarco:
          FractionUtils.toSixteenths(
            calc.cabMarco
          ),

        latMarco:
          FractionUtils.toSixteenths(
            calc.latMarco
          ),

        cabezal:
          FractionUtils.toSixteenths(
            calc.cabezal
          ),

        alfeizar:
          FractionUtils.toSixteenths(
            calc.alfeizar
          ),

        jambas:
          FractionUtils.toSixteenths(
            calc.jambas
          ),

        vidrioAncho:
          FractionUtils.toSixteenths(
            calc.vidrioAncho
          ),

        vidrioAlto:
          FractionUtils.toSixteenths(
            calc.vidrioAlto
          )
      }
    ])

    setForm({
      hueco: '',
      ancho: '',
      alto: ''
    })
  }

  const handleReset = () => {
    setResults([])
    setError('')

    setForm({
      hueco: '',
      ancho: '',
      alto: ''
    })
  }

  const handleGuardar = () => {
    if (results.length === 0) {
      alert('No hay datos para guardar')
      return
    }

    const materiales =
      calcularResumenMaterialesPuertaP40(
        results
      )

    saveDesglose({
      sistema: 'Puerta P40',
      proyecto,
      results,
      materiales
    })

    setSavedMsg('✅ Guardado')

    setTimeout(
      () => setSavedMsg(''),
      3000
    )
  }

  const handlePrint = () => {
    if (results.length === 0) {
      alert('No hay datos para imprimir')
      return
    }

    const w =
      window.open(
        '',
        '_blank'
      )

    if (!w) {
      alert(
        'No se pudo abrir la ventana de impresión.'
      )
      return
    }

    w.document.write(
      buildPrintHtml(
        proyecto,
        results
      )
    )

    w.document.close()

    setTimeout(
      () => w.print(),
      500
    )
  }

  return (
    <Layout>

      {step === 'proyecto' && (
        <ProyectoModal
          onConfirm={(data) => {
            setProyecto(data)
            setStep('formulario')
          }}
          onCancel={() =>
            navigate('/desglose')
          }
        />
      )}

      <div className="page-content">

        {/* HEADER */}
        <div className="desglose-header">

          <button
            className="btn-back"
            onClick={() =>
              navigate('/desglose')
            }
          >
            <i
              className="bi bi-arrow-left"
              style={{
                marginRight: '6px'
              }}
            ></i>

            Volver
          </button>

          <h1 className="page-title">
            Puerta P40
          </h1>

          <div className="desglose-header-actions">

            {results.length > 0 && (
              <>

                {savedMsg ? (
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--success)',
                      fontWeight: 600
                    }}
                  >
                    {savedMsg}
                  </span>
                ) : (
                  <button
                    className="btn-secondary-sm"
                    onClick={handleGuardar}
                  >
                    <i
                      className="bi bi-save"
                      style={{
                        marginRight: '6px'
                      }}
                    ></i>

                    Guardar
                  </button>
                )}

                <button
                  className="btn-primary-sm"
                  onClick={handlePrint}
                >
                  <i
                    className="bi bi-printer"
                    style={{
                      marginRight: '6px'
                    }}
                  ></i>

                  Imprimir
                </button>

              </>
            )}

          </div>
        </div>

        {/* PROYECTO */}
        {proyecto && (
          <div
            className="card-modern mb-4"
            style={{
              background: '#f0f9ff',
              border: '1px solid #bfdbfe'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  fontSize: '13px'
                }}
              >

                <span>
                  <strong>
                    Cliente:
                  </strong>{' '}
                  {proyecto.cliente}
                </span>

                {proyecto.obra && (
                  <span>
                    <strong>
                      Obra:
                    </strong>{' '}
                    {proyecto.obra}
                  </span>
                )}

                {proyecto.color && (
                  <span>
                    <strong>
                      Color:
                    </strong>{' '}
                    {proyecto.color}
                  </span>
                )}

              </div>

              <button
                className="btn-ghost-sm"
                onClick={() =>
                  setStep('proyecto')
                }
                style={{
                  fontSize: '11px'
                }}
              >
                <i
                  className="bi bi-pencil"
                  style={{
                    marginRight: '4px'
                  }}
                ></i>

                Editar
              </button>

            </div>

            {proyecto.notas && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#92400e',
                  marginTop: '6px',
                  background: '#fffbeb',
                  padding: '5px 8px',
                  borderRadius: '6px'
                }}
              >
                <i
                  className="bi bi-sticky"
                  style={{
                    marginRight: '4px'
                  }}
                ></i>

                {proyecto.notas}
              </div>
            )}

          </div>
        )}

        {/* FORMULARIO */}
        {step === 'formulario' && (
          <div className="card-modern mb-4">

            <div className="form-grid-3">

              <div className="auth-field">
                <label className="auth-label">
                  Hueco #
                </label>

                <input
                  type="text"
                  name="hueco"
                  value={form.hueco}
                  onChange={handleFormChange}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">
                  Ancho
                </label>

                <input
                  type="text"
                  name="ancho"
                  value={form.ancho}
                  onChange={handleFormChange}
                  placeholder='ej: 35 1/2"'
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">
                  Alto
                </label>

                <input
                  type="text"
                  name="alto"
                  value={form.alto}
                  onChange={handleFormChange}
                  placeholder='ej: 86"'
                  className="auth-input"
                />
              </div>

            </div>

            {error && (
              <div
                className="auth-error"
                style={{
                  marginTop: '0.5rem'
                }}
              >
                {error}
              </div>
            )}

            <div className="form-actions">

              <button
                className="auth-btn"
                onClick={handleAdd}
              >
                <i
                  className="bi bi-plus-circle"
                  style={{
                    marginRight: '6px'
                  }}
                ></i>

                Agregar
              </button>

              {results.length > 0 && (
                <button
                  className="btn-outline-lg"
                  onClick={handleReset}
                >
                  <i
                    className="bi bi-arrow-counterclockwise"
                    style={{
                      marginRight: '6px'
                    }}
                  ></i>

                  Reset
                </button>
              )}

            </div>

          </div>
        )}

        {/* RESULTADOS */}
        {results.length > 0 && (
          <>
            <div className="table-container">

              <div className="table-title">
                PUERTA P40
              </div>

              <div className="table-responsive">

                <table
                  className="table-professional"
                  style={{
                    minWidth: '820px'
                  }}
                >

                  <thead>

                    <tr>
                      <th rowSpan="2">
                        Hueco
                      </th>

                      <th rowSpan="2">
                        Ancho
                      </th>

                      <th rowSpan="2">
                        Alto
                      </th>

                      <th colSpan="2">
                        Marco
                      </th>

                      <th colSpan="3">
                        Hoja
                      </th>

                      <th colSpan="2">
                        Vidrio
                      </th>
                    </tr>

                    <tr>
                      <th>
                        Cab-marco
                      </th>

                      <th>
                        Lat-marco
                      </th>

                      <th>
                        Cabezal
                      </th>

                      <th>
                        Alféizar
                      </th>

                      <th>
                        Jambas
                      </th>

                      <th>
                        Ancho
                      </th>

                      <th>
                        Alto
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {results.map(
                      (row, idx) => (
                        <tr key={row.id || idx}>

                          <td>
                            {row.hueco}
                          </td>

                          <td>
                            {row.ancho}
                          </td>

                          <td>
                            {row.alto}
                          </td>

                          <td>
                            {row.cabMarco}
                          </td>

                          <td>
                            {row.latMarco}
                          </td>

                          <td>
                            {row.cabezal}
                          </td>

                          <td>
                            {row.alfeizar}
                          </td>

                          <td>
                            {row.jambas}
                          </td>

                          <td>
                            {row.vidrioAncho}
                          </td>

                          <td>
                            {row.vidrioAlto}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            </div>

            {/* MATERIALES */}
            <MaterialPuertaP40
              medidas={results}
            />
          </>
        )}

        {/* EMPTY STATE */}
        {results.length === 0 &&
          step === 'formulario' && (
            <div
              className="card-modern text-center"
              style={{
                padding: '2rem',
                color: 'var(--gray-500)'
              }}
            >
              Ingresa las medidas y haz clic en
              "Agregar"
            </div>
          )}

      </div>

    </Layout>
  )
}
