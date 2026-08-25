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
