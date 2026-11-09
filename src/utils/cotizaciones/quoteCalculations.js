const money = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round((n + Number.EPSILON) * 100) / 100 : 0;
};
const clampNonNegative = (v) => Math.max(0, Number.isFinite(Number(v)) ? Number(v) : 0);

export function calculateItem(item = {}) {
  const quantity = clampNonNegative(item.quantity);
  const unitPrice = clampNonNegative(item.unitPrice);
  const discount = clampNonNegative(item.discount);
  const gross = money(quantity * unitPrice);
  return { ...item, total: money(Math.max(0, gross - discount)) };
}

export function calculateQuote(items = [], financial = {}) {
  const calculatedItems = items.map(calculateItem);
  const subtotal = money(calculatedItems.reduce((sum, item) => sum + item.total, 0));
  const discountValue = clampNonNegative(financial.discountValue);
  const discountAmount = financial.discountType === "fixed"
    ? money(Math.min(subtotal, discountValue))
    : money(subtotal * Math.min(100, discountValue) / 100);
  const taxableBase = money(Math.max(0, subtotal - discountAmount));
  const taxRate = Math.min(100, clampNonNegative(financial.taxRate ?? 18));
  const taxAmount = financial.taxEnabled ? money(taxableBase * taxRate / 100) : 0;
  return {
    items: calculatedItems,
    financial: {
      ...financial, subtotal, discountType: financial.discountType === "fixed" ? "fixed" : "percentage",
      discountValue, discountAmount, taxEnabled: Boolean(financial.taxEnabled),
      taxRate, taxAmount, total: money(taxableBase + taxAmount), currency: "DOP"
    }
  };
}
