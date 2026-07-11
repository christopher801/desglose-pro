import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function TermsOfService() {
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
              <i className="bi bi-file-text me-2"></i>
              Términos de Servicio
            </h1>
          </div>

          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
            Última actualización: 10 de julio de 2026
          </p>

          {/* Contenido */}
          <div className="legal-content">
            
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                1. Aceptación de los Términos
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Al utilizar <strong>Desglose Pro</strong>, aceptas cumplir con estos Términos de Servicio. 
                Si no estás de acuerdo con alguna parte de estos términos, por favor no utilices nuestra 
                plataforma.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                2. Descripción del Servicio
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Desglose Pro es un software profesional diseñado para talleres de aluminio y carpintería 
                metálica. Ofrece herramientas de cálculo preciso para ventanas, puertas y otros sistemas 
                de aluminio, con resultados en fracciones de 1/16".
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>
                  <i className="bi bi-calculator me-1" style={{ color: 'var(--primary)' }}></i>
                  Cálculo de perfiles de aluminio para ventanas y puertas
                </li>
                <li>
                  <i className="bi bi-file-earmark-pdf me-1" style={{ color: 'var(--primary)' }}></i>
                  Exportación de resultados a PDF
                </li>
                <li>
                  <i className="bi bi-graph-up me-1" style={{ color: 'var(--primary)' }}></i>
                  Control de gastos y finanzas
                </li>
                <li>
                  <i className="bi bi-people me-1" style={{ color: 'var(--primary)' }}></i>
                  Gestión de usuarios con roles (admin/usuario)
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                3. Cuentas de Usuario
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Para utilizar Desglose Pro, debes crear una cuenta. Eres responsable de:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Mantener la confidencialidad de tu contraseña.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Todas las actividades realizadas bajo tu cuenta.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Notificarnos inmediatamente sobre cualquier uso no autorizado.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Proporcionar información precisa y actualizada al registrarte.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                4. Uso Aceptable
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Al utilizar Desglose Pro, te comprometes a no:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Utilizar el servicio para fines ilegales o no autorizados.
                </li>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Intentar acceder a cuentas de otros usuarios sin autorización.
                </li>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Interferir con el funcionamiento del servicio.
                </li>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Compartir tu cuenta con personas no autorizadas.
                </li>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Utilizar el servicio para acosar, difamar o dañar a otros usuarios.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                5. Propiedad Intelectual
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Desglose Pro y todo su contenido, incluyendo pero no limitado a software, diseños, 
                algoritmos, textos, gráficos y logos, son propiedad de <strong>Desglose Pro</strong> 
                y están protegidos por leyes de derechos de autor y propiedad intelectual.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                No está permitido:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Copiar, modificar o distribuir el software sin autorización.
                </li>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Realizar ingeniería inversa del software.
                </li>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Utilizar el contenido para fines comerciales sin licencia.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                6. Limitación de Responsabilidad
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Desglose Pro se proporciona <strong>"tal cual"</strong> y <strong>"según disponibilidad"</strong>. 
                No garantizamos que el servicio sea ininterrumpido, seguro o libre de errores.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                En ningún caso seremos responsables por:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-dash-circle me-1" style={{ color: 'var(--warning)' }}></i>
                  Pérdidas de datos o daños indirectos.
                </li>
                <li>
                  <i className="bi bi-dash-circle me-1" style={{ color: 'var(--warning)' }}></i>
                  Errores en los cálculos realizados por el software.
                </li>
                <li>
                  <i className="bi bi-dash-circle me-1" style={{ color: 'var(--warning)' }}></i>
                  Interrupciones del servicio por mantenimiento o problemas técnicos.
                </li>
                <li>
                  <i className="bi bi-dash-circle me-1" style={{ color: 'var(--warning)' }}></i>
                  Daños derivados del uso de la información proporcionada.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                7. Suspensión y Terminación
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Desglose Pro se reserva el derecho de suspender o terminar tu cuenta si:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-exclamation-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Violas estos Términos de Servicio.
                </li>
                <li>
                  <i className="bi bi-exclamation-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Tu cuenta permanece inactiva por un período prolongado.
                </li>
                <li>
                  <i className="bi bi-exclamation-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  Así lo requiere la ley o una autoridad competente.
                </li>
              </ul>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                Puedes cancelar tu cuenta en cualquier momento contactándonos.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                8. Modificaciones
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. 
                Te notificaremos sobre cambios importantes a través de tu correo electrónico o mediante 
                un aviso en la plataforma.
              </p>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)', marginTop: '0.5rem' }}>
                <i className="bi bi-clock me-1" style={{ color: 'var(--gray-500)' }}></i>
                Fecha de la última revisión: 10 de julio de 2026
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                9. Contacto
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Si tienes preguntas sobre estos Términos de Servicio, contáctanos:
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