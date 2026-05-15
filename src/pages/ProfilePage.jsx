import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile } from '../services/userService'
import { logoutUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

export default function ProfilePage() {
  const { user, userData, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState(userData?.nombre || '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

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
    await logoutUser()
    navigate('/login')
  }

  return (
    <Layout>
      <div className="page-content">
        <h1 className="page-title">Mi perfil</h1>

        <div className="card-modern mb-4">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {userData?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="profile-name">{userData?.nombre}</div>
              <div className="profile-email">{userData?.email}</div>
              <span className={`badge ${userData?.isActive ? 'badge-active' : 'badge-inactive'}`}>
                {userData?.isActive ? 'Activo' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        <div className="card-modern mb-4">
          <h3 className="info-card-title">Editar información</h3>
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
          <button
            className="auth-btn"
            style={{ marginTop: '1rem' }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

        <div className="card-modern mb-4">
          <h3 className="info-card-title">Información de cuenta</h3>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{userData?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Rol</span>
            <span className="info-value">{isAdmin ? 'Administrador' : 'Usuario'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Miembro desde</span>
            <span className="info-value">
              {userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString('es-DO')
                : '—'}
            </span>
          </div>
        </div>

        <button className="btn-danger-outline" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </Layout>
  )
}
