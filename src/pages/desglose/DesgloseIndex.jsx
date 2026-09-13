import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const WHATSAPP_NUMBER = "18494850059";

const systems = [
  {
    name: "Ventanas P-92",
    path: "/desglose/p92",
    icon: "bi-window",
    locked: false,
  },
  {
    name: "Ventanas P-65",
    path: "/desglose/p65",
    icon: "bi-window",
    locked: false,
  },
  {
    name: "Ventanas Tradicional",
    path: "/desglose/tradicional",
    icon: "bi-window",
    locked: false,
  },
  {
    name: "Ventanas E-70",
    path: "/desglose/e70",
    icon: "bi-window",
    locked: true,
  },
  {
    name: "Ventanas M-100",
    path: "/desglose/m100",
    icon: "bi-window",
    locked: true,
  },
  {
    name: "Ventanas Proyectada P-40",
    path: "/desglose/p40",
    icon: "bi-window-dock",
    locked: true,
  },
  {
    name: "Puerta Comercial",
    path: "/desglose/puerta",
    icon: "bi-door-open",
    locked: true,
  },
  {
    name: "Puerta Abisagrada P40",
    path: "/desglose/puertap40",
    icon: "bi-door-open",
    locked: true,
  },
];

export default function DesgloseIndex() {
  const { fullAccess, isAdmin, userData } = useAuth();
  const [showPremium, setShowPremium] = useState(false);

  const hasAccess = isAdmin || fullAccess;

  const WHATSAPP_MSG = encodeURIComponent(
  `Hola, soy ${userData?.nombre || 'un usuario'} y me gustaría obtener Full Access en Desglose Pro para acceder a todos los sistemas de cálculo.`
)
  return (
    <Layout>
      <div className="page-content">
        <h1 className="section-title">Sistemas de cálculo</h1>

        {!hasAccess && (
          <div className="alert-info mb-4">
            <i className="bi bi-info-circle" style={{ marginRight: "6px" }}></i>
            Algunos sistemas requieren acceso completo. Contacta al
            administrador.
          </div>
        )}

        <div className="product-grid">
          {systems.map((sys, idx) => {
            const isLocked = sys.locked && !hasAccess;

            if (isLocked) {
              return (
                <div
                  key={idx}
                  className="product-card"
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    border: "1.5px dashed var(--gray-300)",
                  }}
                  onClick={() => setShowPremium(true)}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "#fef3c7",
                      borderRadius: "6px",
                      padding: "2px 6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#b45309",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <i
                      className="bi bi-star-fill"
                      style={{ fontSize: "10px" }}
                    ></i>
                    Premium
                  </span>
                  <i
                    className={`bi ${sys.icon} product-icon`}
                    style={{ color: "var(--gray-400)" }}
                  ></i>
                  <div
                    className="product-title"
                    style={{ color: "var(--gray-500)" }}
                  >
                    {sys.name}
                  </div>
                  <div
                    className="product-desc"
                    style={{ color: "var(--gray-400)" }}
                  >
                    {sys.desc}
                  </div>
                </div>
              );
            }

            return (
              <Link to={sys.path} key={idx} className="product-card">
                <i className={`bi ${sys.icon} product-icon`}></i>
                <div className="product-title">{sys.name}</div>
                <div className="product-desc">{sys.desc}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Modal Premium */}
    {showPremium && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.55)",
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}
    onClick={() => setShowPremium(false)}
  >
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "2rem",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Icon */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "16px",
          background: "#eff6ff",
          border: "1px solid #dbeafe",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.25rem",
        }}
      >
        <i
          className="bi bi-gem"
          style={{
            fontSize: "1.7rem",
            color: "#2563eb",
          }}
        ></i>
      </div>

      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 10px",
          borderRadius: "999px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#475569",
          fontSize: "11px",
          fontWeight: 700,
          marginBottom: "0.75rem",
        }}
      >
        <i className="bi bi-lock-fill"></i>
        ACCESO PREMIUM
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: "0.6rem",
        }}
      >
        Desbloquea esta función
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "1.5rem",
          lineHeight: 1.65,
        }}
      >
        Esta función está disponible para usuarios con{" "}
        <strong style={{ color: "#334155" }}>Full Access</strong>.
        Consulta nuestros planes para conocer todas las funcionalidades
        disponibles para tu taller.
      </p>

      {/* Main CTA */}
      <Link
        to="/planes"
        onClick={() => setShowPremium(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          padding: "12px 16px",
          background: "#1e3a8a",
          color: "#ffffff",
          borderRadius: "10px",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 600,
          transition: "all 0.2s ease",
        }}
      >
        Ver planes
        <i className="bi bi-arrow-right"></i>
      </Link>

      {/* Close */}
      <button
        type="button"
        onClick={() => setShowPremium(false)}
        style={{
          width: "100%",
          marginTop: "0.75rem",
          padding: "10px",
          background: "transparent",
          border: "none",
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: 500,
          color: "#64748b",
          cursor: "pointer",
        }}
      >
        Ahora no
      </button>

      {/* Small trust text */}
      <div
        style={{
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid #f1f5f9",
          fontSize: "11px",
          color: "#94a3b8",
        }}
      >
        <i className="bi bi-shield-check me-1"></i>
        Acceso seguro y activación por administrador
      </div>
    </div>
  </div>
)}
    </Layout>
  );
}
