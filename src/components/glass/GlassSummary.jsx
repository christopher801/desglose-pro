import React from "react";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("es-DO", {
    maximumFractionDigits: 2,
  });
}

export default function GlassSummary({ resultado }) {
  if (!resultado) {
    return (
      <section className="glass-summary glass-summary-empty">
        <div>
          <i className="bi bi-bar-chart"></i>

          <div>
            <strong>Resumen de optimización</strong>
            <span>
              Ejecuta la optimización para visualizar los
              resultados del corte.
            </span>
          </div>
        </div>
      </section>
    );
  }

  const stats = [
    {
      icon: "bi-grid-3x3-gap",
      label: "Planchas necesarias",
      value: formatNumber(resultado.sheetsCount),
    },
    {
      icon: "bi-grid",
      label: "Piezas totales",
      value: formatNumber(resultado.piecesCount),
    },
    {
      icon: "bi-check2-circle",
      label: "Área utilizada",
      value: `${formatNumber(resultado.usedPercentage)}%`,
      detail: formatNumber(resultado.usedArea),
    },
    {
      icon: "bi-recycle",
      label: "Área desperdiciada",
      value: `${formatNumber(resultado.wastePercentage)}%`,
      detail: formatNumber(resultado.wasteArea),
    },
  ];

  return (
    <section className="glass-summary">
      <div className="glass-summary-header">
        <div>
          <span className="glass-summary-kicker">
            RESULTADO
          </span>

          <h2>Resumen de optimización</h2>
        </div>

        <div className="glass-summary-status">
          <i className="bi bi-check-circle-fill"></i>
          Optimización completada
        </div>
      </div>

      <div className="glass-summary-grid">
        {stats.map((stat) => (
          <div className="glass-summary-card" key={stat.label}>
            <div className="glass-summary-icon">
              <i className={`bi ${stat.icon}`}></i>
            </div>

            <div>
              <span>{stat.label}</span>

              <strong>{stat.value}</strong>

              {stat.detail && (
                <small>{stat.detail}</small>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}