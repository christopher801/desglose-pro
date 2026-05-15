import { db } from './firebase'
import { collection, getDocs, doc, updateDoc, getDoc, query, where, orderBy } from 'firebase/firestore'

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    const users = []
    querySnapshot.forEach((d) => {
      users.push({ id: d.id, ...d.data() })
    })
    return { success: true, users }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getPendingUsers = async () => {
  try {
    const q = query(collection(db, 'users'), where('isActive', '==', false))
    const snapshot = await getDocs(q)
    const users = []
    snapshot.forEach((d) => users.push({ id: d.id, ...d.data() }))
    return { success: true, users }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getUserById = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } }
    }
    return { success: false, error: 'Usuario no encontrado' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, data)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const unlockUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, { isActive: true })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const lockUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, { isActive: false })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
