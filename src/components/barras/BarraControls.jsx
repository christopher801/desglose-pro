import React from "react";

const BAR_PRESETS = [
  { label: '252"', value: 252 },
  { label: '240"', value: 240 },
  { label: '192"', value: 192 },
];

export default function BarraControls({
  barLength,
  setBarLength,
  saw,
  setSaw,
  unit,
  setUnit,
}) {
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

  return (
    <div className="barras-config">
      <div className="barras-config-grid">
        <div className="barras-field">
          <label htmlFor="bar-length">LARGO DE BARRA</label>

          <div className="form-select">
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

         

        </div>

        <div className="barras-field">
          <label htmlFor="saw-loss">SIERRA</label>

          <div className="form-select">
            <input
              id="saw-loss"
              type="number"
              min="0"
              step="0.001"
              value={saw}
              onChange={(e) => setSaw(e.target.value)}
            />

          </div>

        </div>

        <div className="barras-field">
          <label htmlFor="cut-unit">UNIDAD DE MEDIDA</label>

          <select
            className="form-select"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="in">Pulgadas (")</option>
            <option value="cm">Centímetros (cm)</option>
            <option value="m">Metros (m)</option>
            <option value="ft">Pies (ft)</option>
          </select>

        </div>
      </div>
    </div>
  );
}
