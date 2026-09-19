import { formatFractionalInches } from "./barraUnits";

const escapeHtml = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatInches = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  return formatFractionalInches(numericValue);
};

const formatDecimalInches = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  return `${numericValue.toFixed(3)}"`;
};

const formatPercent = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "0%";
  }

  return `${numericValue.toFixed(1)}%`;
};

const getUnitLabel = (unit) => {
  const labels = {
    in: "pulgadas",
    cm: "centímetros",
    m: "metros",
    ft: "pies",
  };

  return labels[unit] || "pulgadas";
};

const getDate = () => {
  return new Date().toLocaleDateString("es-DO");
};

const buildCutHtml = (cut, index, barLength) => {
  const cutLength = Number(cut?.length) || 0;
  const cutUsage = Number(cut?.lengthWithSaw) || cutLength;

  const width =
    barLength > 0
      ? Math.max(0, Math.min(100, (cutUsage / barLength) * 100))
      : 0;

  return `
    <div
      class="cut"
      style="width: ${width.toFixed(4)}%;"
      title="${escapeHtml(cut?.label || `Corte ${index + 1}`)}"
    >
      <div class="cut-label">
        ${escapeHtml(cut?.label || `Corte ${index + 1}`)}
      </div>

      <div class="cut-length">
        ${formatInches(cutLength)}
      </div>
    </div>
  `;
};

const buildBarHtml = (bar, index) => {
  const barLength = Number(bar?.barLength) || 0;
  const usedLength = Number(bar?.usedLength) || 0;
  const waste = Number(bar?.waste) || 0;

  const usedPercent =
    barLength > 0
      ? Math.max(0, Math.min(100, (usedLength / barLength) * 100))
      : 0;

  const wastePercent = Math.max(0, 100 - usedPercent);

  const cuts = Array.isArray(bar?.cuts) ? bar.cuts : [];

  const cutsHtml = cuts.length
    ? cuts
        .map((cut, cutIndex) =>
          buildCutHtml(cut, cutIndex, barLength)
        )
        .join("")
    : `
        <div class="empty-cut">
          Sin cortes
        </div>
      `;

  return `
    <section class="bar-section">

      <div class="bar-header">

        <div class="bar-title">
          Barra ${index + 1}
        </div>

        <div class="bar-material">
          ${escapeHtml(bar?.material || "Material sin especificar")}
        </div>

      </div>

      <div class="bar-meta">

        <span>
          <strong>Largo:</strong>
          ${formatInches(barLength)}
        </span>

        <span>
          <strong>Cortes:</strong>
          ${cuts.length}
        </span>

        <span>
          <strong>Usado:</strong>
          ${formatInches(usedLength)}
          (${formatPercent(usedPercent)})
        </span>

        <span>
          <strong>Desperdicio:</strong>
          ${formatInches(waste)}
          (${formatPercent(wastePercent)})
        </span>

      </div>

      <div class="bar-diagram">

        <div class="bar-track">

          ${cutsHtml}

          ${
            wastePercent > 0
              ? `
                <div
                  class="waste"
                  style="width: ${wastePercent.toFixed(4)}%;"
                >
                  <span>Desperdicio</span>
                </div>
              `
              : ""
          }

        </div>

      </div>

      <div class="cut-list">

        ${
          cuts.length
            ? cuts
                .map(
                  (cut, cutIndex) => `
                    <div class="cut-item">

                      <span class="cut-number">
                        ${cutIndex + 1}.
                      </span>

                      <span class="cut-name">
                        ${escapeHtml(
                          cut?.label || `Corte ${cutIndex + 1}`
                        )}
                      </span>

                      <span class="cut-value">
                        ${formatInches(cut?.length)}
                      </span>

                    </div>
                  `
                )
                .join("")
            : ""
        }

      </div>

    </section>
  `;
};

export function exportBarsToPdf({
  result,
  barLength,
  saw,
  unit = "in",
}) {
  if (typeof window === "undefined") {
    return;
  }

  if (!result?.bars?.length) {
    window.alert("No hay resultados de optimización para exportar.");
    return;
  }

  const bars = Array.isArray(result.bars)
    ? result.bars
    : [];

  const summary = result.summary || {};

  const numericBarLength =
    Number(barLength) ||
    Number(summary.barLength) ||
    0;

  const numericSaw =
    Number(saw) ||
    Number(summary.saw) ||
    0;

  const totalBars =
    Number(summary.totalBars) || bars.length;

  const totalCuts =
    Number(summary.totalCuts) ||
    bars.reduce(
      (total, bar) =>
        total + (Array.isArray(bar.cuts) ? bar.cuts.length : 0),
      0
    );

  const totalAvailable =
    Number(summary.totalAvailable) ||
    bars.reduce(
      (total, bar) =>
        total + (Number(bar.barLength) || 0),
      0
    );

  const totalUsed =
    Number(summary.totalUsed) ||
    bars.reduce(
      (total, bar) =>
        total + (Number(bar.usedLength) || 0),
      0
    );

  const totalWaste =
    Number(summary.totalWaste) ||
    bars.reduce(
      (total, bar) =>
        total + (Number(bar.waste) || 0),
      0
    );

  const efficiency =
    Number(summary.efficiency) ||
    (totalAvailable > 0
      ? (totalUsed / totalAvailable) * 100
      : 0);

  const date = getDate();
  const unitLabel = getUnitLabel(unit);

  const materialGroups = bars.reduce((groups, bar) => {
    const material =
      bar?.material || "Sin material";

    if (!groups[material]) {
      groups[material] = 0;
    }

    groups[material] += 1;

    return groups;
  }, {});

  const materialSummary = Object.entries(materialGroups)
    .map(
      ([material, count]) => `
        <tr>
          <td>${escapeHtml(material)}</td>
          <td>${count}</td>
        </tr>
      `
    )
    .join("");

  const barsHtml = bars
    .map((bar, index) => buildBarHtml(bar, index))
    .join("");

  const html = `
<!doctype html>

<html lang="es">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Croquis de Barras - Desglose Pro</title>

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
      color: #110e0e;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11px;
    }

    body {
      padding: 0;
    }

    .page {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px 22px 12px;
    }

    /* ============================================================
       HEADER
    ============================================================ */

    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding-bottom: 12px;
      border-bottom: 1px solid #cfcfcf;
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
      margin-top: 3px;
      color: #110e0e;
      font-size: 11px;
    }

    /* ============================================================
       DOCUMENT HEADER
    ============================================================ */

    .document-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ddd;
    }

    .document-title h1 {
      margin: 0;
      color: #444;
      font-size: 19px;
      line-height: 1;
      font-weight: 700;
    }

    .document-title .sub {
      margin-top: 4px;
      color: #110e0e;
      font-size: 10px;
    }

    .document-info {
      text-align: right;
      color: #444;
      font-size: 10px;
      line-height: 1.4;
    }

    /* ============================================================
       CONFIGURATION
    ============================================================ */

    .configuration {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin-top: 9px;
    }

    .config-box {
      border: 1px solid #d7d7d7;
      background: #e5e7eb;
      padding: 6px 8px;
      text-align: center;
    }

    .config-label {
      display: block;
      color: #444;
      font-size: 9px;
      margin-bottom: 2px;
      text-transform: uppercase;
    }

    .config-value {
      display: block;
      color: #110e0e;
      font-size: 13px;
      font-weight: 700;
    }

    /* ============================================================
       SUMMARY
    ============================================================ */

    .summary {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 7px;
      margin-top: 9px;
    }

    .summary-box {
      border: 1px solid #d7d7d7;
      background: #f4f4f4;
      padding: 6px 7px;
      text-align: center;
    }

    .summary-label {
      display: block;
      color: #666;
      font-size: 9px;
      margin-bottom: 2px;
    }

    .summary-value {
      display: block;
      color: #333;
      font-size: 13px;
      font-weight: 700;
    }

    /* ============================================================
       MATERIALS
    ============================================================ */

    .materials {
      margin-top: 10px;
    }

    .section-title {
      margin: 0 0 4px;
      color: #444;
      font-size: 13px;
      font-weight: 700;
    }

    .materials table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .materials th,
    .materials td {
      border: 1px solid #c9c9c9;
      padding: 3px 5px;
      line-height: 1.1;
    }

    .materials th {
      background: #e5e7eb;
      color: #444;
      font-weight: 700;
      text-align: left;
    }

    .materials td {
      background: #fff;
    }

    .materials th:last-child,
    .materials td:last-child {
      width: 15%;
      text-align: center;
    }

    /* ============================================================
       BARS
    ============================================================ */

    .bars {
      margin-top: 12px;
    }

    .bar-section {
      margin-top: 9px;
      border: 1px solid #d1d1d1;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .bar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #e5e7eb;
      padding: 5px 8px;
      border-bottom: 1px solid #d1d1d1;
    }

    .bar-title {
      color: #444;
      font-size: 12px;
      font-weight: 700;
    }

    .bar-material {
      color: #110e0e;
      font-size: 10px;
      font-weight: 700;
    }

    .bar-meta {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 5px 8px;
      color: #555;
      font-size: 9px;
      border-bottom: 1px solid #ddd;
    }

    .bar-meta strong {
      color: #444;
    }

    /* ============================================================
       BAR DIAGRAM
    ============================================================ */

    .bar-diagram {
      padding: 8px 9px 5px;
    }

    .bar-track {
      width: 100%;
      min-height: 31px;
      display: flex;
      overflow: hidden;
      border: 1px solid #444;
      background: #fff;
    }

    .cut {
      min-width: 20px;
      min-height: 29px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-right: 1px solid #fff;
      background: #444;
      color: #fff;
      text-align: center;
      padding: 2px;
    }

    .cut-label {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 8px;
      font-weight: 700;
    }

    .cut-length {
      margin-top: 1px;
      font-size: 7px;
      white-space: nowrap;
    }

    .waste {
      min-width: 24px;
      min-height: 29px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      background: #e5e7eb;
      color: #444;
      text-align: center;
      padding: 2px;
      font-size: 7px;
      font-weight: 700;
    }

    .empty-cut {
      width: 100%;
      padding: 8px;
      text-align: center;
      color: #666;
    }

    /* ============================================================
       CUT LIST
    ============================================================ */

    .cut-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      padding: 0 9px 7px;
    }

    .cut-item {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: #555;
      font-size: 8px;
    }

    .cut-number {
      color: #444;
      font-weight: 700;
    }

    .cut-name {
      color: #444;
    }

    .cut-value {
      color: #110e0e;
      font-weight: 700;
    }

    /* ============================================================
       FOOTER
    ============================================================ */

    .footer {
      margin-top: 10px;
      padding-top: 5px;
      border-top: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      color: #888;
      font-size: 8px;
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
        padding: 10px 14px 8px;
      }

      .config-box,
      .summary-box,
      .bar-header,
      .cut,
      .waste,
      .materials th {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .bar-section {
        page-break-inside: avoid;
        break-inside: avoid;
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
         DOCUMENT HEADER
    =========================================================== -->

    <section class="document-header">

      <div class="document-title">

        <h1>
          Croquis de Barras
        </h1>

        <div class="sub">
          Optimización de cortes de perfiles
        </div>

      </div>

      <div class="document-info">

        <div>
          <strong>Fecha:</strong>
          ${date}
        </div>

        <div>
          <strong>Unidad:</strong>
          ${escapeHtml(unitLabel)}
        </div>

      </div>

    </section>


    <!-- ==========================================================
         CONFIGURATION
    =========================================================== -->

    <section class="configuration">

      <div class="config-box">

        <span class="config-label">
          Largo de barra
        </span>

        <span class="config-value">
          ${formatInches(numericBarLength)}
        </span>

      </div>


      <div class="config-box">

        <span class="config-label">
          Sierra
        </span>

        <span class="config-value">
          ${formatInches(numericSaw)}
        </span>

      </div>


      <div class="config-box">

        <span class="config-label">
          Eficiencia
        </span>

        <span class="config-value">
          ${formatPercent(efficiency)}
        </span>

      </div>

    </section>


    <!-- ==========================================================
         SUMMARY
    =========================================================== -->

    <section class="summary">

      <div class="summary-box">

        <span class="summary-label">
          Barras
        </span>

        <span class="summary-value">
          ${totalBars}
        </span>

      </div>


      <div class="summary-box">

        <span class="summary-label">
          Cortes
        </span>

        <span class="summary-value">
          ${totalCuts}
        </span>

      </div>


      <div class="summary-box">

        <span class="summary-label">
          Material disponible
        </span>

        <span class="summary-value">
          ${formatDecimalInches(totalAvailable)}
        </span>

      </div>


      <div class="summary-box">

        <span class="summary-label">
          Material usado
        </span>

        <span class="summary-value">
          ${formatDecimalInches(totalUsed)}
        </span>

      </div>


      <div class="summary-box">

        <span class="summary-label">
          Desperdicio
        </span>

        <span class="summary-value">
          ${formatDecimalInches(totalWaste)}
        </span>

      </div>

    </section>


    <!-- ==========================================================
         MATERIALS
    =========================================================== -->

    <section class="materials">

      <h2 class="section-title">
        Resumen por material
      </h2>

      <table>

        <thead>

          <tr>
            <th>
              Material
            </th>

            <th style="width: 15%;">
              Barras
            </th>
          </tr>

        </thead>

        <tbody>

          ${materialSummary}

        </tbody>

      </table>

    </section>


    <!-- ==========================================================
         BAR CROQUIS
    =========================================================== -->

    <section class="bars">

      <h2 class="section-title">
        Croquis de cortes
      </h2>

      ${barsHtml}

    </section>


    <!-- ==========================================================
         FOOTER
    =========================================================== -->

    <footer class="footer">

      <span>
        © 2026 - Desglose Pro
      </span>

      <span>
        Croquis de barras · ${date}
      </span>

    </footer>

  </div>


  <script>

    window.onload = function () {
      setTimeout(function () {
        window.print();
      }, 250);
    };

  </script>

</body>

</html>
  `;

  const printWindow = window.open(
    "",
    "_blank",
    "width=1200,height=850"
  );

  if (!printWindow) {
    window.alert(
      "No se pudo abrir la ventana de impresión. Verifica que las ventanas emergentes estén permitidas."
    );
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}