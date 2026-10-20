const KEY = 'dp_historial_desgloses'

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const save = (data) => {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

export const getHistorial = () => load()

export const saveDesglose = (data) => {
  const list = load()
  const entry = {
    id: Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    fecha: new Date().toISOString(),
    ...data
  }
  save([entry, ...list])
  return entry
}

export const deleteDesglose = (id) => {
  save(load().filter(d => d.id !== id))
}

export const deleteAllDesgloses = () => {
  save([])
}

export const getDesgloseById = (id) => {
  return load().find(d => d.id === id) || null
}

export const updateDesglose = (id, data) => {
  const list = load()
  if (!list.some(d => d.id === id)) return null

  const next = list.map(d =>
    d.id === id
      ? { ...d, ...data, id, fecha: new Date().toISOString() }
      : d
  )

  save(next)
  return next.find(d => d.id === id)
}