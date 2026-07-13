import React, { useState } from "react";

export default function GlassPiecesTable({ piezas, onEdit, onDelete, disabled }) {
  const [editandoId, setEditandoId] = useState(null);
  const [valores, setValores] = useState({ ancho: "", alto: "", cantidad: "" });

  const totalPiezas = piezas.reduce((acc, p) => acc + Number(p.cantidad), 0);

  const iniciarEdicion = (pieza) => {
    setEditandoId(pieza.id);
    setValores({
      ancho: pieza.ancho,
      alto: pieza.alto,
      cantidad: pieza.cantidad,
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
  };

  const guardarEdicion = (id) => {
    const anchoNum = Number(valores.ancho);
    const altoNum = Number(valores.alto);
    const cantidadNum = Number(valores.cantidad);

    if (
      !valores.ancho ||
      !valores.alto ||
      anchoNum <= 0 ||
      altoNum <= 0 ||
      !Number.isInteger(cantidadNum) ||
      cantidadNum < 1
    ) {
      return;
    }

    onEdit(id, { ancho: anchoNum, alto: altoNum, cantidad: cantidadNum });
    setEditandoId(null);
  };

  if (piezas.length === 0) {
    return (
      <div className="card-modern mb-4">
        <div className="empty-state">
          <i className="bi bi-inbox fs-2 d-block mb-2"></i>
          Todavía no se han agregado piezas.
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern mb-4">
      <div className="admin-header">
        <h3 className="section-title" style={{ marginBottom: 0 }}>
          <i className="bi bi-list-ul me-2"></i>
          Piezas a Cortar
        </h3>
        <span className="badge badge-active">
          Total: {totalPiezas} pieza{totalPiezas !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ancho</th>
              <th>Alto</th>
              <th>Cantidad</th>
              <th>Área</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {piezas.map((pieza) => {
              const enEdicion = editandoId === pieza.id;
              const area = pieza.ancho * pieza.alto * pieza.cantidad;

              return (
                <tr key={pieza.id}>
                  <td>
                    {enEdicion ? (
                      <input
                        type="number"
                        className="auth-input"
                        value={valores.ancho}
                        min="0"
                        step="any"
                        onChange={(e) =>
                          setValores({ ...valores, ancho: e.target.value })
                        }
                      />
                    ) : (
                      pieza.ancho
                    )}
                  </td>
                  <td>
                    {enEdicion ? (
                      <input
                        type="number"
                        className="auth-input"
                        value={valores.alto}
                        min="0"
                        step="any"
                        onChange={(e) =>
                          setValores({ ...valores, alto: e.target.value })
                        }
                      />
                    ) : (
                      pieza.alto
                    )}
                  </td>
                  <td>
                    {enEdicion ? (
                      <input
                        type="number"
                        className="auth-input"
                        value={valores.cantidad}
                        min="1"
                        step="1"
                        onChange={(e) =>
                          setValores({ ...valores, cantidad: e.target.value })
                        }
                      />
                    ) : (
                      pieza.cantidad
                    )}
                  </td>
                  <td>{area.toLocaleString()}</td>
                  <td style={{ textAlign: "right" }}>
                    {enEdicion ? (
                      <>
                        <button
                          className="btn-primary-sm me-1"
                          onClick={() => guardarEdicion(pieza.id)}
                          disabled={disabled}
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button
                          className="btn-secondary-sm"
                          onClick={cancelarEdicion}
                          disabled={disabled}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-secondary-sm me-1"
                          onClick={() => iniciarEdicion(pieza)}
                          disabled={disabled}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn-danger-sm"
                          onClick={() => onDelete(pieza.id)}
                          disabled={disabled}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}