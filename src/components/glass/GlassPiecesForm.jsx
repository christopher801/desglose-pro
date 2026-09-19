import React, { useState } from "react";

export default function GlassPiecesForm({
  anchoPlancha,
  altoPlancha,
  onAdd,
  disabled = false,
}) {
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const width = Number(ancho);
    const height = Number(alto);
    const qty = Number(cantidad);

    if (!width || width <= 0) {
      setError("Ingresa un ancho válido.");
      return;
    }

    if (!height || height <= 0) {
      setError("Ingresa un alto válido.");
      return;
    }

    if (!Number.isInteger(qty) || qty < 1) {
      setError("La cantidad debe ser un número entero mayor que 0.");
      return;
    }

    const sheetWidth = Number(anchoPlancha);
    const sheetHeight = Number(altoPlancha);

    if (sheetWidth > 0 && sheetHeight > 0) {
      const normal =
        width <= sheetWidth && height <= sheetHeight;

      const rotated =
        width <= sheetHeight && height <= sheetWidth;

      if (!normal && !rotated) {
        setError(
          `La pieza ${width} × ${height} no cabe en la plancha ${sheetWidth} × ${sheetHeight}.`
        );
        return;
      }
    }

    onAdd({
      ancho: width,
      alto: height,
      cantidad: qty,
    });

    setAncho("");
    setAlto("");
    setCantidad("1");
    setError("");
  };

  return (
    <section className="glass-card">
      <div className="glass-card-header">
        <div className="glass-section-icon">
          <i className="bi bi-plus-square"></i>
        </div>

        <div>
          <h2>Agregar piezas</h2>
          <p>
            Define las dimensiones y cantidad de cada pieza.
          </p>
        </div>
      </div>

      <div className="glass-card-body">
        <form
          className="glass-piece-form"
          onSubmit={handleSubmit}
        >
          <div className="glass-field">
            <label>Ancho</label>

            <input
              type="number"
              min="0"
              step="any"
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
              placeholder="40"
              disabled={disabled}
            />
          </div>

          <div className="glass-piece-x">×</div>

          <div className="glass-field">
            <label>Alto</label>

            <input
              type="number"
              min="0"
              step="any"
              value={alto}
              onChange={(e) => setAlto(e.target.value)}
              placeholder="50"
              disabled={disabled}
            />
          </div>

          <div className="glass-field">
            <label>Cantidad</label>

            <input
              type="number"
              min="1"
              step="1"
              value={cantidad}
              onChange={(e) =>
                setCantidad(e.target.value)
              }
              disabled={disabled}
            />
          </div>

          <button
            type="submit"
            className="glass-add-button"
            disabled={disabled}
          >
            <i className="bi bi-plus-lg"></i>
            Agregar pieza
          </button>
        </form>

        <div className="glass-form-help">
          <i className="bi bi-info-circle"></i>
          <span>
            Las dimensiones deben utilizar la misma unidad
            seleccionada para la plancha.
          </span>
        </div>

        {error && (
          <div className="glass-inline-error">
            <i className="bi bi-exclamation-circle"></i>
            {error}
          </div>
        )}
      </div>
    </section>
  );
}