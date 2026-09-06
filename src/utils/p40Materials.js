const BARRA_PIES = 21
const PULGADAS_POR_PIE = 12

export const calcularMaterialesVentanaP40 = ({
  ancho,
  alto,
  hojas
}) => {
  if (
    !Number.isFinite(ancho) ||
    !Number.isFinite(alto) ||
    hojas !== 1
  ) {
    return []
  }

  const cabVentilador = ancho - 2
  const lateralVentilador = alto - 2

  const cabMarco = ancho - (1 / 8)
  const lateralMarco = alto - (1 / 8)

  return [
    {
      material: 'Cab-Alf ventilador',
      longitud: cabVentilador,
      cantidad: 2
    },
    {
      material: 'Lateral ventilador',
      longitud: lateralVentilador,
      cantidad: 2
    },
    {
      material: 'Cab-Alf del marco P-40',
      longitud: cabMarco,
      cantidad: 2
    },
    {
      material: 'Lateral del marco P-40',
      longitud: lateralMarco,
      cantidad: 2
    }
  ]
}

export const calcularResumenMaterialesP40 = (medidas = []) => {
  const agrupados = {}

  medidas.forEach((medida) => {
    const materiales = calcularMaterialesVentanaP40({
      ancho: Number(medida.anchoDec),
      alto: Number(medida.altoDec),
      hojas: Number(medida.hojasNum)
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

      agrupados[item.material].piezas += item.cantidad

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
      barras: Math.ceil(pies / BARRA_PIES)
    }
  })
}

export const calcularTotalesMaterialesP40 = (
  materiales = []
) => {
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
    )
  }
}

export {
  BARRA_PIES,
  PULGADAS_POR_PIE
}