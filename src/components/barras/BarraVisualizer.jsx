import React from "react";
import {
  formatInches,
} from "../../utils/barras/barraUnits";

function getCutPercentage(length, barLength) {
  if (!barLength) return 0;

  return Math.min(
    Math.max((length / barLength) * 100, 0),
    100
  );
}

export default function BarraVisualizer({
  result,
}) {
  if (!result?.bars?.length) {
    return null;
  }

  return (
    <div className="barras-visualizer">
      <div className="barras-visualizer-header">
        <div>
          <h3>
            <i className="bi bi-layout-text-sidebar-reverse me-2" />
            Croquis de barras
          </h3>

          <p>
            Distribución optimizada de los cortes.
          </p>
        </div>

        <div className="barras-visualizer-legend">
          <span>
            <i className="legend-cut" />
            Corte
          </span>

          <span>
            <i className="legend-waste" />
            Desperdicio
          </span>
        </div>
      </div>

      <div className="barras-bars-list">
        {result.bars.map((bar, index) => {
          const usedPercent =
            bar.barLength > 0
              ? (bar.usedLength / bar.barLength) * 100
              : 0;

          return (
            <div
              className="barras-bar-wrapper"
              key={bar.id}
            >
              <div className="barras-bar-top">
                <div className="barras-bar-name">
                  Barra {index + 1}
                </div>

                <div className="barras-bar-meta">
                  {bar.material}
                </div>

                <div className="barras-bar-stats">
                  Usado: {formatInches(bar.usedLength)}
                  {" · "}
                  Desperdicio: {formatInches(bar.waste)}
                </div>
              </div>

              <div className="barras-bar">
                {bar.cuts.map((cut, cutIndex) => {
                  const width = getCutPercentage(
                    cut.lengthWithSaw,
                    bar.barLength
                  );

                  return (
                    <div
                      key={cut.instanceId}
                      className="barras-cut"
                      style={{
                        width: `${width}%`,
                      }}
                      title={`${cut.label} — ${formatInches(
                        cut.length
                      )}`}
                    >
                      <span className="barras-cut-label">
                        {cut.label}
                      </span>

                      <span className="barras-cut-length">
                        {formatInches(cut.length)}
                      </span>
                    </div>
                  );
                })}

                {bar.waste > 0 && (
                  <div
                    className="barras-waste"
                    style={{
                      width: `${Math.max(
                        0,
                        100 - usedPercent
                      )}%`,
                    }}
                  >
                    <span>
                      {formatInches(bar.waste)}
                    </span>
                  </div>
                )}
              </div>

              <div className="barras-bar-footer">
                <span>
                  {bar.cuts.length} corte
                  {bar.cuts.length !== 1 ? "s" : ""}
                </span>

                <span>
                  Barra: {formatInches(bar.barLength)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}