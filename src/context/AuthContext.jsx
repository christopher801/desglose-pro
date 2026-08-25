import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react'

import { onAuthChange } from '../services/authService'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../services/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // ==========================================
  // DETECCIÓN DE CONEXIÓN
  // ==========================================

  useEffect(() => {
    const handleOffline = () => {
      window.location.href = '/offline.html'
    }

    const handleOnline = () => {
      window.location.reload()
    }

    // Si la app abre sin conexión
    if (!navigator.onLine) {
      window.location.href = '/offline.html'
      return
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  // ==========================================
  // FIREBASE AUTH
  // ==========================================

  useEffect(() => {
    let unsubscribeSnapshot = null

    const unsubscribeAuth = onAuthChange((firebaseUser) => {
      // Limpiar snapshot anterior
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot()
        unsubscribeSnapshot = null
      }

      if (firebaseUser) {
        setUser(firebaseUser)

        // Escuchar cambios del usuario en tiempo real
        const userRef = doc(db, 'users', firebaseUser.uid)

        unsubscribeSnapshot = onSnapshot(
          userRef,

          (docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data())
            } else {
              setUserData(null)
            }

            setLoading(false)
          },

          (error) => {
            console.error(
              'Error de conexión con Firebase:',
              error
            )

            // Si perdió conexión
            if (!navigator.onLine) {
              window.location.href = '/offline.html'
              return
            }

            setLoading(false)
          }
        )
      } else {
        setUser(null)
        setUserData(null)
        setLoading(false)
      }
    })

    return () => {
      unsubscribeAuth()

      if (unsubscribeSnapshot) {
        unsubscribeSnapshot()
      }
    }
  }, [])

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    user,
    userData,
    loading,

    isAuthenticated: !!user,

    isActive: userData?.isActive || false,

    isAdmin: userData?.role === 'admin',

    fullAccess: userData?.fullAccess || false
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}