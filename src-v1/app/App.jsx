import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import ProtectedRoute from '../components/ProtectedRoute'
import LoadingScreen from '../components/LoadingScreen'
import InstallButton from '../components/InstallButton'
import Welcome from '../pages/Welcome'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Admin from '../pages/Admin'

// Import pages V3
import P92 from '../pages/P92'
import P65 from '../pages/P65'
import Tradicional from '../pages/Tradicional'
import ProyectadaP40 from '../pages/ProyectadaP40'
import PuertaComercial from '../pages/PuertaComercial'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Navbar />
      <Container fluid className="px-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          
          {/* System routes V3 */}
          <Route path="/p92" element={
            <ProtectedRoute>
              <P92 />
            </ProtectedRoute>
          } />
          <Route path="/p65" element={
            <ProtectedRoute>
              <P65 />
            </ProtectedRoute>
          } />
          <Route path="/tradicional" element={
            <ProtectedRoute>
              <Tradicional />
            </ProtectedRoute>
          } />
          <Route path="/proyectada-p40" element={
            <ProtectedRoute>
              <ProyectadaP40 />
            </ProtectedRoute>
          } />
          <Route path="/puerta-comercial" element={
            <ProtectedRoute>
              <PuertaComercial />
            </ProtectedRoute>
          } />
        </Routes>
      </Container>
      <InstallButton />
    </>
  )
}

export default App