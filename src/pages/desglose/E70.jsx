import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import FractionUtils from "../../utils/fraction";

import ProyectoModal from "./components/ProyectoModal";
import MaterialE70 from "./components/MaterialE70";

import { saveDesglose } from "../../services/historialService";

import {
  calcularResumenMaterialesE70,
} from "../../utils/e70Materials";

const calcular = (ancho, alto, hojas) => {
  if (hojas === 2) {
    return {
      cabAlf: (ancho - 1) / 2,
      jambas: alto - (2 + 5 / 8),
      marco: ancho - 1 / 8,
      latMarco: alto - 1 / 8,
      vidrioAncho:
        (ancho - (9 + 10 / 16)) / 2,
      vidrioAlto:
        alto - (6 + 11 / 16),
      vidrioMedio: null,
    };
  }

  if (hojas === 3) {
    return {
      cabAlf:
        ancho / 3 + 5 / 16,
      jambas:
        alto - (2 + 5 / 8),
      marco:
        ancho - 1 / 8,
      latMarco:
        alto - 1 / 8,
      vidrioAncho:
        ancho / 3 - (3 + 7 / 8),
      vidrioAlto:
        alto - (6 + 3 / 4),
      vidrioMedio:
        ancho / 3 - (3 + 7 / 8),
    };
  }

  return {
    cabAlf:
      ancho / 4 + 3 / 16,
    jambas:
      alto - (2 + 5 / 8),
    marco:
      ancho - 1 / 8,
    latMarco:
      alto - 1 / 8,
    vidrioAncho:
      ancho / 4 - (3 + 7 / 8),
    vidrioAlto:
      alto - (6 + 3 / 4),
    vidrioMedio: null,
  };
};

export default function E70() {
  const navigate = useNavigate();

  const [step, setStep] =
    useState("proyecto");

  const [proyecto, setProyecto] =
    useState(null);

  const [form, setForm] = useState({
    hueco: "",
    ancho: "",
    alto: "",
    hojas: 2,
  });

  const [results, setResults] =
    useState([]);

  const [error, setError] =
    useState("");

  const [savedMsg, setSavedMsg] =
    useState("");

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAdd = () => {
    setError("");

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
        hueco:
          form.hueco ||
          `H-${results.length + 1}`,

        ancho: form.ancho,

        alto: form.alto,

        hojas: `${hojas} hojas`,

        // Valores numéricos para materiales
        anchoDec,

        altoDec,

        hojasNum: hojas,

        // Resultados formateados
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
          calc.vidrioMedio !== null
            ? FractionUtils.toSixteenths(
                calc.vidrioMedio
              )
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

    setSavedMsg("");

    setForm({
      hueco: "",
      ancho: "",
      alto: "",
      hojas: 2,
    });
  };

  const handleGuardar = () => {
    if (results.length === 0) {
      alert(
        "No hay datos para guardar"
      );
      return;
    }

    const materiales =
      calcularResumenMaterialesE70(
        results
      );

    saveDesglose({
      id: `ventana-e70-${Date.now()}`,

      fecha:
        new Date().toISOString(),

      sistema:
        "Ventana E-70",

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
      alert(
        "No hay datos para imprimir"
      );
      return;
    }

    const materiales =
      calcularResumenMaterialesE70(
        results
      );

    const hasVidrioMedio =
      results.some(
        (r) => r.vidrioMedio
      );

    const date =
      new Date().toLocaleDateString(
        "es-DO"
      );

    const tableRows =
      results
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
              ${
                hasVidrioMedio
                  ? `<td>${
                      row.vidrioMedio ||
                      "—"
                    }</td>`
                  : ""
              }
            </tr>
          `
        )
        .join("");

    const materialRows =
      materiales
        .map(
          (item) => `
            <tr>
              <td style="text-align:left">
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

    const totalPiezas =
      materiales.reduce(
        (total, item) =>
          total + item.piezas,
        0
      );

    const totalPies =
      materiales.reduce(
        (total, item) =>
          total + item.pies,
        0
      );

    const totalBarras =
      materiales.reduce(
        (total, item) =>
          total + item.barras,
        0
      );

    const html = `
      <!DOCTYPE html>

      <html>

      <head>

        <title>
          VENTANA E-70
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            font-family:
              Arial,
              sans-serif;

            margin: .5in;

            background: white;

            color: #1e293b;
          }

          h1 {
            font-size: 18px;

            text-align: center;

            color: #1e2b3c;

            margin-bottom: 4px;
          }

          h2 {
            font-size: 11px;

            text-align: center;

            color: #555;

            font-weight: 400;

            margin-bottom: 12px;
          }

          h3 {
            font-size: 12px;

            color: #1e2b3c;

            margin-top: 20px;

            margin-bottom: 8px;
          }

          .info {
            display: flex;

            gap: 2rem;

            font-size: 11px;

            margin-bottom: 12px;

            background: #f8f9fa;

            padding: 8px;

            border-radius: 4px;

            flex-wrap: wrap;
          }

          table {
            width: 100%;

            border-collapse:
              collapse;

            font-size: 10px;

            margin-bottom: 12px;
          }

          th {
            background: #1e2b3c;

            color: white;

            padding: 5px;

            border:
              1px solid #2c3e50;

            text-align: center;
          }

          th[colspan] {
            background:
              #2c3e50;
          }

          td {
            padding: 4px 5px;

            border:
              1px solid #cbd5e1;

            text-align: center;

            font-family:
              monospace;
          }

          tr:nth-child(even)
            td {
            background:
              #f8f9fa;
          }

          .total-row td,
          .total-row th {
            font-weight: 700;

            background:
              #eef2f7;
          }

          .footer {
            margin-top: 12px;

            font-size: 9px;

            color: #888;

            display: flex;

            justify-content:
              space-between;

            border-top:
              1px solid #ddd;

            padding-top: 6px;
          }

          @media print {

            th {
              -webkit-print-color-adjust:
                exact;

              print-color-adjust:
                exact;
            }

          }

        </style>

      </head>

      <body>

        <h1>
          VENTANA E-70
        </h1>

        <h2>
          SISTEMA PROFESIONAL
          DE CÁLCULO
        </h2>

        <div class="info">

          <span>
            <strong>
              Cliente:
            </strong>

            ${
              proyecto?.cliente ||
              "—"
            }
          </span>

          <span>
            <strong>
              Obra:
            </strong>

            ${
              proyecto?.obra ||
              "—"
            }
          </span>

          <span>
            <strong>
              Color:
            </strong>

            ${
              proyecto?.color ||
              "—"
            }
          </span>

        </div>

        <h3>
          CÁLCULO DE MEDIDAS
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

              <th rowspan="2">
                Hojas
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

            ${tableRows}

          </tbody>

        </table>

        <h3>
          MATERIALES E-70
        </h3>

        <table>

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

          <tfoot>

            <tr class="total-row">

              <th>
                TOTAL
              </th>

              <th>
                ${totalPiezas}
              </th>

              <th>
                ${totalPies.toFixed(2)}
              </th>

              <th>
                ${totalBarras}
              </th>

            </tr>

          </tfoot>

        </table>

        <div class="footer">

          <span>
            © 2026 - Desglose Pro
          </span>

          <span>
            Barra: 21 pies (252")
          </span>

          <span>
            ${date}
          </span>

        </div>

      </body>

      </html>
    `;

    const w =
      window.open(
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

  const hasVidrioMedio =
    results.some(
      (r) => r.vidrioMedio
    );

  return (
    <Layout>

      {step === "proyecto" && (
        <ProyectoModal
          onConfirm={(data) => {
            setProyecto(data);
            setStep("formulario");
          }}
          onCancel={() =>
            navigate("/desglose")
          }
        />
      )}

      <div className="page-content">

        {/* =========================
            HEADER
        ========================== */}

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
            Ventana E-70
          </h1>

          <div
            className="desglose-header-actions"
          >

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

        {/* =========================
            INFO PROYECTO
        ========================== */}

        {proyecto && (
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
                  setStep("proyecto")
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

        {/* =========================
            FORMULARIO
        ========================== */}

        {step === "formulario" && (
          <div
            className="card-modern mb-4"
          >

            <div className="form-grid-4">

              <div className="auth-field">

                <label className="auth-label">
                  Hueco #
                </label>

                <input
                  type="text"
                  name="hueco"
                  value={form.hueco}
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
                  value={form.ancho}
                  onChange={
                    handleFormChange
                  }
                  placeholder='ej: 91 1/2"'
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
                  onChange={
                    handleFormChange
                  }
                  placeholder='ej: 74 7/8"'
                  className="auth-input"
                />

              </div>

              <div className="auth-field">

                <label className="auth-label">
                  Hojas
                </label>

                <select
                  name="hojas"
                  value={form.hojas}
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
                onClick={handleAdd}
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

        {/* =========================
            TABLA RESULTADOS
        ========================== */}

        {results.length > 0 && (
          <div className="table-container">

            <div className="table-title">
              VENTANA E-70
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
                      <tr key={idx}>

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
                          {row.vidrioAncho}
                        </td>

                        <td>
                          {row.vidrioAlto}
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
        )}

        {/* =========================
            MATERIALES
        ========================== */}

        {results.length > 0 && (
          <MaterialE70
            medidas={results}
          />
        )}

        {/* =========================
            EMPTY STATE
        ========================== */}

        {results.length === 0 &&
          step === "formulario" && (
            <div
              className="card-modern text-center"
              style={{
                padding: "2rem",
                color:
                  "var(--gray-500)",
              }}
            >
              Ingresa las medidas y haz
              clic en "Agregar"
            </div>
          )}

      </div>

    </Layout>
  );
}