// Istwa croquis de barras yo (lis). Pa touche historialService.js.
// STORAGE_KEY orijinal la (desglose-pro-croquis-barras) rete pou restore travay kounye a.
const HISTORIAL_KEY = "desglose-pro-croquis-barras-historial";
const MAX_ENTRIES = 100;

export function getCroquisHistorial() {
  try {
    const raw = localStorage.getItem(HISTORIAL_KEY);
    if (!raw) return [];

    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];

    // Pi resan an premye
    return [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  } catch (error) {
    console.error("No se pudo leer el historial de croquis:", error);
    return [];
  }
}

// Si yon antre ak menm id deja egziste, li mete l ajou (pa kreye doub)
export function saveCroquisToHistorial(entry) {
  const current = getCroquisHistorial();
  const index = current.findIndex((item) => item.id === entry.id);

  let next;
  if (index >= 0) {
    next = current.map((item) => (item.id === entry.id ? entry : item));
  } else {
    next = [entry, ...current].slice(0, MAX_ENTRIES);
  }

  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(next));
  return entry;
}

export function deleteCroquis(id) {
  const next = getCroquisHistorial().filter((item) => item.id !== id);
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(next));
}

export function deleteAllCroquis() {
  localStorage.removeItem(HISTORIAL_KEY);
}