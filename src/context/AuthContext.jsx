import React, { createContext, useState, useEffect, useContext } from 'react'
import { onAuthChange } from '../services/authService'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../services/firebase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribeSnapshot = null

    const unsubscribeAuth = onAuthChange((firebaseUser) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot()
        unsubscribeSnapshot = null
      }

      if (firebaseUser) {
        setUser(firebaseUser)
        // onSnapshot: si admin chanje isActive, user wè chanjman an otomatikman
        const userRef = doc(db, 'users', firebaseUser.uid)
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data())
          }
          setLoading(false)
        })
      } else {
        setUser(null)
        setUserData(null)
        setLoading(false)
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
  }, [])

  const value = {
    user,
    userData,
    loading,
    isAuthenticated: !!user,
    isActive: userData?.isActive || false,
    isAdmin: userData?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
