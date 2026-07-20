import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { createNewUserNotification } from './notificationService'
import { logActividad } from './actividadService'

export const registerUser = async (email, password, nombre) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await setDoc(doc(db, 'users', user.uid), {
      email,
      nombre,
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString()
    })

    await createNewUserNotification(user.uid, email, nombre)
    return { success: true, user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Jwenn done user pou log non li
    const docSnap = await getDoc(doc(db, 'users', user.uid))
    const userData = docSnap.exists() ? docSnap.data() : {}

    // Track login
    await logActividad({
      uid: user.uid,
      nombre: userData.nombre || '',
      email: user.email,
      action: 'login',
      detail: 'Inicio de sesión exitoso'
    })

    return { success: true, user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const logoutUser = async (uid, nombre, email) => {
  try {
    // Track logout anvan signOut
    if (uid) {
      await logActividad({
        uid,
        nombre: nombre || '',
        email: email || '',
        action: 'logout',
        detail: 'Cierre de sesión'
      })
    }

    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const getUserData = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    }
    return { success: false, error: 'Usuario no encontrado' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}
