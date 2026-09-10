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
import CroquisBarrasPage from "./pages/CroquisBarrasPage";
import Historial from "./pages/HistorialPage";

// Desglose
import DesgloseIndex from "./pages/desglose/DesgloseIndex";
import P92 from "./pages/desglose/P92";
import P65 from "./pages/desglose/P65";
import Tradicional from "./pages/desglose/Tradicional";
import E70 from "./pages/desglose/E70";
import P40 from "./pages/desglose/P40";
import PuertaComercial from "./pages/desglose/PuertaComercial";
import PuertaP40 from "./pages/desglose/PuertaP40";

// Materiales
import MaterialP92 from "./pages/desglose/components/MaterialP92";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        {/* =========================================
            ROUTES PUBLIC
        ========================================= */}
        <Route path="/" element={<WelcomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        {/* =========================================
            ROUTE POUR USER NON ENCORE ACTIVÉ
        ========================================= */}
        <Route
          path="/pending"
          element={
            <AuthRoute>
              <PendingPage />
            </AuthRoute>
          }
        />

        {/* =========================================
            ROUTES PROTÉGÉES
        ========================================= */}

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Profil */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Croquis / Glass Optimizer */}
        <Route
          path="/glass-optimizer"
          element={
            <ProtectedRoute>
              <GlassOptimizer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/croquis-barras"
          element={
            <ProtectedRoute>
              <CroquisBarrasPage />
            </ProtectedRoute>
          }
        />

        {/* Historial */}
        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <Historial />
            </ProtectedRoute>
          }
        />

        {/* =========================================
            DESGLOSE
        ========================================= */}

        {/* Página principal de Desglose */}
        <Route
          path="/desglose"
          element={
            <ProtectedRoute>
              <DesgloseIndex />
            </ProtectedRoute>
          }
        />

        {/* -----------------------------------------
            P-92
        ----------------------------------------- */}

        <Route
          path="/desglose/p92"
          element={
            <ProtectedRoute>
              <P92 />
            </ProtectedRoute>
          }
        />

        {/* Materiales P-92 */}
        <Route
          path="/desglose/material-p92"
          element={
            <ProtectedRoute>
              <MaterialP92 />
            </ProtectedRoute>
          }
        />

        {/* -----------------------------------------
            P-65
        ----------------------------------------- */}

        <Route
          path="/desglose/p65"
          element={
            <ProtectedRoute>
              <P65 />
            </ProtectedRoute>
          }
        />

        {/* -----------------------------------------
            TRADICIONAL
        ----------------------------------------- */}

        <Route
          path="/desglose/tradicional"
          element={
            <ProtectedRoute>
              <Tradicional />
            </ProtectedRoute>
          }
        />

        {/* -----------------------------------------
            P-40
        ----------------------------------------- */}

        <Route
          path="/desglose/p40"
          element={
            <FullAccessRoute>
              <P40 />
            </FullAccessRoute>
          }
        />

        {/* -----------------------------------------
            E-70
        ----------------------------------------- */}

        <Route
          path="/desglose/e70"
          element={
            <FullAccessRoute>
              <E70 />
            </FullAccessRoute>
          }
        />

        {/* -----------------------------------------
            PUERTA COMERCIAL
        ----------------------------------------- */}

        <Route
          path="/desglose/puerta"
          element={
            <FullAccessRoute>
              <PuertaComercial />
            </FullAccessRoute>
          }
        />

        {/* -----------------------------------------
            PUERTA P-40
        ----------------------------------------- */}

        <Route
          path="/desglose/puertap40"
          element={
            <FullAccessRoute>
              <PuertaP40 />
            </FullAccessRoute>
          }
        />

        {/* =========================================
            ADMIN
        ========================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* =========================================
            ROUTE 404
        ========================================= */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* PWA Install Banner */}
      <InstallBaner />
    </>
  );
}
