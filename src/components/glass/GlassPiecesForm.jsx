import React, { useState } from "react";

export default function GlassPiecesForm({
  anchoPlancha,
  altoPlancha,
  onAdd,
  disabled,
}) {
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [error, setError] = useState("");

  const validar = (a, h, c) => {
    const anchoNum = Number(a);
    const altoNum = Number(h);
    const cantidadNum = Number(c);

    if (!a || !h || anchoNum <= 0 || altoNum <= 0) {
      return "El ancho y el alto deben ser mayores a cero.";
    }
    if (!c || cantidadNum < 1 || !Number.isInteger(cantidadNum)) {
      return "La cantidad debe ser un número entero mayor o igual a 1.";
    }
    if (anchoNum < 0 || altoNum < 0) {
      return "No se permiten valores negativos.";
    }

    const plancha = Number(anchoPlancha);
    const plancha2 = Number(altoPlancha);
    if (plancha > 0 && plancha2 > 0) {
      const cabeNormal = anchoNum <= plancha && altoNum <= plancha2;
      const cabeRotada = anchoNum <= plancha2 && altoNum <= plancha;
      if (!cabeNormal && !cabeRotada) {
        return "La pieza es más grande que la plancha definida.";
      }
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mensaje = validar(ancho, alto, cantidad);
    if (mensaje) {
      setError(mensaje);
      return;
    }
    setError("");
    onAdd({
      ancho: Number(ancho),
      alto: Number(alto),
      cantidad: Number(cantidad),
    });
    setAncho("");
    setAlto("");
    setCantidad("1");
  };

  return (
    <div className="card-modern mb-4">
      <h3 className="section-title">
        <i className="bi bi-plus-square me-2"></i>
        Agregar Pieza
      </h3>

      {error && (
        <div
          className="empty-state"
          style={{
            color: "var(--danger, #ef4444)",
            textAlign: "left",
            padding: "10px 14px",
          }}
        >
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-grid-4">
          <div className="auth-field">
            <label className="auth-label">Ancho</label>
            <input
              type="number"
              className="auth-input"
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
              disabled={disabled}
              min="0"
              step="any"
              placeholder="0"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Alto</label>
            <input
              type="number"
              className="auth-input"
              value={alto}
              onChange={(e) => setAlto(e.target.value)}
              disabled={disabled}
              min="0"
              step="any"
              placeholder="0"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Cantidad</label>
            <input
              type="number"
              className="auth-input"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              disabled={disabled}
              min="1"
              step="1"
              placeholder="1"
            />
          </div>

          <div className="auth-field" style={{ justifyContent: "flex-end" }}>
            <button
              type="submit"
              className="btn-primary-sm"
              disabled={disabled}
              style={{ marginTop: "22px" }}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Agregar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}