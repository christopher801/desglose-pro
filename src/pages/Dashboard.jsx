import React from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { userData, isActive, isAdmin } = useAuth()

  const systems = [
    { name: 'VENTANA P-92', icon: '🪟', color: '#8b5cf6', path: '/p92', nuevo: false },
    { name: 'VENTANA P-65', icon: '🪟', color: '#8b5cf6', path: '/p65', nuevo: false },
    { name: 'VENTANA TRADICIONAL', icon: '🪟', color: '#8b5cf6', path: '/tradicional', nuevo: false },
    { name: 'VENTANA PROYECTADA P-40', icon: '🪟', color: '#a855f7', path: '/proyectada-p40', nuevo: true },
    { name: 'PUERTA COMERCIAL', icon: '🚪', color: '#8b5cf6', path: '/puerta-comercial', nuevo: false }
  ]

  return (
    <Container className="py-4" style={{
      background: 'linear-gradient(145deg, #4a0e78, #2e1065)',
      minHeight: '100vh',
      borderRadius: '0'
    }}>
      {/* Welcome Card with background */}
      <Card className="card-modern mb-4" style={{ 
        background: 'linear-gradient(135deg, #5b21b6, #4a0e78)',
        border: '1px solid #a855f7',
        boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.3)'
      }}>
        <Card.Body>
          <h1 style={{ color: '#fef3c7', marginBottom: '10px' }}>👋 Hola, {userData?.nombre || 'Usuario'}</h1>
          <p style={{ color: '#e9d5ff', marginBottom: '0' }}>
            {isActive 
              ? '✅ Tu cuenta está activa. ¡Puedes usar todos los sistemas!' 
              : '🔒 Tu cuenta está pendiente de activación. Contacta al administrador.'}
          </p>
        </Card.Body>
      </Card>
      
      {!isActive && (
        <Card className="card-modern mb-4" style={{ border: '1px solid #a855f7', background: '#fef3c7' }}>
          <Card.Body className="text-center">
            <div style={{ fontSize: '48px' }}>🔒</div>
            <h5 className="mb-3" style={{ color: '#4a0e78' }}>Cuenta Bloqueada</h5>
            <p style={{ color: '#6b21a5' }}>
              Tu cuenta aún no ha sido activada. Por favor espera a que el administrador 
              active tu cuenta para poder utilizar el sistema de cálculos.
            </p>
          </Card.Body>
        </Card>
      )}
      
      <Row>
        <Col md={8}>
          <h3 style={{ color: '#fef3c7', marginBottom: '20px' }}>📐 Sistemas Disponibles</h3>
          <Row>
            {systems.map((sys, idx) => (
              <Col md={6} lg={3} key={idx} className="mb-3">
                <Card className="card-modern text-center h-100" style={{ 
                  position: 'relative',
                  background: 'white',
                  border: '1px solid #a855f7',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.2)'
                }}>
                  {sys.nuevo && (
                    <Badge 
                      bg="warning" 
                      style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px',
                        borderRadius: '20px',
                        padding: '5px 10px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        background: '#fef3c7',
                        color: '#4a0e78',
                        border: '1px solid #a855f7',
                        zIndex: 1
                      }}
                    >
                      ⭐ NUEVO
                    </Badge>
                  )}
                  <Card.Body>
                    <div style={{ fontSize: '48px' }}>{sys.icon}</div>
                    <h6 className="mt-2" style={{ color: '#4a0e78' }}>{sys.name}</h6>
                    {isActive ? (
                      <Button 
                        as={Link} 
                        to={sys.path}
                        variant="primary" 
                        size="sm" 
                        className="mt-2"
                        style={{ 
                          background: sys.color, 
                          border: 'none',
                          borderRadius: '50px',
                          padding: '8px 16px',
                          fontWeight: '600'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#a855f7'}
                        onMouseLeave={(e) => e.target.style.background = sys.color}
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
          <Card className="card-modern" style={{
            border: '1px solid #a855f7',
            background: 'white'
          }}>
            <Card.Body>
              <h5 className="mb-3" style={{ color: '#4a0e78' }}>ℹ️ Información</h5>
              <hr style={{ borderColor: '#a855f7' }} />
              <p><strong style={{ color: '#4a0e78' }}>Estado:</strong> <span style={{ color: '#6b21a5' }}>{isActive ? '✅ Activo' : '🔒 Bloqueado'}</span></p>
              <p><strong style={{ color: '#4a0e78' }}>Rol:</strong> <span style={{ color: '#6b21a5' }}>{isAdmin ? 'Administrador' : 'Usuario'}</span></p>
              <p><strong style={{ color: '#4a0e78' }}>Email:</strong> <span style={{ color: '#6b21a5' }}>{userData?.email}</span></p>
              <hr style={{ borderColor: '#a855f7' }} />
              <small style={{ color: '#8b5cf6' }}>
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