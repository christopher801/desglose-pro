// src/utils/puertaComercialMaterials.js

const BARRA_PIES = 21
const PULGADAS_POR_PIE = 12

export const calcularMaterialesVentanaPuertaComercial = ({
  ancho,
  alto,
  hojas
}) => {
  if (
    !Number.isFinite(ancho) ||
    !Number.isFinite(alto) ||
    !Number.isFinite(hojas)
  ) {
    return []
  }

  let cabAlf
  let jambas
  let marco
  let latMarco

  if (hojas === 1) {
    cabAlf = ancho - 8
    jambas = alto - (2 + 3 / 4)
    marco = ancho - (3 + 5 / 8)
    latMarco = alto - (1 / 8)
  } else if (hojas === 2) {
    cabAlf = (ancho - 12.1) / 2
    jambas = alto - (2 + 3 / 4)
    marco = ancho - (3 + 5 / 8)
    latMarco = alto - (1 / 8)
  } else {
    return []
  }

  const cantidadHoja = hojas === 1 ? 1 : 2
  const cantidadJambas = hojas === 1 ? 2 : 4

  return [
    {
      material: 'Cabezal de la hoja',
      longitud: cabAlf,
      cantidad: cantidadHoja
    },
    {
      material: 'Alfeizar de la hoja',
      longitud: cabAlf,
      cantidad: cantidadHoja
    },
    {
      material: 'Jambas',
      longitud: jambas,
      cantidad: cantidadJambas
    },
    {
      material: 'Cab-marco',
      longitud: marco,
      cantidad: 1
    },
    {
      material: 'Lat-marco',
      longitud: latMarco,
      cantidad: 2
    }
  ]
}

export const calcularResumenMaterialesPuertaComercial = (
  medidas = []
) => {
  const agrupados = {}

  medidas.forEach((medida) => {
    const materiales =
      calcularMaterialesVentanaPuertaComercial({
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

export const calcularTotalesMaterialesPuertaComercial = (
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