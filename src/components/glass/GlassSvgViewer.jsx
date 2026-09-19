import React from "react";
import { calcularLayoutSvg } from "../../utils/glassSvg";

function PlanchaSvg({ plancha }) {
  const layout = calcularLayoutSvg(plancha);

  return (
    <div className="glass-sheet-card">
      <div className="glass-sheet-header">
        <div>
          <span>PLANCHA</span>
          <strong>#{plancha.numero}</strong>
        </div>

        <div className="glass-sheet-meta">
          {plancha.width} × {plancha.height}
        </div>

        <div className="glass-sheet-count">
          <i className="bi bi-grid"></i>
          {plancha.piezas.length} piezas
        </div>
      </div>

      <div className="glass-sheet-body">
        <div className="glass-sheet-svg-wrap">
          <svg
            viewBox={`0 0 ${layout.viewBoxWidth} ${layout.viewBoxHeight}`}
            className="glass-sheet-svg"
            role="img"
            aria-label={`Plancha ${plancha.numero}`}
          >
            <rect
              x="0"
              y="0"
              width={layout.sheetWidth}
              height={layout.sheetHeight}
              className="glass-svg-sheet"
            />

            {layout.rects.map((rect, index) => (
              <g key={rect.pieceId || index}>
                <rect
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={rect.height}
                  className="glass-svg-piece"
                />

                {rect.width > 45 &&
                  rect.height > 28 && (
                    <>
                      <text
                        x={
                          rect.x +
                          rect.width / 2
                        }
                        y={
                          rect.y +
                          rect.height / 2 -
                          4
                        }
                        textAnchor="middle"
                        className="glass-svg-piece-number"
                      >
                        {index + 1}
                      </text>

                      <text
                        x={
                          rect.x +
                          rect.width / 2
                        }
                        y={
                          rect.y +
                          rect.height / 2 +
                          11
                        }
                        textAnchor="middle"
                        className="glass-svg-piece-size"
                      >
                        {rect.realWidth} ×{" "}
                        {rect.realHeight}
                      </text>
                    </>
                  )}
              </g>
            ))}
          </svg>
        </div>

        <div className="glass-sheet-footer">
          <span>
            <i className="bi bi-rulers"></i>
            Dimensiones: {plancha.width} ×{" "}
            {plancha.height}
          </span>

          <span>
            <i className="bi bi-grid"></i>
            {plancha.piezas.length} piezas
          </span>
        </div>
      </div>
    </div>
  );
}

export default function GlassSvgViewer({ sheets }) {
  if (!sheets || sheets.length === 0) {
    return null;
  }

  return (
    <section className="glass-card glass-drawings-section">
      <div className="glass-card-header">
        <div className="glass-section-icon">
          <i className="bi bi-diagram-3"></i>
        </div>

        <div>
          <h2>Croquis de corte</h2>
          <p>
            Distribución visual de las piezas en cada plancha.
          </p>
        </div>
      </div>

      <div className="glass-card-body">
        <div className="glass-sheets-grid">
          {sheets.map((plancha) => (
            <PlanchaSvg
              key={plancha.numero}
              plancha={plancha}
            />
          ))}
        </div>
      </div>
    </section>
  );
}