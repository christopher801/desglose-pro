import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import FractionUtils from "../../utils/fraction";
import ProyectoModal from "./components/ProyectoModal";
import MaterialP40 from "./components/MaterialP40";

import { saveDesglose } from "../../services/historialService";

import {
  calcularResumenMaterialesP40,
  calcularTotalesMaterialesP40,
} from "../../utils/p40Materials";

// ======================================================
// CALCULO P-40
// ======================================================

const calcular = (ancho, alto) => ({
  cabVen: ancho - 2,
  latVen: alto - 2,
  marco: ancho - 1 / 8,
  latMarco: alto - 1 / 8,
  vidrioAncho: ancho - (6 + 1 / 4),
  vidrioAlto: alto - (6 + 1 / 4),
});

// ======================================================
// PRINT P-40
// ======================================================

const buildPrintHtml = (proyecto, results) => {
  // ================================================
  // MATERIALES
  // ================================================

  const materiales =
    calcularResumenMaterialesP40(results);

  const totales =
    calcularTotalesMaterialesP40(materiales);

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
            ${row.cabVen}
          </td>

          <td>
            ${row.latVen}
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

          <td>
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
        VENTANA P-40
      </title>

      <style>

        * {
          box-sizing: border-box;
        }

        @page {
          size: A4 landscape;

          margin: 10mm;
        }

        html,
        body {
          margin: 0;

          padding: 0;

          background: #ffffff;

          color: #111827;

          font-family:
            Arial,
            Helvetica,
            sans-serif;

          font-size: 12px;
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

        /* =========================================
           HEADER
        ========================================= */

        .top {
          display: flex;

          justify-content: center;

          align-items: center;

          text-align: center;

          padding-bottom: 20px;

          border-bottom:
            1px solid
            #cfcfcf;
        }

        .company {
          line-height: 1.15;
        }

        .company-name {
          font-size: 17px;

          font-weight: 700;
        }

        .company-info {
          font-size: 12px;

          color: #555;

          margin-top: 3px;
        }

        /* =========================================
           UPPER
        ========================================= */

        .upper {
          display: grid;

          grid-template-columns:
            240px
            1fr;

          gap: 48px;

          margin-top: 14px;

          align-items: start;
        }

        /* =========================================
           RESUMEN
        ========================================= */

        .order-box {
          border:
            1px solid
            #d7d7d7;

          border-radius: 6px;

          background:
            #e5e7eb;

          padding:
            12px
            14px
            10px;
        }

        .order-box h2 {
          margin:
            0
            0
            9px;

          font-size: 16px;

          font-weight: 700;

          text-align: left;

          color: #111827;
        }

        .order-box p {
          margin:
            4px
            0;

          font-size: 12px;

          line-height: 1.25;
        }

        /* =========================================
           MATERIALS
        ========================================= */

        .section-title {
          margin:
            0
            0
            7px;

          font-size: 14px;

          font-weight: 700;

          color: #111827;
        }

        .materials-table {
          width: 100%;

          border-collapse:
            collapse;

          table-layout: fixed;
        }

        .materials-table th,
        .materials-table td {
          border:
            1px solid
            #c9c9c9;

          padding:
            3px
            5px;

          line-height: 1.1;
        }

        .materials-table th {
          background:
            #e5e7eb;

          color: #111827;

          font-size: 11px;

          font-weight: 700;

          text-align: center;
        }

        .materials-table td {
          background: #ffffff;

          font-size: 11px;

          text-align: center;
        }

        .materials-table th:first-child,
        .materials-table td:first-child {
          width: 55%;

          text-align: left;
        }

        .materials-table th:nth-child(2),
        .materials-table td:nth-child(2),
        .materials-table th:nth-child(3),
        .materials-table td:nth-child(3),
        .materials-table th:nth-child(4),
        .materials-table td:nth-child(4) {
          width: 15%;

          text-align: center;
        }

        .total-row th,
        .total-row td {
          background:
            #eef2f7;

          font-weight: 700;
        }

        /* =========================================
           WINDOWS
        ========================================= */

        .windows {
          margin-top: 30px;
        }

        .windows h2 {
          margin:
            0
            0
            7px;

          font-size: 16px;

          font-weight: 700;

          text-align: left;

          color: #111827;
        }

        .windows table {
          width: 100%;

          border-collapse:
            collapse;

          table-layout: fixed;

          font-size: 11px;
        }

        .windows th,
        .windows td {
          border:
            1px solid
            #c9c9c9;

          padding:
            3px
            5px;

          line-height: 1.1;

          vertical-align: middle;
        }

        .windows th {
          background:
            #e5e7eb;

          color: #111827;

          font-size: 10px;

          font-weight: 700;

          text-align: center;

          white-space: nowrap;
        }

        .windows td {
          background: #ffffff;

          font-size: 10px;

          text-align: center;

          white-space: nowrap;
        }

        .windows th:nth-child(1),
        .windows td:nth-child(1),
        .windows th:nth-child(2),
        .windows td:nth-child(2),
        .windows th:nth-child(3),
        .windows td:nth-child(3) {
          width: 7%;
        }

        /* =========================================
           FOOTER
        ========================================= */

        .footer {
          margin-top: 9px;

          font-size: 8px;

          color: #888;

          display: flex;

          justify-content:
            space-between;

          border-top:
            1px solid
            #ddd;

          padding-top: 5px;
        }

        /* =========================================
           PRINT
        ========================================= */

        @media print {

          th,
          .order-box,
          .total-row th,
          .total-row td {
            -webkit-print-color-adjust:
              exact;

            print-color-adjust:
              exact;
          }

          tr {
            page-break-inside:
              avoid;
          }

        }

      </style>

    </head>

    <body>

      <div class="page">

        <!-- =========================================
             HEADER
        ========================================= -->

        <div class="top">

          <div class="company">

            <div class="company-name">
              DESGLOSE PRO
            </div>

            <div class="company-info">
              Software profesional para talleres de aluminio
            </div>

          </div>

        </div>


        <!-- =========================================
             RESUMEN + MATERIALES
        ========================================= -->

        <div class="upper">

          <div class="order-box">

            <h2>
              Resumen del Desglose
            </h2>

            <p>

              <strong>
                Tipo:
              </strong>

              Ventana Proyectada P-40

            </p>

            <p>

              <strong>
                Cliente:
              </strong>

              ${
                proyecto?.cliente ||
                "—"
              }

            </p>

            <p>

              <strong>
                Obra/acabado:
              </strong>

              ${
                proyecto?.obra ||
                "—"
              }

            </p>

            <p>

              <strong>
                Color:
              </strong>

              ${
                proyecto?.color ||
                "—"
              }

            </p>

            <p>

              <strong>
                Notas:
              </strong>

              ${
                proyecto?.notas ||
                "—"
              }

            </p>

          </div>


          <div>

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

        </div>


        <!-- =========================================
             MEDIDAS Y CORTES
        ========================================= -->

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

                <th colspan="2">
                  De la hoja
                </th>

                <th colspan="2">
                  Del marco
                </th>

                <th colspan="2">
                  Vidrio
                </th>

              </tr>

              <tr>

                <th>
                  Cab-ven
                </th>

                <th>
                  Lat-ven
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


        <!-- =========================================
             FOOTER
        ========================================= -->

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

// ======================================================
// COMPONENTE P-40
// ======================================================

export default function P40() {
  const navigate = useNavigate();

  const [step, setStep] = useState("proyecto");

  const [proyecto, setProyecto] = useState(null);

  const [form, setForm] = useState({
    hueco: "",
    ancho: "",
    alto: "",
  });

  const [results, setResults] = useState([]);

  const [error, setError] = useState("");

  const [savedMsg, setSavedMsg] = useState("");

  // ====================================================
  // FORM CHANGE
  // ====================================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================================
  // AGREGAR MEDIDA
  // ====================================================

  const handleAdd = () => {
    setError("");

    setSavedMsg("");

    if (!form.ancho || !form.alto) {
      setError(
        "❌ Ingresa ANCHO y ALTO"
      );

      return;
    }

    const anchoDec =
      FractionUtils.parseFraction(
        form.ancho
      );

    const altoDec =
      FractionUtils.parseFraction(
        form.alto
      );

    if (
      !Number.isFinite(anchoDec) ||
      !Number.isFinite(altoDec) ||
      anchoDec <= 0 ||
      altoDec <= 0
    ) {
      setError(
        "❌ Las medidas deben ser mayores a 0"
      );

      return;
    }

    const calc = calcular(
      anchoDec,
      altoDec
    );

    const nuevaMedida = {
      id: Date.now(),

      // ================================================
      // DATOS ORIGINALES
      // ================================================

      hueco:
        form.hueco ||
        `H-${results.length + 1}`,

      ancho: form.ancho,

      alto: form.alto,

      // ================================================
      // DATOS NUMERICOS
      // ================================================

      anchoDec,

      altoDec,

      hojasNum: 1,

      // ================================================
      // HOJA / VENTILADOR
      // ================================================

      cabVen:
        FractionUtils.toSixteenths(
          calc.cabVen
        ),

      latVen:
        FractionUtils.toSixteenths(
          calc.latVen
        ),

      // ================================================
      // MARCO
      // ================================================

      marco:
        FractionUtils.toSixteenths(
          calc.marco
        ),

      latMarco:
        FractionUtils.toSixteenths(
          calc.latMarco
        ),

      // ================================================
      // VIDRIO
      // ================================================

      vidrioAncho:
        FractionUtils.toSixteenths(
          calc.vidrioAncho
        ),

      vidrioAlto:
        FractionUtils.toSixteenths(
          calc.vidrioAlto
        ),
    };

    setResults((prev) => [
      ...prev,
      nuevaMedida,
    ]);

    setForm({
      hueco: "",
      ancho: "",
      alto: "",
    });
  };

  // ====================================================
  // RESET
  // ====================================================

  const handleReset = () => {
    setResults([]);

    setError("");

    setSavedMsg("");

    setForm({
      hueco: "",
      ancho: "",
      alto: "",
    });
  };

  // ====================================================
  // GUARDAR
  // ====================================================

  const handleGuardar = () => {
    if (results.length === 0) {
      alert(
        "No hay datos para guardar"
      );

      return;
    }

    try {
      const materiales =
        calcularResumenMaterialesP40(
          results
        );

      saveDesglose({
        sistema:
          "Ventana P-40 Proyectada",

        proyecto,

        results,

        materiales,
      });

      setSavedMsg(
        "✅ Guardado"
      );

      setTimeout(() => {
        setSavedMsg("");
      }, 3000);

    } catch (err) {
      console.error(
        "Error guardando P-40:",
        err
      );

      setError(
        "❌ No fue posible guardar el desglose"
      );
    }
  };

  // ====================================================
  // IMPRIMIR
  // ====================================================

  const handlePrint = () => {
    if (results.length === 0) {
      alert(
        "No hay datos para imprimir"
      );

      return;
    }

    const html =
      buildPrintHtml(
        proyecto,
        results
      );

    const w = window.open(
      "",
      "_blank"
    );

    if (!w) {
      alert(
        "No se pudo abrir la ventana de impresión."
      );

      return;
    }

    w.document.write(html);

    w.document.close();

    setTimeout(() => {
      w.print();
    }, 500);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <Layout>

      {/* ==============================================
          PROYECTO MODAL
      =============================================== */}

      {step === "proyecto" && (
        <ProyectoModal
          onConfirm={(data) => {
            setProyecto(data);

            setStep(
              "formulario"
            );
          }}

          onCancel={() =>
            navigate("/desglose")
          }
        />
      )}


      <div className="page-content">

        {/* ============================================
            HEADER
        ============================================= */}

        <div className="desglose-header">

          <button
            className="btn-back"
            onClick={() =>
              navigate("/desglose")
            }
          >

            <i
              className="bi bi-arrow-left"
              style={{
                marginRight: "6px",
              }}
            ></i>

            Volver

          </button>


          <h1 className="page-title">
            Ventana P-40 Proyectada
          </h1>


          <div className="desglose-header-actions">

            {results.length > 0 && (
              <>

                {savedMsg ? (

                  <span
                    style={{
                      fontSize: "13px",
                      color:
                        "var(--success)",
                      fontWeight: 600,
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
                        marginRight:
                          "6px",
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
                      marginRight:
                        "6px",
                    }}
                  ></i>

                  Imprimir

                </button>

              </>
            )}

          </div>

        </div>


        {/* ============================================
            INFO PROYECTO
        ============================================= */}

        {proyecto && (

          <div
            className="card-modern mb-4"
            style={{
              background: "#f0f9ff",

              border:
                "1px solid #bfdbfe",
            }}
          >

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                flexWrap:
                  "wrap",

                gap: "8px",
              }}
            >

              <div
                style={{
                  display: "flex",

                  gap: "1.5rem",

                  flexWrap:
                    "wrap",

                  fontSize:
                    "13px",
                }}
              >

                <span>

                  <strong>
                    Cliente:
                  </strong>{" "}

                  {proyecto.cliente}

                </span>


                {proyecto.obra && (

                  <span>

                    <strong>
                      Obra:
                    </strong>{" "}

                    {proyecto.obra}

                  </span>

                )}


                {proyecto.color && (

                  <span>

                    <strong>
                      Color:
                    </strong>{" "}

                    {proyecto.color}

                  </span>

                )}

              </div>


              <button
                className="btn-ghost-sm"
                onClick={() =>
                  setStep(
                    "proyecto"
                  )
                }
                style={{
                  fontSize: "11px",
                }}
              >

                <i
                  className="bi bi-pencil"
                  style={{
                    marginRight:
                      "4px",
                  }}
                ></i>

                Editar

              </button>

            </div>


            {proyecto.notas && (

              <div
                style={{
                  fontSize: "12px",

                  color: "#92400e",

                  marginTop: "6px",

                  background:
                    "#fffbeb",

                  padding:
                    "5px 8px",

                  borderRadius:
                    "6px",
                }}
              >

                <i
                  className="bi bi-sticky"
                  style={{
                    marginRight:
                      "4px",
                  }}
                ></i>

                {proyecto.notas}

              </div>

            )}

          </div>

        )}


        {/* ============================================
            FORMULARIO
        ============================================= */}

        {step === "formulario" && (

          <div
            className="card-modern mb-4"
          >

            <div className="form-grid-3">

              {/* HUECO */}

              <div className="auth-field">

                <label className="auth-label">
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


              {/* ANCHO */}

              <div className="auth-field">

                <label className="auth-label">
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
                  placeholder={'ej: 38 10/16"'}
                  className="auth-input"
                />

              </div>


              {/* ALTO */}

              <div className="auth-field">

                <label className="auth-label">
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
                  placeholder={'ej: 27 15/16"'}
                  className="auth-input"
                />

              </div>

            </div>


            {error && (

              <div
                className="auth-error"
                style={{
                  marginTop:
                    "0.5rem",
                }}
              >
                {error}
              </div>

            )}


            <div className="form-actions">

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
                      "6px",
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
                        "6px",
                    }}
                  ></i>

                  Reset

                </button>

              )}

            </div>

          </div>

        )}


        {/* ============================================
            RESULTADOS
        ============================================= */}

        {results.length > 0 && (

          <>

            <div className="table-container">

              <div className="table-title">
                VENTANA PROYECTADA P-40
              </div>


              <div className="table-responsive">

                <table
                  className="table-professional"
                  style={{
                    minWidth:
                      "780px",
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
                        Cab-ven
                      </th>

                      <th>
                        Lat-ven
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
                            {
                              row.hueco
                            }
                          </td>

                          <td>
                            {
                              row.ancho
                            }
                          </td>

                          <td>
                            {
                              row.alto
                            }
                          </td>

                          <td>
                            {
                              row.cabVen
                            }
                          </td>

                          <td>
                            {
                              row.latVen
                            }
                          </td>

                          <td>
                            {
                              row.marco
                            }
                          </td>

                          <td>
                            {
                              row.latMarco
                            }
                          </td>

                          <td>
                            {
                              row.vidrioAncho
                            }
                          </td>

                          <td>
                            {
                              row.vidrioAlto
                            }
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>


            {/* =========================================
                MATERIALES P-40
            ========================================== */}

            <MaterialP40
              medidas={results}
            />

          </>

        )}


        {/* ============================================
            EMPTY STATE
        ============================================= */}

        {results.length === 0 &&
          step === "formulario" && (

            <div
              className="card-modern text-center"
              style={{
                padding:
                  "2rem",

                color:
                  "var(--gray-500)",
              }}
            >

              Ingresa las medidas y
              haz clic en{" "}

              <strong>
                Agregar
              </strong>

            </div>

          )}

      </div>

    </Layout>
  );
}