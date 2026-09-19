import React from "react";

const TIPOS_VIDRIO = [
  "Vidrio Monolítico",
  "Vidrio Laminado",
  "Vidrio Texturizado",
  "Espejo",
];

const ESPESORES = [
  '1/8" (3mm)',
  '3/16" (4mm)',
  '1/4" (6mm)',
  '5/16" (8mm)',
  '3/8" (10mm)',
  '1/2" (12mm)',
  '5/8" (15mm)',
  '3/4" (19mm)',
];

const COLORES = [
  "Incoloro",
  "Bronce",
  "Gris",
  "Azul",
  "Verde",
  "Reflectivo",
  "Negro",
];

const UNIDADES = [
  {
    value: "in",
    label: "Pulgadas (in)",
  },
  {
    value: "mm",
    label: "Milímetros (mm)",
  },
  {
    value: "cm",
    label: "Centímetros (cm)",
  },
  {
    value: "m",
    label: "Metros (m)",
  },
];

export default function GlassProjectForm({
  proyecto,
  onChange,
}) {
  const handleChange = (field, value) => {
    onChange({
      ...proyecto,
      [field]: value,
    });
  };

  return (
    <section className="glass-card">
      <div className="glass-card-header">
        <div className="glass-section-icon">
          <i className="bi bi-file-earmark-text"></i>
        </div>

        <div>
          <h2>Información del proyecto</h2>
          <p>
            Datos generales y especificaciones del vidrio.
          </p>
        </div>
      </div>

      <div className="glass-card-body">

        <div className="glass-form-grid glass-form-grid-2">
          <div className="glass-field">
            <label>Cliente</label>

            <div className="glass-input-wrap">
              <i className="bi bi-person"></i>

              <input
                type="text"
                value={proyecto.cliente}
                onChange={(e) =>
                  handleChange("cliente", e.target.value)
                }
                placeholder="Nombre del cliente"
              />
            </div>
          </div>

          <div className="glass-field">
            <label>Proyecto / Obra</label>

            <div className="glass-input-wrap">
              <i className="bi bi-building"></i>

              <input
                type="text"
                value={proyecto.proyecto}
                onChange={(e) =>
                  handleChange("proyecto", e.target.value)
                }
                placeholder="Nombre del proyecto"
              />
            </div>
          </div>
        </div>

        <div className="glass-form-grid glass-form-grid-3">

          <div className="glass-field">
            <label>Tipo de vidrio</label>

            <select
              value={proyecto.tipoVidrio}
              onChange={(e) =>
                handleChange("tipoVidrio", e.target.value)
              }
            >
              {TIPOS_VIDRIO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="glass-field">
            <label>Espesor</label>

            <select
              value={proyecto.espesor}
              onChange={(e) =>
                handleChange("espesor", e.target.value)
              }
            >
              <option value="">Seleccionar espesor</option>

              {ESPESORES.map((espesor) => (
                <option key={espesor} value={espesor}>
                  {espesor}
                </option>
              ))}
            </select>
          </div>

          <div className="glass-field">
            <label>Color</label>

            <select
              value={proyecto.color}
              onChange={(e) =>
                handleChange("color", e.target.value)
              }
            >
              <option value="">Seleccionar color</option>

              {COLORES.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="glass-subsection-title">
          <i className="bi bi-rulers"></i>
          Dimensiones de la plancha
        </div>

        <div className="glass-form-grid glass-form-grid-3">

          <div className="glass-field">
            <label>Unidad</label>

            <select
              value={proyecto.unidad}
              onChange={(e) =>
                handleChange("unidad", e.target.value)
              }
            >
              {UNIDADES.map((unidad) => (
                <option
                  key={unidad.value}
                  value={unidad.value}
                >
                  {unidad.label}
                </option>
              ))}
            </select>
          </div>

          <div className="glass-field">
            <label>Ancho de plancha</label>

            <input
              type="number"
              min="0"
              step="any"
              value={proyecto.anchoPlancha}
              onChange={(e) =>
                handleChange(
                  "anchoPlancha",
                  e.target.value
                )
              }
              placeholder="Ej. 130"
            />
          </div>

          <div className="glass-field">
            <label>Alto de plancha</label>

            <input
              type="number"
              min="0"
              step="any"
              value={proyecto.altoPlancha}
              onChange={(e) =>
                handleChange(
                  "altoPlancha",
                  e.target.value
                )
              }
              placeholder="Ej. 84"
            />
          </div>
        </div>

        <div className="glass-field">
          <label>Observaciones</label>

          <textarea
            rows="3"
            value={proyecto.observaciones}
            onChange={(e) =>
              handleChange(
                "observaciones",
                e.target.value
              )
            }
            placeholder="Notas adicionales del proyecto..."
          />
        </div>
      </div>
    </section>
  );
}