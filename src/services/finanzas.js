import { 
  db 
} from './firebase'
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore'

// --- Koleksyon mouvman yo ---
const getMovimientosCollection = (uid) => {
  // Estrikti: usuarios/{uid}/movimientos (3 segman)
  return collection(db, `usuarios/${uid}/movimientos`)
}

// --- Referans yon dokiman ---
const getMovimientoDoc = (uid, movimientoId) => {
  return doc(db, `usuarios/${uid}/movimientos`, movimientoId)
}

// --- CHAJE MOVIMAN (yon fwa) ---
export const cargarMovimientos = async (uid) => {
  try {
    const q = query(
      getMovimientosCollection(uid),
      orderBy('fecha', 'desc'),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    const movimientos = []
    snapshot.forEach((doc) => {
      movimientos.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, data: movimientos }
  } catch (error) {
    console.error('Error cargando movimientos:', error)
    return { success: false, error: error.message }
  }
}

// --- EKOUT AN TAN REEYÈL ---
export const suscribirMovimientos = (uid, callback) => {
  try {
    const q = query(
      getMovimientosCollection(uid),
      orderBy('fecha', 'desc'),
      orderBy('createdAt', 'desc')
    )
    return onSnapshot(q, (snapshot) => {
      const movimientos = []
      snapshot.forEach((doc) => {
        movimientos.push({ id: doc.id, ...doc.data() })
      })
      callback({ success: true, data: movimientos })
    }, (error) => {
      console.error('Error en suscripción:', error)
      callback({ success: false, error: error.message })
    })
  } catch (error) {
    console.error('Error creando suscripción:', error)
    return () => {} // unsubscribe vid
  }
}

// --- AJOUTE MOVIMAN ---
export const agregarMovimiento = async (uid, movimiento) => {
  try {
    const docRef = await addDoc(getMovimientosCollection(uid), {
      ...movimiento,
      monto: parseFloat(movimiento.monto),
      createdAt: serverTimestamp(),
      usuarioId: uid
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error agregando movimiento:', error)
    return { success: false, error: error.message }
  }
}

// --- EFFASE MOVIMAN ---
export const eliminarMovimiento = async (uid, movimientoId) => {
  try {
    await deleteDoc(getMovimientoDoc(uid, movimientoId))
    return { success: true }
  } catch (error) {
    console.error('Error eliminando movimiento:', error)
    return { success: false, error: error.message }
  }
}

// --- EDIT MOVIMAN ---
export const editarMovimiento = async (uid, movimientoId, datos) => {
  try {
    const docRef = getMovimientoDoc(uid, movimientoId)
    await updateDoc(docRef, {
      ...datos,
      monto: parseFloat(datos.monto),
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error editando movimiento:', error)
    return { success: false, error: error.message }
  }
}