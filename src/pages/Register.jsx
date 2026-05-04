import React, { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'

const Register = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    setLoading(true)
    
    const result = await registerUser(email, password, nombre)
    
    if (result.success) {
      setSuccess('¡Registro exitoso! Espera a que el administrador active tu cuenta.')
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{
      background: 'linear-gradient(145deg, #4a0e78, #2e1065)',
      minHeight: '100vh'
    }}>
      <Card className="card-modern" style={{ 
        width: '100%', 
        maxWidth: '500px',
        border: '1px solid #a855f7',
        boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.3)'
      }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="mb-2" style={{ color: '#4a0e78' }}>📝 DESGLOSE PRO</h2>
            <p style={{ color: '#6b21a5' }}>Crea tu cuenta profesional</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#4a0e78', fontWeight: '600' }}>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Tu nombre"
                style={{
                  border: '1px solid #a855f7',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#4a0e78', fontWeight: '600' }}>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@ejemplo.com"
                style={{
                  border: '1px solid #a855f7',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#4a0e78', fontWeight: '600' }}>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="•••••••• (mínimo 6 caracteres)"
                style={{
                  border: '1px solid #a855f7',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label style={{ color: '#4a0e78', fontWeight: '600' }}>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  border: '1px solid #a855f7',
                  borderRadius: '12px',
                  padding: '12px'
                }}
              />
            </Form.Group>
            
            <Button 
              type="submit" 
              variant="primary" 
              className="w-100"
              disabled={loading}
              style={{
                background: '#8b5cf6',
                border: 'none',
                borderRadius: '50px',
                padding: '12px',
                fontWeight: '600',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => e.target.style.background = '#a855f7'}
              onMouseLeave={(e) => e.target.style.background = '#8b5cf6'}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <Link to="/login" style={{ color: '#8b5cf6', textDecoration: 'none' }}>
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
          
          <div className="text-center mt-3 small" style={{ color: '#6b21a5' }}>
            <p>⚠️ Después de registrarte, tu cuenta será activada por el administrador.</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Register