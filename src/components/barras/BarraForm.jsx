import React, { useState } from "react";

export default function BarraForm({
  unit,
  onAdd,
  onCancel,
  editingCut = null,
}) {
  const [length, setLength] = useState(
    editingCut?.length ?? ""
  );

  const [quantity, setQuantity] = useState(
    editingCut?.quantity ?? 1
  );

  const [material, setMaterial] = useState(
    editingCut?.material ?? ""
  );

  const [label, setLabel] = useState(
    editingCut?.label ?? ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedLength = Number(length);
    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedLength) || parsedLength <= 0) {
      return;
    }

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return;
    }

    onAdd({
      id: editingCut?.id,
      length: parsedLength,
      quantity: parsedQuantity,
      material: material.trim() || "Perfil",
      label: label.trim() || "Sin etiqueta",
    });

    if (!editingCut) {
      setLength("");
      setQuantity(1);
      setMaterial("");
      setLabel("");
    }
  };

  return (
    <form
      className="barras-form"
      onSubmit={handleSubmit}
    >
      <div className="barras-form-header">
        <div>
          <h3>
            {editingCut
              ? "Editar corte"
              : "Agregar corte"}
          </h3>

          <p>
            Registra las piezas que necesitas cortar.
          </p>
        </div>
      </div>

      <div className="barras-form-grid">
        <div className="barras-field">
          <label htmlFor="cut-length">
            LARGO ({unit})
          </label>

          <input
            id="cut-length"
            type="number"
            min="0.001"
            step="0.001"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder={
              unit === "cm"
                ? "Ej. 120"
                : unit === "m"
                ? "Ej. 1.20"
                : "Ej. 4"
            }
            required
          />
        </div>

        <div className="barras-field">
          <label htmlFor="cut-quantity">
            CANTIDAD
          </label>

          <input
            id="cut-quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="barras-field">
          <label htmlFor="cut-material">
            MATERIAL
          </label>

          <input
            id="cut-material"
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Ej. Aluminio P-92"
            required
          />
        </div>

        <div className="barras-field">
          <label htmlFor="cut-label">
            ETIQUETA
          </label>

          <input
            id="cut-label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Ej. Jamba 1"
          />
        </div>
      </div>

      <div className="barras-form-actions">
        <button
          type="submit"
          className="btn-primary-sm"
        >
          <i className="bi bi-plus-lg me-1" />
          {editingCut
            ? "Actualizar corte"
            : "Agregar corte"}
        </button>

        {editingCut && (
          <button
            type="button"
            className="btn-secondary-sm"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}