import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function PendingPage() {
  const { userData, isActive } = useAuth()
  const navigate = useNavigate()

  // Si admin aktive user a pandan li sou paj sa, redirect otomatik
  React.useEffect(() => {
    if (isActive) navigate('/dashboard')
  }, [isActive, navigate])

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
        <h2 className="auth-title">Cuenta pendiente</h2>
        <p className="auth-subtitle">
          Hola <strong>{userData?.nombre || 'Usuario'}</strong>, tu cuenta fue creada exitosamente.
        </p>
        <p className="auth-subtitle" style={{ marginTop: '0.5rem' }}>
          El administrador debe activarla antes de que puedas acceder al sistema.
          Recibirás acceso automáticamente una vez que sea aprobada.
        </p>
        <div className="pending-info-box">
          <p>📧 <strong>{userData?.email}</strong></p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
            Puedes cerrar esta página y volver más tarde
          </p>
        </div>
        <button onClick={handleLogout} className="btn-outline-lg" style={{ marginTop: '1.5rem' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
