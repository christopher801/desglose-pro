import React, { useState } from 'react'
import { Container, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'

const Register = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    setLoading(true)
    
    const result = await registerUser(email, password, nombre)
    
    if (result.success) {
      setSuccess('¡Registro exitoso! Espera a que el administrador active tu cuenta.')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="welcome-container">
      <div className="welcome-card" style={{ maxWidth: '480px' }}>
        <div className="welcome-icon">📝</div>
        <h1 className="welcome-title">Registrarse</h1>
        <p className="welcome-subtitle">Crea tu cuenta profesional</p>
        
        {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
        {success && <Alert variant="success" className="mb-4">{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted small fw-medium">Nombre completo</label>
            <input
              type="text"
              className="input-professional"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Tu nombre"
            />
          </div>
          
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
          
          <div className="mb-3">
            <label className="form-label text-muted small fw-medium">Contraseña</label>
            <input
              type="password"
              className="input-professional"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="•••••••• (mínimo 6 caracteres)"
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label text-muted small fw-medium">Confirmar contraseña</label>
            <input
              type="password"
              className="input-professional"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-professional btn-professional-primary w-100"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/login" className="text-decoration-none" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
        
        <div className="mt-3 text-center">
          <small className="text-muted">
            ⚠️ Después de registrarte, tu cuenta será activada por el administrador.
          </small>
        </div>
      </div>
    </div>
  )
}

export default Register