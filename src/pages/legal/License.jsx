import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function License() {
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
              <i className="bi bi-file-earmark-check me-2"></i>
              Licencia de Uso
            </h1>
          </div>

          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
            Última actualización: 10 de julio de 2026
          </p>

          <div className="legal-content">
            
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                1. Licencia de Uso
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                <strong>Desglose Pro</strong> es un software propietario. Al utilizar este software, 
                aceptas los términos de esta licencia.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                2. Concesión de Licencia
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Se te concede una licencia limitada, no exclusiva, intransferible y revocable para 
                utilizar Desglose Pro para tus operaciones comerciales o personales, sujeta a los 
                siguientes términos:
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Puedes utilizar el software en dispositivos autorizados.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Puedes realizar copias de seguridad del software.
                </li>
                <li>
                  <i className="bi bi-check-circle me-1" style={{ color: 'var(--success)' }}></i>
                  Puedes instalar el software en múltiples dispositivos bajo una misma cuenta.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                3. Restricciones
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                <strong>No está permitido:</strong>
              </p>
              <ul style={{ lineHeight: '2', color: 'var(--gray-600)', paddingLeft: '1.5rem' }}>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  <strong>Copiar o distribuir:</strong> No puedes copiar, distribuir, alquilar, vender 
                  o sublicenciar el software sin autorización expresa.
                </li>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  <strong>Ingeniería inversa:</strong> No puedes realizar ingeniería inversa, descompilar 
                  o desensamblar el software.
                </li>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  <strong>Eliminación de avisos:</strong> No puedes eliminar, alterar u ocultar avisos 
                  de derechos de autor o marcas comerciales.
                </li>
                <li>
                  <i className="bi bi-x-circle me-1" style={{ color: 'var(--danger)' }}></i>
                  <strong>Uso ilegal:</strong> No puedes utilizar el software para fines ilegales o 
                  no autorizados.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                4. Propiedad
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Desglose Pro y todos los derechos de propiedad intelectual asociados son propiedad 
                exclusiva de <strong>Desglose Pro</strong>. Esta licencia no te transfiere ningún 
                derecho de propiedad.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                5. Garantía y Responsabilidad
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                El software se proporciona <strong>"tal cual"</strong>, sin garantías de ningún tipo, 
                expresas o implícitas. En ningún caso los desarrolladores serán responsables por daños 
                directos, indirectos, incidentales o consecuentes derivados del uso del software.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                6. Duración y Terminación
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Esta licencia es efectiva hasta su terminación. Puedes terminarla destruyendo todas las 
                copias del software. Si violas cualquiera de estas restricciones, esta licencia terminará 
                automáticamente.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                7. Cambios en la Licencia
              </h2>
              <p style={{ lineHeight: '1.8', color: 'var(--gray-600)' }}>
                Nos reservamos el derecho de modificar esta licencia en cualquier momento. Los cambios 
                serán efectivos inmediatamente después de su publicación en la plataforma.
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