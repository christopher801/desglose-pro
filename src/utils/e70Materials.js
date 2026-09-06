const BARRA_PIES = 21;
const PULGADAS_POR_PIE = 12;

/**
 * Calcula los materiales necesarios para una ventana E-70.
 *
 * 1 barra = 21 pies = 252 pulgadas
 *
 * 2 hojas:
 * - Cab-alf: 4
 * - Jambas: 4
 * - Cabezal/Riel del marco E-70 2 vías: 2
 * - Lateral del marco E-70 2 vías: 2
 *
 * 3 hojas:
 * - Cab-alf: 6
 * - Jambas: 6
 * - Cabezal/Riel del marco E-70 3 vías: 2
 * - Lateral del marco E-70 3 vías: 2
 *
 * 4 hojas:
 * - Cab-alf: 8
 * - Jambas: 8
 * - Cabezal/Riel del marco E-70 2 vías: 2
 * - Lateral del marco E-70 2 vías: 2
 */
export const calcularMaterialesVentanaE70 = ({
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
  let jambas;
  let marco;
  let latMarco;

  let cantidadCabAlf;
  let cantidadJambas;

  let nombreMarco;
  let nombreLateral;

  // =========================
  // 2 HOJAS
  // =========================
  if (hojas === 2) {
    cabAlf = (ancho - 1) / 2;
    jambas = alto - (2 + 5 / 8);
    marco = ancho - 1 / 8;
    latMarco = alto - 1 / 8;

    cantidadCabAlf = 4;
    cantidadJambas = 4;

    nombreMarco =
      "Cabezal/Riel del marco E-70 2 vías";

    nombreLateral =
      "Lateral del marco E-70 2 vías";
  }

  // =========================
  // 3 HOJAS
  // =========================
  else if (hojas === 3) {
    cabAlf = ancho / 3 + 5 / 16;
    jambas = alto - (2 + 5 / 8);
    marco = ancho - 1 / 8;
    latMarco = alto - 1 / 8;

    cantidadCabAlf = 6;
    cantidadJambas = 6;

    nombreMarco =
      "Cabezal/Riel del marco E-70 3 vías";

    nombreLateral =
      "Lateral del marco E-70 3 vías";
  }

  // =========================
  // 4 HOJAS
  // =========================
  else if (hojas === 4) {
    cabAlf = ancho / 4 + 3 / 16;
    jambas = alto - (2 + 5 / 8);
    marco = ancho - 1 / 8;
    latMarco = alto - 1 / 8;

    cantidadCabAlf = 8;
    cantidadJambas = 8;

    nombreMarco =
      "Cabezal/Riel del marco E-70 2 vías";

    nombreLateral =
      "Lateral del marco E-70 2 vías";
  } else {
    return [];
  }

  return [
    {
      material: "Cab-alf E-70",
      longitud: cabAlf,
      cantidad: cantidadCabAlf,
    },

    {
      material: "Jambas E-70",
      longitud: jambas,
      cantidad: cantidadJambas,
    },

    {
      material: nombreMarco,
      longitud: marco,
      cantidad: 2,
    },

    {
      material: nombreLateral,
      longitud: latMarco,
      cantidad: 2,
    },
  ];
};

/**
 * Agrupa los materiales de todas las ventanas E-70.
 *
 * Calcula:
 * - Total de piezas
 * - Total de pulgadas
 * - Total de pies
 * - Total de barras de 21 pies
 */
export const calcularResumenMaterialesE70 = (
  medidas = []
) => {
  const agrupados = {};

  medidas.forEach((medida) => {
    const materiales =
      calcularMaterialesVentanaE70({
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
export const calcularTotalesMaterialesE70 = (
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

export {
  BARRA_PIES,
  PULGADAS_POR_PIE,
};