import React, { useMemo, useState } from "react";

export default function GlassPiecesTable({
  piezas,
  onEdit,
  onDelete,
  disabled = false,
}) {
  const [editingId, setEditingId] = useState(null);

  const totalPiezas = useMemo(
    () =>
      piezas.reduce(
        (total, pieza) =>
          total + Number(pieza.cantidad || 0),
        0
      ),
    [piezas]
  );

  const areaTotal = useMemo(
    () =>
      piezas.reduce(
        (total, pieza) =>
          total +
          Number(pieza.ancho || 0) *
            Number(pieza.alto || 0) *
            Number(pieza.cantidad || 0),
        0
      ),
    [piezas]
  );

  const handleEdit = (pieza, field, value) => {
    const numericValue = Number(value);

    if (!numericValue || numericValue <= 0) {
      return;
    }

    onEdit(pieza.id, {
      [field]: field === "cantidad"
        ? Math.max(1, Math.round(numericValue))
        : numericValue,
    });
  };

  return (
    <section className="glass-card">
      

      <div className="glass-card-body glass-table-body">
        {piezas.length === 0 ? (
          <div className="glass-empty-state">
            <div className="glass-empty-icon">
              <i className="bi bi-grid"></i>
            </div>

            <strong>No hay piezas agregadas</strong>

            <span>
              Agrega las piezas del proyecto para comenzar
              la optimización.
            </span>
          </div>
        ) : (
          <div className="glass-table-responsive">
            <table className="glass-pieces-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ANCHO</th>
                  <th>ALTO</th>
                  <th>CANTIDAD</th>
                  <th>ÁREA</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {piezas.map((pieza, index) => {
                  const area =
                    Number(pieza.ancho || 0) *
                    Number(pieza.alto || 0) *
                    Number(pieza.cantidad || 0);

                  const editing =
                    editingId === pieza.id;

                  return (
                    <tr key={pieza.id}>
                      <td>
                        <span className="glass-piece-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>

                      <td>
                        {editing ? (
                          <input
                            className="glass-table-input"
                            type="number"
                            min="0"
                            step="any"
                            value={pieza.ancho}
                            onChange={(e) =>
                              handleEdit(
                                pieza,
                                "ancho",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          `${pieza.ancho}`
                        )}
                      </td>

                      <td>
                        {editing ? (
                          <input
                            className="glass-table-input"
                            type="number"
                            min="0"
                            step="any"
                            value={pieza.alto}
                            onChange={(e) =>
                              handleEdit(
                                pieza,
                                "alto",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          `${pieza.alto}`
                        )}
                      </td>

                      <td>
                        {editing ? (
                          <input
                            className="glass-table-input glass-table-input-small"
                            type="number"
                            min="1"
                            step="1"
                            value={pieza.cantidad}
                            onChange={(e) =>
                              handleEdit(
                                pieza,
                                "cantidad",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          <span className="glass-quantity-badge">
                            {pieza.cantidad}
                          </span>
                        )}
                      </td>

                      <td className="glass-area-cell">
                        {area.toLocaleString("es-DO")}
                      </td>

                      <td>
                        <div className="glass-row-actions">
                          <button
                            type="button"
                            className="glass-icon-button"
                            title={
                              editing
                                ? "Finalizar edición"
                                : "Editar pieza"
                            }
                            disabled={disabled}
                            onClick={() =>
                              setEditingId(
                                editing
                                  ? null
                                  : pieza.id
                              )
                            }
                          >
                            <i
                              className={
                                editing
                                  ? "bi bi-check-lg"
                                  : "bi bi-pencil"
                              }
                            ></i>
                          </button>

                          <button
                            type="button"
                            className="glass-icon-button glass-icon-danger"
                            title="Eliminar pieza"
                            disabled={disabled}
                            onClick={() =>
                              onDelete(pieza.id)
                            }
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="3">
                    <strong>Total</strong>
                  </td>

                  <td>
                    <strong>{totalPiezas}</strong>
                  </td>

                  <td>
                    <strong>
                      {areaTotal.toLocaleString("es-DO")}
                    </strong>
                  </td>

                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}