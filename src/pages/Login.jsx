import React, { useState } from 'react'
import { Container, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  if (user) {
    navigate('/dashboard')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await loginUser(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="welcome-container">
      <div className="welcome-card" style={{ maxWidth: '420px' }}>
        <div className="welcome-icon">🔐</div>
        <h1 className="welcome-title">Iniciar Sesión</h1>
        <p className="welcome-subtitle">Ingresa a tu cuenta profesional</p>
        
        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted small fw-medium">Email</label>
            <input
              type="email"
              className="input-professional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@ejemplo.com"
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label text-muted small fw-medium">Contraseña</label>
            <input
              type="password"
              className="input-professional"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-professional btn-professional-primary w-100"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/register" className="text-decoration-none" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login