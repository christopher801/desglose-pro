import React, { useState, useEffect } from "react";
import FractionUtils from "../../utils/fraction";

const BAR_PRESETS = [
  { label: '252"', value: 252 },
  { label: '240"', value: 240 },
  { label: '192"', value: 192 },
];

// ---------- Helpers lokal (pa touche utils/fraction.js) ----------

// Tèks valid oswa pa? Pou pa ekri 0 nan state pandan itilizatè a ap tape ("1/")
function isValidFractionText(str) {
  const t = String(str).trim();
  if (!t) return false;
  if (/^\d+\s+\d+\/\d+$/.test(t)) return !/\/0+$/.test(t);
  if (/^\d+\/\d+$/.test(t)) return !/\/0+$/.test(t);
  return /^\d*\.?\d+$/.test(t);
}

// 0.0625 -> "1/16" | 1.5 -> "1 1/2" | 0.07 -> "0.07"
function formatFractionText(value, maxDenominator = 64) {
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

export default function BarraControls({
  barLength,
  setBarLength,
  saw,
  setSaw,
  unit,
  setUnit,
}) {
  // Tèks ki afiche nan chan SIERRA a (ka gen "1/16"), apa de valè nimerik la
  const [sawText, setSawText] = useState(
    saw === "" ? "" : formatFractionText(saw)
  );

  // Si saw chanje depi deyò (egzanp: chanjman inite), senkronize tèks la
  useEffect(() => {
    setSawText(saw === "" ? "" : formatFractionText(saw));
  }, [saw]);

  const handleBarLengthChange = (e) => {
    const value = e.target.value;

    if (value === "") {
      setBarLength("");
      return;
    }

    const parsed = Number(value);

    if (Number.isFinite(parsed) && parsed > 0) {
      setBarLength(parsed);
    }
  };

  const handleSawChange = (e) => {
    const text = e.target.value;
    setSawText(text); // kite itilizatè a tape lib (egzanp "1/")

    if (text.trim() === "") {
      setSaw("");
      return;
    }

    if (isValidFractionText(text)) {
      setSaw(FractionUtils.parseFraction(text));
    }
  };

  // Lè l kite chan an, fòmate l pwòp ("0.0625" -> "1/16")
  const handleSawBlur = () => {
    setSawText(saw === "" ? "" : formatFractionText(saw));
  };

  return (
    <div className="barras-config">
      <div className="barras-config-grid">
        <div className="barras-field">
          <label htmlFor="bar-length">LARGO</label>
          <input
            id="bar-length"
            type="number"
            min="1"
            step="0.01"
            value={barLength}
            onChange={handleBarLengthChange}
            placeholder="252"
          />
        </div>

        <div className="barras-field">
          <label htmlFor="saw-loss">SIERRA</label>
          <input
            id="saw-loss"
            type="text"
            inputMode="text"
            value={sawText}
            onChange={handleSawChange}
            onBlur={handleSawBlur}
            placeholder="Ej. 1/16 o 0.125"
          />
        </div>

        <div className="barras-field">
          <label htmlFor="cut-unit">UNIDAD</label>
          <select
            id="cut-unit"
            className="form-select"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="in">"</option>
            <option value="cm">cm</option>
            <option value="m">Metros (m)</option>
            <option value="ft">Pies (ft)</option>
          </select>
        </div>
      </div>
    </div>
  );
}