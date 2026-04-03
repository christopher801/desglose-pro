import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isActive, loading } = useAuth()

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isActive) {
    return (
      <div className="container mt-5">
        <div className="lock-screen">
          <div className="lock-icon">🔒</div>
          <h2 className="mb-3">Acceso Bloqueado</h2>
          <p className="text-muted mb-4">
            Tu cuenta no está activada. Contacta al administrador para activar tu acceso.
          </p>
          <div className="alert alert-warning">
            <strong>⚠️ Atención:</strong> Para utilizar el sistema, necesitas tener una cuenta activa.
            Por favor, espera a que el administrador active tu cuenta.
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute