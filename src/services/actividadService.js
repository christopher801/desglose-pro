import { db } from './firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, limit, where } from 'firebase/firestore'

const COLLECTION = 'actividad'

export const logActividad = async ({ uid, nombre, email, action, detail = '' }) => {
  try {
    await addDoc(collection(db, COLLECTION), {
      uid,
      nombre: nombre || 'Usuario',
      email: email || '',
      action,
      detail,
      timestamp: Date.now(),
      fecha: new Date().toISOString()
    })
  } catch (error) {
    console.warn('[Actividad] Error al guardar:', error.message)
  }
}

export const getActividad = async (limitCount = 100) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    const actividad = []
    snapshot.forEach(d => actividad.push({ id: d.id, ...d.data() }))
    return { success: true, actividad }
  } catch (error) {
    return { success: false, error: error.message, actividad: [] }
  }
}

export const getActividadByUser = async (uid) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('uid', '==', uid),
      orderBy('timestamp', 'desc'),
      limit(50)
    )
    const snapshot = await getDocs(q)
    const actividad = []
    snapshot.forEach(d => actividad.push({ id: d.id, ...d.data() }))
    return { success: true, actividad }
  } catch (error) {
    return { success: false, error: error.message, actividad: [] }
  }
}

export const deleteActividad = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION, id))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const deleteAllActividad = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION))
    const promises = []
    snapshot.forEach(d => promises.push(deleteDoc(d.ref)))
    await Promise.all(promises)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getActionLabel = (action) => {
  const labels = {
    login: { label: 'Login', icon: 'bi-box-arrow-in-right', color: 'var(--success)' },
    logout: { label: 'Logout', icon: 'bi-box-arrow-right', color: 'var(--gray-500)' },
    desglose: { label: 'Desglose', icon: 'bi-layers', color: 'var(--primary)' },
    admin_action: { label: 'Acción admin', icon: 'bi-shield-lock', color: 'var(--warning)' }
  }
  return labels[action] || { label: action, icon: 'bi-circle', color: 'var(--gray-400)' }
}