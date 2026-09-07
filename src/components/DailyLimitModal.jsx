import React from 'react'

export default function DailyLimitModal({ onClose, onVerPlanes }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '18px',
          padding: '2rem',
          maxWidth: '360px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,.2)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Ikon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: '#fff7ed',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <i className="bi bi-clock-history" style={{ fontSize: '1.75rem', color: '#f97316' }}></i>
        </div>

        {/* Titre */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
          Límite diario alcanzado
        </h3>

        {/* Mesaj */}
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Has usado tus <strong>5 desgloses gratuitos</strong> de hoy.<br />
          Vuelve mañana o activa <strong>Full Access</strong> para desgloses ilimitados.
        </p>

        {/* Bouton Entendido */}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px', marginBottom: '0.75rem',
            background: 'var(--primary, #1e3a8a)', color: 'white',
            border: 'none', borderRadius: '10px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          Entendido
        </button>

        {/* Bouton Ver planes */}
        
      </div>
    </div>
  )
}
