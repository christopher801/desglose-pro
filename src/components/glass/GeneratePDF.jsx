import React from "react";
import jsPDF from "jspdf";

const MARGIN = 15;
const PAGE_WIDTH = 210; // A4 mm
const PAGE_HEIGHT = 297; // A4 mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

function formatearNumero(valor) {
  return Number(valor).toLocaleString("es-DO", { maximumFractionDigits: 1 });
}

/**
 * Dibuja el encabezado del documento (título + fecha) en la página actual.
 */
function dibujarEncabezado(doc, titulo) {
  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.setTextColor(30, 41, 59); // gray-800
  doc.text(titulo, MARGIN, 18);

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100, 116, 139); // gray-500
  const fecha = new Date().toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  doc.text(`Generado el ${fecha}`, MARGIN, 24);

  doc.setDrawColor(226, 232, 240); // gray-200
  doc.line(MARGIN, 28, PAGE_WIDTH - MARGIN, 28);
}

/**
 * Dibuja un bloque de datos del proyecto (cliente, vidrio, plancha, etc.)
 * Devuelve la posición Y siguiente disponible.
 */
function dibujarDatosProyecto(doc, proyecto, startY) {
  let y = startY;

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Datos del Proyecto", MARGIN, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(51, 65, 85); // gray-700

  const filas = [
    ["Cliente", proyecto.cliente || "-"],
    ["Proyecto", proyecto.proyecto || "-"],
    ["Tipo de vidrio", proyecto.tipoVidrio || "-"],
    ["Espesor", proyecto.espesor || "-"],
    ["Color", proyecto.color || "-"],
    [
      "Plancha",
      `${proyecto.anchoPlancha || "-"} x ${proyecto.altoPlancha || "-"} ${proyecto.unidad || ""}`,
    ],
  ];

  const colWidth = CONTENT_WIDTH / 2;
  filas.forEach((fila, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = MARGIN + col * colWidth;
    const filaY = y + row * 6;

    doc.setFont(undefined, "bold");
    doc.text(`${fila[0]}:`, x, filaY);
    doc.setFont(undefined, "normal");
    doc.text(String(fila[1]), x + 26, filaY);
  });

  y += Math.ceil(filas.length / 2) * 6 + 4;

  if (proyecto.observaciones) {
    doc.setFont(undefined, "bold");
    doc.text("Observaciones:", MARGIN, y);
    y += 5;
    doc.setFont(undefined, "normal");
    const lineas = doc.splitTextToSize(proyecto.observaciones, CONTENT_WIDTH);
    doc.text(lineas, MARGIN, y);
    y += lineas.length * 5 + 4;
  }

  return y;
}

/**
 * Dibuja las tarjetas de resumen (planchas, piezas, área usada/desperdiciada).
 */
function dibujarResumen(doc, resultado, startY) {
  let y = startY;

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Resumen de Optimización", MARGIN, y);
  y += 7;

  const tarjetas = [
    ["Planchas necesarias", `${resultado.sheetsCount}`],
    ["Piezas totales", `${resultado.piecesCount}`],
    [
      "Área utilizada",
      `${formatearNumero(resultado.usedArea)} (${resultado.usedPercentage.toFixed(1)}%)`,
    ],
    [
      "Área desperdiciada",
      `${formatearNumero(resultado.wasteArea)} (${resultado.wastePercentage.toFixed(1)}%)`,
    ],
  ];

  const cardWidth = (CONTENT_WIDTH - 9) / 4;
  const cardHeight = 18;

  tarjetas.forEach((tarjeta, i) => {
    const x = MARGIN + i * (cardWidth + 3);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(x, y, cardWidth, cardHeight);

    doc.setFontSize(7.5);
    doc.setFont(undefined, "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(tarjeta[0], x + 2, y + 6, { maxWidth: cardWidth - 4 });

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(tarjeta[1], x + 2, y + 13, { maxWidth: cardWidth - 4 });
  });

  return y + cardHeight + 10;
}

/**
 * Dibuja la tabla de piezas a cortar.
 */
function dibujarTablaPiezas(doc, piezas, startY) {
  let y = startY;

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Piezas a Cortar", MARGIN, y);
  y += 7;

  const columnas = [
    { label: "Ancho", width: CONTENT_WIDTH * 0.25 },
    { label: "Alto", width: CONTENT_WIDTH * 0.25 },
    { label: "Cantidad", width: CONTENT_WIDTH * 0.25 },
    { label: "Área", width: CONTENT_WIDTH * 0.25 },
  ];

  doc.setFillColor(248, 250, 252); // gray-50
  doc.rect(MARGIN, y, CONTENT_WIDTH, 7, "F");
  doc.setFontSize(8.5);
  doc.setFont(undefined, "bold");
  doc.setTextColor(71, 85, 105); // gray-600

  let x = MARGIN;
  columnas.forEach((col) => {
    doc.text(col.label, x + 2, y + 5);
    x += col.width;
  });
  y += 7;

  doc.setFont(undefined, "normal");
  doc.setTextColor(51, 65, 85);

  piezas.forEach((pieza, index) => {
    if (y > PAGE_HEIGHT - MARGIN - 10) {
      doc.addPage();
      y = MARGIN;
    }

    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(MARGIN, y, CONTENT_WIDTH, 6.5, "F");
    }

    const area = pieza.ancho * pieza.alto * pieza.cantidad;
    const valores = [
      String(pieza.ancho),
      String(pieza.alto),
      String(pieza.cantidad),
      formatearNumero(area),
    ];

    x = MARGIN;
    valores.forEach((valor, i) => {
      doc.text(valor, x + 2, y + 4.5);
      x += columnas[i].width;
    });

    y += 6.5;
  });

  doc.setDrawColor(226, 232, 240);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);

  return y + 8;
}

/**
 * Dibuja el diagrama de corte de una plancha en una página nueva.
 */
function dibujarPlancha(doc, plancha) {
  doc.addPage();

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Plancha #${plancha.numero}`, MARGIN, 18);

  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(
    `${plancha.width} x ${plancha.height} — ${plancha.piezas.length} pieza(s)`,
    MARGIN,
    24
  );

  const areaDisponible = {
    width: CONTENT_WIDTH,
    height: PAGE_HEIGHT - 40 - MARGIN,
  };

  const escala = Math.min(
    areaDisponible.width / plancha.width,
    areaDisponible.height / plancha.height
  );

  const anchoDibujo = plancha.width * escala;
  const altoDibujo = plancha.height * escala;
  const offsetX = MARGIN + (areaDisponible.width - anchoDibujo) / 2;
  const offsetY = 32;

  doc.setDrawColor(203, 213, 225); // gray-300
  doc.setFillColor(248, 250, 252);
  doc.rect(offsetX, offsetY, anchoDibujo, altoDibujo, "FD");

  doc.setDrawColor(26, 86, 219); // primary
  doc.setFillColor(59, 130, 246); // primary-light
  doc.setLineWidth(0.3);

  plancha.piezas.forEach((pieza) => {
    const px = offsetX + pieza.x * escala;
    const py = offsetY + pieza.y * escala;
    const pw = pieza.width * escala;
    const ph = pieza.height * escala;

    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.25 }));
    doc.rect(px, py, pw, ph, "F");
    doc.restoreGraphicsState();
    doc.rect(px, py, pw, ph, "S");

    if (pw > 12 && ph > 6) {
      doc.setFontSize(7);
      doc.setTextColor(51, 65, 85);
      doc.text(
        `${pieza.width}x${pieza.height}`,
        px + pw / 2,
        py + ph / 2,
        { align: "center" }
      );
    }
  });
}

/**
 * Genera y descarga el PDF completo del proyecto de corte de vidrio.
 */
function generarPDF({ proyecto, piezas, resultado }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  dibujarEncabezado(doc, "Optimización de Corte de Vidrio");
  let y = dibujarDatosProyecto(doc, proyecto, 34);

  if (resultado) {
    y = dibujarResumen(doc, resultado, y);
  }

  dibujarTablaPiezas(doc, piezas, y);

  if (resultado && resultado.sheets && resultado.sheets.length > 0) {
    resultado.sheets.forEach((plancha) => dibujarPlancha(doc, plancha));
  }

  const nombreArchivo = `corte-vidrio-${(proyecto.proyecto || "proyecto")
    .toLowerCase()
    .replace(/\s+/g, "-")}.pdf`;

  doc.save(nombreArchivo);
}

export default function GeneratePDF({ proyecto, piezas, resultado }) {
  const disabled = !piezas || piezas.length === 0;

  return (
    <button
      className="btn-secondary-sm"
      disabled={disabled}
      onClick={() => generarPDF({ proyecto, piezas, resultado })}
      title={
        disabled
          ? "Agrega piezas antes de exportar"
          : "Exportar proyecto a PDF"
      }
    >
      <i className="bi bi-file-earmark-pdf me-1"></i>
      Exportar PDF
    </button>
  );
}