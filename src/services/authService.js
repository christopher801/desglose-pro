import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { createNewUserNotification } from './notificationService'

export const registerUser = async (email, password, nombre) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      nombre: nombre,
      role: 'user',
      isActive: false,
      createdAt: new Date().toISOString()
    })
    
    // Kreye notifikasyon pou admin
    await createNewUserNotification(user.uid, email, nombre)
    
    return { success: true, user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const logoutUser = async () => {
  try {
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
    return { success: false, error: 'User not found' }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}