import React from "react";
import { calcularLayoutSvg } from "../../utils/glassSvg";

function PlanchaSvg({ plancha }) {
  const layout = calcularLayoutSvg(plancha);

  return (
    <div
      style={{
        border: "1px solid var(--gray-200, #e2e8f0)",
        borderRadius: "var(--radius, 12px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          borderBottom: "1px solid var(--gray-200, #e2e8f0)",
          background: "var(--gray-50, #f8fafc)",
        }}
      >
        <span style={{ fontWeight: 600, color: "var(--gray-800, #1e293b)" }}>
          <i
            className="bi bi-square me-2"
            style={{ color: "var(--primary, #1a56db)" }}
          ></i>
          Plancha #{plancha.numero}
        </span>
        <span className="badge badge-active">
          {plancha.piezas.length} pieza{plancha.piezas.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        <svg
          width={layout.viewBoxWidth}
          height={layout.viewBoxHeight}
          viewBox={`0 0 ${layout.viewBoxWidth} ${layout.viewBoxHeight}`}
          style={{ maxWidth: "100%" }}
        >
          <rect
            x={0}
            y={0}
            width={layout.viewBoxWidth}
            height={layout.viewBoxHeight}
            fill="var(--gray-50, #f8fafc)"
            stroke="var(--gray-300, #cbd5e1)"
            strokeWidth={2}
          />

          {layout.rects.map((rect, i) => (
            <g key={i}>
              <rect
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill="var(--primary-light, #3b82f6)"
                fillOpacity={0.25}
                stroke="var(--primary, #1a56db)"
                strokeWidth={1.5}
              />
              <text
                x={rect.x + rect.width / 2}
                y={rect.y + rect.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fill="var(--gray-700, #334155)"
              >
                {rect.realWidth} x {rect.realHeight}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function GlassSvgViewer({ sheets }) {
  if (!sheets || sheets.length === 0) return null;

  return (
    <div className="card-modern mb-4">
      <h3 className="section-title">
        <i className="bi bi-grid-3x3-gap me-2"></i>
        Distribución de Corte
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {sheets.map((plancha) => (
          <PlanchaSvg key={plancha.numero} plancha={plancha} />
        ))}
      </div>
    </div>
  );
}