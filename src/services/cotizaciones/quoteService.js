import { calculateQuote } from "../../utils/cotizaciones/quoteCalculations";
import { formatQuoteNumber } from "../../utils/cotizaciones/quoteNumber";
import { uid, todayISO } from "../../utils/cotizaciones/quoteFormatters";

const STORAGE_KEY = "desglose_pro_cotizaciones";
const VERSION = 1;
const LOCAL_OWNER = "local";

function storage() {
  if (typeof window === "undefined" || !window.localStorage) throw new Error("LOCALSTORAGE no está disponible en este navegador.");
  const test = `${STORAGE_KEY}_test`;
  try { window.localStorage.setItem(test, "1"); window.localStorage.removeItem(test); }
  catch { throw new Error("No se pudo acceder a LOCALSTORAGE. Revisa el espacio disponible o la configuración del navegador."); }
  return window.localStorage;
}
function emptyState() { return { version: VERSION, quotations: [], lastSequence: 0 }; }
function readState() {
  const raw = storage().getItem(STORAGE_KEY);
  if (!raw) return emptyState();
  let parsed;
  try { parsed = JSON.parse(raw); } catch { throw new Error("Los datos de cotizaciones están dañados. Exporta o recupera un respaldo antes de continuar."); }
  if (!parsed || !Array.isArray(parsed.quotations) || !Number.isInteger(parsed.lastSequence) || parsed.lastSequence < 0) {
    throw new Error("La estructura de cotizaciones no es válida. No se modificaron los datos existentes.");
  }
  if (parsed.version !== VERSION) throw new Error(`Versión de datos no compatible: ${parsed.version}.`);
  return parsed;
}
function writeState(state) {
  try { storage().setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (error) { throw new Error(error?.name === "QuotaExceededError" ? "No hay espacio suficiente en LOCALSTORAGE para guardar la cotización." : `No se pudo guardar: ${error.message}`); }
}
function ownerId(explicit) { return explicit || LOCAL_OWNER; }
function visible(state, owner) { return state.quotations.filter(q => (q.ownerId || LOCAL_OWNER) === owner); }
function nextNumber(state) { const n = state.lastSequence + 1; return { n, number: formatQuoteNumber(n) }; }

export function getAllQuotes(owner = LOCAL_OWNER) { return visible(readState(), owner).sort((a,b) => (b.updatedAt || "").localeCompare(a.updatedAt || "")); }
export function getQuoteById(id, owner = LOCAL_OWNER) { return visible(readState(), owner).find(q => q.id === id) || null; }
export function getNextQuoteNumber() { const state = readState(); return nextNumber(state).number; }

export function createQuote(data, owner = LOCAL_OWNER) {
  const state = readState(); const seq = nextNumber(state);
  const now = new Date().toISOString();
  const calc = calculateQuote(data.items || [], data.financial || {});
  const quote = { ...data, ...calc, id: uid(), ownerId: ownerId(owner), number: seq.number, status: data.status || "draft",
    issueDate: data.issueDate || todayISO(), createdAt: now, updatedAt: now };
  state.quotations.push(quote); state.lastSequence = seq.n; writeState(state); return quote;
}
export function updateQuote(id, data, owner = LOCAL_OWNER) {
  const state = readState(); const index = state.quotations.findIndex(q => q.id === id && (q.ownerId || LOCAL_OWNER) === owner);
  if (index < 0) throw new Error("No se encontró la cotización.");
  const old = state.quotations[index];
  const calc = calculateQuote(data.items || [], data.financial || {});
  const updated = { ...old, ...data, ...calc, id: old.id, number: old.number, ownerId: old.ownerId || LOCAL_OWNER, createdAt: old.createdAt, updatedAt: new Date().toISOString() };
  state.quotations[index] = updated; writeState(state); return updated;
}
export function duplicateQuote(id, owner = LOCAL_OWNER) {
  const original = getQuoteById(id, owner); if (!original) throw new Error("No se encontró la cotización.");
  const { id: _id, number: _number, createdAt: _created, updatedAt: _updated, ...copy } = original;
  return createQuote({ ...copy, title: `${copy.title} (copia)`, status: "draft" }, owner);
}
export function deleteQuote(id, owner = LOCAL_OWNER) {
  const state = readState(); const next = state.quotations.filter(q => !(q.id === id && (q.ownerId || LOCAL_OWNER) === owner));
  if (next.length === state.quotations.length) return false;
  state.quotations = next; writeState(state); return true;
}
export function getQuoteStatistics(owner = LOCAL_OWNER) {
  const quotes = getAllQuotes(owner); const today = todayISO();
  const statusOf = q => q.status === "draft" || q.status === "sent" || q.status === "approved" || q.status === "rejected"
    ? q.status : (q.expirationDate && q.expirationDate < today ? "expired" : q.status);
  const count = status => quotes.filter(q => statusOf(q) === status).length;
  return { total: quotes.length, drafts: count("draft"), sent: count("sent"), approved: count("approved"),
    rejected: count("rejected"), expired: quotes.filter(q => q.status !== "approved" && q.status !== "rejected" && q.expirationDate && q.expirationDate < today).length,
    quotedAmount: quotes.reduce((s,q) => s + Number(q.financial?.total || 0), 0),
    approvedAmount: quotes.filter(q => q.status === "approved").reduce((s,q) => s + Number(q.financial?.total || 0), 0) };
}
export function exportQuotesJSON(owner = LOCAL_OWNER) {
  return JSON.stringify({ exportedAt: new Date().toISOString(), version: VERSION, quotations: getAllQuotes(owner), lastSequence: readState().lastSequence }, null, 2);
}
export function importQuotesJSON(json, owner = LOCAL_OWNER) {
  let incoming; try { incoming = typeof json === "string" ? JSON.parse(json) : json; } catch { throw new Error("El archivo JSON no es válido."); }
  if (!incoming || !Array.isArray(incoming.quotations)) throw new Error("El respaldo no contiene una lista válida de cotizaciones.");
  const state = readState(); const existing = new Set(state.quotations.map(q => q.id));
  const valid = incoming.quotations.filter(q => q && typeof q.id === "string" && typeof q.number === "string" && q.client && Array.isArray(q.items) && !existing.has(q.id));
  if (!valid.length && incoming.quotations.length) throw new Error("No hay cotizaciones nuevas válidas para importar.");
  const merged = valid.map(q => ({ ...q, ownerId: ownerId(owner), ...calculateQuote(q.items, q.financial || {}) }));
  state.quotations.push(...merged);
  const max = Math.max(0, ...valid.map(q => Number(String(q.number).replace(/\D/g, "")) || 0));
  state.lastSequence = Math.max(state.lastSequence, Number(incoming.lastSequence) || 0, max);
  writeState(state); return { imported: merged.length, skipped: incoming.quotations.length - merged.length };
}
export function clearQuoteStorage() { storage().removeItem(STORAGE_KEY); }
export const QUOTE_STORAGE_KEY = STORAGE_KEY;
