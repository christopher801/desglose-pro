import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

// 👇 CHANJE EMOJI YO AK NON ICON BOOTSTRAP (SAN "bi")
const systems = [
  { name: 'Ventana P-92', icon: 'bi-window', path: '/desglose/p92', nuevo: false },
  { name: 'Ventana P-65', icon: 'bi-window', path: '/desglose/p65', nuevo: false },
  { name: 'Ventana Tradicional', icon: 'bi-window', path: '/desglose/tradicional', nuevo: false },
  { name: 'Ventana P-40', icon: 'bi-window', path: '/desglose/p40', nuevo: false },
  { name: 'Puerta Comercial', icon: 'bi-door-open', path: '/desglose/puerta', nuevo: false },
  { name: 'Control de Gastos', icon: 'bi-cash-coin', path: '/finanzas', nuevo: false },
  { name: 'Croquins de vidrio', icon: 'bi-square-half', path: '/glass-optimizer', nuevo: true },
]

export default function Dashboard() {
  const { userData, isActive, isAdmin } = useAuth()

  return (
    <Layout>
      <div className="page-content">

        {/* Welcome */}
        <div className="card-modern mb-4">
          <div className="dashboard-welcome">
            <div>
              <h1 className="dashboard-greeting">
                Hola, {userData?.nombre || 'Usuario'}
              </h1>
              <p className="dashboard-sub">
                {isActive
                  ? 'Tu cuenta está activa. Todos los sistemas disponibles.'
                  : 'Tu cuenta está pendiente de activación.'}
              </p>
            </div>
            <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
              {isActive ? 'Activo' : 'Pendiente'}
            </span>
          </div>
        </div>

        {/* Stats — solo si admin */}
        {isAdmin && (
          <div className="dashboard-stats mb-4">
            <div className="stat-card">
              <div className="stat-card-title">Sistemas</div>
              <div className="stat-card-value">{systems.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Tu rol</div>
              <div className="stat-card-value" style={{ fontSize: '1.2rem' }}>Admin</div>
            </div>
          </div>
        )}

        {/* Advertencia si no activo */}
        {!isActive && (
          <div className="alert-warning mb-4">
            Tu cuenta aún no ha sido activada. Contacta al administrador.
          </div>
        )}

        {/* Sistemas */}
        {isActive && (
          <>
            <h2 className="section-title">Sistemas disponibles</h2>
            <div className="product-grid">
              {systems.map((sys, idx) => (
                <Link to={sys.path} key={idx} className="product-card">
                  {sys.nuevo && <span className="product-badge">Nuevo</span>}
                  <i className={`bi ${sys.icon} product-icon`}></i>
                  <div className="product-title">{sys.name}</div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Info card */}
        <div className="card-modern mt-4">
          <h3 className="info-card-title">Información de cuenta</h3>
          <div className="info-row">
            <span className="info-label">Estado</span>
            <span className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}>
              {isActive ? 'Activo' : 'Bloqueado'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Rol</span>
            <span className="info-value">{isAdmin ? 'Administrador' : 'Usuario'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{userData?.email}</span>
          </div>
        </div>

      </div>
    </Layout>
  )
}