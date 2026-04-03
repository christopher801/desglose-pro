import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { userData, isActive, isAdmin } = useAuth()

  const systems = [
    { name: 'VENTANA P-92', icon: '🪟', color: '#1e3b5c', path: '/calculator?system=p92' },
    { name: 'VENTANA P-65', icon: '🪟', color: '#2c5a7a', path: '/calculator?system=p65' },
    { name: 'VENTANA TRADICIONAL', icon: '🪟', color: '#3a6e8c', path: '/calculator?system=tradicional' },
    { name: 'PUERTA COMERCIAL', icon: '🚪', color: '#4a7c9e', path: '/calculator?system=puerta' }
  ]

  return (
    <Container className="py-4">
      {/* Welcome Card with background */}
      <Card className="card-modern mb-4" style={{ background: 'linear-gradient(135deg, #1e2b3c 0%, #2c3e50 100%)', border: 'none' }}>
        <Card.Body>
          <h1 style={{ color: 'white', marginBottom: '10px' }}>👋 Hola, {userData?.nombre || 'Usuario'}</h1>
          <p style={{ color: '#cbd5e1', marginBottom: '0' }}>
            {isActive 
              ? '✅ Tu cuenta está activa. ¡Puedes usar todos los sistemas!' 
              : '🔒 Tu cuenta está pendiente de activación. Contacta al administrador.'}
          </p>
        </Card.Body>
      </Card>
      
      {!isActive && (
        <Card className="card-modern mb-4 border-warning">
          <Card.Body className="text-center">
            <div style={{ fontSize: '48px' }}>🔒</div>
            <h5 className="mb-3">Cuenta Bloqueada</h5>
            <p className="text-muted">
              Tu cuenta aún no ha sido activada. Por favor espera a que el administrador 
              active tu cuenta para poder utilizar el sistema de cálculos.
            </p>
          </Card.Body>
        </Card>
      )}
      
      <Row>
        <Col md={8}>
          <h3 style={{ color: '#1e2b3c', marginBottom: '20px' }}>📐 Sistemas Disponibles</h3>
          <Row>
            {systems.map((sys, idx) => (
              <Col md={6} lg={3} key={idx} className="mb-3">
                <Card className="card-modern text-center h-100">
                  <Card.Body>
                    <div style={{ fontSize: '48px' }}>{sys.icon}</div>
                    <h6 className="mt-2">{sys.name}</h6>
                    {isActive ? (
                      <Button 
                        as={Link} 
                        to={sys.path}
                        variant="primary" 
                        size="sm" 
                        className="mt-2"
                        style={{ background: sys.color, border: 'none' }}
                      >
                        Usar
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" className="mt-2" disabled>
                        🔒 Bloqueado
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        
        <Col md={4}>
          <Card className="card-modern">
            <Card.Body>
              <h5 className="mb-3">ℹ️ Información</h5>
              <hr />
              <p><strong>Estado:</strong> {isActive ? '✅ Activo' : '🔒 Bloqueado'}</p>
              <p><strong>Rol:</strong> {isAdmin ? 'Administrador' : 'Usuario'}</p>
              <p><strong>Email:</strong> {userData?.email}</p>
              <hr />
              <small className="text-muted">
                {isActive 
                  ? 'Puedes usar todos los sistemas de cálculo disponibles.' 
                  : 'Necesitas activación para usar el sistema.'}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard