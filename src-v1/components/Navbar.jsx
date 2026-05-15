import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'
import InstallButton from './InstallButton'
import NotificationBell from './NotificationBell'

const AppNavbar = () => {
  const { user, userData, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutUser()
    navigate('/login')
  }

  return (
    <Navbar className="navbar-professional" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          <span style={{ color: 'var(--primary)' }}>DESGLOSE</span>
          <span style={{ color: 'var(--gray-600)' }}> PRO</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="text-gray-600">Dashboard</Nav.Link>
                {userData?.role === 'admin' && (
                  <Nav.Link as={Link} to="/admin" className="text-gray-600">Admin</Nav.Link>
                )}
                
                {/* Notification bell pou admin sèlman */}
                {userData?.role === 'admin' && <NotificationBell />}
                
                <InstallButton />
                
                <Nav.Link className="text-gray-400">
                  {userData?.nombre || user?.email}
                </Nav.Link>
                
                <Button 
                  variant="link" 
                  onClick={handleLogout}
                  className="text-gray-500 text-decoration-none"
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-gray-600">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-gray-600">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar