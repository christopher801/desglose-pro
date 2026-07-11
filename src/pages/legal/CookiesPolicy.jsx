import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function CookiesPolicy() {
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
              <i className="bi bi-cookie me-2"></i>
              Política de Cookies
            </h1>
          </div>

          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
            Última actualización: 10 de julio de 2026
          </p>

          {/* Contenido */}
          <div className="legal-content">
            
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                1. ¿Qué son las cookies?
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (computadora, 
                tableta o teléfono) cuando visitas un sitio web. Estos archivos contienen información que 
                el sitio web puede leer durante tu visita o en visitas futuras.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                En <strong>Desglose Pro</strong>, utilizamos cookies para mejorar tu experiencia, recordar 
                tus preferencias y analizar cómo usas nuestro servicio.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                2. Tipos de cookies que utilizamos
              </h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>
                  <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--success)' }}></i>
                  Cookies esenciales (necesarias)
                </h3>
                <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                  <li>Permiten la autenticación y sesión de usuario.</li>
                  <li>Mantienen tu sesión activa mientras usas la plataforma.</li>
                  <li>Son necesarias para el funcionamiento básico del servicio.</li>
                  <li>No pueden ser desactivadas ya que el servicio no funcionaría sin ellas.</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>
                  <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--info)' }}></i>
                  Cookies de preferencias
                </h3>
                <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                  <li>Recuerdan tus preferencias de configuración (idioma, tema, etc.).</li>
                  <li>Mejoran tu experiencia personalizando la interfaz.</li>
                  <li>No afectan el funcionamiento básico del sistema.</li>
                </ul>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>
                  <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--warning)' }}></i>
                  Cookies de análisis/rendimiento
                </h3>
                <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                  <li>Nos ayudan a entender cómo los usuarios interactúan con la plataforma.</li>
                  <li>Recopilan datos anónimos sobre páginas visitadas y tiempo de uso.</li>
                  <li>Utilizamos esta información para mejorar el servicio.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>
                  <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--danger)' }}></i>
                  Cookies de terceros
                </h3>
                <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                  <li>Podemos utilizar servicios de terceros que establecen cookies (ej. Firebase).</li>
                  <li>Estas cookies son gestionadas por las políticas de privacidad de dichos terceros.</li>
                  <li>No tenemos control directo sobre estas cookies.</li>
                </ul>
              </div>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                3. ¿Para qué utilizamos las cookies?
              </h2>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  <strong>Autenticación:</strong> Para verificar tu identidad y mantener tu sesión activa.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  <strong>Seguridad:</strong> Para proteger tu cuenta contra accesos no autorizados.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  <strong>Preferencias:</strong> Para recordar tus configuraciones y personalizar la interfaz.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  <strong>Análisis:</strong> Para entender cómo usas la plataforma y mejorar nuestros servicios.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  <strong>Rendimiento:</strong> Para optimizar la velocidad y el funcionamiento del servicio.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                4. Gestión de cookies
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Puedes controlar y/o eliminar las cookies según tu preferencia. Aquí te mostramos cómo 
                hacerlo en los navegadores más comunes:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-browser-chrome me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios.
                </li>
                <li>
                  <i className="bi bi-browser-firefox me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos de sitios.
                </li>
                <li>
                  <i className="bi bi-browser-safari me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web.
                </li>
                <li>
                  <i className="bi bi-browser-edge me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Microsoft Edge:</strong> Configuración → Cookies y permisos de sitio.
                </li>
              </ul>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '1rem' }}>
                <i className="bi bi-exclamation-circle me-1" style={{ color: 'var(--warning)' }}></i>
                <strong>Nota:</strong> Deshabilitar cookies esenciales puede afectar el funcionamiento 
                del servicio y tu experiencia de usuario.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                5. Cookies en servicios de terceros
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Desglose Pro utiliza los siguientes servicios que pueden establecer cookies:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-firebase me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Firebase</strong> (Google) - Autenticación y base de datos.
                </li>
                <li>
                  <i className="bi bi-file-earmark-pdf me-1" style={{ color: 'var(--primary)' }}></i>
                  <strong>Generación de PDF</strong> - Para exportar resultados.
                </li>
              </ul>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                Te recomendamos revisar las políticas de privacidad de estos servicios para más información.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                6. Cambios en esta política
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en 
                nuestras prácticas o en la legislación aplicable. Te notificaremos sobre cambios 
                importantes a través de la plataforma.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                <i className="bi bi-clock me-1" style={{ color: 'var(--gray-500)' }}></i>
                Fecha de la última revisión: 10 de julio de 2026
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                7. Contacto
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Si tienes preguntas sobre nuestra Política de Cookies, contáctanos:
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