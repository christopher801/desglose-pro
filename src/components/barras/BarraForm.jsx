import React, { useState } from "react";
import FractionUtils from "../../utils/fraction";

// ---------- Helpers lokal ----------

// Netwaye tèks la anvan n li l:
// '48-1/2"' -> '48 1/2' | '1,5' -> '1.5' | '  5/8 ' -> '5/8'
function normalizeMeasure(text) {
  return String(text)
    .trim()
    .replace(/["”″]/g, "")          // retire mak pous (")
    .replace(/,/g, ".")             // vigil -> pwen
    .replace(/(\d)\s*-\s*(\d+\/)/, "$1 $2") // 48-1/2 -> 48 1/2
    .replace(/\s+/g, " ");
}

// Valid: "120", "0.125", "1/16", "5/8", "48 1/2"
function isValidMeasure(text) {
  const t = normalizeMeasure(text);
  if (!t) return false;

  const mixed = t.match(/^(\d+) (\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[3]) > 0;

  const frac = t.match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[2]) > 0;

  return /^\d*\.?\d+$/.test(t);
}

// Tèks -> nonb (itilize parseFraction ou a)
function measureToNumber(text) {
  return FractionUtils.parseFraction(normalizeMeasure(text));
}

// Nonb -> tèks: 0.0625 -> "1/16" | 48.5 -> "48 1/2" | 0.07 -> "0.07"
function numberToMeasure(value, maxDenominator = 64) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  if (Number.isInteger(n)) return String(n);

  const whole = Math.floor(n);
  const decimal = n - whole;

  for (let den = 2; den <= maxDenominator; den *= 2) {
    const num = Math.round(decimal * den);
    if (Math.abs(decimal - num / den) < 1e-9) {
      if (num === 0) return String(whole);
      const g = FractionUtils.gcd(num, den);
      const frac = `${num / g}/${den / g}`;
      return whole > 0 ? `${whole} ${frac}` : frac;
    }
  }

  return String(n);
}

// ---------- Konpozan ----------

export default function BarraForm({
  unit,
  onAdd,
  onCancel,
  editingCut = null,
}) {
  // Tèks ki afiche (ka gen "1/16", "3/4", "5/8", "48 1/2"...)
  const [lengthText, setLengthText] = useState(
    editingCut?.length != null ? numberToMeasure(editingCut.length) : ""
  );

  const [quantity, setQuantity] = useState(editingCut?.quantity ?? 1);

  const [material, setMaterial] = useState(editingCut?.material ?? "");

  const [label, setLabel] = useState(editingCut?.label ?? "");

  const lengthIsInvalid =
    lengthText.trim() !== "" && !isValidMeasure(lengthText);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidMeasure(lengthText)) {
      return;
    }

    const parsedLength = measureToNumber(lengthText);
    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedLength) || parsedLength <= 0) {
      return;
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return;
    }

    onAdd({
      id: editingCut?.id,
      length: parsedLength, // toujou yon NONB pou rès app la
      quantity: parsedQuantity,
      material: material.trim() || "Perfil",
      label: label.trim() || "Sin etiqueta",
    });

    if (!editingCut) {
      setLengthText("");
      setQuantity(1);
      setMaterial("");
      setLabel("");
    }
  };

  // Lè l kite chan an, fòmate l pwòp ("0.0625" -> "1/16", "48.5" -> "48 1/2")
  const handleLengthBlur = () => {
    if (isValidMeasure(lengthText)) {
      setLengthText(numberToMeasure(measureToNumber(lengthText)));
    }
  };

  return (
    <form className="barras-form" onSubmit={handleSubmit}>
      <div className="barras-form-grid">
        <div className="barras-field">
          <label htmlFor="cut-length">LARGO ({unit})</label>
          <input
            id="cut-length"
            type="text"
            inputMode="text"
            autoComplete="off"
            value={lengthText}
            onChange={(e) => setLengthText(e.target.value)}
            onBlur={handleLengthBlur}
            placeholder={
              unit === "cm"
                ? "Ej. 120"
                : unit === "m"
                ? "Ej. 1.20"
                : "Ej. 48 1/2, 5/8, 3/4"
            }
            aria-invalid={lengthIsInvalid}
            required
          />
          {lengthIsInvalid && (
            <small style={{ color: "#dc2626" }}>
              Formato inválido. Usa 48 1/2, 5/8, 3/4 o 0.125
            </small>
          )}
        </div>

        <div className="barras-field">
          <label htmlFor="cut-quantity">CANTIDAD</label>

          <input
            id="cut-quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="barras-field">
          <label htmlFor="cut-material">MATERIAL</label>

          <input
            id="cut-material"
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Ej. Aluminio P-92"
            required
          />
        </div>

        <div className="barras-field">
          <label htmlFor="cut-label">ETIQUETA</label>

          <input
            id="cut-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ej. Jamba 1"
          />
        </div>
      </div>

      <div className="barras-form-actions">
        <button type="submit" className="btn-primary-sm">
          <i className="bi bi-plus-lg me-1" />
          {editingCut ? "Actualizar corte" : "Agregar corte"}
        </button>

        {editingCut && (
          <button type="button" className="btn-secondary-sm" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}