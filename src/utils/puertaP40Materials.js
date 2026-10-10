// src/utils/puertaP40Materials.js

const BARRA_PIES = 21
const PULGADAS_POR_PIE = 12

export const calcularMaterialesPuertaP40 = ({
  ancho,
  alto,
  hojas = 1
}) => {
  if (
    !Number.isFinite(ancho) ||
    !Number.isFinite(alto)
  ) {
    return []
  }

  // ================================================
  // FÓRMULAS SEGÚN CANTIDAD DE HOJAS
  // ================================================

  let cabMarco
  let latMarco
  let cabezal
  let alfeizar
  let jambas

  if (hojas === 2) {
    cabMarco = ancho - (1 / 8)
    latMarco = alto - (1 / 8)
    cabezal = ancho / 2 - (1 + 15 / 16)
    alfeizar = ancho / 2 - (7 + 14 / 16)
    jambas = alto - 2
  } else {
    cabMarco = ancho - (1 / 8)
    latMarco = alto - (1 / 8)
    cabezal = ancho - (3 + 3 / 4)
    alfeizar = ancho - (8 + 15 / 16)
    jambas = alto - 2
  }

  // ================================================
  // CANTIDADES SEGÚN CANTIDAD DE HOJAS
  // ================================================

  // Marco: siempre 1 cab-marco + 2 lat-marco (no depende de hojas)
  // Hoja: se multiplica por cantidad de hojas
  const cantidadCabezal = hojas
  const cantidadAlfeizar = hojas
  const cantidadJambas = hojas * 2

  return [
    {
      material: 'Lat-marco',
      longitud: latMarco,
      cantidad: 2
    },
    {
      material: 'Cab-marco',
      longitud: cabMarco,
      cantidad: 1
    },
    {
      material: 'Jambas',
      longitud: jambas,
      cantidad: cantidadJambas
    },
    {
      material: 'Cabezal de la hoja',
      longitud: cabezal,
      cantidad: cantidadCabezal
    },
    {
      material: 'Alfeizar de la hoja',
      longitud: alfeizar,
      cantidad: cantidadAlfeizar
    }
  ]
}

export const calcularResumenMaterialesPuertaP40 = (
  medidas = []
) => {
  const agrupados = {}

  medidas.forEach((medida) => {
    const materiales =
      calcularMaterialesPuertaP40({
        ancho: Number(medida.anchoDec),
        alto: Number(medida.altoDec),
        hojas: Number(medida.hojas) || 1
      })

    materiales.forEach((item) => {
      if (!agrupados[item.material]) {
        agrupados[item.material] = {
          material: item.material,
          piezas: 0,
          pulgadas: 0,
          pies: 0,
          barras: 0
        }
      }

      agrupados[item.material].piezas +=
        item.cantidad

      agrupados[item.material].pulgadas +=
        item.longitud * item.cantidad
    })
  })

  return Object.values(agrupados).map((item) => {
    const pies =
      item.pulgadas / PULGADAS_POR_PIE

    return {
      ...item,
      pies,
      barras: Math.ceil(
        pies / BARRA_PIES
      )
    }
  })
}

export const calcularTotalesMaterialesPuertaP40 = (
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
    )
  }
}

export {
  BARRA_PIES,
  PULGADAS_POR_PIE
}