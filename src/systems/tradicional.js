import FractionUtils from '../utils/fraction'

export const tradicionalCalcular = (ancho, alto, hojas) => {
  const parts = []
  
  if (hojas === 2) {
    parts.push(
      { pieza: 'CAB-ALF', medida: (ancho / 2) - (4/16) },
      { pieza: 'JAMBAS', medida: alto - (12/16) },
      { pieza: 'CAB-RIEL', medida: ancho - (2/16) },
      { pieza: 'LATERAL', medida: alto - (1/2) },
      { pieza: 'VIDRIO_ANCHO', medida: (ancho / 2) - (2 + 1/8) },
      { pieza: 'VIDRIO_ALTO', medida: alto - (3 + 13/16) }
    )
  } else if (hojas === 3) {
    parts.push(
      { pieza: 'CAB-ALF', medida: (ancho / 3) + (1/16) },
      { pieza: 'JAMBAS', medida: alto - (12/16) },
      { pieza: 'CAB-RIEL', medida: ancho - (2/16) },
      { pieza: 'LATERAL', medida: alto - (1/2) },
      { pieza: 'VIDRIO_ANCHO', medida: (ancho / 3) - (1 + 12/16) },
      { pieza: 'VIDRIO_MEDIO', medida: (ancho / 3) - (15/16) },
      { pieza: 'VIDRIO_ALTO', medida: alto - (3 + 13/16) }
    )
  } else if (hojas === 4) {
    parts.push(
      { pieza: 'CAB-ALF', medida: (ancho / 4) - (3/16) },
      { pieza: 'JAMBAS', medida: alto - (12/16) },
      { pieza: 'CAB-RIEL', medida: ancho - (1/8) },
      { pieza: 'LATERAL', medida: alto - (1/2) },
      { pieza: 'VIDRIO_ANCHO', medida: (ancho / 4) - (2 + 1/16) },
      { pieza: 'VIDRIO_ALTO', medida: alto - (3 + 13/16) }
    )
  }
  
  return parts
}

export const tradicionalFormatResult = (parts, hojas) => {
  const cabAlf = parts.find(p => p.pieza === 'CAB-ALF')?.medida || 0
  const jambas = parts.find(p => p.pieza === 'JAMBAS')?.medida || 0
  const marco = parts.find(p => p.pieza === 'CAB-RIEL')?.medida || 0
  const latMarco = parts.find(p => p.pieza === 'LATERAL')?.medida || 0
  const vidrioAncho = parts.find(p => p.pieza === 'VIDRIO_ANCHO')?.medida || 0
  const vidrioAlto = parts.find(p => p.pieza === 'VIDRIO_ALTO')?.medida || 0
  const vidrioMedio = parts.find(p => p.pieza === 'VIDRIO_MEDIO')?.medida || null
  
  return {
    cabAlf: FractionUtils.toSixteenths(cabAlf),
    jambas: FractionUtils.toSixteenths(jambas),
    marco: FractionUtils.toSixteenths(marco),
    latMarco: FractionUtils.toSixteenths(latMarco),
    vidrioAncho: FractionUtils.toSixteenths(vidrioAncho),
    vidrioAlto: FractionUtils.toSixteenths(vidrioAlto),
    vidrioMedio: vidrioMedio ? FractionUtils.toSixteenths(vidrioMedio) : null
  }
}