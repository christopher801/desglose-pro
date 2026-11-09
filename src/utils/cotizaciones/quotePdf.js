
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatMoney, formatDate } from "./quoteFormatters";

export function generateQuotePdf(quote) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const M = 15;
  const RIGHT = W - M;
  const CONTENT = W - M * 2;

  const C = {
    black: [25, 25, 25],
    dark: [55, 55, 55],
    gray: [115, 115, 115],
    border: [220, 220, 220],
    light: [245, 245, 245],
  };

  const client = quote.client || {};
  const financial = quote.financial || {};
  const items = Array.isArray(quote.items) ? quote.items : [];

  const money = (value) => formatMoney(Number(value) || 0);
  const value = (v) => (v == null ? "" : String(v));

  let y = 18;

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  doc.setTextColor(...C.black);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("COTIZACIÓN", M, y);

  doc.setFontSize(9);
  doc.text(value(quote.number), RIGHT, y, { align: "right" });

  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);

  doc.text(
    `Emisión: ${formatDate(quote.issueDate)}  |  Vencimiento: ${formatDate(quote.expirationDate)}`,
    RIGHT,
    y,
    { align: "right" }
  );

  y += 5;

  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.25);
  doc.line(M, y, RIGHT, y);

  // --------------------------------------------------
  // PROJECT
  // --------------------------------------------------

  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text("PROYECTO", M, y);

  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.black);

  const titleLines = doc.splitTextToSize(
    value(quote.title || "Sin título"),
    CONTENT
  );

  doc.text(titleLines, M, y);
  y += titleLines.length * 4.5;

  if (quote.description) {
    y += 1;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...C.dark);

    const description = doc.splitTextToSize(
      value(quote.description),
      CONTENT
    );

    doc.text(description, M, y);
    y += description.length * 3.8;
  }

  // --------------------------------------------------
  // CLIENT
  // --------------------------------------------------

  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text("CLIENTE", M, y);

  y += 5;

  const clientFields = [
    ["Nombre", client.name],
    ["Documento", client.document],
    ["Teléfono", client.phone],
    ["Correo", client.email],
    ["Dirección", client.address],
  ].filter(([, v]) => v);

  const colWidth = CONTENT / 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  clientFields.forEach(([label, fieldValue], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);

    const x = M + col * colWidth;
    const fieldY = y + row * 7;

    doc.setTextColor(...C.gray);
    doc.text(`${label}:`, x, fieldY);

    doc.setTextColor(...C.dark);

    const labelWidth = doc.getTextWidth(`${label}: `);

    doc.text(
      value(fieldValue),
      x + labelWidth,
      fieldY
    );
  });

  y += Math.ceil(clientFields.length / 2) * 7;

  // --------------------------------------------------
  // ITEMS
  // --------------------------------------------------

  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.gray);
  doc.text("DETALLE", M, y);

  y += 3;

  const body = items.length
    ? items.map((item) => [
        `${value(item.description || "Sin descripción")}${
          item.details ? `\n${value(item.details)}` : ""
        }`,
        `${value(item.quantity)} ${value(item.unit)}`.trim(),
        money(item.unitPrice),
        money(item.total),
      ])
    : [["Sin artículos", "-", money(0), money(0)]];

  autoTable(doc, {
    startY: y,
    head: [[
      "Descripción",
      "Cantidad",
      "Precio unitario",
      "Importe",
    ]],
    body,
    theme: "plain",
    margin: {
      left: M,
      right: M,
      bottom: 20,
    },
    styles: {
      font: "helvetica",
      fontSize: 8,
      textColor: C.dark,
      cellPadding: 2.5,
      lineColor: C.border,
      lineWidth: 0.15,
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fontStyle: "bold",
      textColor: C.black,
      fillColor: C.light,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 27, halign: "center" },
      2: { cellWidth: 38, halign: "right" },
      3: { cellWidth: 35, halign: "right" },
    },
    didDrawPage: () => {
      const page = doc.internal.getCurrentPageInfo().pageNumber;

      doc.setDrawColor(...C.border);
      doc.line(M, H - 12, RIGHT, H - 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...C.gray);

      doc.text("Cotización", M, H - 7);
      doc.text(`Página ${page}`, RIGHT, H - 7, {
        align: "right",
      });
    },
  });

  y = doc.lastAutoTable.finalY + 6;

  // --------------------------------------------------
  // FINANCIAL SUMMARY
  // --------------------------------------------------

  const rows = [
    ["Subtotal", money(financial.subtotal)],
  ];

  if (Number(financial.discountAmount) > 0) {
    rows.push([
      "Descuento",
      `- ${money(financial.discountAmount)}`,
    ]);
  }

  if (financial.taxEnabled) {
    rows.push([
      `ITBIS (${value(financial.taxRate)}%)`,
      money(financial.taxAmount),
    ]);
  }

  rows.push(["TOTAL", money(financial.total)]);

  const summaryWidth = 75;
  const summaryX = RIGHT - summaryWidth;

  autoTable(doc, {
    startY: y,
    body: rows,
    theme: "plain",
    tableWidth: summaryWidth,
    margin: {
      left: summaryX,
      right: M,
      bottom: 20,
    },
    styles: {
      font: "helvetica",
      fontSize: 8,
      textColor: C.dark,
      cellPadding: 1.8,
    },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 37, halign: "right" },
    },
    didParseCell: (data) => {
      if (data.row.index === rows.length - 1) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 10;
        data.cell.styles.textColor = C.black;
      }
    },
  });

  y = doc.lastAutoTable.finalY + 6;

  // --------------------------------------------------
  // NOTES / TERMS
  // --------------------------------------------------

  const addSection = (title, content) => {
    if (!content) return;

    const lines = doc.splitTextToSize(
      value(content),
      CONTENT
    );

    const requiredHeight = 5 + lines.length * 3.8 + 4;

    if (y + requiredHeight > H - 25) {
      doc.addPage();
      y = 18;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.black);
    doc.text(title.toUpperCase(), M, y);

    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...C.dark);
    doc.text(lines, M, y);

    y += lines.length * 3.8 + 4;
  };

  addSection("Observaciones", quote.notes);
  addSection("Condiciones comerciales", quote.terms);

  // --------------------------------------------------
  // SIGNATURES
  // --------------------------------------------------

  const signatureHeight = 19;

  if (y + signatureHeight > H - 20) {
    doc.addPage();
    y = 20;
  } else {
    y += 5;
  }

  const signatureWidth = 58;
  const leftSignature = M + 5;
  const rightSignature = RIGHT - signatureWidth - 5;

  doc.setDrawColor(...C.gray);
  doc.setLineWidth(0.2);

  doc.line(
    leftSignature,
    y + 10,
    leftSignature + signatureWidth,
    y + 10
  );

  doc.line(
    rightSignature,
    y + 10,
    rightSignature + signatureWidth,
    y + 10
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.gray);

  doc.text(
    "Firma del cliente",
    leftSignature + signatureWidth / 2,
    y + 14,
    { align: "center" }
  );

  doc.text(
    "Firma autorizada",
    rightSignature + signatureWidth / 2,
    y + 14,
    { align: "center" }
  );

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  const fileName = value(quote.number || "nueva")
    .replace(/[\\/:*?"<>|]/g, "-");

  doc.save(`Cotizacion-${fileName}.pdf`);

  return doc;
}
