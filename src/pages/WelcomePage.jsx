import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function WelcomePage() {
  const { isAuthenticated, isActive } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={isActive ? '/dashboard' : '/pending'} replace />
  }
  return (
    <>
      {/* ===== CSS ENTEGRE (responsif) ===== */}
      <style>{`
        /* ---------- ROOT VARIABLES ---------- */
        .landing-page-root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --primary-light: #dbeafe;
          --success: #16a34a;
          --success-light: #d1fae5;
          --warning: #f59e0b;
          --warning-light: #fef3c7;
          --purple: #7c3aed;
          --purple-light: #ede9fe;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
          --gray-900: #111827;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        }

        /* ---------- LANDING PAGE ---------- */
        .landing-page {
          min-height: 100vh;
          background: #ffffff;
          color: var(--gray-800);
        }

        .landing-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ---------- HEADER ---------- */
        .landing-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--gray-200);
          padding: 0.75rem 0;
        }

        .landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .landing-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--gray-800);
        }

        .landing-logo-icon {
          font-size: 1.5rem;
        }

        .landing-nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .landing-nav-link {
          color: var(--gray-600);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .landing-nav-link:hover {
          color: var(--primary);
        }

        .landing-nav-btn {
          background: var(--primary);
          color: #fff !important;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background 0.2s, transform 0.1s;
          border: none;
          cursor: pointer;
        }
        .landing-nav-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }

        /* ---------- HERO ---------- */
        .landing-hero {
          padding: 4rem 0 3rem;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        }

        .landing-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .landing-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .landing-hero-title {
          font-size: clamp(2rem, 5vw, 2.8rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--gray-900);
          margin-bottom: 1.25rem;
        }
        .landing-hero-title span {
          color: var(--primary);
        }

        .landing-hero-desc {
          font-size: 1.1rem;
          color: var(--gray-600);
          line-height: 1.7;
          max-width: 500px;
          margin-bottom: 2rem;
        }

        .landing-hero-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .btn-primary-lg {
          display: inline-flex;
          align-items: center;
          background: var(--primary);
          color: #fff !important;
          padding: 0.75rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          border: none;
          cursor: pointer;
        }
        .btn-primary-lg:hover {
          background: var(--primary-dark);
          transform: translateY(-3px);
        }

        .btn-outline-lg {
          display: inline-flex;
          align-items: center;
          background: transparent;
          color: var(--gray-700);
          padding: 0.75rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid var(--gray-300);
          transition: border-color 0.2s, color 0.2s, transform 0.15s;
          cursor: pointer;
        }
        .btn-outline-lg:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-3px);
        }

        .landing-hero-stats {
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
        }
        .hero-stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gray-900);
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: var(--gray-500);
        }
        .hero-stat-divider {
          width: 1px;
          height: 2.5rem;
          background: var(--gray-300);
        }

        /* ---- Hero Cards (flottantes) ---- */
        .landing-hero-image {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        .landing-hero-card {
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem 1.2rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          text-align: center;
          width: 160px;
          border: 1px solid var(--gray-200);
          transition: transform 0.2s;
        }
        .landing-hero-card i {
          font-size: 2.5rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
          display: block;
        }
        .landing-hero-card h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .landing-hero-card p {
          font-size: 0.8rem;
          color: var(--gray-500);
          margin: 0;
        }

        .floating-1 {
          position: absolute;
          top: -20px;
          right: 0;
          animation: float 3s ease-in-out infinite;
        }
        .floating-2 {
          position: absolute;
          bottom: 0;
          left: -30px;
          animation: float 3.5s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* ---------- FEATURES ---------- */
        .landing-features {
          padding: 4rem 0;
          background: #fff;
        }

        .landing-section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }

        .landing-section-tag {
          display: inline-block;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.2rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .landing-section-title {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 0.75rem;
        }

        .landing-section-desc {
          color: var(--gray-600);
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .landing-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .landing-feature-card {
          background: var(--gray-50);
          padding: 2rem 1.5rem;
          border-radius: 16px;
          text-align: center;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          border: 1px solid transparent;
        }
        .landing-feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border-color: var(--gray-200);
        }

        .landing-feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .landing-feature-icon i {
          font-size: 1.6rem;
        }

        .landing-feature-card h3 {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .landing-feature-card p {
          font-size: 0.9rem;
          color: var(--gray-500);
          line-height: 1.5;
          margin: 0;
        }

        /* ---------- SYSTEMS ---------- */
        .landing-systems {
          padding: 4rem 0;
          background: var(--gray-50);
        }

        .landing-systems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.25rem;
        }

        .landing-system-card {
          background: #fff;
          padding: 1.5rem 1rem;
          border-radius: 12px;
          text-align: center;
          border: 1px solid var(--gray-200);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .landing-system-card:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.08);
          transform: translateY(-4px);
        }

        .landing-system-card i {
          font-size: 2rem;
          color: var(--primary);
          margin-bottom: 0.5rem;
          display: block;
        }
        .landing-system-card h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .landing-system-card p {
          font-size: 0.85rem;
          color: var(--gray-500);
          margin: 0;
        }

        /* ---------- CTA ---------- */
        .landing-cta {
          padding: 4rem 0;
          background: #fff;
        }

        .landing-cta-box {
          background: var(--primary);
          border-radius: 24px;
          padding: 4rem 2rem;
          text-align: center;
          color: #fff;
        }
        .landing-cta-box h2 {
          font-size: clamp(1.8rem, 4vw, 2.2rem);
          font-weight: 700;
          margin-bottom: 0.75rem;
        }
        .landing-cta-box p {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 500px;
          margin: 0 auto 2rem;
        }
        .landing-cta-box .btn-primary-lg {
          background: #fff;
          color: var(--primary) !important;
        }
        .landing-cta-box .btn-primary-lg:hover {
          background: var(--gray-50);
          color: var(--primary-dark) !important;
        }

        /* ---------- FOOTER ---------- */
        .landing-footer {
          background: var(--gray-900);
          color: #fff;
          padding: 3rem 0 1.5rem;
        }

        .landing-footer-grid {
          display: flex;
          justify-content: space-between;
          align-items: start;
          flex-wrap: wrap;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .landing-footer-brand p {
          color: var(--gray-400);
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .landing-footer-links {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .landing-footer-links a {
          color: var(--gray-400);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s;
        }
        .landing-footer-links a:hover {
          color: #fff;
        }

        .landing-footer-bottom {
          border-top: 1px solid var(--gray-700);
          padding-top: 1.5rem;
          text-align: center;
          color: var(--gray-500);
          font-size: 0.8rem;
        }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 1024px) {
          .landing-hero-grid {
            gap: 2rem;
          }
          .landing-hero-image {
            min-height: 250px;
          }
          .floating-1 { right: 10px; }
          .floating-2 { left: -10px; }
        }

        @media (max-width: 768px) {
          .landing-hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .landing-hero-desc {
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
          }
          .landing-hero-buttons {
            justify-content: center;
          }
          .landing-hero-stats {
            justify-content: center;
          }
          .landing-hero-image {
            display: none;
          }
          .landing-nav-links .landing-nav-link {
            font-size: 0.85rem;
          }
          .landing-cta-box {
            padding: 2.5rem 1.5rem;
          }
          .landing-footer-grid {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .landing-footer-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .landing-nav {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          .landing-nav-links {
            justify-content: center;
            gap: 0.8rem;
          }
          .landing-nav-btn {
            padding: 0.4rem 1rem;
            font-size: 0.8rem;
          }
          .landing-hero-title {
            font-size: 1.8rem;
          }
          .landing-hero-stats {
            flex-wrap: wrap;
            gap: 1rem;
            justify-content: center;
          }
          .hero-stat-divider {
            display: none;
          }
          .landing-features-grid {
            grid-template-columns: 1fr;
          }
          .landing-systems-grid {
            grid-template-columns: 1fr 1fr;
          }
          .landing-cta-box h2 {
            font-size: 1.5rem;
          }
          .landing-cta-box p {
            font-size: 1rem;
          }
          .btn-primary-lg, .btn-outline-lg {
            padding: 0.6rem 1.5rem;
            font-size: 0.9rem;
            width: 100%;
            justify-content: center;
          }
          .landing-hero-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 380px) {
          .landing-systems-grid {
            grid-template-columns: 1fr;
          }
          .landing-footer-links {
            flex-direction: column;
            align-items: center;
            gap: 0.8rem;
          }
        }
      `}</style>

      {/* ===== HTML ===== */}
      <div className="landing-page landing-page-root">
        {/* ---- HEADER ---- */}
        <header className="landing-header">
          <div className="landing-container">
            <nav className="landing-nav">
              <div className="landing-logo">
                <img className='landing-logo-icon' src="../public/icons/favicon-32x32.png" alt="logo" />
                <span>Desglose Pro</span>
              </div>
              <div className="landing-nav-links">
                <a href="#features" className="landing-nav-link">Características</a>
                <a href="#systems" className="landing-nav-link">Sistemas</a>
                <Link to="/login" className="landing-nav-btn">Iniciar sesión</Link>
              </div>
            </nav>
          </div>
        </header>

        {/* ---- HERO ---- */}
        <section className="landing-hero">
          <div className="landing-container">
            <div className="landing-hero-grid">
              <div className="landing-hero-content">
                <div className="landing-hero-badge">
                  <i className="bi bi-star-fill"></i> Software profesional
                </div>
                <h1 className="landing-hero-title">
                  Calcula ventanas de aluminio con <span>precisión exacta</span>
                </h1>
                <p className="landing-hero-desc">
                  Desglose Pro te permite calcular perfiles para ventanas P‑65, P‑92, P‑40,
                  Tradicionales y Puertas Comerciales con resultados en fracciones de 1/16".
                </p>
                <div className="landing-hero-buttons">
                  <Link to="/signup" className="btn-primary-lg">
                    <i className="bi bi-rocket-takeoff me-2"></i> Comenzar gratis
                  </Link>
                  <a href="#features" className="btn-outline-lg">
                    <i className="bi bi-play-circle me-2"></i> Ver más
                  </a>
                </div>
                <div className="landing-hero-stats">
                  <div className="hero-stat">
                    <span className="hero-stat-number">6+</span>
                    <span className="hero-stat-label">Sistemas</span>
                  </div>
                  <div className="hero-stat-divider"></div>
                  <div className="hero-stat">
                    <span className="hero-stat-number">1/16"</span>
                    <span className="hero-stat-label">Precisión</span>
                  </div>
                  <div className="hero-stat-divider"></div>
                  <div className="hero-stat">
                    <span className="hero-stat-number">100%</span>
                    <span className="hero-stat-label">Profesional</span>
                  </div>
                </div>
              </div>
              <div className="landing-hero-image">
                <div className="landing-hero-card">
                  <i className="bi bi-calculator"></i>
                  <h3>Desglose rápido</h3>
                  <p>Resultados en segundos</p>
                </div>
                <div className="landing-hero-card floating-1">
                  <i className="bi bi-file-earmark-pdf"></i>
                  <h3>Exporta PDF</h3>
                  <p>Imprime o guarda</p>
                </div>
                <div className="landing-hero-card floating-2">
                  <i className="bi bi-phone"></i>
                  <h3>PWA móvil</h3>
                  <p>Usa sin internet</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- FEATURES ---- */}
        <section id="features" className="landing-features">
          <div className="landing-container">
            <div className="landing-section-header">
              <span className="landing-section-tag">Características</span>
              <h2 className="landing-section-title">Todo lo que necesitas para tu taller</h2>
              <p className="landing-section-desc">
                Desglose Pro está diseñado para simplificar el cálculo de perfiles de aluminio
                y mejorar la productividad de tu taller.
              </p>
            </div>
            <div className="landing-features-grid">
              <div className="landing-feature-card">
                <div className="landing-feature-icon" style={{ background: 'var(--primary-light)' }}>
                  <i className="bi bi-calculator" style={{ color: 'var(--primary)' }}></i>
                </div>
                <h3>Cálculo preciso</h3>
                <p>Resultados en fracciones exactas de 1/16" para cortes perfectos.</p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon" style={{ background: 'var(--success-light)' }}>
                  <i className="bi bi-file-earmark-pdf" style={{ color: 'var(--success)' }}></i>
                </div>
                <h3>Exportar PDF</h3>
                <p>Genera reportes profesionales para imprimir o compartir.</p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon" style={{ background: 'var(--warning-light)' }}>
                  <i className="bi bi-phone" style={{ color: 'var(--warning)' }}></i>
                </div>
                <h3>PWA móvil</h3>
                <p>Instala la app en tu teléfono y úsala sin conexión a internet.</p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon" style={{ background: 'var(--purple-light)' }}>
                  <i className="bi bi-shield-lock" style={{ color: 'var(--purple)' }}></i>
                </div>
                <h3>Acceso seguro</h3>
                <p>Sistema de roles y permisos para administradores y usuarios.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- SYSTEMS ---- */}
        <section id="systems" className="landing-systems">
          <div className="landing-container">
            <div className="landing-section-header">
              <span className="landing-section-tag">Sistemas</span>
              <h2 className="landing-section-title">Módulos de cálculo disponibles</h2>
              <p className="landing-section-desc">
                Elige el sistema que necesitas y comienza a calcular al instante.
              </p>
            </div>
            <div className="landing-systems-grid">
              <div className="landing-system-card">
                <i className="bi bi-window"></i>
                <h4>Ventana P‑92</h4>
                <p>Corredera 2, 3 o 4 hojas</p>
              </div>
              <div className="landing-system-card">
                <i className="bi bi-window"></i>
                <h4>Ventana P‑65</h4>
                <p>Corredera 2, 3 o 4 hojas</p>
              </div>
              <div className="landing-system-card">
                <i className="bi bi-window"></i>
                <h4>Ventana Tradicional</h4>
                <p>Corredera 2, 3 o 4 hojas</p>
              </div>
              <div className="landing-system-card">
                <i className="bi bi-window-dock"></i>
                <h4>Ventana P‑40</h4>
                <p>Sistema proyectado</p>
              </div>
              <div className="landing-system-card">
                <i className="bi bi-door-open"></i>
                <h4>Puerta P40</h4>
                <p>Puertas de aluminio</p>
              </div>
              <div className="landing-system-card">
                <i className="bi bi-door-open"></i>
                <h4>Puerta Comercial</h4>
                <p>Puertas de aluminio</p>
              </div>
              <div className="landing-system-card">
                <i className="bi bi-cash-coin"></i>
                <h4>Control de Gastos</h4>
                <p>Finanzas del taller</p>
              </div>
              <div className="landing-system-card">
                <i className="bi bi-square-half"></i>
                <h4>Croquins de vidrio</h4>
                <p>Optimización de Corte de Vidrio</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- CTA ---- */}
        <section className="landing-cta">
          <div className="landing-container">
            <div className="landing-cta-box">
              <h2>¿Listo para optimizar tu taller?</h2>
              <p>Comienza a usar Desglose Pro hoy mismo y mejora la precisión de tus cálculos.</p>
              <Link to="/signup" className="btn-primary-lg">
                <i className="bi bi-rocket-takeoff me-2"></i> Crear cuenta gratis
              </Link>
            </div>
          </div>
        </section>

        {/* ---- FOOTER ---- */}
        <footer className="landing-footer">
            <div className="landing-footer-bottom">
              <p>© 2026 Desglose Pro — Todos los derechos reservados</p>
          </div>
        </footer>
      </div>
    </>
  )
}