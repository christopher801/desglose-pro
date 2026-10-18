import React from "react";

const GeneratePDF = ({ proyecto, piezas = [], resultado }) => {
  const generarPDF = () => {
    if (!resultado?.sheets?.length) {
      alert("No hay una optimización disponible para generar el PDF.");
      return;
    }

    const escapeHtml = (value) => {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const formatNumber = (value) => {
      const number = Number(value);

      if (!Number.isFinite(number)) return "0";

      return Number.isInteger(number)
        ? String(number)
        : number.toFixed(2).replace(/\.00$/, "");
    };

    const formatArea = (width, height) => {
      const area = Number(width || 0) * Number(height || 0);

      if (!Number.isFinite(area)) return "0";

      return area.toFixed(2);
    };

    const fecha = new Date().toLocaleDateString("es-DO");

    const totalPiezas = resultado.sheets.reduce(
      (total, sheet) => total + (sheet.piezas?.length || 0),
      0
    );

    const totalPlanchas = resultado.sheets.length;

    const areaDisponible = resultado.sheets.reduce(
      (total, sheet) =>
        total + Number(sheet.width || 0) * Number(sheet.height || 0),
      0
    );

    const areaUtilizada = resultado.sheets.reduce(
      (total, sheet) =>
        total +
        (sheet.piezas || []).reduce(
          (sheetTotal, pieza) =>
            sheetTotal +
            Number(pieza.width || 0) * Number(pieza.height || 0),
          0
        ),
      0
    );

    const desperdicio =
      areaDisponible > 0
        ? ((areaDisponible - areaUtilizada) / areaDisponible) * 100
        : 0;

    const piezasOriginales = piezas || [];

    const getPiezaOriginal = (placedPiece) => {
      return piezasOriginales.find(
        (pieza) =>
          pieza.id === placedPiece.sourcePieceId ||
          String(pieza.id) === String(placedPiece.sourcePieceId)
      );
    };

    const getPieceNumber = (placedPiece, fallbackIndex) => {
      const original = getPiezaOriginal(placedPiece);

      const originalIndex = piezasOriginales.findIndex(
        (pieza) =>
          pieza.id === placedPiece.sourcePieceId ||
          String(pieza.id) === String(placedPiece.sourcePieceId)
      );

      if (originalIndex >= 0) {
        return originalIndex + 1;
      }

      if (placedPiece.piezaNumero) {
        return placedPiece.piezaNumero;
      }

      return fallbackIndex + 1;
    };

    const buildSheetDrawing = (sheet, sheetIndex) => {
      const sheetWidth = Number(sheet.width || 0);
      const sheetHeight = Number(sheet.height || 0);

      const pieces = sheet.piezas || [];

      const pieceHtml = pieces
        .map((pieza, index) => {
          const x = Number(pieza.x || 0);
          const y = Number(pieza.y || 0);
          const width = Number(pieza.width || 0);
          const height = Number(pieza.height || 0);

          const left =
            sheetWidth > 0 ? (x / sheetWidth) * 100 : 0;

          const top =
            sheetHeight > 0 ? (y / sheetHeight) * 100 : 0;

          const pieceWidth =
            sheetWidth > 0 ? (width / sheetWidth) * 100 : 0;

          const pieceHeight =
            sheetHeight > 0 ? (height / sheetHeight) * 100 : 0;

          const pieceNumber = getPieceNumber(pieza, index);

          return `
            <div
              class="sheet-piece"
              style="
                left: ${left}%;
                top: ${top}%;
                width: ${pieceWidth}%;
                height: ${pieceHeight}%;
              "
            >
              <div class="piece-number">
                P${escapeHtml(pieceNumber)}
              </div>

              <div class="piece-dimensions">
                ${escapeHtml(formatNumber(width))} ×
                ${escapeHtml(formatNumber(height))}
              </div>
            </div>
          `;
        })
        .join("");

      const usedArea = pieces.reduce(
        (total, pieza) =>
          total +
          Number(pieza.width || 0) * Number(pieza.height || 0),
        0
      );

      const availableArea = sheetWidth * sheetHeight;

      const sheetWaste =
        availableArea > 0
          ? ((availableArea - usedArea) / availableArea) * 100
          : 0;

      return `
        <section class="sheet-section">

          <div class="sheet-header">
            <div>
              <strong>Plancha ${sheetIndex + 1}</strong>
              <span class="sheet-subtitle">
                ${escapeHtml(formatNumber(sheetWidth))} ×
                ${escapeHtml(formatNumber(sheetHeight))}
              </span>
            </div>

            <div class="sheet-piece-count">
              ${pieces.length} pieza${pieces.length === 1 ? "" : "s"}
            </div>
          </div>

          <div class="sheet-drawing-wrapper">

            <div
              class="sheet-drawing"
              style="
                aspect-ratio:
                  ${sheetWidth > 0 ? sheetWidth : 1}
                  /
                  ${sheetHeight > 0 ? sheetHeight : 1};
              "
            >

              <div class="sheet-outline"></div>

              ${pieceHtml}

            </div>

          </div>

          <div class="sheet-footer">
            <span>
              Área utilizada:
              <strong>${escapeHtml(usedArea.toFixed(2))}</strong>
            </span>

            <span>
              Desperdicio:
              <strong>${escapeHtml(sheetWaste.toFixed(2))}%</strong>
            </span>
          </div>

        </section>
      `;
    };

    const sheetsHtml = resultado.sheets
      .map((sheet, index) => buildSheetDrawing(sheet, index))
      .join("");

    const piecesRows = piezasOriginales
      .map((pieza, index) => {
        const ancho = Number(pieza.ancho || 0);
        const alto = Number(pieza.alto || 0);
        const cantidad = Number(pieza.cantidad || 0);

        return `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(formatNumber(ancho))}</td>
            <td>${escapeHtml(formatNumber(alto))}</td>
            <td>${escapeHtml(formatNumber(cantidad))}</td>
            <td>${escapeHtml(
              formatArea(ancho, alto)
            )}</td>
          </tr>
        `;
      })
      .join("");

    const html = `
      <!DOCTYPE html>

      <html lang="es">

      <head>

        <meta charset="UTF-8" />

        <title>
          Croquis de Vidrios - Desglose Pro
        </title>

        <style>

          * {
            box-sizing: border-box;
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
          }

          body {
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

          /* ========================================
             HEADER
          ======================================== */

          .top {
            text-align: center;
            border-bottom: 1px solid #c9c9c9;
            padding-bottom: 10px;
          }

          .company-name {
            font-size: 17px;
            font-weight: 700;
            margin-bottom: 3px;
          }

          .company-info {
            font-size: 12px;
            color: #4b5563;
          }

          .document-title {
            margin-top: 7px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
          }

          /* ========================================
             UPPER INFORMATION
          ======================================== */

          .upper {
            display: grid;
            grid-template-columns: 240px 1fr;
            gap: 48px;
            margin-top: 14px;
            align-items: start;
          }

          .project-box {
            background: #e5e7eb;
            border: 1px solid #d7d7d7;
            border-radius: 6px;
            padding: 11px 12px;
          }

          .project-box-title {
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .project-row {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            padding: 3px 0;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          }

          .project-row:last-child {
            border-bottom: none;
          }

          .project-label {
            color: #4b5563;
          }

          .project-value {
            font-weight: 600;
            text-align: right;
            max-width: 135px;
            word-break: break-word;
          }

          /* ========================================
             CONFIGURATION
          ======================================== */

          .materials-section {
            width: 100%;
          }

          .section-title {
            font-size: 12px;
            font-weight: 700;
            margin: 0 0 7px;
            text-transform: uppercase;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid #c9c9c9;
            padding: 6px 7px;
            text-align: left;
            vertical-align: middle;
          }

          th {
            background: #e5e7eb;
            font-weight: 700;
          }

          td {
            background: #ffffff;
          }

          /* ========================================
             SUMMARY
          ======================================== */

          .summary {
            display: grid;
            grid-template-columns:
              repeat(5, 1fr);
            gap: 10px;
            margin-top: 15px;
          }

          .summary-box {
            border: 1px solid #d7d7d7;
            background: #f3f4f6;
            border-radius: 5px;
            padding: 8px 10px;
            text-align: center;
          }

          .summary-label {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
          }

          .summary-value {
            margin-top: 3px;
            font-size: 14px;
            font-weight: 700;
          }

          /* ========================================
             PIECES
          ======================================== */

          .pieces-section {
            margin-top: 17px;
          }

          .pieces-table th,
          .pieces-table td {
            text-align: center;
          }

          .pieces-table th:first-child,
          .pieces-table td:first-child {
            width: 45px;
          }

          /* ========================================
             CROQUIS
          ======================================== */

          .croquis-section {
            margin-top: 20px;
          }

          .croquis-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 10px;
          }

          .sheet-section {
            margin-bottom: 22px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .sheet-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #c9c9c9;
            padding-bottom: 6px;
            margin-bottom: 8px;
          }

          .sheet-header strong {
            font-size: 12px;
          }

          .sheet-subtitle {
            margin-left: 8px;
            color: #6b7280;
            font-size: 11px;
          }

          .sheet-piece-count {
            color: #4b5563;
            font-size: 11px;
          }

          .sheet-drawing-wrapper {
            width: 100%;
            padding: 2px 0;
          }

          .sheet-drawing {
            position: relative;

            width: 100%;
            max-width: 1180px;

            margin: 0 auto;

            background: #ffffff;

            border: 2px solid #6b7280;

            overflow: hidden;

            /* CRITICAL FOR PRINT */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .sheet-outline {
            position: absolute;
            inset: 0;

            border: 1px solid #9ca3af;

            pointer-events: none;

            z-index: 1;
          }

          /* ========================================
             GLASS PIECES
          ======================================== */

          .sheet-piece {
            position: absolute;

            /* IMPORTANT:
               Keeps the gray fill in Chrome Print */
            background: #e5e7eb !important;

            border: 1px solid #6b7280;

            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            overflow: hidden;

            text-align: center;

            min-width: 24px;
            min-height: 20px;

            z-index: 2;

            /* CRITICAL PRINT FIX */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .piece-number {
            font-size: 10px;
            font-weight: 700;
            color: #111827;

            line-height: 1.1;
          }

          .piece-dimensions {
            margin-top: 2px;

            font-size: 8px;
            color: #374151;

            line-height: 1.1;

            white-space: nowrap;
          }

          .sheet-footer {
            display: flex;
            justify-content: space-between;

            border-bottom: 1px solid #d7d7d7;

            padding: 6px 2px 7px;

            color: #4b5563;

            font-size: 10px;
          }

          /* ========================================
             OBSERVATIONS
          ======================================== */

          .observations {
            margin-top: 15px;
            border-top: 1px solid #c9c9c9;
            padding-top: 9px;
          }

          .observations-title {
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 4px;
            text-transform: uppercase;
          }

          .observations-text {
            color: #4b5563;
            line-height: 1.4;
          }

          /* ========================================
             FOOTER
          ======================================== */

          .footer {
            margin-top: auto;

            border-top: 1px solid #c9c9c9;

            padding-top: 7px;

            display: flex;
            justify-content: space-between;

            color: #6b7280;

            font-size: 10px;
          }

          /* ========================================
             PRINT
          ======================================== */

          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          @media print {

            html,
            body {
              width: 100%;
              margin: 0;
              padding: 0;

              background: #ffffff !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .page {
              width: 100%;
              max-width: none;
              min-height: auto;

              margin: 0;
              padding: 0;
            }

            .project-box {
              background: #e5e7eb !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            th {
              background: #e5e7eb !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .summary-box {
              background: #f3f4f6 !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .sheet-drawing {
              background: #ffffff !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .sheet-piece {
              background: #e5e7eb !important;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;

              opacity: 1 !important;
            }

            .sheet-outline {
              border-color: #9ca3af !important;
            }

            .sheet-section {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }

        </style>

      </head>

      <body>

        <div class="page">

          <!-- HEADER -->

          <div class="top">

            <div class="company">

              <div class="company-name">
                Desglose Pro
              </div>

              <div class="company-info">
                Software Profesional para talleres de aluminio
              </div>


            </div>

          </div>

          <!-- PROJECT + CONFIGURATION -->

          <div class="upper">

            <div class="project-box">

              <div class="project-box-title">
                Resumen del Proyecto
              </div>

              <div class="project-row">
                <span class="project-label">
                  Unidad
                </span>

                <span class="project-value">
                  ${escapeHtml(
                    proyecto?.unidad || "—"
                  )}
                </span>
              </div>

              <div class="project-row">
                <span class="project-label">
                  Fecha
                </span>

                <span class="project-value">
                  ${escapeHtml(fecha)}
                </span>
              </div>

            </div>

            <div class="materials-section">

              <div class="section-title">
                Configuración de Plancha
              </div>

              <table>

                <thead>
                  <tr>
                    <th>
                      Ancho de Plancha
                    </th>

                    <th>
                      Alto de Plancha
                    </th>

                    <th>
                      Unidad
                    </th>
                  </tr>
                </thead>

                <tbody>

                  <tr>

                    <td>
                      ${escapeHtml(
                        formatNumber(
                          proyecto?.anchoPlancha
                        )
                      )}
                    </td>

                    <td>
                      ${escapeHtml(
                        formatNumber(
                          proyecto?.altoPlancha
                        )
                      )}
                    </td>

                    <td>
                      ${escapeHtml(
                        proyecto?.unidad || "—"
                      )}
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          <!-- SUMMARY -->

          <div class="summary">

            <div class="summary-box">

              <div class="summary-label">
                Planchas
              </div>

              <div class="summary-value">
                ${escapeHtml(totalPlanchas)}
              </div>

            </div>

            <div class="summary-box">

              <div class="summary-label">
                Piezas
              </div>

              <div class="summary-value">
                ${escapeHtml(totalPiezas)}
              </div>

            </div>

            <div class="summary-box">

              <div class="summary-label">
                Área disponible
              </div>

              <div class="summary-value">
                ${escapeHtml(
                  areaDisponible.toFixed(2)
                )}
              </div>

            </div>

            <div class="summary-box">

              <div class="summary-label">
                Área utilizada
              </div>

              <div class="summary-value">
                ${escapeHtml(
                  areaUtilizada.toFixed(2)
                )}
              </div>

            </div>

            <div class="summary-box">

              <div class="summary-label">
                Desperdicio
              </div>

              <div class="summary-value">
                ${escapeHtml(
                  desperdicio.toFixed(2)
                )}%
              </div>

            </div>

          </div>

          <!-- PIECES -->

          <div class="pieces-section">

            <div class="section-title">
              Medidas y Cortes
            </div>

            <table class="pieces-table">

              <thead>

                <tr>
                  <th>#</th>
                  <th>Ancho</th>
                  <th>Alto</th>
                  <th>Cantidad</th>
                  <th>Área</th>
                </tr>

              </thead>

              <tbody>

                ${
                  piecesRows ||
                  `
                    <tr>
                      <td colspan="5">
                        No hay piezas registradas.
                      </td>
                    </tr>
                  `
                }

              </tbody>

            </table>

          </div>

          <!-- CROQUIS -->

          <div class="croquis-section">

            <div class="croquis-title">
              Croquis de Distribución
            </div>

            ${sheetsHtml}

          </div>

          <!-- OBSERVATIONS -->

          ${
            proyecto?.observaciones
              ? `
                <div class="observations">

                  <div class="observations-title">
                    Observaciones
                  </div>

                  <div class="observations-text">
                    ${escapeHtml(
                      proyecto.observaciones
                    )}
                  </div>

                </div>
              `
              : ""
          }

          <!-- FOOTER -->

          <div class="footer">

            <span>
              © 2026 - Desglose Pro
            </span>

            <span>
              Generado el ${escapeHtml(fecha)}
            </span>

          </div>

        </div>

        <script>

          window.addEventListener(
            "load",
            function () {

              setTimeout(
                function () {

                  window.focus();

                  window.print();

                },
                400
              );

            }
          );

        </script>

      </body>

      </html>
    `;

    const printWindow = window.open(
      "",
      "_blank",
      "width=1400,height=900"
    );

    if (!printWindow) {
      alert(
        "No se pudo abrir la ventana de impresión. Verifica que las ventanas emergentes estén permitidas."
      );

      return;
    }

    printWindow.document.open();

    printWindow.document.write(html);

    printWindow.document.close();
  };

  return (
    <button
      type="button"
      className="btn-secondary-sm"
      onClick={generarPDF}
    >
      <i className="bi bi-file-earmark-pdf me-2"></i>
      Generar PDF
    </button>
  );
};

export default GeneratePDF;
