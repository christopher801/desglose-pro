import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.nombre || !form.email || !form.password || !form.confirm) {
      setError('Completa todos los campos')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    const result = await registerUser(form.email, form.password, form.nombre)
    setLoading(false)
    if (result.success) {
      navigate('/pending')
    } else {
      if (result.error.includes('email-already-in-use')) {
        setError('Este email ya está registrado')
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo')
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo-wrap">
          <div className="auth-logo">DP</div>
          <span className="auth-logo-name">Desglose Pro</span>
        </Link>

        <h2 className="auth-title">Crear cuenta</h2>
        <p className="auth-subtitle">
          Tu cuenta será activada por el administrador
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="auth-input"
              autoComplete="name"
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              className="auth-input"
              autoComplete="new-password"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirmar contraseña</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              className="auth-input"
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="auth-link">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
