import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'
import InstallButton from './InstallButton'

const AppNavbar = () => {
  const { user, userData, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  return (
    <Navbar expand="lg" className="mb-4" style={{
      background: 'linear-gradient(135deg, #4a0e78, #2e1065)',
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)'
    }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: '#fef3c7', fontWeight: 'bold' }}>
          🪟 DESGLOSE PRO
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: '#a855f7' }} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" style={{ color: '#e9d5ff' }}>Dashboard</Nav.Link>
                {userData?.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" style={{ color: '#e9d5ff' }}>Admin</Nav.Link>
                )}
                <Nav.Link style={{ color: '#a855f7', fontWeight: 'bold' }}>
                  👤 {userData?.nombre || user?.email}
                </Nav.Link>
                <InstallButton />
                <Button 
                  size="sm" 
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: '1px solid #a855f7',
                    color: '#a855f7',
                    borderRadius: '50px',
                    padding: '5px 15px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#a855f7'
                    e.target.style.color = '#fef3c7'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent'
                    e.target.style.color = '#a855f7'
                  }}
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{ color: '#e9d5ff' }}>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" style={{ color: '#e9d5ff' }}>Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar