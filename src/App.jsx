import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FinanceProvider } from './context/FinanceContext'
import AppRoutes from './Routes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FinanceProvider>
          <AppRoutes />
        </FinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}