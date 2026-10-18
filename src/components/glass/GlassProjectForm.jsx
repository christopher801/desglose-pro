import React, { useEffect, useState } from "react";
import FractionUtils from "../../utils/fraction";

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
  { value: "in", label: "Pulgadas (in)" },
  { value: "mm", label: "Milímetros (mm)" },
  { value: "cm", label: "Centímetros (cm)" },
  { value: "m", label: "Metros (m)" },
];

export const DEFAULT_PLANCHA = {
  anchoPlancha: 130,
  altoPlancha: 84,
  unidad: "in",
};

const isEmpty = (v) => v === "" || v === null || v === undefined;

// FractionUtils.parseFraction devuelve 0 si es inválido; aquí 0 => null
const parse = (text) => {
  const clean = String(text ?? "")
    .replace(/["”″]/g, "")
    .replace(/,/g, ".")
    .trim();

  if (!clean) return null;

  const n = FractionUtils.parseFraction(clean);
  return Number.isFinite(n) && n > 0 ? n : null;
};

const toNumberOrNull = (value) => {
  if (isEmpty(value)) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

// Pulgadas => fracción (solo si es exacta a 1/16), otras unidades => número
const formatValue = (value, unidad) => {
  const n = toNumberOrNull(value);
  if (n === null) return "";

  if (unidad === "in") {
    const exacto = Math.abs(Math.round(n * 16) / 16 - n) < 1e-9;
    if (exacto) return FractionUtils.toSixteenths(n);
  }

  return String(n);
};

export default function GlassProjectForm({ proyecto, onChange }) {
  const [anchoText, setAnchoText] = useState(
    String(proyecto.anchoPlancha ?? DEFAULT_PLANCHA.anchoPlancha)
  );
  const [altoText, setAltoText] = useState(
    String(proyecto.altoPlancha ?? DEFAULT_PLANCHA.altoPlancha)
  );

  const handleChange = (field, value) => {
    onChange({
      ...proyecto,
      [field]: value,
    });
  };

  // Valores por defecto si el proyecto llega vacío
  useEffect(() => {
    if (
      isEmpty(proyecto.anchoPlancha) ||
      isEmpty(proyecto.altoPlancha) ||
      isEmpty(proyecto.unidad)
    ) {
      onChange({
        ...proyecto,
        anchoPlancha: isEmpty(proyecto.anchoPlancha)
          ? DEFAULT_PLANCHA.anchoPlancha
          : proyecto.anchoPlancha,
        altoPlancha: isEmpty(proyecto.altoPlancha)
          ? DEFAULT_PLANCHA.altoPlancha
          : proyecto.altoPlancha,
        unidad: isEmpty(proyecto.unidad)
          ? DEFAULT_PLANCHA.unidad
          : proyecto.unidad,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar el texto cuando el proyecto cambia desde afuera
  // (cargar proyecto, limpiar, etc.)
  useEffect(() => {
    if (parse(anchoText) !== toNumberOrNull(proyecto.anchoPlancha)) {
      setAnchoText(String(proyecto.anchoPlancha ?? ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyecto.anchoPlancha]);

  useEffect(() => {
    if (parse(altoText) !== toNumberOrNull(proyecto.altoPlancha)) {
      setAltoText(String(proyecto.altoPlancha ?? ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyecto.altoPlancha]);

  const handleAnchoChange = (e) => {
    const text = e.target.value;
    setAnchoText(text);
    handleChange("anchoPlancha", parse(text) ?? "");
  };

  const handleAltoChange = (e) => {
    const text = e.target.value;
    setAltoText(text);
    handleChange("altoPlancha", parse(text) ?? "");
  };

  // Al salir del campo: formatear si es válido, o volver al último valor válido
  const handleAnchoBlur = () => {
    const n = parse(anchoText);
    setAnchoText(
      n === null
        ? formatValue(proyecto.anchoPlancha, proyecto.unidad)
        : formatValue(n, proyecto.unidad)
    );
  };

  const handleAltoBlur = () => {
    const n = parse(altoText);
    setAltoText(
      n === null
        ? formatValue(proyecto.altoPlancha, proyecto.unidad)
        : formatValue(n, proyecto.unidad)
    );
  };

  return (
    <div className="barras-config">
      <div className="barras-config-grid">
        <div className="barras-field">
          <label htmlFor="plancha-ancho">ANCHO</label>
          <input
            id="plancha-ancho"
            type="text"
            inputMode="text"
            value={anchoText}
            onChange={handleAnchoChange}
            onBlur={handleAnchoBlur}
            placeholder="Ej. 130 o 52 1/2"
          />
        </div>

        <div className="barras-field">
          <label htmlFor="plancha-alto">ALTO</label>
          <input
            id="plancha-alto"
            type="text"
            inputMode="text"
            value={altoText}
            onChange={handleAltoChange}
            onBlur={handleAltoBlur}
            placeholder="Ej. 84 o 36 3/4"
          />
        </div>

        <div className="barras-field">
          <label htmlFor="plancha-unidad">UNIDAD</label>
          <select
            id="plancha-unidad"
            className="form-select"
            value={proyecto.unidad}
            onChange={(e) => handleChange("unidad", e.target.value)}
          >
            {UNIDADES.map((unidad) => (
              <option key={unidad.value} value={unidad.value}>
                {unidad.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}