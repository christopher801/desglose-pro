/**
 * Todas las operaciones internas se realizan en pulgadas.
 *
 * 1 pulgada = 1"
 * 1 cm      = 0.3937007874"
 * 1 m       = 39.37007874"
 * 1 ft      = 12"
 */

const UNIT_TO_INCHES = {
  in: 1,
  cm: 0.3937007874,
  m: 39.37007874,
  ft: 12,
};

export const SUPPORTED_UNITS = Object.keys(UNIT_TO_INCHES);

/**
 * Convierte una medida desde la unidad seleccionada
 * hacia pulgadas.
 */
export function convertToInches(value, unit) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  const factor = UNIT_TO_INCHES[unit];

  if (factor === undefined) {
    throw new Error(`Unidad no soportada: ${unit}`);
  }

  return numericValue * factor;
}

/**
 * Convierte pulgadas hacia la unidad seleccionada.
 */
export function convertFromInches(value, unit) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  const factor = UNIT_TO_INCHES[unit];

  if (factor === undefined) {
    throw new Error(`Unidad no soportada: ${unit}`);
  }

  return numericValue / factor;
}

/**
 * Formatea una medida según la unidad seleccionada.
 */
export function formatMeasurement(value, unit) {
  const converted = convertFromInches(value, unit);

  if (unit === "in") {
    return `${converted.toFixed(3)}"`;
  }

  if (unit === "m") {
    return `${converted.toFixed(3)} m`;
  }

  if (unit === "cm") {
    return `${converted.toFixed(2)} cm`;
  }

  if (unit === "ft") {
    return `${converted.toFixed(3)} ft`;
  }

  return `${converted.toFixed(3)}`;
}

/**
 * Formatea directamente una medida en pulgadas.
 *
 * Ejemplo:
 * 252 -> 252.000"
 */
export function formatInches(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return `0"`;
  }

  return `${numericValue.toFixed(3)}"`;
}

/**
 * Convierte un decimal en una representación aproximada
 * con fracciones comunes de pulgada.
 *
 * Ejemplo:
 * 12.0625 -> 12 1/16"
 */
export function formatFractionalInches(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return `0"`;
  }

  const whole = Math.floor(numericValue);
  const decimal = numericValue - whole;

  const fractions = [
    { value: 0, text: "" },
    { value: 1 / 16, text: "1/16" },
    { value: 2 / 16, text: "1/8" },
    { value: 3 / 16, text: "3/16" },
    { value: 4 / 16, text: "1/4" },
    { value: 5 / 16, text: "5/16" },
    { value: 6 / 16, text: "3/8" },
    { value: 7 / 16, text: "7/16" },
    { value: 8 / 16, text: "1/2" },
    { value: 9 / 16, text: "9/16" },
    { value: 10 / 16, text: "5/8" },
    { value: 11 / 16, text: "11/16" },
    { value: 12 / 16, text: "3/4" },
    { value: 13 / 16, text: "13/16" },
    { value: 14 / 16, text: "7/8" },
    { value: 15 / 16, text: "15/16" },
    { value: 16 / 16, text: "" },
  ];

  let closest = fractions[0];

  for (const fraction of fractions) {
    if (
      Math.abs(decimal - fraction.value) <
      Math.abs(decimal - closest.value)
    ) {
      closest = fraction;
    }
  }

  if (closest.value >= 1) {
    return `${whole + 1}"`;
  }

  if (!closest.text) {
    return `${whole}"`;
  }

  if (whole === 0) {
    return `${closest.text}"`;
  }

  return `${whole} ${closest.text}"`;
}