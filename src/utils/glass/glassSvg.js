/**
 * glassSvg.js
 *
 * Convierte el resultado del algoritmo de optimización (utils/glassPacking.js)
 * en información lista para dibujar con SVG. No contiene lógica de negocio.
 */

const MAX_RENDER_WIDTH = 640;
const MAX_RENDER_HEIGHT = 460;

/**
 * Calcula el layout SVG de una plancha, escalando sus dimensiones reales
 * para que quepan dentro del área máxima de dibujo, manteniendo proporción.
 *
 * @param {{ width: number, height: number, piezas: Array }} plancha
 * @returns {{
 *   viewBoxWidth: number,
 *   viewBoxHeight: number,
 *   scale: number,
 *   sheetWidth: number,
 *   sheetHeight: number,
 *   rects: Array<{ x: number, y: number, width: number, height: number, realWidth: number, realHeight: number, pieceId: string }>
 * }}
 */
export function calcularLayoutSvg(plancha) {
  const escala = Math.min(
    MAX_RENDER_WIDTH / plancha.width,
    MAX_RENDER_HEIGHT / plancha.height
  );

  const sheetWidth = plancha.width * escala;
  const sheetHeight = plancha.height * escala;

  const rects = plancha.piezas.map((pieza) => ({
    x: pieza.x * escala,
    y: pieza.y * escala,
    width: pieza.width * escala,
    height: pieza.height * escala,
    realWidth: pieza.width,
    realHeight: pieza.height,
    pieceId: pieza.pieceId,
  }));

  return {
    viewBoxWidth: sheetWidth,
    viewBoxHeight: sheetHeight,
    scale: escala,
    sheetWidth,
    sheetHeight,
    rects,
  };
}