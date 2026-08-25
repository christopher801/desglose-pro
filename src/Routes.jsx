import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  ProtectedRoute,
  AdminRoute,
  AuthRoute,
  FullAccessRoute,
} from "./components/ProtectedRoute";
import InstallBaner from "./components/InstallBaner";

// Pages
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PendingPage from "./pages/PendingPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import GlassOptimizer from "./pages/GlassOptimizer";

// Desglose
import DesgloseIndex from "./pages/desglose/DesgloseIndex";
import P92 from "./pages/desglose/P92";
import P65 from "./pages/desglose/P65";
import Tradicional from "./pages/desglose/Tradicional";
import E70 from "./pages/desglose/E70";
import P40 from "./pages/desglose/P40";
import PuertaComercial from "./pages/desglose/PuertaComercial";
import PuertaP40 from "./pages/desglose/PuertaP40";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        {/* ===== ROUT PIBLIK ===== */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ===== ROUT POU USER POKO AKTIVE ===== */}
        <Route
          path="/pending"
          element={
            <AuthRoute>
              <PendingPage />
            </AuthRoute>
          }
        />

        {/* ===== ROUT PWOTEJE ===== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        
        <Route
          path="/glass-optimizer"
          element={
            <ProtectedRoute>
              <GlassOptimizer />
            </ProtectedRoute>
          }
        />

        {/* ===== DESGLOSE ===== */}
        <Route
          path="/desglose"
          element={
            <ProtectedRoute>
              <DesgloseIndex />
            </ProtectedRoute>
          }
        />
        <Route
          path="/desglose/p92"
          element={
            <ProtectedRoute>
              <P92 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/desglose/p65"
          element={
            <ProtectedRoute>
              <P65 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/desglose/tradicional"
          element={
            <ProtectedRoute>
              <Tradicional />
            </ProtectedRoute>
          }
        />
        <Route
          path="/desglose/p40"
          element={
            <FullAccessRoute>
              <P40 />
            </FullAccessRoute>
          }
        />
        <Route
          path="/desglose/e70"
          element={
            <FullAccessRoute>
              <E70 />
            </FullAccessRoute>
          }
        />
        <Route
          path="/desglose/puerta"
          element={
            <FullAccessRoute>
              <PuertaComercial />
            </FullAccessRoute>
          }
        />
        <Route
          path="/desglose/puertap40"
          element={
            <FullAccessRoute>
              <PuertaP40 />
            </FullAccessRoute>
          }
        />

        {/* ===== ADMIN ===== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* ===== REDIRECT SI WOUT ENKONI ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <InstallBaner />
    </>
  );
}
