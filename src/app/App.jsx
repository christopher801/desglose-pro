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
import Calculator from '../pages/Calculator'
import Admin from '../pages/Admin'

function App() {
  const { loading } = useAuth()

  // Pandan k ap chaje, montre loading screen
  if (loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Navbar />
      <Container fluid className="px-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/calculator" element={
            <ProtectedRoute>
              <Calculator />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Routes>
      </Container>
      <InstallButton />
    </>
  )
}

export default App