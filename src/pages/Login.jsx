import React, { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  if (user) {
    navigate('/dashboard')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await loginUser(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="card-modern" style={{ width: '100%', maxWidth: '450px' }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="mb-2">🔑 DESGLOSE PRO</h2>
            <p className="text-muted">Inicia sesión en tu cuenta</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@ejemplo.com"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </Form.Group>
            
            <Button 
              type="submit" 
              variant="primary" 
              className="w-100 btn-primary-custom"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <Link to="/register" className="text-decoration-none">
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login