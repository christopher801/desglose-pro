import React from "react";
import { formatMeasurement } from "../../utils/barras/barraUnits";

export default function BarraTable({
  cuts,
  unit,
  onRemove,
  onEdit,
}) {
  if (!cuts.length) {
    return (
      <div className="barras-empty">
        <div className="barras-empty-icon">
          <i className="bi bi-rulers" />
        </div>

        <h3>No hay cortes agregados</h3>

        <p>
          Agrega los perfiles que necesitas optimizar.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="barras-table">
        <thead>
          <tr>
            <th>LARGO</th>
            <th>CANTIDAD</th>
            <th>MATERIAL</th>
            <th>ETIQUETA</th>
            <th className="text-center">ACCIONES</th>
          </tr>
        </thead>

        <tbody>
          {cuts.map((cut) => (
            <tr key={cut.id}>
              <td className="barras-length-cell">
                {formatMeasurement(cut.length, unit)}
              </td>

              <td>
                <span className="barras-quantity">
                  {cut.quantity}
                </span>
              </td>

              <td>
                <span className="barras-material">
                  {cut.material}
                </span>
              </td>

              <td>
                <span className="barras-label">
                  {cut.label}
                </span>
              </td>

              <td>
                <div className="barras-row-actions">
                  <button
                    type="button"
                    className="btn-ghost-sm"
                    title="Editar"
                    onClick={() => onEdit(cut)}
                  >
                    <i className="bi bi-pencil" />
                  </button>

                  <button
                    type="button"
                    className="btn-danger-sm"
                    title="Eliminar"
                    onClick={() => onRemove(cut.id)}
                  >
                    <i className="bi bi-trash3" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}