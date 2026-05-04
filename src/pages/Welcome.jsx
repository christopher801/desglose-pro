import React, { useEffect } from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Welcome = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isActive } = useAuth()

  useEffect(() => {
    if (isAuthenticated && isActive) {
      navigate('/dashboard')
    } else if (isAuthenticated && !isActive) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, isActive, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #4a0e78, #2e1065)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="card-modern text-center" style={{
              border: '1px solid #a855f7',
              boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.3)'
            }}>
              <Card.Body style={{ padding: '3rem' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🪟</div>
                <h1 style={{ color: '#4a0e78', marginBottom: '10px', fontSize: '2rem' }}>DESGLOSE PRO</h1>
                <h2 style={{ color: '#6b21a5', fontSize: '1rem', fontWeight: '400', marginBottom: '30px' }}>
                  Sistema profesional para el desglose de puertas y ventanas
                </h2>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '30px' }}>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/login')}
                    style={{
                      background: '#8b5cf6',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '50px',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#a855f7'}
                    onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/register')}
                    style={{
                      border: '2px solid #8b5cf6',
                      color: '#8b5cf6',
                      padding: '12px 30px',
                      borderRadius: '50px',
                      fontWeight: '600',
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#8b5cf6'
                      e.target.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent'
                      e.target.style.color = '#8b5cf6'
                    }}
                  >
                    Registrarse
                  </Button>
                </div>
                
                <hr style={{ margin: '20px 0', borderColor: '#a855f7' }} />
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '24px' }}>🪟</div>
                    <small style={{ color: '#6b21a5' }}>Ventanas P-92</small>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '24px' }}>🪟</div>
                    <small style={{ color: '#6b21a5' }}>Ventanas P-65</small>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '24px' }}>🪟</div>
                    <small style={{ color: '#6b21a5' }}>Ventana Tradicional</small>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '24px' }}>🚪</div>
                    <small style={{ color: '#6b21a5' }}>Puerta Comercial</small>
                  </div>
                </div>
                
                <div style={{ marginTop: '30px', fontSize: '12px', color: '#8b5cf6' }}>
                  <p>Desarrollado por Christopher</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Welcome