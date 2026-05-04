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
      background: 'linear-gradient(145deg, #4a0e78, #2e1065)',
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
        boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.3)',
        border: '1px solid #a855f7'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🪟</div>
        <h2 style={{ color: '#4a0e78', marginBottom: '10px' }}>DESGLOSE PRO</h2>
        <p style={{ color: '#6b21a5', marginBottom: '20px' }}>Sistema profesional de cálculo</p>
        <Spinner animation="border" style={{ color: '#8b5cf6' }} />
        <p style={{ color: '#8b5cf6', marginTop: '20px', fontSize: '12px' }}>Cargando...</p>
      </div>
    </div>
  )
}

export default LoadingScreen