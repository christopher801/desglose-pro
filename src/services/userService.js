import { db } from './firebase'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    const users = []
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, users }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const unlockUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      isActive: true
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const lockUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      isActive: false
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}