import React from "react";

const TIPOS_VIDRIO = [
  "Claro",
  "Bronce",
  "Gris",
  "Azul",
  "Verde",
  "Reflectivo",
  "Templado",
  "Laminado",
  "Espejo",
];

const UNIDADES = [
  { value: "mm", label: "Milímetros (mm)" },
  { value: "cm", label: "Centímetros (cm)" },
  { value: "m", label: "Metros (m)" },
  { value: "in", label: "Pulgadas (in)" },
];

export default function GlassProjectForm({ proyecto, onChange, disabled }) {
  const handle = (campo) => (e) => {
    onChange({ ...proyecto, [campo]: e.target.value });
  };

  return (
    <div className="card-modern mb-4">
      <h3 className="section-title">
        <i className="bi bi-info-circle me-2"></i>
        Datos del Proyecto
      </h3>

      <form className="auth-form">
        <div className="form-grid-4">
          <div className="auth-field">
            <label className="auth-label">Cliente</label>
            <input
              type="text"
              className="auth-input"
              value={proyecto.cliente}
              onChange={handle("cliente")}
              disabled={disabled}
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Proyecto</label>
            <input
              type="text"
              className="auth-input"
              value={proyecto.proyecto}
              onChange={handle("proyecto")}
              disabled={disabled}
              placeholder="Nombre o referencia"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Tipo de vidrio</label>
            <select
              className="auth-input"
              value={proyecto.tipoVidrio}
              onChange={handle("tipoVidrio")}
              disabled={disabled}
            >
              {TIPOS_VIDRIO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label className="auth-label">Espesor</label>
            <input
              type="text"
              className="auth-input"
              value={proyecto.espesor}
              onChange={handle("espesor")}
              disabled={disabled}
              placeholder="Ej. 6mm"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Color</label>
            <input
              type="text"
              className="auth-input"
              value={proyecto.color}
              onChange={handle("color")}
              disabled={disabled}
              placeholder="Ej. Incoloro"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Unidad</label>
            <select
              className="auth-input"
              value={proyecto.unidad}
              onChange={handle("unidad")}
              disabled={disabled}
            >
              {UNIDADES.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label className="auth-label">Ancho de plancha</label>
            <input
              type="number"
              className="auth-input"
              value={proyecto.anchoPlancha}
              onChange={handle("anchoPlancha")}
              disabled={disabled}
              min="0"
              step="any"
              placeholder="Ej. 2440"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Alto de plancha</label>
            <input
              type="number"
              className="auth-input"
              value={proyecto.altoPlancha}
              onChange={handle("altoPlancha")}
              disabled={disabled}
              min="0"
              step="any"
              placeholder="Ej. 1830"
            />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">Observaciones</label>
          <textarea
            className="auth-input"
            value={proyecto.observaciones}
            onChange={handle("observaciones")}
            disabled={disabled}
            rows={2}
            placeholder="Notas adicionales sobre el proyecto"
          />
        </div>
      </form>
    </div>
  );
}