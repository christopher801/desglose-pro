export function validateQuote(quote) {
  const errors = {};
  if (!quote?.title?.trim()) errors.title = "Escribe el nombre del proyecto.";
  if (!quote?.client?.name?.trim()) errors.client = "El nombre del cliente es obligatorio.";
  if (!Array.isArray(quote?.items) || !quote.items.some(i => i.description?.trim() && Number(i.quantity) > 0 && Number(i.unitPrice) >= 0)) {
    errors.items = "Agrega al menos un concepto válido.";
  }
  for (const item of quote.items || []) {
    if (!item.description?.trim()) errors.items = "Todos los conceptos deben tener descripción.";
    if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0) errors.items = "Las cantidades deben ser mayores que cero.";
    if (!Number.isFinite(Number(item.unitPrice)) || Number(item.unitPrice) < 0) errors.items = "Los precios no pueden ser negativos.";
    if (!Number.isFinite(Number(item.discount)) || Number(item.discount) < 0) errors.items = "Los descuentos no pueden ser negativos.";
  }
  if (quote.expirationDate && quote.issueDate && quote.expirationDate < quote.issueDate) errors.expirationDate = "El vencimiento no puede ser anterior a la fecha de emisión.";
  if (!Number.isFinite(Number(quote.financial?.discountValue)) || Number(quote.financial.discountValue) < 0) errors.discount = "Descuento general inválido.";
  if (Number(quote.financial?.discountType === "percentage" && quote.financial?.discountValue) > 100) errors.discount = "El descuento porcentual no puede superar el 100%.";
  return errors;
}
