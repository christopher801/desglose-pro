import React from "react";

function TarjetaResumen({ etiqueta, valor, color }) {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-card-title">{etiqueta}</div>
      <div className="stat-card-value" style={{ color }}>
        {valor}
      </div>
    </div>
  );
}

export default function GlassSummary({ resultado }) {
  if (!resultado) return null;

  const {
    sheetsCount,
    piecesCount,
    usedArea,
    wasteArea,
    usedPercentage,
    wastePercentage,
  } = resultado;

  return (
    <div className="mb-4">
      <h3 className="section-title">
        <i className="bi bi-clipboard-data me-2"></i>
        Resumen de Optimización
      </h3>
      <div className="dashboard-stats">
        <TarjetaResumen
          etiqueta="Planchas necesarias"
          valor={sheetsCount}
          color="var(--primary, #1a56db)"
        />
        <TarjetaResumen
          etiqueta="Piezas totales"
          valor={piecesCount}
          color="var(--primary, #1a56db)"
        />
        <TarjetaResumen
          etiqueta="Área utilizada"
          valor={`${usedArea.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })} (${usedPercentage.toFixed(1)}%)`}
          color="var(--success, #10b981)"
        />
        <TarjetaResumen
          etiqueta="Área desperdiciada"
          valor={`${wasteArea.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })} (${wastePercentage.toFixed(1)}%)`}
          color="var(--warning, #f59e0b)"
        />
      </div>
    </div>
  );
}