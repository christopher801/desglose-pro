import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import FractionUtils from '../../utils/fraction'
import ProyectoModal from './components/ProyectoModal'
import MaterialPuertaComercial from './components/MaterialPuertaComercial'
import { saveDesglose } from '../../services/historialService'

import {
  calcularResumenMaterialesPuertaComercial,
  calcularTotalesMaterialesPuertaComercial
} from '../../utils/puertaComercialMaterials'

const calcular = (ancho, alto, hojas) => {
  if (hojas === 1) {
    return {
      cabAlf: ancho - 8,
      jambas: alto - (2 + 3 / 4),
      marco: ancho - (3 + 5 / 8),
      latMarco: alto - (1 / 8),
      vidrioAncho: ancho - (8 + 1 / 4),
      vidrioAlto: alto - 8
    }
  } else {
    return {
      cabAlf: (ancho - 12.1) / 2,
      jambas: alto - (2 + 3 / 4),
      marco: ancho - (3 + 5 / 8),
      latMarco: alto - (1 / 8),
      vidrioAncho: (ancho - 12.625) / 2,
      vidrioAlto: alto - 8
    }
  }
}

const buildPrintHtml = (proyecto, results) => {
  // ================================================
  // MATERIALES
  // ================================================

  const materiales =
    calcularResumenMaterialesPuertaComercial(results);

  const totales =
    calcularTotalesMaterialesPuertaComercial(materiales);

  const totalPiezas = totales.piezas;
  const totalPies = totales.pies;
  const totalBarras = totales.barras;

  // ================================================
  // FECHA
  // ================================================

  const date =
    new Date().toLocaleDateString("es-DO");

  // ================================================
  // TABLA DE MEDIDAS
  // ================================================

  const tableRows = results
    .map(
      (row) => `
        <tr>

          <td>
            ${row.hueco || "—"}
          </td>

          <td>
            ${row.ancho}
          </td>

          <td>
            ${row.alto}
          </td>

          <td>
            ${row.tipo}
          </td>

          <td>
            ${row.cabAlf}
          </td>

          <td>
            ${row.jambas}
          </td>

          <td>
            ${row.marco}
          </td>

          <td>
            ${row.latMarco}
          </td>

          <td>
            ${row.vidrioAncho}
          </td>

          <td>
            ${row.vidrioAlto}
          </td>

        </tr>
      `
    )
    .join("");

  // ================================================
  // TABLA DE MATERIALES
  // ================================================

  const materialRows = materiales
    .map(
      (item) => `
        <tr>

          <td
            style="
              text-align:left;
              font-weight:600;
            "
          >
            ${item.material}
          </td>

          <td>
            ${item.piezas}
          </td>

          <td>
            ${item.pies.toFixed(2)}
          </td>

          <td>
            ${item.barras}
          </td>

        </tr>
      `
    )
    .join("");

  // ================================================
  // HTML PRINT
  // ================================================

  return `
    <!DOCTYPE html>

    <html lang="es">

    <head>

      <meta charset="UTF-8" />

      <title>
        PUERTA COMERCIAL TRADICIONAL
      </title>

      <style>

        * {
          box-sizing: border-box;
        }

        @page {
          size: A4 landscape;
          margin: 10mm;
        }

        body {
          font-family:
            Arial,
            Helvetica,
            sans-serif;

          margin: 0;

          background: #ffffff;

          color: #111827;
        }

        .page {
          width: 100%;

          max-width: 1400px;

          min-height: 900px;

          margin: 0 auto;

          padding:
            20px
            26px
            16px;

          display: flex;

          flex-direction: column;
        }

        /* ============================================
           HEADER
        ============================================ */

        .top {
          text-align: center;

          padding-bottom: 10px;

          border-bottom:
            1px solid #cfcfcf;
        }

        .company-name {
          font-size: 17px;

          font-weight: 700;

          color: #111827;

          margin: 0;
        }

        .company-info {
          font-size: 12px;

          color: #64748b;

          margin-top: 3px;
        }

        /* ============================================
           UPPER SECTION
        ============================================ */

        .upper {
          display: grid;

          grid-template-columns:
            240px
            1fr;

          gap: 48px;

          margin-top: 14px;

          align-items: start;
        }

        /* ============================================
           ORDER BOX
        ============================================ */

        .order-box {
          border:
            1px solid #d7d7d7;

          border-radius: 6px;

          background: #e5e7eb;

          padding:
            12px
            14px
            10px;
        }

        .order-box h2 {
          margin:
            0 0 10px;

          font-size: 16px;

          font-weight: 700;

          color: #111827;
        }

        .order-field {
          margin-bottom: 7px;

          font-size: 11px;

          line-height: 1.35;
        }

        .order-field:last-child {
          margin-bottom: 0;
        }

        .order-label {
          font-weight: 700;

          color: #111827;
        }

        .order-value {
          color: #374151;
        }

        /* ============================================
           MATERIALS
        ============================================ */

        .materials {
          width: 100%;
        }

        .section-title {
          margin:
            0 0 7px;

          font-size: 14px;

          font-weight: 700;

          color: #111827;
        }

        .materials-table {
          width: 100%;

          border-collapse:
            collapse;

          table-layout: fixed;

          margin: 0;
        }

        .materials-table th {
          background: #e5e7eb;

          color: #111827;

          border:
            1px solid #d0d0d0;

          padding:
            6px
            5px;

          font-size: 11px;

          font-weight: 700;

          text-align: center;
        }

        .materials-table td {
          background: #ffffff;

          color: #111827;

          border:
            1px solid #d0d0d0;

          padding:
            6px
            5px;

          font-size: 11px;

          text-align: center;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .materials-table th:first-child,
        .materials-table td:first-child {
          width: 55%;

          text-align: left;
        }

        .materials-table th:not(:first-child),
        .materials-table td:not(:first-child) {
          width: 15%;
        }

        .materials-table .total-row td {
          background: #eef2f7;

          font-weight: 700;

          color: #111827;
        }

        /* ============================================
           WINDOWS / MEASURES
        ============================================ */

        .windows {
          margin-top: 30px;
        }

        .windows h2 {
          margin:
            0 0 7px;

          font-size: 16px;

          font-weight: 700;

          color: #111827;

          text-align: left;
        }

        .windows table {
          width: 100%;

          border-collapse:
            collapse;

          table-layout: fixed;

          margin: 0;

          font-size: 10px;
        }

        .windows th {
          background: #e5e7eb;

          color: #111827;

          border:
            1px solid #c9c9c9;

          padding:
            6px
            5px;

          text-align: center;

          font-size: 10px;

          font-weight: 700;
        }

        .windows td {
          background: #ffffff;

          color: #111827;

          border:
            1px solid #c9c9c9;

          padding:
            6px
            5px;

          text-align: center;

          font-size: 10px;

          font-family:
            monospace;
        }

        .windows tbody tr:nth-child(even) td {
          background: #fafafa;
        }

        /* ============================================
           FOOTER
        ============================================ */

        .footer {
          margin-top: 9px;

          font-size: 8px;

          color: #888888;

          display: flex;

          justify-content: space-between;

          border-top:
            1px solid #dddddd;

          padding-top: 5px;
        }

        /* ============================================
           PRINT
        ============================================ */

        @media print {

          body {
            margin: 0;
          }

          .page {
            max-width: none;

            min-height: auto;

            padding:
              20px
              26px
              16px;
          }

          .top,
          .order-box,
          .materials-table th,
          .materials-table .total-row td,
          .windows th {
            -webkit-print-color-adjust: exact;

            print-color-adjust: exact;
          }

          .materials-table,
          .windows table {
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

      <div class="page">

        <!-- ==========================================
             HEADER
        =========================================== -->

        <div class="top">

          <div class="company-name">
            DESGLOSE PRO
          </div>

          <div class="company-info">
            Software profesional para talleres de aluminio
          </div>

        </div>


        <!-- ==========================================
             UPPER
        =========================================== -->

        <div class="upper">

          <!-- RESUMEN -->

          <div class="order-box">

            <h2>
              Resumen del Desglose
            </h2>

            <div class="order-field">

              <span class="order-label">
                Tipo:
              </span>

              <span class="order-value">
                Puerta Comercial Tradicional
              </span>

            </div>

            <div class="order-field">

              <span class="order-label">
                Cliente:
              </span>

              <span class="order-value">
                ${proyecto?.cliente || "—"}
              </span>

            </div>

            <div class="order-field">

              <span class="order-label">
                Obra/acabado:
              </span>

              <span class="order-value">
                ${proyecto?.obra || "—"}
              </span>

            </div>

            <div class="order-field">

              <span class="order-label">
                Color:
              </span>

              <span class="order-value">
                ${proyecto?.color || "—"}
              </span>

            </div>

            <div class="order-field">

              <span class="order-label">
                Notas:
              </span>

              <span class="order-value">
            ${proyecto?.notas || "—"}
              </span>

            </div>

          </div>

        


          <!-- MATERIALES -->

          ${
            materiales.length > 0
              ? `
                <div class="materials">

                  <div class="section-title">
                    Materiales
                  </div>

                  <table class="materials-table">

                    <thead>

                      <tr>

                        <th>
                          Material
                        </th>

                        <th>
                          Piezas
                        </th>

                        <th>
                          Pies
                        </th>

                        <th>
                          Barras
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      ${materialRows}

                      <tr class="total-row">

                        

                      </tr>

                    </tbody>

                  </table>

                </div>
              `
              : ""
          }

        </div>


        <!-- ==========================================
             MEDIDAS Y CORTES
        =========================================== -->

        <div class="windows">

          <h2>
            Medidas y Cortes
          </h2>

          <table>

            <thead>

              <tr>

                <th rowspan="2">
                  Hueco
                </th>

                <th rowspan="2">
                  Ancho
                </th>

                <th rowspan="2">
                  Alto
                </th>

                <th rowspan="2">
                  Tipo
                </th>

                <th colspan="2">
                  Hoja
                </th>

                <th colspan="2">
                  Marco
                </th>

                <th colspan="2">
                  Vidrio
                </th>

              </tr>

              <tr>

                <th>
                  Cab-alf
                </th>

                <th>
                  Jambas
                </th>

                <th>
                  Cab-marco
                </th>

                <th>
                  Lat-marco
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

              ${tableRows}

            </tbody>

          </table>

        </div>


        <!-- ==========================================
             FOOTER
        =========================================== -->

        <div class="footer">

          <span>
            © 2026 - Desglose Pro
          </span>
          <span>
            ${date}
          </span>

        </div>

      </div>

    </body>

    </html>
  `;
};

export default function PuertaComercial() {

  const navigate = useNavigate()

  const [step, setStep] =
    useState('proyecto')

  const [proyecto, setProyecto] =
    useState(null)

  const [form, setForm] =
    useState({
      hueco: '',
      ancho: '',
      alto: '',
      hojas: 1
    })

  const [results, setResults] =
    useState([])

  const [error, setError] =
    useState('')

  const [savedMsg, setSavedMsg] =
    useState('')

  const handleFormChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  const handleAdd = () => {

    setError('')

    if (!form.ancho || !form.alto) {
      setError(
        '❌ Ingresa ANCHO y ALTO'
      )

      return
    }

    const anchoDec =
      FractionUtils.parseFraction(
        form.ancho
      )

    const altoDec =
      FractionUtils.parseFraction(
        form.alto
      )

    if (
      anchoDec <= 0 ||
      altoDec <= 0
    ) {
      setError(
        '❌ Las medidas deben ser mayores a 0'
      )

      return
    }

    const hojas =
      parseInt(
        form.hojas,
        10
      )

    const calc =
      calcular(
        anchoDec,
        altoDec,
        hojas
      )

    setResults([
      ...results,
      {
        id: Date.now(),

        hueco:
          form.hueco || `H-${results.length + 1}`,

        ancho:
          form.ancho,

        alto:
          form.alto,

        anchoDec,

        altoDec,

        hojasNum:
          hojas,

        tipo:
          hojas === 1
            ? 'Simple'
            : 'Doble',

        cabAlf:
          FractionUtils.toSixteenths(
            calc.cabAlf
          ),

        jambas:
          FractionUtils.toSixteenths(
            calc.jambas
          ),

        marco:
          FractionUtils.toSixteenths(
            calc.marco
          ),

        latMarco:
          FractionUtils.toSixteenths(
            calc.latMarco
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
      alto: '',
      hojas: form.hojas
    })
  }

  const handleReset = () => {

    setResults([])

    setError('')

    setForm({
      hueco: '',
      ancho: '',
      alto: '',
      hojas: 1
    })
  }

  const handleGuardar = () => {

    if (
      results.length === 0
    ) {
      alert(
        'No hay datos para guardar'
      )

      return
    }

    const materiales =
      calcularResumenMaterialesPuertaComercial(
        results
      )

    saveDesglose({
      sistema:
        'Puerta Comercial',

      proyecto,

      results,

      materiales
    })

    setSavedMsg(
      '✅ Guardado'
    )

    setTimeout(
      () =>
        setSavedMsg(''),
      3000
    )
  }

  const handlePrint = () => {

    if (
      results.length === 0
    ) {
      alert(
        'No hay datos para imprimir'
      )

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
            Puerta Comercial
          </h1>

          <div className="desglose-header-actions">

            {results.length > 0 && (

              <>

                {savedMsg ? (

                  <span
                    style={{
                      fontSize: '13px',
                      color:
                        'var(--success)',
                      fontWeight: 600
                    }}
                  >
                    {savedMsg}
                  </span>

                ) : (

                  <button
                    className="btn-secondary-sm"
                    onClick={
                      handleGuardar
                    }
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
                  onClick={
                    handlePrint
                  }
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
              background:
                '#f0f9ff',
              border:
                '1px solid #bfdbfe'
            }}
          >

            <div
              style={{
                display:
                  'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
                flexWrap:
                  'wrap',
                gap:
                  '8px'
              }}
            >

              <div
                style={{
                  display:
                    'flex',
                  gap:
                    '1.5rem',
                  flexWrap:
                    'wrap',
                  fontSize:
                    '13px'
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
                  setStep(
                    'proyecto'
                  )
                }
                style={{
                  fontSize:
                    '11px'
                }}
              >

                <i
                  className="bi bi-pencil"
                  style={{
                    marginRight:
                      '4px'
                  }}
                ></i>

                Editar

              </button>

            </div>

            {proyecto.notas && (

              <div
                style={{
                  fontSize:
                    '12px',
                  color:
                    '#92400e',
                  marginTop:
                    '6px',
                  background:
                    '#fffbeb',
                  padding:
                    '5px 8px',
                  borderRadius:
                    '6px'
                }}
              >

                <i
                  className="bi bi-sticky"
                  style={{
                    marginRight:
                      '4px'
                  }}
                ></i>

                {proyecto.notas}

              </div>

            )}

          </div>

        )}

        {/* FORMULARIO */}

        {step === 'formulario' && (

          <div
            className="card-modern mb-4"
          >

            <div
              className="form-grid-4"
            >

              <div
                className="auth-field"
              >

                <label
                  className="auth-label"
                >
                  Hueco #
                </label>

                <input
                  type="text"
                  name="hueco"
                  value={
                    form.hueco
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="ej: A-1"
                  className="auth-input"
                />

              </div>

              <div
                className="auth-field"
              >

                <label
                  className="auth-label"
                >
                  Ancho
                </label>

                <input
                  type="text"
                  name="ancho"
                  value={
                    form.ancho
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder='ej: 56 7/8"'
                  className="auth-input"
                />

              </div>

              <div
                className="auth-field"
              >

                <label
                  className="auth-label"
                >
                  Alto
                </label>

                <input
                  type="text"
                  name="alto"
                  value={
                    form.alto
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder='ej: 82 2/16"'
                  className="auth-input"
                />

              </div>

              <div
                className="auth-field"
              >

                <label
                  className="auth-label"
                >
                  Tipo puerta
                </label>

                <select
                  name="hojas"
                  value={
                    form.hojas
                  }
                  onChange={
                    handleFormChange
                  }
                  className="auth-input"
                >

                  <option value={1}>
                    1 hoja (Simple)
                  </option>

                  <option value={2}>
                    2 hojas (Doble)
                  </option>

                </select>

              </div>

            </div>

            {error && (

              <div
                className="auth-error"
                style={{
                  marginTop:
                    '0.5rem'
                }}
              >
                {error}
              </div>

            )}

            <div
              className="form-actions"
            >

              <button
                className="auth-btn"
                onClick={
                  handleAdd
                }
              >

                <i
                  className="bi bi-plus-circle"
                  style={{
                    marginRight:
                      '6px'
                  }}
                ></i>

                Agregar

              </button>

              {results.length > 0 && (

                <button
                  className="btn-outline-lg"
                  onClick={
                    handleReset
                  }
                >

                  <i
                    className="bi bi-arrow-counterclockwise"
                    style={{
                      marginRight:
                        '6px'
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

            <div
              className="table-container"
            >

              <div
                className="table-title"
              >
                PUERTA COMERCIAL TRADICIONAL
              </div>

              <div
                className="table-responsive"
              >

                <table
                  className="table-professional"
                  style={{
                    minWidth:
                      '820px'
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

                      <th rowSpan="2">
                        Tipo
                      </th>

                      <th colSpan="2">
                        Hoja
                      </th>

                      <th colSpan="2">
                        Marco
                      </th>

                      <th colSpan="2">
                        Vidrio
                      </th>

                    </tr>

                    <tr>

                      <th>
                        Cab-alf
                      </th>

                      <th>
                        Jambas
                      </th>

                      <th>
                        Cab-marco
                      </th>

                      <th>
                        Lat-marco
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

                        <tr
                          key={
                            row.id ||
                            idx
                          }
                        >

                          <td>
                            {row.hueco ||
                              '—'}
                          </td>

                          <td>
                            {row.ancho}
                          </td>

                          <td>
                            {row.alto}
                          </td>

                          <td>
                            {row.tipo}
                          </td>

                          <td>
                            {row.cabAlf}
                          </td>

                          <td>
                            {row.jambas}
                          </td>

                          <td>
                            {row.marco}
                          </td>

                          <td>
                            {row.latMarco}
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

            <MaterialPuertaComercial
              medidas={
                results
              }
            />

          </>

        )}

        {/* EMPTY */}

        {results.length === 0 &&
          step === 'formulario' && (

            <div
              className="card-modern text-center"
              style={{
                padding:
                  '2rem',
                color:
                  'var(--gray-500)'
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
