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
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="card-modern" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="mb-2">📝 DESGLOSE PRO</h2>
            <p className="text-muted">Crea tu cuenta profesional</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                placeholder="Tu nombre"
              />
            </Form.Group>
            
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
            
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="•••••••• (mínimo 6 caracteres)"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>
          
          <div className="text-center mt-3 small text-muted">
            <p>⚠️ Después de registrarte, tu cuenta será activada por el administrador.</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Register