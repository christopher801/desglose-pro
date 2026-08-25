import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile } from '../services/userService'
import { logoutUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const WHATSAPP_NUMBER = '18494850059'

const legalLinks = [
  { path: '/legal/PrivacyPolicy.html', icon: 'bi-shield-lock', label: 'Política de Privacidad' },
  { path: '/legal/TermsOfService.html', icon: 'bi-file-text', label: 'Términos de Servicio' },
]

export default function ProfilePage() {
  const { user, userData, isAdmin, fullAccess } = useAuth()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState(userData?.nombre || '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = async () => {
    if (!nombre.trim()) return
    setLoading(true)
    const result = await updateUserProfile(user.uid, { nombre: nombre.trim() })
    setLoading(false)
    if (result.success) {
      setMessage('✅ Perfil actualizado')
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('❌ Error al actualizar')
    }
  }

  const handleLogout = async () => {
    await logoutUser(user?.uid, userData?.nombre, userData?.email)
    navigate('/login')
  }

  const handleRequestDelete = () => {
    const msg = encodeURIComponent(
      `Hola, soy ${userData?.nombre || 'un usuario'} (${userData?.email}) y quiero solicitar la eliminación de mi cuenta en Desglose Pro.`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
    setShowDeleteConfirm(false)
  }

  const daysSince = userData?.createdAt
    ? Math.floor((new Date() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24))
    : null

  return (
    <Layout>
      <div className="page-content">
        <h1 className="page-title">Mi perfil</h1>

        {/* Avatar card */}
        <div className="card-modern mb-4">
          <div className="profile-avatar-section">
            <div className="profile-avatar" style={{ background: '#0d1e3d', color: 'white', fontSize: '22px', fontWeight: 700 }}>
              {userData?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="profile-name">{userData?.nombre}</div>
              <div className="profile-email">{userData?.email}</div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span className={`badge ${userData?.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {userData?.isActive ? 'Activo' : 'Pendiente'}
                </span>
                <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                  {isAdmin ? 'Administrador' : 'Usuario'}
                </span>
                {(isAdmin || fullAccess) && (
                  <span className="badge badge-admin">
                    <i className="bi bi-star-fill" style={{ marginRight: '3px', fontSize: '9px' }}></i>
                    Full Access
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Editar nombre */}
        <div className="card-modern mb-4">
          <h3 className="info-card-title">
            <i className="bi bi-pencil" style={{ marginRight: '6px' }}></i>Editar información
          </h3>
          {message && <div className="alert-info mb-3">{message}</div>}
          <div className="auth-field">
            <label className="auth-label">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="auth-input"
              placeholder="Tu nombre"
            />
          </div>
          <button className="auth-btn" style={{ marginTop: '1rem' }} onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

        {/* Info cuenta */}
        <div className="card-modern mb-4">
          <h3 className="info-card-title">
            <i className="bi bi-person-badge" style={{ marginRight: '6px' }}></i>Información de cuenta
          </h3>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{userData?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Rol</span>
            <span className="info-value">{isAdmin ? 'Administrador' : 'Usuario'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Acceso</span>
            <span className="info-value">{isAdmin || fullAccess ? 'Full Access' : 'Normal'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Miembro desde</span>
            <span className="info-value">
              {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('es-DO') : '—'}
            </span>
          </div>
          {daysSince !== null && (
            <div className="info-row">
              <span className="info-label">Días en la plataforma</span>
              <span className="info-value" style={{ color: daysSince > 60 ? '#ef4444' : daysSince > 30 ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
                {daysSince} días
              </span>
            </div>
          )}
        </div>

        {/* Legal */}
        <div className="card-modern mb-4">
          <h3 className="info-card-title">
            <i className="bi bi-file-earmark-text" style={{ marginRight: '6px' }}></i>Legal
          </h3>
          {legalLinks.map(link => (
            <a
              key={link.path}
              href={link.path}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-100)', textDecoration: 'none', color: 'var(--gray-700)', fontSize: '14px' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className={`bi ${link.icon}`} style={{ color: 'var(--primary)' }}></i>
                {link.label}
              </span>
              <i className="bi bi-chevron-right" style={{ fontSize: '12px', color: 'var(--gray-400)' }}></i>
            </a>
          ))}
        </div>

        {/* Soporte */}
        <div className="card-modern mb-4">
          <h3 className="info-card-title">
            <i className="bi bi-headset" style={{ marginRight: '6px' }}></i>Soporte
          </h3>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, soy ${userData?.nombre || 'un usuario'} y necesito ayuda con Desglose Pro.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-100)', textDecoration: 'none', color: 'var(--gray-700)', fontSize: '14px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-whatsapp" style={{ color: '#25D366' }}></i>
              Contactar soporte
            </span>
            <i className="bi bi-chevron-right" style={{ fontSize: '12px', color: 'var(--gray-400)' }}></i>
          </a>
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', cursor: 'pointer', fontSize: '14px', color: '#ef4444' }}
            onClick={() => setShowDeleteConfirm(true)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-trash"></i>
              Solicitar eliminación de cuenta
            </span>
            <i className="bi bi-chevron-right" style={{ fontSize: '12px', color: 'var(--gray-400)' }}></i>
          </div>
        </div>

        {/* Logout */}
        <button className="btn-danger-outline" onClick={handleLogout} style={{ width: '100%' }}>
          <i className="bi bi-box-arrow-right" style={{ marginRight: '6px' }}></i>
          Cerrar sesión
        </button>

      </div>

      {/* Modal eliminar cuenta */}
      {showDeleteConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', maxWidth: '360px', width: '100%', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <i className="bi bi-trash" style={{ fontSize: '1.3rem', color: '#ef4444' }}></i>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Eliminar cuenta</h3>
            <p style={{ fontSize: '13px', color: 'var(--gray-500)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Tu solicitud será enviada al administrador vía WhatsApp. Él procesará la eliminación de tu cuenta y todos tus datos.
            </p>
            <button
              onClick={handleRequestDelete}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginBottom: '0.75rem' }}
            >
              <i className="bi bi-whatsapp"></i> Enviar solicitud por WhatsApp
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--gray-300)', borderRadius: '10px', fontSize: '13px', color: 'var(--gray-600)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

    </Layout>
  )
}