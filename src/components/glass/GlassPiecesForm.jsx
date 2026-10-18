import React, { useState } from "react";
import FractionUtils from "../../utils/fraction";

// FractionUtils.parseFraction devuelve 0 si es inválido; aquí 0 => null
const parse = (text) => {
  const clean = String(text ?? "")
    .replace(/["”″]/g, "")
    .replace(/,/g, ".")
    .trim();

  if (!clean) return null;

  const n = FractionUtils.parseFraction(clean);
  return Number.isFinite(n) && n > 0 ? n : null;
};

// Pulgadas => fracción (solo si es exacta a 1/16), otras unidades => número
const formatValue = (n, unidad) => {
  if (n === null) return "";

  if (unidad === "in") {
    const exacto = Math.abs(Math.round(n * 16) / 16 - n) < 1e-9;
    if (exacto) return FractionUtils.toSixteenths(n);
  }

  return String(n);
};

export default function GlassPiecesForm({
  anchoPlancha,
  altoPlancha,
  unidad = "in",
  onAdd,
  disabled = false,
}) {
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [error, setError] = useState("");

  const handleAnchoBlur = () => {
    const n = parse(ancho);
    if (n !== null) setAncho(formatValue(n, unidad));
  };

  const handleAltoBlur = () => {
    const n = parse(alto);
    if (n !== null) setAlto(formatValue(n, unidad));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const width = parse(ancho);
    const height = parse(alto);
    const qty = Number(cantidad);

    if (width === null) {
      setError("Ingresa un ancho válido (ej. 40, 40 1/2 o 3/4).");
      return;
    }

    if (height === null) {
      setError("Ingresa un alto válido (ej. 50, 50 1/2 o 3/4).");
      return;
    }

    if (!Number.isInteger(qty) || qty < 1) {
      setError("La cantidad debe ser un número entero mayor que 0.");
      return;
    }

    const sheetWidth = Number(anchoPlancha);
    const sheetHeight = Number(altoPlancha);

    if (sheetWidth > 0 && sheetHeight > 0) {
      const normal = width <= sheetWidth && height <= sheetHeight;
      const rotated = width <= sheetHeight && height <= sheetWidth;

      if (!normal && !rotated) {
        setError(
          `La pieza ${formatValue(width, unidad)} × ${formatValue(
            height,
            unidad
          )} no cabe en la plancha ${formatValue(
            sheetWidth,
            unidad
          )} × ${formatValue(sheetHeight, unidad)}.`
        );
        return;
      }
    }

    onAdd({
      ancho: width,
      alto: height,
      cantidad: qty,
    });

    setAncho("");
    setAlto("");
    setCantidad("1");
    setError("");
  };

  return (
    <div className="barras-config">
      <form onSubmit={handleSubmit}>
        <div className="barras-config-grid">
          <div className="barras-field">
            <label htmlFor="pieza-ancho">ANCHO</label>
            <input
              id="pieza-ancho"
              type="text"
              inputMode="text"
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
              onBlur={handleAnchoBlur}
              placeholder="Ej. 40 1/2"
              disabled={disabled}
            />
          </div>

          <div className="barras-field">
            <label htmlFor="pieza-alto">ALTO</label>
            <input
              id="pieza-alto"
              type="text"
              inputMode="text"
              value={alto}
              onChange={(e) => setAlto(e.target.value)}
              onBlur={handleAltoBlur}
              placeholder="Ej. 50 3/4"
              disabled={disabled}
            />
          </div>

          <div className="barras-field">
            <label htmlFor="pieza-cantidad">CANTIDAD</label>
            <input
              id="pieza-cantidad"
              type="number"
              min="1"
              step="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="barras-form-actions">
          <button type="submit" className="btn-primary-sm" disabled={disabled}>
            <i className="bi bi-plus-lg me-1" />
            Agregar pieza
          </button>
        </div>
      </form>

      {error && (
        <div className="barras-error">
          <i className="bi bi-exclamation-circle me-1" />
          {error}
        </div>
      )}
    </div>
  );
}