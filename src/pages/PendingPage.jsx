import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const WHATSAPP_NUMBER = '18494850059'

export default function PendingPage() {
  const { user, userData, isActive } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (isActive) navigate('/dashboard')
  }, [isActive, navigate])

  const handleLogout = async () => {
    await logoutUser(user?.uid, userData?.nombre, userData?.email)
    navigate('/login')
  }

  // Si kont lan gen plis pase 5 minit — se kont bloke pa admin
  const isBlocked = userData?.createdAt &&
    (new Date() - new Date(userData.createdAt)) > (5 * 60 * 1000)

  const whatsappMsg = encodeURIComponent(
    `Hola, soy ${userData?.nombre || 'un usuario'} y mi cuenta en Desglose Pro está ${isBlocked ? 'bloqueada' : 'pendiente'}. Email: ${userData?.email}`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>

        <i
          className={`bi ${isBlocked ? 'bi-shield-x' : 'bi-hourglass-split'}`}
          style={{
            fontSize: '3rem',
            color: isBlocked ? 'var(--danger)' : 'var(--warning)',
            marginBottom: '1rem',
            display: 'block'
          }}
        ></i>

        <h2 className="auth-title">
          {isBlocked ? 'Acceso suspendido' : 'Cuenta pendiente'}
        </h2>

        <p className="auth-subtitle">
          Hola <strong>{userData?.nombre || 'Usuario'}</strong>,{' '}
          {isBlocked
            ? 'tu acceso ha sido suspendido.'
            : 'tu cuenta fue creada exitosamente.'}
        </p>

        <p className="auth-subtitle" style={{ marginTop: '0.5rem' }}>
          {isBlocked
            ? 'Contacta al administrador para reactivar tu cuenta o renovar tu plan.'
            : 'El administrador activará tu cuenta en breve.'}
        </p>

        <div className="pending-info-box">
          <p>
            <i className="bi bi-envelope" style={{ marginRight: '6px' }}></i>
            <strong>{userData?.email}</strong>
          </p>
          {!isBlocked && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
              Puedes cerrar esta página y volver más tarde
            </p>
          )}
        </div>

        {isBlocked && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '1rem',
              padding: '11px',
              background: '#25D366',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <i className="bi bi-whatsapp"></i>
            Contactar soporte
          </a>
        )}

        <button
          onClick={handleLogout}
          className="btn-outline-lg"
          style={{ marginTop: '1rem' }}
        >
          <i className="bi bi-box-arrow-right" style={{ marginRight: '6px' }}></i>
          Cerrar sesión
        </button>

      </div>
    </div>
  )
}