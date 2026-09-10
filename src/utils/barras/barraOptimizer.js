import {
  calculateCutUsage,
  calculateWaste,
  calculateEfficiency,
} from "./barraCalculations";

function normalizeMaterial(material) {
  return String(material || "Perfil")
    .trim()
    .toLowerCase();
}

function expandCuts(cuts, saw) {
  const expanded = [];

  cuts.forEach((cut) => {
    const quantity = Number(cut.quantity) || 0;
    const length = Number(cut.length) || 0;

    for (let i = 0; i < quantity; i += 1) {
      expanded.push({
        instanceId: `${cut.id}-${i + 1}`,
        sourceId: cut.id,
        length,
        label:
          quantity > 1
            ? `${cut.label} ${i + 1}`
            : cut.label,
        material: cut.material,
        lengthWithSaw: calculateCutUsage(
          length,
          saw
        ),
      });
    }
  });

  return expanded;
}

function optimizeMaterialGroup(
  cuts,
  barLength,
  saw
) {
  const expandedCuts = expandCuts(cuts, saw);

  /**
   * Best Fit Decreasing:
   * pi gwo pyès yo antre an premye.
   */
  expandedCuts.sort(
    (a, b) => b.lengthWithSaw - a.lengthWithSaw
  );

  const bars = [];

  for (const cut of expandedCuts) {
    let bestBar = null;
    let bestRemaining = Infinity;

    for (const bar of bars) {
      const remaining =
        bar.barLength -
        bar.usedLength -
        cut.lengthWithSaw;

      if (
        remaining >= -0.000001 &&
        remaining < bestRemaining
      ) {
        bestRemaining = remaining;
        bestBar = bar;
      }
    }

    if (!bestBar) {
      const newBar = {
        id: `bar-${bars.length + 1}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        barLength,
        material: cut.material,
        usedLength: cut.lengthWithSaw,
        waste: calculateWaste(
          barLength,
          cut.lengthWithSaw
        ),
        cuts: [cut],
      };

      bars.push(newBar);
    } else {
      bestBar.cuts.push(cut);
      bestBar.usedLength += cut.lengthWithSaw;
      bestBar.waste = calculateWaste(
        bestBar.barLength,
        bestBar.usedLength
      );
    }
  }

  return bars;
}

export function optimizeBars({
  cuts,
  barLength,
  saw,
}) {
  const numericBarLength = Number(barLength);
  const numericSaw = Number(saw);

  if (
    !Number.isFinite(numericBarLength) ||
    numericBarLength <= 0
  ) {
    throw new Error(
      "La longitud de la barra debe ser mayor que 0."
    );
  }

  if (
    !Number.isFinite(numericSaw) ||
    numericSaw < 0
  ) {
    throw new Error(
      "La pérdida de sierra no puede ser negativa."
    );
  }

  if (!Array.isArray(cuts) || cuts.length === 0) {
    throw new Error(
      "Debes agregar al menos un corte."
    );
  }

  const groups = new Map();

  cuts.forEach((cut) => {
    const materialKey = normalizeMaterial(
      cut.material
    );

    if (!groups.has(materialKey)) {
      groups.set(materialKey, []);
    }

    groups.get(materialKey).push(cut);
  });

  const allBars = [];

  for (const materialCuts of groups.values()) {
    const materialBars = optimizeMaterialGroup(
      materialCuts,
      numericBarLength,
      numericSaw
    );

    allBars.push(...materialBars);
  }

  const totalCuts = allBars.reduce(
    (total, bar) => total + bar.cuts.length,
    0
  );

  const totalAvailable =
    allBars.length * numericBarLength;

  const totalUsed = allBars.reduce(
    (total, bar) => total + bar.usedLength,
    0
  );

  const totalWaste = allBars.reduce(
    (total, bar) => total + bar.waste,
    0
  );

  const efficiency = calculateEfficiency(
    totalAvailable,
    totalUsed
  );

  return {
    bars: allBars,
    summary: {
      totalBars: allBars.length,
      totalCuts,
      totalAvailable,
      totalUsed,
      totalWaste,
      efficiency,
      saw: numericSaw,
      barLength: numericBarLength,
    },
  };
}

export function getOptimizationSummary(result) {
  if (!result) {
    return null;
  }

  return {
    totalBars: result.summary.totalBars,
    totalCuts: result.summary.totalCuts,
    totalAvailable: result.summary.totalAvailable,
    totalUsed: result.summary.totalUsed,
    totalWaste: result.summary.totalWaste,
    efficiency: result.summary.efficiency,
  };
}