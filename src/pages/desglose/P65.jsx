import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import FractionUtils from "../../utils/fraction";
import ProyectoModal from "./components/ProyectoModal";
import MaterialP65 from "./components/MaterialP65";

import { saveDesglose } from "../../services/historialService";
import { useAuth } from "../../context/AuthContext";
import { checkAndIncrementUsage } from "../../services/usageService";
import DailyLimitModal from "../../components/DailyLimitModal";

import { calcularResumenMaterialesP65 } from "../../utils/p65Materials";

const calcular = (ancho, alto, hojas) => {
  if (hojas === 2) {
    return {
      cabAlf: ancho / 2 - 11 / 16,
      jambas: alto - (2 + 1 / 8),
      marco: ancho - (1 + 3 / 8),
      latMarco: alto - 1 / 8,
      vidrioAncho: ancho / 2 - (3 + 3 / 16),
      vidrioAlto: alto - (4 + 15 / 16),
      vidrioMedio: null,
    };
  }

  if (hojas === 3) {
    return {
      cabAlf: ancho / 3 + 1 / 8,
      jambas: alto - (2 + 1 / 8),
      marco: ancho - (1 + 3 / 8),
      latMarco: alto - 1 / 8,
      vidrioAncho: ancho / 3 - (2 + 6 / 16),
      vidrioAlto: alto - (4 + 15 / 16),
      vidrioMedio: ancho / 3 - (2 + 11 / 16),
    };
  }

  return {
    cabAlf: ancho / 4 - 2 / 16,
    jambas: alto - (2 + 1 / 8),
    marco: ancho - (1 + 3 / 8),
    latMarco: alto - 1 / 8,
    vidrioAncho: ancho / 4 - (2 + 7 / 8),
    vidrioAlto: alto - (4 + 15 / 16),
    vidrioMedio: null,
  };
};

const buildPrintHtml = (proyecto, results, materiales) => {
  const hasVidrioMedio = results.some((r) => r.vidrioMedio);

  const date = new Date().toLocaleDateString("es-DO");

  const rows = results
    .map(
      (row) => `
      <tr>
        <td>${row.hueco}</td>
        <td>${row.ancho}</td>
        <td>${row.alto}</td>
        <td>${row.hojas}</td>
        <td>${row.cabAlf}</td>
        <td>${row.jambas}</td>
        <td>${row.marco}</td>
        <td>${row.latMarco}</td>
        <td>${row.vidrioAncho}</td>
        <td>${row.vidrioAlto}</td>
        ${hasVidrioMedio ? `<td>${row.vidrioMedio || "—"}</td>` : ""}
      </tr>
    `,
    )
    .join("");

  const materialRows = materiales
    .map(
      (item) => `
      <tr>
        <td style="text-align:left;font-family:Arial,sans-serif;">
          ${item.material}
        </td>
        <td>${item.piezas}</td>
        <td>${item.pies.toFixed(2)}</td>
        <td>${item.barras}</td>
      </tr>
    `,
    )
    .join("");

  const totalPiezas = materiales.reduce(
    (total, item) => total + item.piezas,
    0,
  );

  const totalPies = materiales.reduce((total, item) => total + item.pies, 0);

  const totalBarras = materiales.reduce(
    (total, item) => total + item.barras,
    0,
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <title>VENTANA P-65</title>

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
      background: #fff;
      color: #111;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
    }

    .page {
      width: 100%;
      max-width: 1400px;
      min-height: 900px;
      margin: 0 auto;
      padding: 20px 26px 16px;
      display: flex;
      flex-direction: column;
    }

    /* ============================================================
       HEADER
    ============================================================ */
    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #cfcfcf;
      text-align: center;
    }

    .company {
      line-height: 1.1;
      text-align: center;
    }

    .company-name {
      font-size: 17px;
      font-weight: 700;
    }

    .company-info {
      color: #110e0e;
      font-size: 12px;
      margin-top: 2px;
    }

    .document-title {
      text-align: right;
    }

    .document-title h1 {
      margin: 0;
      font-size: 20px;
      line-height: 1;
      font-weight: 700;
      color: #444;
    }

    .document-title .sub {
      margin-top: 4px;
      color: #110e0e;
      font-size: 12px;
      line-height: 1.25;
    }

    /* ============================================================
       UPPER SECTION
    ============================================================ */

    .upper {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 48px;
      margin-top: 14px;
      align-items: start;
    }

    /* ============================================================
       ORDER BOX
    ============================================================ */

    .order-box {
      border: 1px solid #d7d7d7;
      border-radius: 6px;
      background: #e5e7eb;
      padding: 12px 14px 10px;
    }

    .order-box h2 {
      margin: 0 0 5px;
      font-size: 16px;
    }

    .order-box .type {
      font-size: 14px;
      font-weight: 700;
      color: #444;
      margin-bottom: 9px;
    }

    .order-box p {
      margin: 4px 0;
      font-size: 12px;
    }

    /* ============================================================
       MATERIALS
    ============================================================ */

    .materials-section {
      min-width: 0;
    }

    .section-title {
      margin: 0 0 4px;
      font-size: 14px;
      font-weight: 700;
    }

    /* ============================================================
       TABLES
    ============================================================ */

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    th,
    td {
      border: 1px solid #c9c9c9;
      padding: 3px 5px;
      vertical-align: middle;
      line-height: 1.1;
    }

    th {
      background: #e5e7eb;
      font-weight: 700;
      text-align: left;
    }

    td {
      background: #fff;
    }

    .materials th:nth-child(1) {
      width: 55%;
    }

    .materials th:nth-child(2) {
      width: 15%;
    }

    .materials th:nth-child(3) {
      width: 15%;
    }

    .materials th:nth-child(4) {
      width: 15%;
    }

    .materials td:nth-child(2),
    .materials td:nth-child(3),
    .materials td:nth-child(4) {
      text-align: center;
    }

    /* ============================================================
       MEASURES / CUTTING
    ============================================================ */
    .windows {
      margin-top: 30px;
    }

    .windows h2 {
      margin: 0 0 5px;
      font-size: 16px;
    }

    .windows table {
      font-size: 11px;
      width: 100%;
      table-layout: fixed;
    }

    .windows th {
      text-align: center;
      font-size: 11px;
      white-space: nowrap;
      padding: 2px 3px;
    }

    .windows td {
      text-align: center;
      font-size: 11px;
      padding: 2px 3px;
      font-family: Arial, Helvetica, sans-serif;
    }

    .windows th,
    .windows td {
      width: auto;
    }

    .windows th:nth-child(1),
    .windows td:nth-child(1),
    .windows th:nth-child(2),
    .windows td:nth-child(2),
    .windows th:nth-child(3),
    .windows td:nth-child(3),
    .windows th:nth-child(4),
    .windows td:nth-child(4) {
      width: 6%;
    }

    .windows .group-header {
      text-align: center;
    }
    /* ============================================================
       MATERIAL SECTION
    ============================================================ */

    .material-section {
      margin-top: 22px;
      page-break-inside: avoid;
    }

    .material-info {
      margin-bottom: 5px;
      color: #555;
      font-size: 11px;
      line-height: 1.25;
    }

    .material-table {
      font-size: 11px;
    }

    .material-table th {
      text-align: left;
    }

    .material-table th:not(:first-child),
    .material-table td:not(:first-child) {
      text-align: center;
    }

    .material-table td:first-child {
      text-align: left;
    }

    .total-row td {
      background: #ddd !important;
      font-weight: 700;
    }

    /* ============================================================
       SUMMARY
    ============================================================ */

    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 9px;
      margin-top: 9px;
    }

    .summary-box {
      border: 1px solid #d7d7d7;
      background: #f4f4f4;
      padding: 7px 8px;
      text-align: center;
    }

    .summary-label {
      display: block;
      color: #666;
      font-size: 10px;
      margin-bottom: 2px;
    }

    .summary-value {
      display: block;
      color: #333;
      font-size: 15px;
      font-weight: 700;
    }

    /* ============================================================
       FOOTER
    ============================================================ */
    .footer {
      margin-top: 9px;
      font-size: 8px;
      color: #888;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #ddd;
      padding-top: 5px;
    }

    /* ============================================================
       PRINT
    ============================================================ */

    @media print {

      html,
      body {
        background: #fff;
      }

      .page {
        max-width: none;
        min-height: auto;
      }

      .order-box,
      .summary-box,
      th,
      .total-row td {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .material-section {
        page-break-inside: avoid;
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

    <!-- ==========================================================
         HEADER
    =========================================================== -->

    <header class="top">

      <div class="company">

        <div class="company-name">
          Desglose Pro
        </div>

        <div class="company-info">
          Software Profesional para talleres de aluminio
        </div>

      </div>
    </header>


    <!-- ==========================================================
         UPPER SECTION
    =========================================================== -->

    <section class="upper">


      <!-- ========================================================
           ORDEN DE PRODUCCIÓN
      ========================================================= -->

      <div class="order-box">

        <h2>
          Resumen del Desglose
        </h2>

        <p>
        <strong>tipo:</strong>
          Ventana P-65
        </p>

        <p>
          <strong>Cliente:</strong>
          ${proyecto?.cliente || "—"}
        </p>

        <p>
          <strong>Obra/acabado:</strong>
          ${proyecto?.obra || "—"}
        </p>

        <p>
          <strong>Color:</strong>
          ${proyecto?.color || "—"}
        </p>
        <p>
          <strong>Notas:</strong>
          ${proyecto?.notas || "—"}
        </p>
        <P>
        <Strong>Fecha:</strong>
        ${date}
        </p>

      </div>


      <!-- ========================================================
           MATERIAL PREVIEW
      ========================================================= -->

      <div class="materials-section">

        <h2 class="section-title">
          Materiales
        </h2>

        <table class="materials">

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

          </tbody>

        </table>

      </div>

    </section>


    <!-- ==========================================================
         MEDIDAS Y CORTES
    =========================================================== -->

    <section class="windows">

      <h2>
        MEDIDAS Y CORTES
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
              Hojas
            </th>

            <th colspan="2" class="group-header">
              De la hoja
            </th>

            <th colspan="2" class="group-header">
              Del marco
            </th>

            <th colspan="2" class="group-header">
              Vidrio
            </th>

            ${
              hasVidrioMedio
                ? `
                  <th rowspan="2">
                    V. Medio
                  </th>
                `
                : ""
            }

          </tr>


          <tr>

            <th>
              Cab-alf
            </th>

            <th>
              Jambas
            </th>

            <th>
              Cab-riel
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

          ${rows}

        </tbody>

      </table>

    </section>



    <!-- ==========================================================
         FOOTER
    =========================================================== -->

    <footer class="footer">

    <span>
      © 2026 - Desglose Pro
    </span>

    <span>
      ${date}
    </span>

    </footer>

  </div>

</body>
</html>
`;
};

export default function P65() {
  const navigate = useNavigate();

  const { user, fullAccess } = useAuth();

  const [showLimitModal, setShowLimitModal] = useState(false);

  const [step, setStep] = useState("proyecto");

  const [proyecto, setProyecto] = useState(null);

  const [form, setForm] = useState({
    hueco: "",
    ancho: "",
    alto: "",
    hojas: 2,
  });

  const [results, setResults] = useState([]);

  const [error, setError] = useState("");

  const [savedMsg, setSavedMsg] = useState("");

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = async () => {
    setError("");

    const allowed = await checkAndIncrementUsage(user?.uid, fullAccess);
    if (!allowed) {
      setShowLimitModal(true);
      return;
    }

    if (!form.ancho || !form.alto) {
      setError("❌ Ingresa ANCHO y ALTO");
      return;
    }

    const anchoDec = FractionUtils.parseFraction(form.ancho);

    const altoDec = FractionUtils.parseFraction(form.alto);

    if (anchoDec <= 0 || altoDec <= 0) {
      setError("❌ Las medidas deben ser mayores a 0");

      return;
    }

    const hojas = parseInt(form.hojas, 10);

    const calc = calcular(anchoDec, altoDec, hojas);

    setResults([
      ...results,
      {
        hueco: form.hueco || `H-${results.length + 1}`,
        ancho: form.ancho,
        alto: form.alto,
        hojas: `${hojas} hojas`,

        anchoDec,

        altoDec,

        hojasNum: hojas,

        cabAlf: FractionUtils.toSixteenths(calc.cabAlf),

        jambas: FractionUtils.toSixteenths(calc.jambas),

        marco: FractionUtils.toSixteenths(calc.marco),

        latMarco: FractionUtils.toSixteenths(calc.latMarco),

        vidrioAncho: FractionUtils.toSixteenths(calc.vidrioAncho),

        vidrioAlto: FractionUtils.toSixteenths(calc.vidrioAlto),

        vidrioMedio: calc.vidrioMedio
          ? FractionUtils.toSixteenths(calc.vidrioMedio)
          : null,
      },
    ]);

    setForm({
      hueco: "",
      ancho: "",
      alto: "",
      hojas: form.hojas,
    });
  };

  const handleReset = () => {
    setResults([]);

    setError("");

    setForm({
      hueco: "",
      ancho: "",
      alto: "",
      hojas: 2,
    });
  };

  const handleGuardar = () => {
    if (results.length === 0) {
      alert("No hay datos para guardar");
      return;
    }

    const materiales = calcularResumenMaterialesP65(results);

    saveDesglose({
      sistema: "Ventana P-65",
      proyecto,
      results,
      materiales,
    });

    setSavedMsg("✅ Guardado");

    setTimeout(() => {
      setSavedMsg("");
    }, 3000);
  };

  const handlePrint = () => {
    if (results.length === 0) {
      alert("No hay datos para imprimir");
      return;
    }

    const materiales = calcularResumenMaterialesP65(results);

    const w = window.open("", "_blank");

    if (!w) {
      alert("No se pudo abrir la ventana de impresión.");

      return;
    }

    w.document.write(buildPrintHtml(proyecto, results, materiales));

    w.document.close();

    setTimeout(() => {
      w.print();
    }, 500);
  };

  const hasVidrioMedio = results.some((r) => r.vidrioMedio);

  return (
    <Layout>
      {showLimitModal && (
        <DailyLimitModal onClose={() => setShowLimitModal(false)} />
      )}

      {step === "proyecto" && (
        <ProyectoModal
          onConfirm={(data) => {
            setProyecto(data);
            setStep("formulario");
          }}
          onCancel={() => navigate("/desglose")}
        />
      )}

      <div className="page-content">
        <div className="desglose-header">
          <button className="btn-back" onClick={() => navigate("/desglose")}>
            <i
              className="bi bi-arrow-left"
              style={{
                marginRight: "6px",
              }}
            ></i>
            Volver
          </button>

          <h1 className="page-title">Ventana P-65</h1>

          <div className="desglose-header-actions">
            {results.length > 0 && (
              <>
                {savedMsg ? (
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--success)",
                      fontWeight: 600,
                    }}
                  >
                    {savedMsg}
                  </span>
                ) : (
                  <button className="btn-secondary-sm" onClick={handleGuardar}>
                    <i
                      className="bi bi-save"
                      style={{
                        marginRight: "6px",
                      }}
                    ></i>
                    Guardar
                  </button>
                )}

                <button className="btn-primary-sm" onClick={handlePrint}>
                  <i
                    className="bi bi-printer"
                    style={{
                      marginRight: "6px",
                    }}
                  ></i>
                  Imprimir
                </button>
              </>
            )}
          </div>
        </div>

        {proyecto && (
          <div
            className="card-modern mb-4"
            style={{
              background: "#f0f9ff",
              border: "1px solid #bfdbfe",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                  fontSize: "13px",
                }}
              >
                <span>
                  <strong>Cliente:</strong> {proyecto.cliente}
                </span>

                {proyecto.obra && (
                  <span>
                    <strong>Obra:</strong> {proyecto.obra}
                  </span>
                )}

                {proyecto.color && (
                  <span>
                    <strong>Color:</strong> {proyecto.color}
                  </span>
                )}
              </div>

              <button
                className="btn-ghost-sm"
                onClick={() => setStep("proyecto")}
                style={{
                  fontSize: "11px",
                }}
              >
                <i
                  className="bi bi-pencil"
                  style={{
                    marginRight: "4px",
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
                  background: "#fffbeb",
                  padding: "5px 8px",
                  borderRadius: "6px",
                }}
              >
                <i
                  className="bi bi-sticky"
                  style={{
                    marginRight: "4px",
                  }}
                ></i>

                {proyecto.notas}
              </div>
            )}
          </div>
        )}

        {step === "formulario" && (
          <div className="card-modern mb-4">
            <div className="form-grid-4">
              <div className="auth-field">
                <label className="auth-label">Hueco #</label>

                <input
                  type="text"
                  name="hueco"
                  value={form.hueco}
                  onChange={handleFormChange}
                  placeholder="ej: A-1"
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Ancho</label>

                <input
                  type="text"
                  name="ancho"
                  value={form.ancho}
                  onChange={handleFormChange}
                  placeholder={'ej: 91 1/2"'}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Alto</label>

                <input
                  type="text"
                  name="alto"
                  value={form.alto}
                  onChange={handleFormChange}
                  placeholder={'ej: 74 7/8"'}
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Hojas</label>

                <select
                  name="hojas"
                  value={form.hojas}
                  onChange={handleFormChange}
                  className="auth-input"
                >
                  <option value={2}>2 hojas</option>

                  <option value={3}>3 hojas</option>

                  <option value={4}>4 hojas</option>
                </select>
              </div>
            </div>

            {error && (
              <div
                className="auth-error"
                style={{
                  marginTop: "0.5rem",
                }}
              >
                {error}
              </div>
            )}

            <div className="form-actions">
              <button className="auth-btn" onClick={handleAdd}>
                <i
                  className="bi bi-plus-circle"
                  style={{
                    marginRight: "6px",
                  }}
                ></i>
                Agregar
              </button>

              {results.length > 0 && (
                <button className="btn-outline-lg" onClick={handleReset}>
                  <i
                    className="bi bi-arrow-counterclockwise"
                    style={{
                      marginRight: "6px",
                    }}
                  ></i>
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="table-container">
            <div className="table-title">VENTANA P-65</div>

            <div className="table-responsive">
              <table
                className="table-professional"
                style={{
                  minWidth: "900px",
                }}
              >
                <thead>
                  <tr>
                    <th rowSpan="2">Hueco</th>

                    <th rowSpan="2">Ancho</th>

                    <th rowSpan="2">Alto</th>

                    <th rowSpan="2">Hojas</th>

                    <th colSpan="2">De la hoja</th>

                    <th colSpan="2">Del marco</th>

                    <th colSpan="2">Vidrio</th>

                    {hasVidrioMedio && <th rowSpan="2">V. Medio</th>}
                  </tr>

                  <tr>
                    <th>Cab-alf</th>
                    <th>Jambas</th>
                    <th>Cab-riel</th>
                    <th>Lat-marco</th>
                    <th>Ancho</th>
                    <th>Alto</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.hueco}</td>

                      <td>{row.ancho}</td>

                      <td>{row.alto}</td>

                      <td>{row.hojas}</td>

                      <td>{row.cabAlf}</td>

                      <td>{row.jambas}</td>

                      <td>{row.marco}</td>

                      <td>{row.latMarco}</td>

                      <td>{row.vidrioAncho}</td>

                      <td>{row.vidrioAlto}</td>

                      {hasVidrioMedio && <td>{row.vidrioMedio || "—"}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results.length > 0 && <MaterialP65 medidas={results} />}

        {results.length === 0 && step === "formulario" && (
          <div
            className="card-modern text-center"
            style={{
              padding: "2rem",
              color: "var(--gray-500)",
            }}
          >
            Ingresa las medidas y haz clic en "Agregar"
          </div>
        )}
      </div>
    </Layout>
  );
}
