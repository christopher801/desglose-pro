import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { getHistorial } from "../services/historialService";

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

const SYSTEM_ICONS = {
  "Ventana P-92": "bi-window",
  "Ventana P-65": "bi-window",
  "Ventana Tradicional": "bi-window",
  "Ventana E-70": "bi-window",
  "Ventana P-40 Proyectada": "bi-window",
  "Puerta Comercial": "bi-door-open",
  "Puerta P40": "bi-door-open",
};

const getSystemIcon = (sistema) => {
  return SYSTEM_ICONS[sistema] || "bi-calculator";
};

const formatDate = (date) => {
  if (!date) return "Sin fecha";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Sin fecha";
  }

  return parsedDate.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatRelativeDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const now = new Date();

  const diff = now.getTime() - parsedDate.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Ahora mismo";
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} h`;
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;

  return formatDate(date);
};

export default function Dashboard() {
  const { userData, isActive, isAdmin, fullAccess } = useAuth();

  const [showPremium, setShowPremium] = useState(false);

  const [historial, setHistorial] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const hasAccess = isAdmin || fullAccess;

  const WHATSAPP_NUMBER = "18494850059";

  const WHATSAPP_MSG = encodeURIComponent(
    `Hola, soy ${
      userData?.nombre || "un usuario"
    } y me gustaría obtener Full Access en Desglose Pro para acceder a todos los sistemas de cálculo.`,
  );

  // ==========================================
  // CARGAR HISTORIAL
  // ==========================================

  useEffect(() => {
    const loadHistorial = () => {
      try {
        const data = getHistorial();

        if (Array.isArray(data)) {
          setHistorial(data);
        } else {
          setHistorial([]);
        }
      } catch (error) {
        console.error("Error cargando historial:", error);
        setHistorial([]);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistorial();
  }, []);

  // ==========================================
  // ORDENAR HISTORIAL
  // ==========================================

  const sortedHistorial = [...historial].sort((a, b) => {
    return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
  });

  // ==========================================
  // SUMMARY DATA
  // ==========================================

  const totalDesgloses = historial.length;

  const currentDate = new Date();

  const desglosesEsteMes = historial.filter((item) => {
    if (!item.fecha) return false;

    const date = new Date(item.fecha);

    return (
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  }).length;

  const sistemasUtilizados = new Set(
    historial.map((item) => item.sistema).filter(Boolean),
  ).size;

  const ultimoDesglose = sortedHistorial[0];

  const summaryData = [
    {
      label: "Total Desgloses",
      value: totalDesgloses,
      footer:
        totalDesgloses === 1
          ? "1 desglose registrado"
          : `${totalDesgloses} desgloses registrados`,
    },
    {
      label: "Este Mes",
      value: desglosesEsteMes,
      footer: "Desgloses realizados este mes",
    },
    {
      label: "Sistemas Utilizados",
      value: sistemasUtilizados,
      footer:
        sistemasUtilizados === 1
          ? "1 sistema utilizado"
          : `${sistemasUtilizados} sistemas utilizados`,
    },
    {
      label: "Último Desglose",
      value: ultimoDesglose ? formatDate(ultimoDesglose.fecha) : "—",
      footer: ultimoDesglose
        ? ultimoDesglose.sistema
        : "Aún no has creado desgloses",
    },
  ];

  // ==========================================
  // RECENT DESGLOSES
  // ==========================================

  const recentDesgloses = sortedHistorial.slice(0, 5).map((item) => {
    const cliente =
      item.proyecto?.cliente || item.proyecto?.cuenta || "Sin cliente";

    const obra = item.proyecto?.obra || "";

    return {
      id: item.id,
      name: item.sistema || "Desglose",
      icon: getSystemIcon(item.sistema),
      meta: obra ? `${cliente} • ${obra}` : cliente,
      type: formatRelativeDate(item.fecha),
    };
  });

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
                        style={{
                          color: "var(--gray-400)",
                        }}
                      ></i>

                      <div
                        className="product-title"
                        style={{
                          color: "var(--gray-500)",
                        }}
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

        {/* ==========================================
            RESUMEN
        ========================================== */}

        <div className="summary-grid">
          {summaryData.map((item, index) => (
            <div className="summary-card" key={index}>
              <div className="summary-label">{item.label}</div>

              <div className="summary-value">
                {loadingHistory ? "..." : item.value}
              </div>

              <div className="summary-footer">{item.footer}</div>
            </div>
          ))}
        </div>

        {/* ==========================================
            DESGLOSES RECIENTES
        ========================================== */}

        <div className="bottom-grid">
          <div className="panel">
            <div
              className="panel-header"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  Desgloses recientes
                </h3>

                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "12px",
                    color: "var(--gray-500)",
                  }}
                >
                  Tus últimos cálculos guardados
                </p>
              </div>

              {historial.length > 0 && (
                <Link
                  to="/historial"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Ver historial
                </Link>
              )}
            </div>

            <div className="panel-body">
              {loadingHistory ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--gray-500)",
                    fontSize: "13px",
                  }}
                >
                  Cargando historial...
                </div>
              ) : recentDesgloses.length > 0 ? (
                recentDesgloses.map((item) => (
                  <div className="recent-item" key={item.id}>
                    <div className="recent-icon">
                      <i className={`bi ${item.icon}`}></i>
                    </div>

                    <div className="recent-info">
                      <div className="recent-name">{item.name}</div>

                      <div className="recent-meta">{item.meta}</div>
                    </div>

                    <span className="recent-type">{item.type}</span>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem 1rem",
                    color: "var(--gray-500)",
                  }}
                >
                  <i
                    className="bi bi-clock-history"
                    style={{
                      fontSize: "2rem",
                      display: "block",
                      marginBottom: "0.75rem",
                      opacity: 0.5,
                    }}
                  ></i>

                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    No hay desgloses recientes
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Crea tu primer desglose para verlo aquí.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          MODAL PREMIUM
      ========================================== */}

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
                style={{
                  fontSize: "1.5rem",
                  color: "#f59e0b",
                }}
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
