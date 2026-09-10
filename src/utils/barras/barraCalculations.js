export function calculateCutUsage(length, saw) {
  const cutLength = Number(length);
  const sawLoss = Number(saw);

  if (!Number.isFinite(cutLength) || cutLength < 0) {
    return 0;
  }

  if (!Number.isFinite(sawLoss) || sawLoss < 0) {
    return cutLength;
  }

  return cutLength + sawLoss;
}

export function calculateWaste(
  barLength,
  usedLength
) {
  return Math.max(
    0,
    Number(barLength) - Number(usedLength)
  );
}

export function calculateEfficiency(
  totalAvailable,
  totalUsed
) {
  if (
    !Number.isFinite(totalAvailable) ||
    totalAvailable <= 0
  ) {
    return 0;
  }

  return (
    (Number(totalUsed) / Number(totalAvailable)) *
    100
  );
}