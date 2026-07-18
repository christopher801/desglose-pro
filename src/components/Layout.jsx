import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'
import InstallButton from './InstallButton'

const navItems = [
  { path: '/dashboard', icon: 'bi-grid', label: 'Inicio' },
  { path: '/desglose', icon: 'bi-layers', label: 'Desglose' },
  { path: '/glass-optimizer', icon: 'bi-square-half', label: 'Croquis' },   // 👈 nouvo antre
  { path: '/finanzas', icon: 'bi-cash-coin', label: 'Gastos' },
]

const legalLinks = [
  { path: '/legal/privacidad', icon: 'bi-shield-lock', label: 'Política de Privacidad' },
  { path: '/legal/terminos', icon: 'bi-file-text', label: 'Términos de Servicio' },
  { path: '/legal/licencia', icon: 'bi-file-earmark-check', label: 'Licencia de Uso' },
  { path: '/about', icon: 'bi-info-circle', label: 'Acerca de' },

]

export default function Layout({ children, unreadCount = 0 }) {
  const { userData, isAdmin } = useAuth()
  const WHATSAPP_NUMBER = '18494850059'
  const WHATSAPP_MESSAGE = `Hola, soy ${userData?.nombre || 'un usuario'} y me comunico desde Desglose Pro v4.9.0. Me gustaría recibir asistencia técnica.`
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)  // ← ajoute sa


  const handleLogout = async () => {
  await logoutUser(user?.uid, userData?.nombre, userData?.email)
  navigate('/login')
}


  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  // 👇 Admin tou ajoute icon Bootstrap
  const allNavItems = isAdmin
    ? [...navItems, { path: '/admin', icon: 'bi-shield-lock', label: 'Admin', badge: unreadCount }]
    : navItems

  return (
    <div className="layout-shell">
      {/* SIDEBAR — desktop */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div>
            <div className="sidebar-logo-name">DESGLOSE PRO</div>
            <div className="sidebar-logo-ver">v4.9.0</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">Menú</div>
          {allNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? 'sidebar-item-active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="sidebar-item-label">{item.label}</span>
              {item.badge > 0 && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <Link to="/perfil" onClick={() => setSidebarOpen(false)}>
              <div className="sidebar-avatar">
               <i className='bi bi-person'></i>
              </div>
            </Link>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userData?.nombre || 'Usuario'}</div>
              <div className="sidebar-user-role">{isAdmin ? 'Administrador' : 'Usuario'}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Cerrar sesión">
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </aside>

      {/* Overlay mobil */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN */}
      <div className="layout-main">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="topbar-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Abrir menú"
          >
            <i className={sidebarOpen ? "bi bi-x-lg" : "bi bi-list"}></i>
          </button>
          <div className="topbar-title">
            {allNavItems.find(i => isActive(i.path))?.label || 'Desglose Pro'}
          </div>
          <div className="topbar-right">
            {isAdmin && unreadCount > 0 && (
              <Link to="/admin" className="topbar-notif-btn" title="Notificaciones">
                <i className="bi bi-bell"></i>  {/* 👇 Chanje 🔔 an icon Bootstrap */}
                <span className="topbar-notif-dot">{unreadCount}</span>
              </Link>
            )}
          </div>
          <a href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer" 
            className="topbar-notif-btn"
            title="Ayuda y soporte">
            <i className="bi bi-headset me-1"></i>
          </a>
          {/*acerca de aqui */}
          <button
            className="topbar-notif-btn"
            title="Acerca de"
            onClick={() => setShowAboutModal(true)}
          >
            <i className="bi bi-info-circle"></i>
          </button>
        </header>

        {/* Contenido */}
        <main className="layout-content">
          {children}
        </main>

        {/* BOTTOM NAV — mobil */}
        <nav className="bottom-nav">
          {allNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive(item.path) ? 'bottom-nav-item-active' : ''}`}
            >
              {/* 👇 CHANJE <span> an <i> POU ICON BOOTSTRAP */}
              <i className={`bi ${item.icon}`}></i>
              <span className="bottom-nav-label">{item.label}</span>
              {item.badge > 0 && <span className="bottom-nav-dot" />}
            </Link>
          ))}
        </nav>
      </div>
      {showAboutModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowAboutModal(false)}
        >
          <div
            style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', maxWidth: '420px', width: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Desglose Pro v4.9.0</h3>
              <button onClick={() => setShowAboutModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--gray-500)' }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
              Sistema profesional de gestión para carpintería de aluminio.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShowAboutModal(false)}
                  style={{ fontSize: '0.85rem', color: 'var(--gray-500)', textDecoration: 'none' }}
                >
                  <i className={`bi ${link.icon} me-1`}></i>{link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* InstallButton — deyò layout-main pou pa gen konflì ak bottom-nav */}
      <InstallButton />
    </div>
  )
}