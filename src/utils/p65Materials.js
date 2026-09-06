// src/utils/p65Materials.js

const BARRA_PIES = 21;
const PULGADAS_POR_PIE = 12;

export const calcularMaterialesVentanaP65 = ({
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

  if (hojas === 2) {
    cabAlf = ancho / 2 - 11 / 16;

    cantidadCabAlf = 4;
    cantidadJambaEnganche = 2;
    cantidadJambaLlavin = 2;
  } else if (hojas === 3) {
    cabAlf = ancho / 3 + 1 / 8;

    cantidadCabAlf = 6;
    cantidadJambaEnganche = 4;
    cantidadJambaLlavin = 2;
  } else {
    cabAlf = ancho / 4 - 2 / 16;

    cantidadCabAlf = 8;
    cantidadJambaEnganche = 4;
    cantidadJambaLlavin = 4;
  }

  const jambasEnganche = alto - (2 + 1 / 8);
  const jambasLlavin = alto - (2 + 1 / 8);

  const cabMarco = ancho - (1 + 3 / 8);
  const riel = ancho - (1 + 3 / 8);
  const latMarco = alto - 1 / 8;

  const nombreCabMarco =
    hojas === 3
      ? "Cabezal del marco 3 vías P-65"
      : "Cabezal del marco 2/4 vías P-65";

  const nombreRiel =
    hojas === 3
      ? "Riel del marco 3 vías P-65"
      : "Riel del marco 2/4 vías P-65";

  const nombreLateral =
    hojas === 3
      ? "Lateral 3 vías P-65"
      : "Lateral 2/4 vías P-65";

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
      material: "Jamba enganche P-65",
      longitud: jambasEnganche,
      cantidad: cantidadJambaEnganche,
    },
    {
      material: "Jamba llavín P-65",
      longitud: jambasLlavin,
      cantidad: cantidadJambaLlavin,
    },
    {
      material: "Cab-alf P-65",
      longitud: cabAlf,
      cantidad: cantidadCabAlf,
    },
  ];
};

export const calcularResumenMaterialesP65 = (medidas = []) => {
  const agrupados = {};

  medidas.forEach((medida) => {
    const materiales = calcularMaterialesVentanaP65({
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

export const calcularTotalesMaterialesP65 = (materiales = []) => {
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