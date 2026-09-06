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
            <span class="barra-badge">
              ${item.barras}
            </span>
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

        body {
          font-family:
            Arial,
            Helvetica,
            sans-serif;

          margin: .5in;

          background: #ffffff;

          color: #1e293b;
        }

        h1 {
          font-size: 18px;

          text-align: center;

          color: #1e2b3c;

          margin:
            0 0 4px;
        }

        h2 {
          font-size: 11px;

          text-align: center;

          color: #64748b;

          font-weight: 400;

          margin:
            0 0 16px;
        }

        h3 {
          font-size: 13px;

          color: #1e2b3c;

          margin:
            20px 0 8px;

          border-bottom:
            2px solid #1e2b3c;

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

          border:
            1px solid #e2e8f0;

          border-radius: 4px;
        }

        table {
          width: 100%;

          border-collapse:
            collapse;

          font-size: 10px;

          margin-bottom: 16px;
        }

        th {
          background: #1e2b3c;

          color: #ffffff;

          padding: 6px 5px;

          border:
            1px solid #2c3e50;

          text-align: center;

          font-weight: 700;
        }

        th[colspan] {
          background: #2c3e50;
        }

        td {
          padding: 5px;

          border:
            1px solid #cbd5e1;

          text-align: center;

          font-family:
            monospace;
        }

        tr:nth-child(even) td {
          background: #f8f9fa;
        }

        /* ======================================
           MATERIAL
        ====================================== */

        .material-section {
          margin-top: 24px;

          page-break-inside:
            avoid;
        }

        .material-info {
          background: #f8fafc;

          border:
            1px solid #e2e8f0;

          padding:
            8px 10px;

          font-size: 10px;

          color: #64748b;

          margin-bottom: 8px;
        }

        .material-table {
          margin-bottom: 10px;
        }

        .material-table td {
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .barra-badge {
          display: inline-block;

          min-width: 28px;

          padding:
            3px 7px;

          border-radius: 5px;

          background: #eff6ff;

          color: #1d4ed8;

          font-weight: 700;
        }

        .total-row td {
          background:
            #e2e8f0 !important;

          font-weight: 700;

          color: #0f172a;
        }

        /* ======================================
           SUMMARY
        ====================================== */

        .summary {
          display: flex;

          gap: 10px;

          margin-top: 10px;

          margin-bottom: 16px;
        }

        .summary-box {
          flex: 1;

          border:
            1px solid #e2e8f0;

          background: #f8fafc;

          padding: 8px;

          text-align: center;
        }

        .summary-label {
          display: block;

          font-size: 9px;

          color: #64748b;

          margin-bottom: 3px;
        }

        .summary-value {
          display: block;

          font-size: 14px;

          font-weight: 700;

          color: #1e293b;
        }

        /* ======================================
           FOOTER
        ====================================== */

        .footer {
          margin-top: 24px;

          font-size: 9px;

          color: #888888;

          display: flex;

          justify-content:
            space-between;

          border-top:
            1px solid #dddddd;

          padding-top: 6px;
        }

        /* ======================================
           PRINT
        ====================================== */

        @media print {

          body {
            margin: .4in;
          }

          th {
            -webkit-print-color-adjust:
              exact;

            print-color-adjust:
              exact;
          }

          .barra-badge {
            -webkit-print-color-adjust:
              exact;

            print-color-adjust:
              exact;
          }

          .total-row td {
            -webkit-print-color-adjust:
              exact;

            print-color-adjust:
              exact;
          }

          .summary-box {
            -webkit-print-color-adjust:
              exact;

            print-color-adjust:
              exact;
          }

          .material-section {
            page-break-inside:
              avoid;
          }

          table {
            page-break-inside:
              auto;
          }

          tr {
            page-break-inside:
              avoid;

            page-break-after:
              auto;
          }

        }

      </style>

    </head>

    <body>

      <!-- ======================================
           HEADER
      ======================================= -->

      <h1>
        VENTANA PROYECTADA P-40
      </h1>

      <h2>
        SISTEMA PROFESIONAL DE CÁLCULO
      </h2>


      <!-- ======================================
           PROYECTO
      ======================================= -->

      <div class="info">

        <span>
          <strong>
            Cliente:
          </strong>

          ${proyecto?.cliente || "—"}
        </span>

        <span>
          <strong>
            Obra:
          </strong>

          ${proyecto?.obra || "—"}
        </span>

        <span>
          <strong>
            Color:
          </strong>

          ${proyecto?.color || "—"}
        </span>

      </div>


      <!-- ======================================
           MEDIDAS
      ======================================= -->

      <h3>
        MEDIDAS Y CORTES
      </h3>

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


      <!-- ======================================
           MATERIALES
      ======================================= -->

      <div class="material-section">

        <h3>
          MATERIALES P-40
        </h3>

        <div class="material-info">

          <strong>
            Resumen de materiales
          </strong>

          &nbsp; — &nbsp;

          ${results.length}

          medida${
            results.length !== 1
              ? "s"
              : ""
          }

          &nbsp; | &nbsp;

          Barra estándar:

          <strong>
            21 pies (252")
          </strong>

        </div>


        <table
          class="material-table"
        >

          <thead>

            <tr>

              <th
                style="
                  text-align:left;
                "
              >
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

            <tr
              class="total-row"
            >

              <td
                style="
                  text-align:left;
                "
              >
                TOTAL
              </td>

              <td>
                ${totalPiezas}
              </td>

              <td>
                ${totalPies.toFixed(2)}
              </td>

              <td>
                ${totalBarras}
              </td>

            </tr>

          </tbody>

        </table>


        <!-- ====================================
             RESUMEN GENERAL
        ===================================== -->

        <div class="summary">

          <div class="summary-box">

            <span
              class="summary-label"
            >
              TOTAL PIEZAS
            </span>

            <span
              class="summary-value"
            >
              ${totalPiezas}
            </span>

          </div>


          <div class="summary-box">

            <span
              class="summary-label"
            >
              TOTAL PIES
            </span>

            <span
              class="summary-value"
            >
              ${totalPies.toFixed(2)}
            </span>

          </div>


          <div class="summary-box">

            <span
              class="summary-label"
            >
              TOTAL BARRAS
            </span>

            <span
              class="summary-value"
            >
              ${totalBarras}
            </span>

          </div>

        </div>

      </div>


      <!-- ======================================
           FOOTER
      ======================================= -->

      <div class="footer">

        <span>
          © 2026 - Desglose Pro
        </span>

        <span>
          ${date}
        </span>

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