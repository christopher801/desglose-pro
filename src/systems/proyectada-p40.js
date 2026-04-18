import FractionUtils from '../utils/fraction'

export const proyectadaP40Calcular = (ancho, alto, hojas) => {
  const parts = []
  
  // P-40 seulement 1 hoja
  parts.push(
    { pieza: 'CAB-VEN', medida: ancho - 2 },
    { pieza: 'LAT-VEN', medida: alto - 2 },
    { pieza: 'CAB-MARCO', medida: ancho - (1/8) },
    { pieza: 'LAT-MARCO', medida: alto - (1/8) },
    { pieza: 'VIDRIO_ANCHO', medida: ancho - (6 + 3/8) },
    { pieza: 'VIDRIO_ALTO', medida: alto - (6 + 1/4) }
  )
  
  return parts
}

export const proyectadaP40FormatResult = (parts) => {
  const cabVen = parts.find(p => p.pieza === 'CAB-VEN')?.medida || 0
  const latVen = parts.find(p => p.pieza === 'LAT-VEN')?.medida || 0
  const cabMarco = parts.find(p => p.pieza === 'CAB-MARCO')?.medida || 0
  const latMarco = parts.find(p => p.pieza === 'LAT-MARCO')?.medida || 0
  const vidrioAncho = parts.find(p => p.pieza === 'VIDRIO_ANCHO')?.medida || 0
  const vidrioAlto = parts.find(p => p.pieza === 'VIDRIO_ALTO')?.medida || 0
  
  return {
    cabVen: FractionUtils.toSixteenths(cabVen),
    latVen: FractionUtils.toSixteenths(latVen),
    marco: FractionUtils.toSixteenths(cabMarco),
    latMarco: FractionUtils.toSixteenths(latMarco),
    vidrioAncho: FractionUtils.toSixteenths(vidrioAncho),
    vidrioAlto: FractionUtils.toSixteenths(vidrioAlto),
    vidrioMedio: null
  }
}