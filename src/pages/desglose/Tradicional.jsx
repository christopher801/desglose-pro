import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import FractionUtils from "../../utils/fraction";
import ProyectoModal from "./components/ProyectoModal";
import MaterialTradicional from "./components/MaterialTradicional";

import { saveDesglose } from "../../services/historialService";
import { useAuth } from "../../context/AuthContext";
import { checkAndIncrementUsage } from "../../services/usageService";
import DailyLimitModal from "../../components/DailyLimitModal";

import {
  calcularResumenMaterialesTradicional,
} from "../../utils/tradicionalMaterials";

const calcular = (ancho, alto, hojas) => {
  if (hojas === 2) {
    return {
      cabAlf: ancho / 2 - 4 / 16,
      jambas: alto - 12 / 16,
      marco: ancho - 2 / 16,
      latMarco: alto - 1 / 2,
      vidrioAncho: ancho / 2 - (2 + 1 / 8),
      vidrioAlto: alto - (3 + 13 / 16),
      vidrioMedio: null,
    };
  }

  if (hojas === 3) {
    return {
      cabAlf: ancho / 3 + 1 / 16,
      jambas: alto - 12 / 16,
      marco: ancho - 2 / 16,
      latMarco: alto - 1 / 2,
      vidrioAncho: ancho / 3 - (1 + 12 / 16),
      vidrioAlto: alto - (3 + 13 / 16),
      vidrioMedio: ancho / 3 - 15 / 16,
    };
  }

  return {
    cabAlf: ancho / 4 - 3 / 16,
    jambas: alto - 12 / 16,
    marco: ancho - 1 / 8,
    latMarco: alto - 1 / 2,
    vidrioAncho: ancho / 4 - (2 + 1 / 16),
    vidrioAlto: alto - (3 + 13 / 16),
    vidrioMedio: null,
  };
};

const buildPrintHtml = (
  title,
  projectInfo,
  results,
  materiales
) => {
  const hasVidrioMedio = results.some(
    (r) => r.vidrioMedio
  );

  const date = new Date().toLocaleDateString(
    "es-DO"
  );

  // ============================================================
  // FILAS DE MEDIDAS Y CORTES
  // ============================================================

  const rows = results
    .map(
      (row) => `
        <tr>

          <td>
            ${row.hueco}
          </td>

          <td>
            ${row.ancho}
          </td>

          <td>
            ${row.alto}
          </td>

          <td>
            ${row.hojas}
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

          ${
            hasVidrioMedio
              ? `
                <td>
                  ${row.vidrioMedio || "—"}
                </td>
              `
              : ""
          }

        </tr>
      `
    )
    .join("");


  // ============================================================
  // MATERIALES
  // ============================================================

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


  // ============================================================
  // TOTALES
  // ============================================================

  const totalPiezas = materiales.reduce(
    (total, item) =>
      total + item.piezas,
    0
  );

  const totalPies = materiales.reduce(
    (total, item) =>
      total + item.pies,
    0
  );

  const totalBarras = materiales.reduce(
    (total, item) =>
      total + item.barras,
    0
  );


  // ============================================================
  // HTML
  // ============================================================

  return `
<!doctype html>

<html lang="es">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>${title}</title>

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


    /* ============================================================
       UPPER SECTION
    ============================================================ */

    .upper {
      display: grid;

      grid-template-columns:
        240px
        1fr;

      gap: 48px;

      margin-top: 14px;

      align-items: start;
    }


    /* ============================================================
       RESUMEN
    ============================================================ */

    .order-box {
      border: 1px solid #d7d7d7;

      border-radius: 6px;

      background: #e5e7eb;

      padding:
        12px
        14px
        10px;
    }

    .order-box h2 {
      margin:
        0
        0
        8px;

      font-size: 16px;

      font-weight: 700;

      text-align: left;

      color: #111;
    }

    .order-box p {
      margin:
        5px
        0;

      font-size: 12px;

      line-height: 1.25;
    }


    /* ============================================================
       MATERIALS
    ============================================================ */

    .materials-section {
      min-width: 0;
    }

    .section-title {
      margin:
        0
        0
        4px;

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
      border:
        1px
        solid
        #c9c9c9;

      padding:
        3px
        5px;

      vertical-align: middle;

      line-height: 1.1;
    }

    th {
      background: #e5e7eb;

      color: #111;

      font-weight: 700;

      text-align: left;
    }

    td {
      background: #fff;
    }


    /* ============================================================
       MATERIAL TABLE
    ============================================================ */

    .materials th:nth-child(1) {
      width: 55%;
    }

    .materials th:nth-child(2),
    .materials th:nth-child(3),
    .materials th:nth-child(4) {
      width: 15%;
    }

    .materials td:nth-child(2),
    .materials td:nth-child(3),
    .materials td:nth-child(4) {
      text-align: center;
    }

    .materials-total td {
      background: #ddd !important;

      font-weight: 700;
    }


    /* ============================================================
       MEDIDAS Y CORTES
    ============================================================ */

    .windows {
      margin-top: 30px;
    }

    .windows h2 {
      margin:
        0
        0
        5px;

      font-size: 16px;

      font-weight: 700;

      text-align: left;

      color: #111;
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

      padding:
        2px
        3px;
    }

    .windows td {
      text-align: center;

      font-size: 11px;

      padding:
        2px
        3px;

      font-family:
        Arial,
        Helvetica,
        sans-serif;
    }


    /* ============================================================
       FIRST COLUMNS
    ============================================================ */

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
       SUMMARY
    ============================================================ */

    .summary {
      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 9px;

      margin-top: 9px;
    }

    .summary-box {
      border:
        1px
        solid
        #d7d7d7;

      background: #f4f4f4;

      padding:
        7px
        8px;

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

      border-top:
        1px
        solid
        #ddd;

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
      .materials-total td {
        -webkit-print-color-adjust:
          exact;

        print-color-adjust:
          exact;
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
           RESUMEN DEL DESGLOSE
      ========================================================= -->

      <div class="order-box">

        <h2>
          Resumen del Desglose
        </h2>

        <p>
          <strong>Tipo:</strong>
          Ventana Tradicional
        </p>

        <p>
          <strong>Cuenta:</strong>
          ${projectInfo?.cuenta || "—"}
        </p>

        <p>
          <strong>Obra:</strong>
          ${projectInfo?.obra || "—"}
        </p>

        <p>
          <strong>Color:</strong>
          ${projectInfo?.color || "—"}
        </p>

        <p>
          <strong>Fecha:</strong>
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

            <tr class="materials-total">

              <td>
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

            <th
              colspan="2"
              class="group-header"
            >
              De la hoja
            </th>

            <th
              colspan="2"
              class="group-header"
            >
              Del marco
            </th>

            <th
              colspan="2"
              class="group-header"
            >
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

export default function Tradicional() {
  const navigate = useNavigate();

  const { user, fullAccess } = useAuth();

  const [showLimitModal, setShowLimitModal] = useState(false);

  const [step, setStep] = useState("proyecto");

  const [form, setForm] = useState({
    hueco: "",
    ancho: "",
    alto: "",
    hojas: 2,
  });

  const [results, setResults] = useState([]);

  const [projectInfo, setProjectInfo] = useState({
    cuenta: "",
    obra: "",
    color: "",
  });

  const [error, setError] = useState("");

  const [saved, setSaved] = useState(false);

  const handleProjectConfirm = (data) => {
    setProjectInfo({
      cuenta: data.cliente || data.cuenta || "",
      obra: data.obra || "",
      color: data.color || "",
    });

    setStep("formulario");

    setSaved(false);
  };

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setSaved(false);
  };

  const handleAdd = async () => {
    setError("");

    const allowed = await checkAndIncrementUsage(user?.uid, fullAccess);
    if (!allowed) { setShowLimitModal(true); return; }

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
      anchoDec <= 0 ||
      altoDec <= 0
    ) {
      setError(
        "❌ Las medidas deben ser mayores a 0"
      );

      return;
    }

    const hojas = parseInt(
      form.hojas,
      10
    );

    const calc = calcular(
      anchoDec,
      altoDec,
      hojas
    );

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
          ),

        vidrioMedio:
          calc.vidrioMedio
            ? FractionUtils.toSixteenths(
                calc.vidrioMedio
              )
            : null,
      },
    ]);

    setSaved(false);

    setForm({
      hueco: "",
      ancho: "",
      alto: "",
      hojas: form.hojas,
    });
  };

  const handleSave = () => {
    if (results.length === 0) {
      alert(
        "No hay datos para guardar"
      );

      return;
    }

    const materiales =
      calcularResumenMaterialesTradicional(
        results
      );

    const historialEntry = {
      id: `ventana-tradicional-${Date.now()}`,

      fecha:
        new Date().toISOString(),

      sistema:
        "Ventana Tradicional",

      proyecto: {
        cliente:
          projectInfo.cuenta ||
          "Sin cliente",

        obra:
          projectInfo.obra || "",

        color:
          projectInfo.color || "",

        notas: "",
      },

      results,

      materiales,
    };

    try {
      saveDesglose(
        historialEntry
      );

      setSaved(true);

    } catch (err) {
      console.error(
        "Error guardando desglose Ventana Tradicional:",
        err
      );

      alert(
        "❌ No se pudo guardar el desglose."
      );
    }
  };

  const handleReset = () => {
    setResults([]);

    setError("");

    setSavedMsg("");

    setForm({
      hueco: "",
      ancho: "",
      alto: "",
      hojas: 2,
    });
  };
  const handlePrint = () => {
    if (results.length === 0) {
      alert(
        "No hay datos para imprimir"
      );

      return;
    }

    const materiales =
      calcularResumenMaterialesTradicional(
        results
      );

    const w = window.open(
      "",
      "_blank"
    );

    if (!w) {
      alert(
        "No se pudo abrir la ventana de impresión. Verifica que los pop-ups estén permitidos."
      );

      return;
    }

    w.document.write(
      buildPrintHtml(
        "VENTANA TRADICIONAL",
        projectInfo,
        results,
        materiales
      )
    );

    w.document.close();

    setTimeout(() => {
      w.print();
    }, 500);
  };

  const hasVidrioMedio =
    results.some(
      (r) => r.vidrioMedio
    );

  return (
    <Layout>

      {showLimitModal && (
        <DailyLimitModal onClose={() => setShowLimitModal(false)} />
      )}

      {step === "proyecto" && (
        <ProyectoModal
          onConfirm={
            handleProjectConfirm
          }
          onCancel={() =>
            navigate("/desglose")
          }
        />
      )}

      <div className="page-content">

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
            Ventana Tradicional
          </h1>

          <div className="desglose-header-actions">

            {results.length > 0 && (
              <>
                <button
                  className="btn-secondary-sm"
                  onClick={
                    handleSave
                  }
                >
                  <i
                    className="bi bi-save"
                    style={{
                      marginRight:
                        "6px",
                    }}
                  ></i>

                  {saved
                    ? "Guardado"
                    : "Guardar"}
                </button>

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

        {projectInfo.cuenta && (
          <div
            className="card-modern mb-4"
            style={{
              background:
                "#f0f9ff",
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
                  display:
                    "flex",
                  gap:
                    "1.5rem",
                  flexWrap:
                    "wrap",
                  fontSize:
                    "13px",
                }}
              >

                <span>
                  <strong>
                    Cuenta:
                  </strong>{" "}
                  {
                    projectInfo.cuenta
                  }
                </span>

                {projectInfo.obra && (
                  <span>
                    <strong>
                      Obra:
                    </strong>{" "}
                    {
                      projectInfo.obra
                    }
                  </span>
                )}

                {projectInfo.color && (
                  <span>
                    <strong>
                      Color:
                    </strong>{" "}
                    {
                      projectInfo.color
                    }
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
                  fontSize:
                    "11px",
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
          </div>
        )}

        {step === "formulario" && (
          <div className="card-modern mb-4">

            <div className="form-grid-4">

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
                  placeholder={'ej: 91 1/2"'}
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
                  value={
                    form.alto
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder={'ej: 74 7/8"'}
                  className="auth-input"
                />

              </div>

              <div className="auth-field">

                <label className="auth-label">
                  Hojas
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

                  <option value={2}>
                    2 hojas
                  </option>

                  <option value={3}>
                    3 hojas
                  </option>

                  <option value={4}>
                    4 hojas
                  </option>

                </select>

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

        {results.length > 0 ? (
          <>
            <div className="table-container">

              <div className="table-title">
                VENTANA TRADICIONAL
              </div>

              <div className="table-responsive">

                <table
                  className="table-professional"
                  style={{
                    minWidth:
                      "900px",
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
                        Hojas
                      </th>

                      <th colSpan="2">
                        De la hoja
                      </th>

                      <th colSpan="2">
                        Del marco
                      </th>

                      <th colSpan="2">
                        Vidrio
                      </th>

                      {hasVidrioMedio && (
                        <th rowSpan="2">
                          V. Medio
                        </th>
                      )}

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

                    {results.map(
                      (row, idx) => (
                        <tr
                          key={idx}
                        >

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
                            {row.hojas}
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
                            {
                              row.vidrioAncho
                            }
                          </td>

                          <td>
                            {
                              row.vidrioAlto
                            }
                          </td>

                          {hasVidrioMedio && (
                            <td>
                              {
                                row.vidrioMedio ||
                                "—"
                              }
                            </td>
                          )}

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            </div>

            <MaterialTradicional
              medidas={results}
            />
          </>
        ) : (
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
              haz clic en "Agregar"
            </div>
          )
        )}

      </div>

    </Layout>
  );
}