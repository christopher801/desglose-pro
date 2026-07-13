/**
 * services/glassOptimizer.js
 *
 * Responsable únicamente del manejo de LocalStorage para el módulo
 * de Optimización de Corte de Vidrio. No contiene lógica del algoritmo.
 */

const STORAGE_KEY = "desglosepro_glass_projects";

function leerTodos() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al leer proyectos de vidrio:", error);
    return [];
  }
}

function escribirTodos(proyectos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proyectos));
    return true;
  } catch (error) {
    console.error("Error al guardar proyectos de vidrio:", error);
    return false;
  }
}

function generarId() {
  return `glass_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Guarda un nuevo proyecto y devuelve el objeto guardado (con id y fechas).
 */
export function guardarProyecto(proyecto) {
  const proyectos = leerTodos();
  const nuevo = {
    ...proyecto,
    id: proyecto.id || generarId(),
    createdAt: proyecto.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  proyectos.push(nuevo);
  escribirTodos(proyectos);
  return nuevo;
}

/**
 * Actualiza un proyecto existente por id. Devuelve el proyecto actualizado
 * o null si no existe.
 */
export function actualizarProyecto(id, cambios) {
  const proyectos = leerTodos();
  const index = proyectos.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const actualizado = {
    ...proyectos[index],
    ...cambios,
    id,
    updatedAt: new Date().toISOString(),
  };
  proyectos[index] = actualizado;
  escribirTodos(proyectos);
  return actualizado;
}

/**
 * Elimina un proyecto por id. Devuelve true si fue eliminado.
 */
export function eliminarProyecto(id) {
  const proyectos = leerTodos();
  const filtrados = proyectos.filter((p) => p.id !== id);
  if (filtrados.length === proyectos.length) return false;
  escribirTodos(filtrados);
  return true;
}

/**
 * Busca un proyecto por id. Devuelve el proyecto o null.
 */
export function buscarProyecto(id) {
  const proyectos = leerTodos();
  return proyectos.find((p) => p.id === id) || null;
}

/**
 * Devuelve todos los proyectos guardados, más recientes primero.
 */
export function obtenerProyectos() {
  return leerTodos().sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
}