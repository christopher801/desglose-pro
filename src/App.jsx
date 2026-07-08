import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FinanceProvider } from './context/FinanceContext'  // 👈 NUEVO
import { ProtectedRoute, AdminRoute, AuthRoute } from './components/ProtectedRoute'

// Pages
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PendingPage from './pages/PendingPage'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import AboutPage from './pages/AboutPage'
import GlassOptimizer from './pages/GlassOptimizer'
import Finanzas from './pages/Finanzas'  // 👈 NUEVO

// Desglose
import DesgloseIndex from './pages/desglose/DesgloseIndex'
import P92 from './pages/desglose/P92'
import P65 from './pages/desglose/P65'
import Tradicional from './pages/desglose/Tradicional'
import P40 from './pages/desglose/P40'
import PuertaComercial from './pages/desglose/PuertaComercial'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 👇 FinanceProvider envuelve TODAS las rutas protegidas */}
        <FinanceProvider>
          <Routes>
            {/* Paj piblik (sin FinanceProvider) */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Paj pou user ki louvri men poko aktive */}
            <Route path="/pending" element={
              <AuthRoute><PendingPage /></AuthRoute>
            } />

            {/* ===== RUTAS PROTEGIDAS (con FinanceProvider) ===== */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute><AboutPage /></ProtectedRoute>
            } />
            <Route path="/glass-optimizer" element={
              <ProtectedRoute><GlassOptimizer /></ProtectedRoute>
            } />

            {/* FINANZAS — NUEVA RUTA */}
            <Route path="/finanzas" element={
              <ProtectedRoute><Finanzas /></ProtectedRoute>
            } />

            {/* Sistèm desglose */}
            <Route path="/desglose" element={
              <ProtectedRoute><DesgloseIndex /></ProtectedRoute>
            } />
            <Route path="/desglose/p92" element={
              <ProtectedRoute><P92 /></ProtectedRoute>
            } />
            <Route path="/desglose/p65" element={
              <ProtectedRoute><P65 /></ProtectedRoute>
            } />
            <Route path="/desglose/tradicional" element={
              <ProtectedRoute><Tradicional /></ProtectedRoute>
            } />
            <Route path="/desglose/p40" element={
              <ProtectedRoute><P40 /></ProtectedRoute>
            } />
            <Route path="/desglose/puerta" element={
              <ProtectedRoute><PuertaComercial /></ProtectedRoute>
            } />

            {/* Admin sèlman */}
            <Route path="/admin" element={
              <AdminRoute><AdminPage /></AdminRoute>
            } />

            {/* Redirect pou rout enkoni */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}