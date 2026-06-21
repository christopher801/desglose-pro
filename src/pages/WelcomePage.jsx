import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function WelcomePage() {
  const { isAuthenticated, isActive } = useAuth()

  // Si deja konekte — redirije dirèkteman, pa montre Welcome page
  if (isAuthenticated) {
    return <Navigate to={isActive ? '/dashboard' : '/pending'} replace />
  }

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-logo">DP</div>
        <h1 className="welcome-title">Desglose Pro</h1>
        <p className="welcome-subtitle">
          Sistema profesional de cálculo para carpintería de aluminio
        </p>
        <div className="welcome-features">
          <div className="welcome-feature">
            <span>🪟</span>
            <span>Ventanas P-92, P-65, Tradicional, P-40</span>
          </div>
          <div className="welcome-feature">
            <span>🚪</span>
            <span>Puertas comerciales</span>
          </div>
          <div className="welcome-feature">
            <span>🔢</span>
            <span>Resultados precisos en fracciones de 1/16"</span>
          </div>
          <div className="welcome-feature">
            <span>📄</span>
            <span>Exportar a PDF</span>
          </div>
        </div>
        <div className="welcome-actions">
          <Link to="/login" className="btn-primary-lg">Iniciar sesión</Link>
          <Link to="/signup" className="btn-outline-lg">Crear cuenta</Link>
        </div>
        <p className="welcome-note">
          Las cuentas nuevas requieren aprobación del administrador
        </p>
      </div>
    </div>
  )
}