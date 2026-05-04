import React from 'react'
import { Spinner } from 'react-bootstrap'

const LoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(145deg, #1e2b3c, #0f1a24)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        textAlign: 'center',
        background: 'rgba(255,255,255,0.95)',
        padding: '3rem 4rem',
        borderRadius: '32px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🪟</div>
        <h2 style={{ color: '#1e2b3c', marginBottom: '10px' }}>DESGLOSE PRO</h2>
        <p style={{ color: '#4a5c6e', marginBottom: '20px' }}>Sistema profesional de cálculo</p>
        <Spinner animation="border" variant="primary" style={{ color: '#1e3b5c' }} />
        <p style={{ color: '#64748b', marginTop: '20px', fontSize: '12px' }}>Cargando...</p>
      </div>
    </div>
  )
}

export default LoadingScreen