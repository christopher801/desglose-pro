import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'
import InstallButton from './InstallButton'

const navItems = [
  { path: '/dashboard', icon: '⊞', label: 'Inicio' },
  { path: '/desglose', icon: '📐', label: 'Sistemas' },
  { path: '/about', icon: 'ℹ️', label: 'Acerca de' },
  { path: '/perfil', icon: '👤', label: 'Perfil' },
]

export default function Layout({ children, unreadCount = 0 }) {
  const { userData, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const allNavItems = isAdmin
    ? [...navItems, { path: '/admin', icon: '🛡️', label: 'Admin', badge: unreadCount }]
    : navItems

  return (
    <div className="layout-shell">
      {/* SIDEBAR — desktop */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">DP</div>
          <div>
            <div className="sidebar-logo-name">Desglose Pro</div>
            <div className="sidebar-logo-ver">v2.0.0</div>
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
              <span className="sidebar-item-icon">{item.icon}</span>
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
            ⏻
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
            ☰
          </button>
          <div className="topbar-title">
            {allNavItems.find(i => isActive(i.path))?.label || 'Desglose Pro'}
          </div>
          <div className="topbar-right">
            {isAdmin && unreadCount > 0 && (
              <Link to="/admin" className="topbar-notif-btn" title="Notificaciones">
                🔔
                <span className="topbar-notif-dot">{unreadCount}</span>
              </Link>
            )}
          </div>
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
              <span className="bottom-nav-icon">{item.icon}</span>
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
