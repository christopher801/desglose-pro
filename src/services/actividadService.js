import { db } from './firebase'
import { collection, addDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore'

const COLLECTION = 'actividad'

// Sove yon aksyon nan Firestore
export const logActividad = async ({ uid, nombre, email, action, detail = '' }) => {
  try {
    await addDoc(collection(db, COLLECTION), {
      uid,
      nombre: nombre || 'Usuario',
      email: email || '',
      action,   // 'login' | 'logout' | 'desglose' | 'admin_action'
      detail,   // 'P92 - Hueco 1A' | 'login exitoso' | 'Activó a Juan' etc.
      timestamp: Date.now(),
      fecha: new Date().toISOString()
    })
  } catch (error) {
    // Pa janm kase app la si tracking echwe
    console.warn('[Actividad] Error al guardar:', error.message)
  }
}

// Jwenn tout aktivite yo — pou AdminPage
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

// Jwenn aktivite yon user espesifik
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

// Etikèt pou chak tip aksyon
export const getActionLabel = (action) => {
  const labels = {
    login: { label: 'Login', icon: 'bi-box-arrow-in-right', color: 'var(--success)' },
    logout: { label: 'Logout', icon: 'bi-box-arrow-right', color: 'var(--gray-500)' },
    desglose: { label: 'Desglose', icon: 'bi-layers', color: 'var(--primary)' },
    admin_action: { label: 'Acción admin', icon: 'bi-shield-lock', color: 'var(--warning)' }
  }
  return labels[action] || { label: action, icon: 'bi-circle', color: 'var(--gray-400)' }
}
