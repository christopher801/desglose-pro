/**
 * glassPacking.js
 *
 * Algoritmo de optimización de corte de vidrio.
 * Estrategia: Guillotine Cutting con heurística "Best Area Fit"
 * y división por "eje sobrante más corto" (shorter leftover axis).
 *
 * No depende de React. Recibe primitivas y devuelve estructuras planas.
 */

/**
 * Expande la lista de piezas (con cantidad) en instancias individuales.
 * @param {Array<{id: string, ancho: number, alto: number, cantidad: number}>} piezas
 * @returns {Array<{pieceId: string, ancho: number, alto: number}>}
 */
function expandirPiezas(piezas) {
  const instancias = [];
  piezas.forEach((pieza) => {
    for (let i = 0; i < pieza.cantidad; i++) {
      instancias.push({
        pieceId: pieza.id,
        ancho: pieza.ancho,
        alto: pieza.alto,
      });
    }
  });
  return instancias;
}

/**
 * Ordena las piezas de mayor a menor área (First Fit Decreasing).
 */
function ordenarPorArea(instancias) {
  return [...instancias].sort((a, b) => {
    const areaA = a.ancho * a.alto;
    const areaB = b.ancho * b.alto;
    if (areaB !== areaA) return areaB - areaA;
    return Math.max(b.ancho, b.alto) - Math.max(a.ancho, a.alto);
  });
}

/**
 * Busca el mejor rectángulo libre (best area fit) donde encaje la pieza.
 */
function buscarMejorRectangulo(freeRects, ancho, alto) {
  let mejorIndex = -1;
  let mejorAreaSobrante = Infinity;

  freeRects.forEach((rect, index) => {
    if (rect.width >= ancho && rect.height >= alto) {
      const areaSobrante = rect.width * rect.height - ancho * alto;
      if (areaSobrante < mejorAreaSobrante) {
        mejorAreaSobrante = areaSobrante;
        mejorIndex = index;
      }
    }
  });

  return mejorIndex;
}

/**
 * Divide un rectángulo libre luego de colocar una pieza dentro de él,
 * usando la heurística "eje sobrante más corto".
 */
function dividirRectangulo(rect, ancho, alto) {
  const sobranteAncho = rect.width - ancho;
  const sobranteAlto = rect.height - alto;
  const nuevos = [];

  if (sobranteAncho > sobranteAlto) {
    // Corte vertical: la franja derecha ocupa todo el alto original.
    if (sobranteAncho > 0) {
      nuevos.push({
        x: rect.x + ancho,
        y: rect.y,
        width: sobranteAncho,
        height: rect.height,
      });
    }
    if (sobranteAlto > 0) {
      nuevos.push({
        x: rect.x,
        y: rect.y + alto,
        width: ancho,
        height: sobranteAlto,
      });
    }
  } else {
    // Corte horizontal: la franja inferior ocupa todo el ancho original.
    if (sobranteAlto > 0) {
      nuevos.push({
        x: rect.x,
        y: rect.y + alto,
        width: rect.width,
        height: sobranteAlto,
      });
    }
    if (sobranteAncho > 0) {
      nuevos.push({
        x: rect.x + ancho,
        y: rect.y,
        width: sobranteAncho,
        height: rect.height,
      });
    }
  }

  return nuevos;
}

/**
 * Elimina rectángulos libres que están completamente contenidos
 * dentro de otro, para mantener la lista de rectángulos libres limpia.
 */
function podarRectangulos(freeRects) {
  const contenido = (a, b) =>
    a.x >= b.x &&
    a.y >= b.y &&
    a.x + a.width <= b.x + b.width &&
    a.y + a.height <= b.y + b.height;

  return freeRects.filter((rect, i) => {
    for (let j = 0; j < freeRects.length; j++) {
      if (i !== j && contenido(rect, freeRects[j])) {
        // Si son idénticos, conserva solo uno (el de menor índice).
        const esIdentico =
          rect.x === freeRects[j].x &&
          rect.y === freeRects[j].y &&
          rect.width === freeRects[j].width &&
          rect.height === freeRects[j].height;
        if (esIdentico && i < j) continue;
        return false;
      }
    }
    return true;
  });
}

/**
 * Crea una nueva plancha vacía.
 */
function crearPlancha(anchoPlancha, altoPlancha, numero) {
  return {
    numero,
    width: anchoPlancha,
    height: altoPlancha,
    freeRects: [{ x: 0, y: 0, width: anchoPlancha, height: altoPlancha }],
    piezas: [],
  };
}

/**
 * Ejecuta el algoritmo de optimización de corte.
 *
 * @param {{ anchoPlancha: number, altoPlancha: number }} plancha
 * @param {Array<{id: string, ancho: number, alto: number, cantidad: number}>} piezas
 * @returns {{
 *   sheets: Array,
 *   sheetsCount: number,
 *   piecesCount: number,
 *   totalArea: number,
 *   usedArea: number,
 *   wasteArea: number,
 *   usedPercentage: number,
 *   wastePercentage: number,
 *   piezasNoUbicadas: Array,
 * }}
 */
export function optimizarCorte({ anchoPlancha, altoPlancha }, piezas) {
  const anchoP = Number(anchoPlancha);
  const altoP = Number(altoPlancha);

  const instancias = ordenarPorArea(expandirPiezas(piezas));
  const sheets = [];
  const piezasNoUbicadas = [];

  instancias.forEach((instancia) => {
    const { ancho, alto, pieceId } = instancia;

    // No puede caber en ninguna plancha (en ninguna orientación fija).
    if (ancho > anchoP || alto > altoP) {
      piezasNoUbicadas.push(instancia);
      return;
    }

    let colocada = false;

    for (let s = 0; s < sheets.length && !colocada; s++) {
      const plancha = sheets[s];
      const index = buscarMejorRectangulo(plancha.freeRects, ancho, alto);

      if (index !== -1) {
        const rect = plancha.freeRects[index];

        plancha.piezas.push({
          pieceId,
          x: rect.x,
          y: rect.y,
          width: ancho,
          height: alto,
        });

        const nuevosRects = dividirRectangulo(rect, ancho, alto);
        plancha.freeRects.splice(index, 1);
        plancha.freeRects.push(...nuevosRects);
        plancha.freeRects = podarRectangulos(plancha.freeRects);

        colocada = true;
      }
    }

    if (!colocada) {
      const nuevaPlancha = crearPlancha(anchoP, altoP, sheets.length + 1);
      const index = buscarMejorRectangulo(nuevaPlancha.freeRects, ancho, alto);
      const rect = nuevaPlancha.freeRects[index];

      nuevaPlancha.piezas.push({
        pieceId,
        x: rect.x,
        y: rect.y,
        width: ancho,
        height: alto,
      });

      const nuevosRects = dividirRectangulo(rect, ancho, alto);
      nuevaPlancha.freeRects.splice(index, 1);
      nuevaPlancha.freeRects.push(...nuevosRects);
      nuevaPlancha.freeRects = podarRectangulos(nuevaPlancha.freeRects);

      sheets.push(nuevaPlancha);
    }
  });

  const totalArea = sheets.length * anchoP * altoP;
  const usedArea = sheets.reduce(
    (acc, plancha) =>
      acc + plancha.piezas.reduce((a, p) => a + p.width * p.height, 0),
    0
  );
  const wasteArea = totalArea - usedArea;
  const usedPercentage = totalArea > 0 ? (usedArea / totalArea) * 100 : 0;
  const wastePercentage = totalArea > 0 ? (wasteArea / totalArea) * 100 : 0;
  const piecesCount = instancias.length - piezasNoUbicadas.length;

  return {
    sheets: sheets.map((s) => ({
      numero: s.numero,
      width: s.width,
      height: s.height,
      piezas: s.piezas,
    })),
    sheetsCount: sheets.length,
    piecesCount,
    totalArea,
    usedArea,
    wasteArea,
    usedPercentage,
    wastePercentage,
    piezasNoUbicadas,
  };
}