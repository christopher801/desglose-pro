import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

// 👇 CHANJE EMOJI YO AK NON ICON BOOTSTRAP (SAN "bi")
const features = [
  { icon: 'bi-calculator', title: 'Cálculo preciso', desc: 'Fracciones exactas en 1/16"' },
  { icon: 'bi-file-earmark-pdf', title: 'Exportar PDF', desc: 'Imprimir o guardar resultados' },
  { icon: 'bi-phone', title: 'PWA móvil', desc: 'Instala y usa sin internet' },
  { icon: 'bi-shield-lock', title: 'Acceso seguro', desc: 'Sistema de roles y permisos' },
];

const systems = [
  { name: 'Ventana P-92', nuevo: false },
  { name: 'Ventana P-65', nuevo: false },
  { name: 'Ventana Tradicional', nuevo: false },
  { name: 'Ventana P-40 Proyectada', nuevo: false },
  { name: 'Puerta Comercial', nuevo: false },
  { name: 'Control de Gastos', nuevo: false },
  { name: 'Optimización de Corte de Vidrio', nuevo: true },
]

export default function AboutPage() {
  return (
    <Layout>
      <div className="page-content">

        {/* Hero */}
        <div className="card-modern mb-4" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <h1 className="sidebar-logo-name">DESGLOSE PRO</h1>
          <p className="about-app-name">Software profesional para talleres de aluminio</p>
          <p className="about-desc">
            Con esta aplicación, puedes desglosar las ventanas: P-65, P-92, P-40, Tradicional, Puertas Comercial.
            Incluye opciones para 2 hojas, 3 hojas, 4 hojas.
          </p>
          <span className="badge badge-active" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
            v4.9.0
          </span>
        </div>

        {/* Características */}
        <h2 className="section-title">Características</h2>
        <div className="about-features mb-4">
          {features.map((f, i) => (
            <div key={i} className="about-feat-card">
              {/* 👇 CHANJE <div> an <i> POU ICON BOOTSTRAP */}
              <i className={`bi ${f.icon} about-feat-icon`}></i>
              <div>
                <div className="about-feat-name">{f.title}</div>
                <div className="about-feat-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sistemas */}
        <h2 className="section-title">Sistemas disponibles</h2>
        <div className="card-modern mb-4" style={{ padding: 0, overflow: 'hidden' }}>
          {systems.map((s, i) => (
            <div key={i} className="about-sys-row">
              <i className="bi bi-check-circle-fill"></i>
              <span className="about-sys-name">{s.name}</span>
              {s.nuevo && <span className="product-badge" style={{ position: 'static' }}>Nuevo</span>}
            </div>
          ))}
        </div>
                {/* Legal links */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1.5rem', 
          flexWrap: 'wrap',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--gray-200)'
        }}>
          <Link to="/legal/privacidad" style={{ fontSize: '0.85rem', color: 'var(--gray-500)', textDecoration: 'none' }}>
            <i className="bi bi-shield-lock me-1"></i>
              Política de Privacidad
          </Link>
          <Link to="/legal/terminos" style={{ fontSize: '0.85rem', color: 'var(--gray-500)', textDecoration: 'none' }}>
            <i className="bi bi-file-text me-1"></i>
              Términos de Servicio
          </Link>
          <Link to="/legal/cookies" style={{ fontSize: '0.85rem', color: 'var(--gray-500)', textDecoration: 'none' }}>
            <i className="bi bi-cookie me-1"></i>
              Política de Cookies
          </Link>
          <Link to="/legal/licencia" style={{ fontSize: '0.85rem', color: 'var(--gray-500)', textDecoration: 'none' }}>
            <i className="bi bi-file-earmark-check me-1"></i>
              Licencia de Uso
          </Link>
        </div>
        
                {/* Footer */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1.5rem', 
          flexWrap: 'wrap',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--gray-200)'
        }}>      
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray-400)', paddingBottom: '1rem' }}>
          © 2026 Desglose Pro — Todos los derechos reservados
        </p>
        </div>
      </div>
    </Layout>
  )
}