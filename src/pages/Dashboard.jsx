import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { userData, isActive, isAdmin } = useAuth()

  const systems = [
    { name: 'VENTANA P-92', icon: '🪟', color: '#1a56db', path: '/p92', nuevo: false },
    { name: 'VENTANA P-65', icon: '🪟', color: '#1a56db', path: '/p65', nuevo: false },
    { name: 'VENTANA TRADICIONAL', icon: '🪟', color: '#1a56db', path: '/tradicional', nuevo: false },
    { name: 'VENTANA PROYECTADA P-40', icon: '🪟', color: '#1a56db', path: '/proyectada-p40', nuevo: true },
    { name: 'PUERTA COMERCIAL', icon: '🚪', color: '#1a56db', path: '/puerta-comercial', nuevo: false }
  ]

  return (
    <Container className="py-4">
      {/* Welcome Card */}
      <div className="card-modern p-4 mb-4">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h1 className="h3 mb-2" style={{ color: 'var(--gray-900)' }}>
              👋 Hola, {userData?.nombre || 'Usuario'}
            </h1>
            <p className="text-muted mb-0">
              {isActive 
                ? '✅ Tu cuenta está activa. Puedes usar todos los sistemas' 
                : '🔒 Tu cuenta está pendiente de activación'}
            </p>
          </div>
          {!isActive && (
            <span className="badge-professional badge-inactive">Pendiente</span>
          )}
          {isActive && (
            <span className="badge-professional badge-active">Activo</span>
          )}
        </div>
      </div>
      
      {!isActive && (
        <div className="card-modern p-4 mb-4 text-center" style={{ borderLeft: `4px solid var(--warning)` }}>
          <p className="text-muted mb-0">
            Tu cuenta aún no ha sido activada. Contacta al administrador para poder utilizar el sistema.
          </p>
        </div>
      )}
      
      <Row>
        <Col lg={8}>
          <h5 className="mb-3" style={{ color: 'var(--gray-700)' }}>📐 Sistemas Disponibles</h5>
          <div className="product-grid">
            {systems.map((sys, idx) => (
              <Link to={sys.path} key={idx} className="product-card">
                {sys.nuevo && (
                  <div className="badge-professional" style={{ 
                    position: 'absolute', 
                    top: '0.75rem', 
                    right: '0.75rem',
                    background: '#fef3c7',
                    color: '#b45309',
                    fontSize: '0.65rem'
                  }}>
                    Nuevo
                  </div>
                )}
                <div className="product-icon">{sys.icon}</div>
                <div className="product-title">{sys.name}</div>
                <div className="product-desc">Usar sistema</div>
              </Link>
            ))}
          </div>
        </Col>
        
        <Col lg={4}>
          <div className="card-modern p-4">
            <h6 className="text-muted mb-3">ℹ️ Información</h6>
            <div className="mb-2">
              <small className="text-muted">Estado</small>
              <p className="mb-0 fw-medium">{isActive ? 'Activo' : 'Bloqueado'}</p>
            </div>
            <div className="mb-2">
              <small className="text-muted">Rol</small>
              <p className="mb-0 fw-medium">{isAdmin ? 'Administrador' : 'Usuario'}</p>
            </div>
            <div className="mb-2">
              <small className="text-muted">Email</small>
              <p className="mb-0 fw-medium">{userData?.email}</p>
            </div>
            <hr />
            <small className="text-muted">
              {isActive 
                ? 'Todos los sistemas están disponibles' 
                : 'Necesitas activación para usar el sistema'}
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard