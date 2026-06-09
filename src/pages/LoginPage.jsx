import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    const result = await loginUser(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      if (result.error.includes('invalid-credential') || result.error.includes('wrong-password')) {
        setError('Email o contraseña incorrectos')
      } else if (result.error.includes('too-many-requests')) {
        setError('Demasiados intentos. Espera un momento')
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo')
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo-wrap">
        <div className="auth-logo">
         <img 
            src="/icons/icon-384x384.png" 
            alt="Desglose Pro" 
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
            />
        </div>
          <span className="auth-logo-name">Desglose Pro</span>
        </Link>

        <h2 className="auth-title">Iniciar sesión</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tucorreo@email.com"
              className="auth-input"
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="auth-input"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta?{' '}
          <Link to="/signup" className="auth-link">Registrarse</Link>
        </p>
      </div>
    </div>
  )
}
