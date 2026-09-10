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
      <div className="barras-config-header">
        <div>
          <h2 className="barras-card-title">Configuración de barra</h2>

          <p className="barras-card-subtitle">
            Define la longitud disponible y la pérdida de material por corte.
          </p>
        </div>

        <div className="barras-config-icon">
          <i className="bi bi-sliders2" />
        </div>
      </div>

      <div className="barras-config-grid">
        <div className="barras-field">
          <label htmlFor="bar-length">LARGO DE BARRA</label>

          <div className="barras-input-with-unit">
            <input
              id="bar-length"
              type="number"
              min="1"
              step="0.01"
              value={barLength}
              onChange={handleBarLengthChange}
              placeholder="252"
            />

            <span className="barras-unit-static">"</span>
          </div>

          <div className="barras-presets">
            {BAR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={
                  Number(barLength) === preset.value
                    ? "barras-preset active"
                    : "barras-preset"
                }
                onClick={() => setBarLength(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <small>Ejemplo: 252" = 21 pies.</small>
        </div>

        <div className="barras-field">
          <label htmlFor="saw-loss">SIERRA</label>

          <div className="barras-input-with-unit">
            <input
              id="saw-loss"
              type="number"
              min="0"
              step="0.001"
              value={saw}
              onChange={(e) => setSaw(e.target.value)}
            />

            <span className="barras-unit-static">"</span>
          </div>

          <small>Pérdida de material por cada corte.</small>
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

          <small>Esta unidad se utilizará para los cortes.</small>
        </div>
      </div>
    </div>
  );
}
