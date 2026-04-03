import FractionUtils from '../utils/fraction'

export const puertaCalcular = (ancho, alto, hojas = 1) => {
  const parts = []
  
  // SIMPLE DOOR (always 1 hoja)
  parts.push(
    { pieza: 'CAB-ALF', medida: ancho - 8 },
    { pieza: 'JAMBAS', medida: alto - (2 + 3/4) },
    { pieza: 'CAB-MARCO', medida: ancho - (3 + 5/8) },
    { pieza: 'LATERAL-MARCO', medida: alto - (1/8) },
    { pieza: 'VIDRIO_ANCHO', medida: ancho - (8 + 1/4) },
    { pieza: 'VIDRIO_ALTO', medida: alto - 8 }
  )
  
  return parts
}

export const puertaFormatResult = (parts) => {
  const cabAlf = parts.find(p => p.pieza === 'CAB-ALF')?.medida || 0
  const jambas = parts.find(p => p.pieza === 'JAMBAS')?.medida || 0
  const marco = parts.find(p => p.pieza === 'CAB-MARCO')?.medida || 0
  const latMarco = parts.find(p => p.pieza === 'LATERAL-MARCO')?.medida || 0
  const vidrioAncho = parts.find(p => p.pieza === 'VIDRIO_ANCHO')?.medida || 0
  const vidrioAlto = parts.find(p => p.pieza === 'VIDRIO_ALTO')?.medida || 0
  
  return {
    cabAlf: FractionUtils.toSixteenths(cabAlf),
    jambas: FractionUtils.toSixteenths(jambas),
    marco: FractionUtils.toSixteenths(marco),
    latMarco: FractionUtils.toSixteenths(latMarco),
    vidrioAncho: FractionUtils.toSixteenths(vidrioAncho),
    vidrioAlto: FractionUtils.toSixteenths(vidrioAlto),
    vidrioMedio: null
  }
}