const BARRA_PIES = 21;
const PULGADAS_POR_PIE = 12;

/**
 * Calcula los materiales necesarios para una ventana Tradicional.
 *
 * 1 barra = 21 pies = 252 pulgadas
 *
 * Cantidades por hojas:
 *
 * 2 hojas:
 * - Cabezal de la hoja: 2
 * - Alfeizar de la hoja: 2
 * - Jamba enganche: 2
 * - Jamba llavín: 2
 *
 * 3 hojas:
 * - Cabezal de la hoja: 3
 * - Alfeizar de la hoja: 3
 * - Jamba enganche: 4
 * - Jamba llavín: 2
 *
 * 4 hojas:
 * - Cabezal de la hoja: 4
 * - Alfeizar de la hoja: 4
 * - Jamba enganche: 4
 * - Jamba llavín: 4
 */
export const calcularMaterialesVentanaTradicional = ({
  ancho,
  alto,
  hojas,
}) => {
  if (
    !Number.isFinite(ancho) ||
    !Number.isFinite(alto) ||
    !Number.isFinite(hojas)
  ) {
    return [];
  }

  let cabAlf;

  let cantidadCabezalHoja;
  let cantidadAlfeizarHoja;

  let cantidadJambaEnganche;
  let cantidadJambaLlavin;

  // =========================
  // CANTIDADES SEGÚN HOJAS
  // =========================
  if (hojas === 2) {
    cabAlf = ancho / 2 - 4 / 16;

    cantidadCabezalHoja = 2;
    cantidadAlfeizarHoja = 2;

    cantidadJambaEnganche = 2;
    cantidadJambaLlavin = 2;
  } else if (hojas === 3) {
    cabAlf = ancho / 3 + 1 / 16;

    cantidadCabezalHoja = 3;
    cantidadAlfeizarHoja = 3;

    cantidadJambaEnganche = 4;
    cantidadJambaLlavin = 2;
  } else if (hojas === 4) {
    cabAlf = ancho / 4 - 3 / 16;

    cantidadCabezalHoja = 4;
    cantidadAlfeizarHoja = 4;

    cantidadJambaEnganche = 4;
    cantidadJambaLlavin = 4;
  } else {
    return [];
  }

  // =========================
  // JAMBAS
  // =========================
  const jambasEnganche = alto - 12 / 16;
  const jambasLlavin = alto - 12 / 16;

  // =========================
  // MARCO
  // =========================
  const cabMarco =
    hojas === 4
      ? ancho - 1 / 8
      : ancho - 2 / 16;

  const riel =
    hojas === 4
      ? ancho - 1 / 8
      : ancho - 2 / 16;

  const latMarco = alto - 1 / 2;

  // =========================
  // NOMBRES SEGÚN SISTEMA
  // =========================
  const nombreCabMarco =
    hojas === 3
      ? "Cabezal del marco 3 vías Tradicional"
      : "Cabezal del marco 2 vías Tradicional";

  const nombreRiel =
    hojas === 3
      ? "Riel del marco 3 vías Tradicional"
      : "Riel del marco 2 vías Tradicional";

  const nombreLateral =
    hojas === 3
      ? "Lateral 3 vías Tradicional"
      : "Lateral 2 vías Tradicional";

  // =========================
  // MATERIAL FINAL
  // =========================
  return [
    {
      material: nombreCabMarco,
      longitud: cabMarco,
      cantidad: 1,
    },

    {
      material: nombreRiel,
      longitud: riel,
      cantidad: 1,
    },

    {
      material: nombreLateral,
      longitud: latMarco,
      cantidad: 2,
    },

    {
      material: "Jamba enganche Tradicional",
      longitud: jambasEnganche,
      cantidad: cantidadJambaEnganche,
    },

    {
      material: "Jamba llavín Tradicional",
      longitud: jambasLlavin,
      cantidad: cantidadJambaLlavin,
    },

    {
      material: "Cabezal de la hoja Tradicional",
      longitud: cabAlf,
      cantidad: cantidadCabezalHoja,
    },

    {
      material: "Alfeizar de la hoja Tradicional",
      longitud: cabAlf,
      cantidad: cantidadAlfeizarHoja,
    },
  ];
};

/**
 * Agrupa los materiales de todas las ventanas agregadas.
 *
 * Calcula:
 * - Total de piezas
 * - Total de pulgadas
 * - Total de pies
 * - Total de barras de 21 pies
 */
export const calcularResumenMaterialesTradicional = (
  medidas = []
) => {
  const agrupados = {};

  medidas.forEach((medida) => {
    const materiales =
      calcularMaterialesVentanaTradicional({
        ancho: Number(medida.anchoDec),
        alto: Number(medida.altoDec),
        hojas: Number(medida.hojasNum),
      });

    materiales.forEach((item) => {
      if (!agrupados[item.material]) {
        agrupados[item.material] = {
          material: item.material,
          piezas: 0,
          pulgadas: 0,
          pies: 0,
          barras: 0,
        };
      }

      agrupados[item.material].piezas += item.cantidad;

      agrupados[item.material].pulgadas +=
        item.longitud * item.cantidad;
    });
  });

  return Object.values(agrupados).map((item) => {
    const pies =
      item.pulgadas / PULGADAS_POR_PIE;

    return {
      ...item,
      pies,
      barras: Math.ceil(pies / BARRA_PIES),
    };
  });
};

/**
 * Calcula los totales generales de materiales.
 */
export const calcularTotalesMaterialesTradicional = (
  materiales = []
) => {
  return {
    piezas: materiales.reduce(
      (total, item) =>
        total + item.piezas,
      0
    ),

    pies: materiales.reduce(
      (total, item) =>
        total + item.pies,
      0
    ),

    barras: materiales.reduce(
      (total, item) =>
        total + item.barras,
      0
    ),
  };
};

// =========================
// CONSTANTES EXPORTADAS
// =========================

export {
  BARRA_PIES,
  PULGADAS_POR_PIE,
};