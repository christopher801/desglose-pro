// src/utils/p92Materials.js

const BARRA_PIES = 21;
const PULGADAS_POR_PIE = 12;

/**
 * Calcula las piezas de material necesarias para UNA ventana P-92.
 *
 * Reglas:
 * - 2 hojas y 4 hojas utilizan los mismos perfiles de marco.
 * - 3 hojas utiliza perfiles de marco de 3 vías.
 * - 1 barra = 21 pies = 252 pulgadas.
 */
export const calcularMaterialesVentanaP92 = ({
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
  let cantidadCabAlf;
  let cantidadJambaEnganche;
  let cantidadJambaLlavin;

  // =========================
  // 2 HOJAS
  // =========================
  if (hojas === 2) {
    cabAlf = ancho / 2 - 9 / 16;

    cantidadCabAlf = 4;
    cantidadJambaEnganche = 2;
    cantidadJambaLlavin = 2;
  }

  // =========================
  // 3 HOJAS
  // =========================
  else if (hojas === 3) {
    cabAlf = ancho / 3 + 3 / 8;

    cantidadCabAlf = 6;
    cantidadJambaEnganche = 4;
    cantidadJambaLlavin = 2;
  }

  // =========================
  // 4 HOJAS
  // =========================
  else {
    cabAlf = ancho / 4 - 3 / 16;

    cantidadCabAlf = 8;
    cantidadJambaEnganche = 4;
    cantidadJambaLlavin = 4;
  }

  // =========================
  // MEDIDAS COMUNES
  // =========================

  const jambasEnganche = alto - (2 + 7 / 16);
  const jambasLlavin = alto - (2 + 7 / 16);

  const cabMarco = ancho - (1 + 5 / 8);
  const riel = ancho - (1 + 5 / 8);
  const latMarco = alto - 1 / 8;

  // =========================
  // NOMBRES DE MATERIALES
  // =========================

  // 3 hojas utiliza perfiles diferentes.
  //
  // 2 y 4 hojas utilizan el mismo material.
  const nombreCabMarco =
    hojas === 3
      ? "Cabezal del marco 3 vías P-92"
      : "Cabezal del marco 2/4 vías P-92";

  const nombreRiel =
    hojas === 3
      ? "Riel del marco 3 vías P-92"
      : "Riel del marco 2/4 vías P-92";

  const nombreLateral =
    hojas === 3
      ? "Lateral 3 vías P-92"
      : "Lateral 2/4 vías P-92";

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
      material: "Jamba enganche P-92",
      longitud: jambasEnganche,
      cantidad: cantidadJambaEnganche,
    },

    {
      material: "Jamba llavín P-92",
      longitud: jambasLlavin,
      cantidad: cantidadJambaLlavin,
    },

    {
      material: "Cab-alf P-92",
      longitud: cabAlf,
      cantidad: cantidadCabAlf,
    },
  ];
};

/**
 * Convierte todas las medidas agregadas en un resumen
 * agrupado por material.
 */
export const calcularResumenMaterialesP92 = (medidas = []) => {
  const agrupados = {};

  medidas.forEach((medida) => {
    const materiales = calcularMaterialesVentanaP92({
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
    const pies = item.pulgadas / PULGADAS_POR_PIE;

    return {
      ...item,
      pies,
      barras: Math.ceil(pies / BARRA_PIES),
    };
  });
};

/**
 * Totales generales.
 */
export const calcularTotalesMaterialesP92 = (materiales = []) => {
  return {
    piezas: materiales.reduce(
      (total, item) => total + item.piezas,
      0
    ),

    pies: materiales.reduce(
      (total, item) => total + item.pies,
      0
    ),

    barras: materiales.reduce(
      (total, item) => total + item.barras,
      0
    ),
  };
};

export {
  BARRA_PIES,
  PULGADAS_POR_PIE,
};