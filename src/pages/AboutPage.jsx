import React from 'react'
import Layout from '../components/Layout'

const WHATSAPP_NUMBER = '18494850059' // ← Chanje sa ak nimewo ou a
const WHATSAPP_MESSAGE = 'Hola, me comunico desde Desglose Pro 📐'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const features = [
  { icon: '🧮', title: 'Cálculo preciso', desc: 'Fracciones exactas en 1/16"' },
  { icon: '📄', title: 'Exportar PDF', desc: 'Imprimir o guardar resultados' },
  { icon: '📱', title: 'PWA móvil', desc: 'Instala y usa sin internet' },
  { icon: '🔒', title: 'Acceso seguro', desc: 'Sistema de roles y permisos' },
]

const systems = [
  { name: 'Ventana P-92', nuevo: false },
  { name: 'Ventana P-65', nuevo: false },
  { name: 'Ventana Tradicional', nuevo: false },
  { name: 'Ventana P-40 Proyectada', nuevo: true },
  { name: 'Puerta Comercial', nuevo: false },
]

const techInfo = [
  { label: 'Versión', value: '2.0.0' },
  { label: 'Framework', value: 'React 18 + Vite' },
  { label: 'Base de datos', value: 'Firebase Firestore' },
  { label: 'Autenticación', value: 'Firebase Auth' },
  { label: 'Plataforma', value: 'PWA' },
]

export default function AboutPage() {
  return (
    <Layout>
      <div className="page-content">

        {/* Hero */}
        <div className="card-modern mb-4" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div className="about-logo">
  <img 
    src="/icons/icon-384x384.png" 
    alt="Desglose Pro" 
    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
  />
</div>
          <h1 className="about-app-name">Desglose Pro</h1>
          <span className="badge badge-active" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
            v2.0.0
          </span>
          <p className="about-desc">
            Sistema profesional de cálculo para carpintería de aluminio.
            Resultados precisos en fracciones de 1/16".
          </p>
        </div>

        {/* Características */}
        <h2 className="section-title">Características</h2>
        <div className="about-features mb-4">
          {features.map((f, i) => (
            <div key={i} className="about-feat-card">
              <div className="about-feat-icon">{f.icon}</div>
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
              <div className="about-sys-dot" />
              <span className="about-sys-name">{s.name}</span>
              {s.nuevo && <span className="product-badge" style={{ position: 'static' }}></span>}
            </div>
          ))}
        </div>

        {/* Desarrollado por */}
        <h2 className="section-title">Desarrollado por</h2>
        <div className="card-modern mb-4">
          <div className="about-dev">
            <div className="about-dev-avatar">C</div>
            <div className="about-dev-info">
              <div className="about-dev-name">Christopher</div>
              <div className="about-dev-role">Full Stack &amp; Mobile Developer</div>
            </div>
          </div>

          {/* Botón WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="about-whatsapp-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar por WhatsApp
          </a>
        </div>
        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray-400)', paddingBottom: '1rem' }}>
          © 2026 Desglose Pro — Todos los derechos reservados
        </p>

      </div>
    </Layout>
  )
}
