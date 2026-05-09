import React from 'react'

const LoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--gray-50)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid var(--gray-200)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '1rem'
        }} />
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Cargando...</p>
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  )
}

export default LoadingScreen