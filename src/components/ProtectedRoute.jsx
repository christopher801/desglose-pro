import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Rout ki egzije login sèlman
export const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

// Rout ki egzije login + kont aktive
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isActive } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isActive) return <Navigate to="/pending" replace />
  return children
}

// Rout admin sèlman
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isActive, isAdmin } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isActive) return <Navigate to="/pending" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}
