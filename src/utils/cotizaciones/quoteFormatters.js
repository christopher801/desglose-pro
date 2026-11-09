export const formatMoney = (value) => new Intl.NumberFormat("es-DO", {
  style: "currency", currency: "DOP", minimumFractionDigits: 2, maximumFractionDigits: 2
}).format(Number.isFinite(Number(value)) ? Number(value) : 0);

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("es-DO").format(date);
};
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const uid = () => globalThis.crypto?.randomUUID?.() || `q-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
