// src/pages/desglose/components/MaterialP40.jsx

import React, { useMemo } from "react";
import FractionUtils from "../../../utils/fraction";

import {
  calcularResumenMaterialesP40,
  calcularTotalesMaterialesP40,
  BARRA_PIES,
} from "../../../utils/p40Materials";

export default function MaterialP40({ medidas = [] }) {
  const materiales = useMemo(() => {
    return calcularResumenMaterialesP40(medidas);
  }, [medidas]);

  const totales = useMemo(() => {
    return calcularTotalesMaterialesP40(materiales);
  }, [materiales]);

  if (!medidas.length) {
    return null;
  }

  return (
    <div
      className="table-container"
      style={{ marginTop: "24px" }}
    >
      {/* HEADER */}
      <div
        className="table-title"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="bi bi-box-seam"></i>
          <span>MATERIALES P-40</span>
        </div>

        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            opacity: 0.8,
          }}
        >
          {medidas.length} medida
          {medidas.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* INFO */}
      <div
        style={{
          padding: "12px 16px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        <span>
          <i
            className="bi bi-info-circle"
            style={{ marginRight: "6px" }}
          ></i>

          Material calculado para todas las medidas agregadas.
        </span>

        <strong style={{ color: "#334155" }}>
          Barra: {BARRA_PIES} pies (252")
        </strong>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table
          className="table-professional"
          style={{ minWidth: "720px" }}
        >
          <thead>
            <tr>
              <th>Material</th>

              <th style={{ textAlign: "center" }}>
                Piezas
              </th>

              <th style={{ textAlign: "center" }}>
                Pies
              </th>

              <th style={{ textAlign: "center" }}>
                Barras
              </th>
            </tr>
          </thead>

          <tbody>
            {materiales.map((item) => (
              <tr key={item.material}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <i
                      className="bi bi-box-seam"
                      style={{
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    ></i>

                    <span>{item.material}</span>
                  </div>
                </td>

                <td style={{ textAlign: "center" }}>
                  <strong>{item.piezas}</strong>
                </td>

                <td style={{ textAlign: "center" }}>
                  {item.pies.toFixed(2)}
                </td>

                <td style={{ textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "36px",
                      height: "28px",
                      padding: "0 8px",
                      borderRadius: "7px",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      fontWeight: 700,
                      fontSize: "12px",
                    }}
                  >
                    {item.barras}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

          {/* TOTAL */}
          <tfoot>
            <tr>
              <th>
                TOTAL
              </th>

              <th style={{ textAlign: "center" }}>
                {totales.piezas}
              </th>

              <th style={{ textAlign: "center" }}>
                {totales.pies.toFixed(2)}
              </th>

              <th style={{ textAlign: "center" }}>
                {totales.barras}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* FOOTER INFO */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #e2e8f0",
          background: "#ffffff",
          fontSize: "11px",
          color: "#64748b",
        }}
      >
        <i
          className="bi bi-calculator"
          style={{ marginRight: "6px" }}
        ></i>

        Los materiales de todas las ventanas fueron agrupados
        por tipo y calculados utilizando barras de{" "}
        <strong>21 pies</strong>.
      </div>
    </div>
  );
}