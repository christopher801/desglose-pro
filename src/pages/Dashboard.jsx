import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const systems = [
  {
    name: "Ventanas P-92",
    icon: "bi-window",
    path: "/desglose/p92",
    locked: false,
  },
  {
    name: "Ventanas P-65",
    icon: "bi-window",
    path: "/desglose/p65",
    locked: false,
  },
  {
    name: "Ventanas Tradicional",
    icon: "bi-window",
    path: "/desglose/tradicional",
    locked: false,
  },
  {
    name: "Ventanas E-70",
    path: "/desglose/e70",
    icon: "bi-window",
    locked: true,
  },
  {
    name: "Ventanas Proyectadas P-40",
    icon: "bi-window",
    path: "/desglose/p40",
    locked: true,
  },
  {
    name: "Puerta Comercial",
    icon: "bi-door-open",
    path: "/desglose/puerta",
    locked: true,
  },
  {
    name: "Puerta Abisagrada P40",
    icon: "bi-door-open",
    path: "/desglose/puertap40",
    locked: true,
  },

  {
    name: "Croquis",
    icon: "bi-square-half",
    path: "/glass-optimizer",
    locked: false,
  },
];

const summaryData = [];

const recentDesgloses = [];

export default function Dashboard() {
  const { userData, isActive, isAdmin, fullAccess } = useAuth();
  const [showPremium, setShowPremium] = useState(false);

  const hasAccess = isAdmin || fullAccess;

  const WHATSAPP_NUMBER = "18494850059";
  const WHATSAPP_MSG = encodeURIComponent(
    `Hola, soy ${userData?.nombre || "un usuario"} y me gustaría obtener Full Access en Desglose Pro para acceder a todos los sistemas de cálculo.`,
  );

  return (
    <Layout>
      <div className="page-content">
        {!isActive && (
          <div className="alert-warning mb-4">
            Tu cuenta aún no ha sido activada. Contacta al administrador.
          </div>
        )}

        {isActive && (
          <>
            <h2 className="section-title">Crear proyecto</h2>
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
                    </div>
                  );
                }

                return (
                  <Link to={sys.path} key={idx} className="product-card">
                    <i className={`bi ${sys.icon} product-icon`}></i>
                    <div className="product-title">{sys.name}</div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div className="summary-grid">
          {summaryData.map((item, index) => (
            <div className="summary-card" key={index}>
              <div className="summary-label">{item.label}</div>

              <div
                className={`summary-value ${item.positive ? "positive" : ""}`}
              >
                {item.value}
              </div>

              <div className="summary-footer">{item.footer}</div>
            </div>
          ))}
        </div>

        <div className="bottom-grid">
          <div className="panel">
            {/* Panel Header */}
            {/* <div className="panel-header">
              <div className="panel-title">Desgloses recientes</div>

              <button className="panel-link">
                Ver todos <i className="bi bi-arrow-right"></i>
              </button>
            </div>  */}

            {/* Panel Body */}
            <div className="panel-body">
              {recentDesgloses.map((item, index) => (
                <div className="recent-item" key={index}>
                  {/* Icon */}
                  <div className="recent-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </div>

                  {/* Information */}
                  <div className="recent-info">
                    <div className="recent-name">{item.name}</div>

                    <div className="recent-meta">{item.meta}</div>
                  </div>

                  {/* Type */}
                  <span className="recent-type">{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card-modern mt-4">
          <h3 className="info-card-title">Información de cuenta</h3>
          <div className="info-row">
            <span className="info-label">Estado</span>
            <span
              className={`badge ${isActive ? "badge-active" : "badge-inactive"}`}
            >
              {isActive ? "Activo" : "Bloqueado"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Rol</span>
            <span className="info-value">
              {isAdmin ? "Administrador" : "Usuario"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Acceso</span>
            <span
              className={`badge ${hasAccess ? "badge-admin" : "badge-user"}`}
            >
              {hasAccess ? "Full Access" : "Normal"}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{userData?.email}</span>
          </div>
        </div>
      </div>

      {/* Modal Premium */}
      {showPremium && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
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
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "380px",
              width: "100%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}
            >
              <i
                className="bi bi-star-fill"
                style={{ fontSize: "1.5rem", color: "#f59e0b" }}
              ></i>
            </div>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Producto Premium
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--gray-500)",
                marginBottom: "1.5rem",
                lineHeight: 1.6,
              }}
            >
              Este sistema requiere <strong>Full Access</strong>. Contacta al
              administrador para obtener acceso completo a todos los módulos de
              cálculo.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                width: "100%",
                padding: "12px",
                background: "#25D366",
                color: "white",
                borderRadius: "10px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              <i className="bi bi-whatsapp"></i>
              Solicitar Full Access
            </a>
            <button
              onClick={() => setShowPremium(false)}
              style={{
                width: "100%",
                padding: "10px",
                background: "transparent",
                border: "1px solid var(--gray-300)",
                borderRadius: "10px",
                fontSize: "13px",
                color: "var(--gray-600)",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
