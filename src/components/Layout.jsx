import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import InstallButton from "./InstallButton";

const navItems = [
  { path: "/dashboard", icon: "bi-grid", label: "Inicio" },
  { path: "/desglose", icon: "bi-layers", label: "Desglose" },
  { path: "/glass-optimizer", icon: "bi-square-half", label: "Croquis" },
];

const NAV_CALCULO = [
  { path: "/desglose", icon: "bi-layers", label: "Desglose" },
  {
    path: "/glass-optimizer",
    icon: "bi-square-half",
    label: "Croquis",
  },
];

const NAV_GESTION = [
  {
    path: "/cotizaciones",
    icon: "bi-file-earmark-text",
    label: "Cotizaciones",
  },
  { path: "/gastos", icon: "bi-credit-card", label: "Gastos" },
  { path: "/facturas", icon: "bi-receipt", label: "Facturas" },
];

const NAV_SISTEMA = [
];

const legalLinks = [
  {
    path: "/legal/PrivacyPolicy.html",
    icon: "bi-shield-lock",
    label: "Política de Privacidad",
  },
  {
    path: "/legal/TermsOfService.html",
    icon: "bi-file-text",
    label: "Términos de Servicio",
  },
];

export default function Layout({ children, unreadCount = 0 }) {
  const { user, userData, isAdmin } = useAuth();
  const WHATSAPP_NUMBER = "18494850059";
  const WHATSAPP_MESSAGE = `Hola, soy ${userData?.nombre || "un usuario"} y me comunico desde Desglose Pro v4.9.0. Me gustaría recibir asistencia técnica.`;
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrecioModal, setShowPrecioModal] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const allNavItems = isAdmin
    ? [
        ...navItems,
        {
          path: "/admin",
          icon: "bi-shield-lock",
          label: "Admin",
          badge: unreadCount,
        },
      ]
    : navItems;

  // Fèmen dropdown lè w klike deyò
  const toggleDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  return (
    <div className="layout-shell">
      {/* SIDEBAR — desktop */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <div>
            <div className="sidebar-logo-name">DESGLOSE PRO</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Inicio */}
          <Link
            to="/dashboard"
            className={`sidebar-item ${isActive("/dashboard") ? "sidebar-item-active" : ""}`}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="bi bi-grid"></i>
            <span className="sidebar-item-label">Inicio</span>
          </Link>

          {/* Cálculo */}
          <div className="sidebar-section">Herramientas</div>
          {NAV_CALCULO.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? "sidebar-item-active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="sidebar-item-label">{item.label}</span>
            </Link>
          ))}

          {/* Gestión */}

          {/* Sistema */}
          <div className="sidebar-section"></div>
          {NAV_SISTEMA.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? "sidebar-item-active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="sidebar-item-label">{item.label}</span>
            </Link>
          ))}

          {/* Admin */}
          {isAdmin && (
            <>
              <div className="sidebar-section">Admin</div>
              <Link
                to="/admin"
                className={`sidebar-item ${isActive("/admin") ? "sidebar-item-active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="bi bi-shield-lock"></i>
                <span className="sidebar-item-label">Panel admin</span>
                {unreadCount > 0 && (
                  <span className="sidebar-badge">{unreadCount}</span>
                )}
              </Link>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <Link
            to="/perfil"
            onClick={() => setSidebarOpen(false)}
            className="sidebar-user"
            style={{ textDecoration: "none", flex: 1 }}
          >
            <div className="sidebar-avatar">
              <i className="bi bi-person"></i>
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {userData?.nombre || "Usuario"}
              </div>
              <div className="sidebar-user-role">
                {isAdmin ? "Administrador" : "Usuario"}
              </div>
            </div>
          </Link>
          <button
            className="sidebar-logout"
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </aside>

      {/* Overlay mobil */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="layout-main">
        {/* Topbar */}
        <header className="topbar">
          {/* Desktop — titl paj aktif */}
          <div className="topbar-title topbar-title-desktop">
            {allNavItems.find((i) => isActive(i.path))?.label || "Desglose Pro"}
          </div>

          {/* Mobil — non app lan sèlman */}
          <div className="topbar-title topbar-title-mobile">Desglose Pro</div>

          <div className="topbar-right">
            {isAdmin && unreadCount > 0 && (
              <Link
                to="/admin"
                className="topbar-notif-btn"
                title="Notificaciones"
              >
                <i className="bi bi-bell"></i>
                <span className="topbar-notif-dot">{unreadCount}</span>
              </Link>
            )}

            <InstallButton className="topbar-install-slot" />

            <button
              className="topbar-notif-btn"
              title="Precios y planes"
              onClick={() => setShowPrecioModal(true)}
            >
              <i className="bi bi-gem"></i>
            </button>

            {/* USER DROPDOWN */}
            <div style={{ position: "relative" }}>
              <button
                className="topbar-notif-btn"
                onClick={toggleDropdown}
                title="Usuario"
                style={{
                  background: userDropdownOpen
                    ? "var(--gray-100)"
                    : "transparent",
                  borderRadius: "50%",
                  padding: "0.3rem",
                }}
              >
                <i
                  className="bi bi-person-circle"
                  style={{ fontSize: "1.4rem" }}
                ></i>
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="dropdown-overlay"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 999,
                    }}
                  />
                  <div
                    className="user-dropdown"
                    id="userDropdown"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "white",
                      borderRadius: "12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      minWidth: "240px",
                      padding: "0.5rem",
                      zIndex: 1000,
                      border: "1px solid var(--gray-200)",
                    }}
                  >
                    <div
                      className="user-dropdown-header"
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderBottom: "1px solid var(--gray-100)",
                      }}
                    >
                      <div
                        className="dropdown-name"
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "var(--gray-700)",
                        }}
                      >
                        {userData?.nombre || "Usuario"}
                      </div>
                      <div
                        className="dropdown-email"
                        style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}
                      >
                        {userData?.email || "usuario@email.com"}
                      </div>
                      <span
                        className="dropdown-role"
                        style={{
                          display: "inline-block",
                          marginTop: "0.3rem",
                          background: isAdmin
                            ? "var(--primary, #0d6efd)"
                            : "var(--gray-400)",
                          color: "white",
                          fontSize: "0.65rem",
                          padding: "0.15rem 0.6rem",
                          borderRadius: "20px",
                          fontWeight: 500,
                        }}
                      >
                        {isAdmin ? "Administrador" : "Usuario"}
                      </span>
                    </div>

                    <div
                      className="dropdown-links"
                      style={{ padding: "0.3rem 0" }}
                    >
                      <Link
                        to="/perfil"
                        className="dropdown-link"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          textDecoration: "none",
                          color: "var(--gray-700)",
                          fontSize: "0.9rem",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "var(--gray-50)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <i
                          className="bi bi-person"
                          style={{ fontSize: "1rem" }}
                        ></i>
                        Mi perfil
                      </Link>
                    </div>

                    <div
                      className="dropdown-logout"
                      style={{
                        borderTop: "1px solid var(--gray-100)",
                        paddingTop: "0.3rem",
                      }}
                    >
                      <button
                        className="dropdown-link"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          border: "none",
                          background: "transparent",
                          width: "100%",
                          textAlign: "left",
                          color: "var(--danger, #dc3545)",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(220, 53, 69, 0.08)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <i
                          className="bi bi-box-arrow-right"
                          style={{ fontSize: "1rem" }}
                        ></i>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="layout-content">{children}</main>

        {/* BOTTOM NAV — mobil */}
        <nav className="bottom-nav">
          {allNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive(item.path) ? "bottom-nav-item-active" : ""}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="bottom-nav-label">{item.label}</span>
              {item.badge > 0 && <span className="bottom-nav-dot" />}
            </Link>
          ))}
        </nav>
      </div>

      {showAboutModal && (
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
          onClick={() => setShowAboutModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "420px",
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
                Desglose Pro v5.1.0
              </h3>
              <button
                onClick={() => setShowAboutModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "var(--gray-500)",
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--gray-500)",
                marginBottom: "1rem",
              }}
            >
              Software profesional para talleres de aluminio.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.5rem",
                flexWrap: "wrap",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--gray-200)",
              }}
            >
              {legalLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowAboutModal(false)}
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--gray-500)",
                    textDecoration: "none",
                  }}
                >
                  <i className={`bi ${link.icon} me-1`}></i>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPrecioModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={() => setShowPrecioModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px 16px 0 0",
              width: "100%",
              maxWidth: "480px",
              padding: "1.5rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>
                  Planes y soporte
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "var(--gray-500)",
                  }}
                >
                  
                </p>
              </div>
              <button
                onClick={() => setShowPrecioModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  color: "var(--gray-500)",
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Precio */}
            <div
              style={{
                background: "linear-gradient(135deg, #0d1e3d, #1e3a8a)",
                borderRadius: "12px",
                padding: "1.25rem",
                marginBottom: "1rem",
                color: "white",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#93c5fd",
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                <i className="bi bi-gem" style={{ marginRight: "5px" }}></i>
                Precio Full Access
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                    RD$ 499
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#93c5fd",
                      marginTop: "2px",
                    }}
                  >
                    por mes
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "10px",
                    padding: "12px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.2)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#f59e0b",
                      color: "white",
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "10px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    AHORRA 33%
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                    RD$ 3,990
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#93c5fd",
                      marginTop: "2px",
                    }}
                  >
                    por año
                  </div>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {/* Activar Full Access */}
              {(() => {
                const msg = encodeURIComponent(
                  "Hola, soy " +
                    (userData?.nombre || "un usuario") +
                    " y quiero activar Full Access en Desglose Pro.",
                );
                return (
                  <a
                    href={"https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowPrecioModal(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "13px 16px",
                      background: "#0d1e3d",
                      color: "white",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <i
                      className="bi bi-stars"
                      style={{ fontSize: "18px", color: "#93c5fd" }}
                    ></i>
                    <div>
                      <div>Activar Full Access</div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 400,
                          color: "#93c5fd",
                        }}
                      >
                        Todos los módulos desbloqueados
                      </div>
                    </div>
                    <i
                      className="bi bi-chevron-right"
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "#93c5fd",
                      }}
                    ></i>
                  </a>
                );
              })()}

              {/* Prueba gratuita */}
              

              {/* Como funciona */}
              {(() => {
                const msg = encodeURIComponent(
                  "Hola, me gustaria saber como funciona Desglose Pro y que incluye el Full Access.",
                );
                return (
                  <a
                    href={"https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowPrecioModal(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "13px 16px",
                      background: "#eff6ff",
                      color: "#1e40af",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 600,
                      border: "1px solid #bfdbfe",
                    }}
                  >
                    <i
                      className="bi bi-question-circle"
                      style={{ fontSize: "18px", color: "#3b82f6" }}
                    ></i>
                    <div>
                      <div>Como funciona?</div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 400,
                          color: "#3b82f6",
                        }}
                      >
                        Conoce todos los modulos
                      </div>
                    </div>
                    <i
                      className="bi bi-chevron-right"
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "#3b82f6",
                      }}
                    ></i>
                  </a>
                );
              })()}

              {/* Soporte */}
              {(() => {
                const msg = encodeURIComponent(
                  "Hola, soy " +
                    (userData?.nombre || "un usuario") +
                    " y necesito soporte tecnico con Desglose Pro.",
                );
                return (
                  <a
                    href={"https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowPrecioModal(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "13px 16px",
                      background: "#f8fafc",
                      color: "var(--gray-700)",
                      borderRadius: "10px",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 600,
                      border: "1px solid var(--gray-200)",
                    }}
                  >
                    <i
                      className="bi bi-headset"
                      style={{ fontSize: "18px", color: "#16a34a" }}
                    ></i>
                    <div>
                      <div>Soporte tecnico</div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 400,
                          color: "var(--gray-500)",
                        }}
                      >
                        Respuesta rapida por WhatsApp
                      </div>
                    </div>
                    <i
                      className="bi bi-chevron-right"
                      style={{
                        marginLeft: "auto",
                        fontSize: "12px",
                        color: "var(--gray-400)",
                      }}
                    ></i>
                  </a>
                );
              })()}
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: "var(--gray-400)",
                marginTop: "1rem",
              }}
            >
              © 2026 <strong>Desglose Pro</strong>. Todos los derechos
              reservados.
            </p>
            

          </div>
        </div>
      )}
    </div>
  );
}
