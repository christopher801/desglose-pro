import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="page-content">
        <div className="card-modern" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid var(--gray-200)'
          }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>
              <i className="bi bi-shield-lock me-2"></i>
              Política de Privacidad
            </h1>
          </div>

          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
            Última actualización: 10 de julio de 2026
          </p>

          {/* Contenido */}
          <div className="legal-content">
            
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                1. Introducción
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                En <strong>Desglose Pro</strong>, nos tomamos muy en serio la privacidad de nuestros usuarios. 
                Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos tu 
                información personal cuando utilizas nuestra plataforma.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                Al utilizar Desglose Pro, aceptas las prácticas descritas en esta política.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                2. Información que recopilamos
              </h2>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-person me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Datos de identificación:</strong> Nombre, apellido, correo electrónico.
                </li>
                <li>
                  <i className="bi bi-building me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Datos profesionales:</strong> Empresa, rol, sector (si aplica).
                </li>
                <li>
                  <i className="bi bi-device-desktop me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, sistema operativo, 
                  páginas visitadas y tiempo de uso.
                </li>
                <li>
                  <i className="bi bi-calculator me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Datos de uso:</strong> Proyectos creados, cálculos realizados, preferencias de 
                  configuración.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                3. Cómo usamos tu información
              </h2>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Proporcionar y mantener nuestro servicio.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Gestionar tu cuenta y autenticación.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Personalizar tu experiencia de usuario.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Enviarte notificaciones importantes sobre tu cuenta.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Mejorar nuestro software con base en el uso y feedback.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Cumplir con obligaciones legales y regulatorias.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                4. Compartición de datos
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                No vendemos, alquilamos ni compartimos tu información personal con terceros, 
                excepto en los siguientes casos:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-shield me-1" style={{ color: 'var(--warning)' }}></i>
                  <strong>Proveedores de servicios:</strong> Firebase (autenticación y base de datos), 
                  que cumplen con estrictos estándares de seguridad.
                </li>
                <li>
                  <i className="bi bi-gavel me-1" style={{ color: 'var(--warning)' }}></i>
                  <strong>Obligaciones legales:</strong> Cuando sea requerido por ley o para proteger 
                  nuestros derechos legales.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                5. Seguridad de los datos
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger 
                tu información personal contra acceso no autorizado, alteración, divulgación o destrucción:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-lock me-1" style={{ color: 'var(--success)' }}></i>
                  Encriptación de datos en tránsito (SSL/TLS).
                </li>
                <li>
                  <i className="bi bi-shield me-1" style={{ color: 'var(--success)' }}></i>
                  Autenticación segura con Firebase Auth.
                </li>
                <li>
                  <i className="bi bi-database me-1" style={{ color: 'var(--success)' }}></i>
                  Bases de datos con accesos restringidos.
                </li>
                <li>
                  <i className="bi bi-clock me-1" style={{ color: 'var(--success)' }}></i>
                  Sesiones con expiración automática.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                6. Tus derechos
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Como usuario, tienes los siguientes derechos sobre tus datos personales:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-eye me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Acceso:</strong> Conocer qué datos tenemos sobre ti.
                </li>
                <li>
                  <i className="bi bi-pencil me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Rectificación:</strong> Corregir datos inexactos.
                </li>
                <li>
                  <i className="bi bi-trash me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Eliminación:</strong> Solicitar que eliminemos tus datos.
                </li>
                <li>
                  <i className="bi bi-download me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Portabilidad:</strong> Recibir tus datos en formato estructurado.
                </li>
              </ul>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '1rem' }}>
                Para ejercer estos derechos, contáctanos en: <strong>contacto@desglosepro.com</strong>
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                7. Cambios en esta política
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos sobre 
                cambios significativos a través de tu correo electrónico o mediante un aviso en la 
                plataforma.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                <i className="bi bi-clock me-1" style={{ color: 'var(--gray-500)' }}></i>
                Fecha de la última revisión: 10 de julio de 2026
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                8. Contacto
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Si tienes preguntas sobre esta Política de Privacidad, contáctanos:
              </p>
              <div style={{ 
                background: 'var(--gray-50)', 
                padding: '1rem', 
                borderRadius: '8px',
                marginTop: '0.5rem'
              }}>
                <p style={{ marginBottom: '0.25rem' }}>
                  <i className="bi bi-envelope me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Email:</strong> softwaredesglosepro@gmail.com
                </p>
                <p style={{ marginBottom: 0 }}>
                  <i className="bi bi-telephone me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Teléfono:</strong> +1 (849) 485-0059
                </p>
              </div>
            </section>

          </div>

          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '1.5rem', 
            borderTop: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <Link to="/" className="btn-primary-sm">
              <i className="bi bi-arrow-left me-1"></i>
              Volver al inicio
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  )
}