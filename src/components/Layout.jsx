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
  { path: '/about', icon: 'bi-info-circle', label: 'Acerca de' },
  { path: '/perfil', icon: 'bi-person', label: 'Perfil' },
]

export default function Layout({ children, unreadCount = 0 }) {
  const { userData, isAdmin } = useAuth()
  const WHATSAPP_NUMBER = '18494850059'
  const WHATSAPP_MESSAGE = `Hola, soy ${userData?.nombre || 'un usuario'} y me comunico desde Desglose Pro v4.9.0. Me gustaría recibir asistencia técnica.`
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logoutUser()
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
            <div className="sidebar-avatar">
              {userData?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
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
      
      {/* InstallButton — deyò layout-main pou pa gen konflì ak bottom-nav */}
      <InstallButton />
    </div>
  )
}