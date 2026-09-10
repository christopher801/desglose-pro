import React from "react";
import { formatInches } from "../../utils/barras/barraUnits";

export default function OptimizationSummary({
  result,
}) {
  if (!result) {
    return null;
  }

  const {
    totalBars,
    totalCuts,
    totalAvailable,
    totalUsed,
    totalWaste,
    efficiency,
  } = result.summary;

  return (
    <div className="barras-summary">
      <div className="barras-summary-card">
        <div className="barras-summary-icon">
          <i className="bi bi-box-seam" />
        </div>

        <div>
          <span>BARROTES</span>
          <strong>{totalBars}</strong>
          <small>Necesarios</small>
        </div>
      </div>

      <div className="barras-summary-card">
        <div className="barras-summary-icon">
          <i className="bi bi-scissors" />
        </div>

        <div>
          <span>CORTES</span>
          <strong>{totalCuts}</strong>
          <small>Piezas procesadas</small>
        </div>
      </div>

      <div className="barras-summary-card">
        <div className="barras-summary-icon">
          <i className="bi bi-rulers" />
        </div>

        <div>
          <span>MATERIAL USADO</span>
          <strong>{formatInches(totalUsed)}</strong>
          <small>Incluye sierra</small>
        </div>
      </div>

      <div className="barras-summary-card">
        <div className="barras-summary-icon waste">
          <i className="bi bi-recycle" />
        </div>

        <div>
          <span>DESPERDICIO</span>
          <strong>{formatInches(totalWaste)}</strong>
          <small>
            {efficiency.toFixed(1)}% aprovechamiento
          </small>
        </div>
      </div>

      <div className="barras-summary-total">
        <div>
          <span>Material disponible</span>
          <strong>{formatInches(totalAvailable)}</strong>
        </div>

        <div className="barras-efficiency">
          <div className="barras-efficiency-header">
            <span>Eficiencia</span>
            <strong>{efficiency.toFixed(1)}%</strong>
          </div>

          <div className="barras-progress">
            <div
              className="barras-progress-value"
              style={{
                width: `${Math.min(
                  Math.max(efficiency, 0),
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}