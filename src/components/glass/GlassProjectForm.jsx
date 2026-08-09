import React from "react";

const TIPOS_VIDRIO = [
  "Vidrio Monolítico",
  "Vidrio laminado",
  "Vidrio texturizado",
  "Espejo",
];

const ESPESOR = [
  '1/8" (3mm)',
  '3/16" (4mm)',
  '1/4" (6mm)',
  '5/16" (8mm)',
  '3/8" (10mm)',
  '1/2" (12mm)',
  '5/8" (15mm)',
  '3/4" (19mm)',
];

const COLOR = [
  "Incoloro",
  "Bronce",
  "Gris",
  "Azul",
  "Verde",
  "Reflectivo",
  "Negro",
];

const UNIDADES = [
  { value: "in", label: "Pulgadas (in)" },
  { value: "mm", label: "Milímetros (mm)" },
  { value: "cm", label: "Centímetros (cm)" },
  { value: "m", label: "Metros (m)" },
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
            <select
              className="auth-input"
              value={proyecto.espesor}
              onChange={handle("espesor")}
              disabled={disabled}
            >
              {ESPESOR.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="auth-field">
            <label className="auth-label">Color</label>
            <select
              className="auth-input"
              value={proyecto.color}
              onChange={handle("color")}
              disabled={disabled}
            >
              {COLOR.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
              placeholder="Ej. 130"
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
              placeholder="Ej. 84"
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
