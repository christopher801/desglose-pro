import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Welcome = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isActive } = useAuth()

  useEffect(() => {
    if (isAuthenticated && isActive) {
      navigate('/dashboard')
    } else if (isAuthenticated && !isActive) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, isActive, navigate])

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-icon">🏢</div>
        <h1 className="welcome-title">DESGLOSE PRO</h1>
        <p className="welcome-subtitle">
          Sistema profesional de cálculo<br />
          de Ventanas y Puertas de Aluminio
        </p>
        
        <div className="welcome-buttons">
          <button 
            className="btn-professional btn-professional-primary"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </button>
          <button 
            className="btn-professional btn-professional-outline"
            onClick={() => navigate('/register')}
          >
            Registrarse
          </button>
        </div>
        
        <hr className="my-4" />
        
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <div className="text-center">
            <div style={{ fontSize: '1.5rem' }}>🪟</div>
            <small className="text-muted">Ventanas</small>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '1.5rem' }}>🚪</div>
            <small className="text-muted">Puertas</small>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '1.5rem' }}>📐</div>
            <small className="text-muted">Cálculo preciso</small>
          </div>
        </div>
        
        <div className="mt-4">
          <small className="text-muted">Desarrollado por Christopher</small>
        </div>
      </div>
    </div>
  )
}

export default Welcome