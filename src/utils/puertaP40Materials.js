// src/utils/puertaP40Materials.js

const BARRA_PIES = 21
const PULGADAS_POR_PIE = 12

export const calcularMaterialesPuertaP40 = ({
  ancho,
  alto
}) => {
  if (
    !Number.isFinite(ancho) ||
    !Number.isFinite(alto)
  ) {
    return []
  }

  // Fórmulas originales de Puerta P40
  const cabMarco = ancho - (1 / 8)
  const latMarco = alto - (1 / 8)
  const cabezal = ancho - (3 + 3 / 4)
  const alfeizar = ancho - (8 + 15 / 16)
  const jambas = alto - 2

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
      cantidad: 2
    },
    {
      material: 'Cabezal de la hoja',
      longitud: cabezal,
      cantidad: 1
    },
    {
      material: 'Alfeizar de la hoja',
      longitud: alfeizar,
      cantidad: 1
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
        alto: Number(medida.altoDec)
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
