import React, { useEffect } from 'react'
import { Container, Row, Col, Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Welcome = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isActive } = useAuth()

  useEffect(() => {
    // Si deja konekte, ale nan dashboard
    if (isAuthenticated && isActive) {
      navigate('/dashboard')
    } else if (isAuthenticated && !isActive) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, isActive, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #1e2b3c, #0f1a24)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="card-modern text-center">
              <Card.Body style={{ padding: '3rem' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🪟</div>
                <h1 style={{ color: '#1e2b3c', marginBottom: '10px', fontSize: '2rem' }}>DESGLOSE PRO</h1>
                <h2 style={{ color: '#4a5c6e', fontSize: '1rem', fontWeight: '400', marginBottom: '30px' }}>
                  Sistema profesional par el desblose de puertas y ventanas
                </h2>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '30px' }}>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/login')}
                    style={{
                      background: '#1e3b5c',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '50px',
                      fontWeight: '600'
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/register')}
                    style={{
                      border: '2px solid #1e3b5c',
                      color: '#1e3b5c',
                      padding: '12px 30px',
                      borderRadius: '50px',
                      fontWeight: '600',
                      background: 'transparent'
                    }}
                  >
                    Registrarse
                  </Button>
                </div>
                
                <hr style={{ margin: '20px 0' }} />
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '24px' }}>🪟</div>
                    <small style={{ color: '#64748b' }}>Ventanas P-92</small>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '24px' }}>🪟</div>
                    <small style={{ color: '#64748b' }}>Ventanas P-65</small>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '24px' }}>🪟</div>
                    <small style={{ color: '#64748b' }}>Ventana Tradicional</small>
                  </div>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ fontSize: '24px' }}>🚪</div>
                    <small style={{ color: '#64748b' }}>Puerta Comercial</small>
                  </div>
                </div>
                
                <div style={{ marginTop: '30px', fontSize: '12px', color: '#94a3b8' }}>
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