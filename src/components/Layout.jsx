import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import InstallButton from "./InstallButton";

const navItems = [
  { path: "/dashboard", icon: "bi-grid", label: "Inicio" },
  { path: "/desglose", icon: "bi-layers", label: "Desglose" },
  { path: "/glass-optimizer", icon: "bi-square-half", label: "Croquis" },
  { path: "/historial", icon: "bi-clock", label: "Historial" },
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

const NAV_HISTORY = [
  { path: "/historial", icon: "bi-clock", label: "Historial" },
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
          <div className="sidebar-section">GESTIÓN</div>
          {NAV_HISTORY.map((item) => (
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
          onClick={() => setShowPrecioModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.60)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "0",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "520px",
              maxHeight: "94vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "24px 24px 0 0",
              boxShadow: "0 -20px 60px rgba(15, 23, 42, 0.20)",
              animation: "slideUpModal 0.28s ease-out",
            }}
          >
            {/* ================================
          HEADER
      ================================= */}
            <div
              style={{
                padding: "22px 22px 16px",
                borderBottom: "1px solid #e2e8f0",
                position: "sticky",
                top: 0,
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(10px)",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "#eff6ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2563eb",
                    }}
                  >
                    <i className="bi bi-gem" style={{ fontSize: "20px" }}></i>
                  </div>

                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#0f172a",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Full Access
                    </h3>

                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      Acceso completo a Desglose Pro
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPrecioModal(false)}
                  aria-label="Cerrar"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    color: "#64748b",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div style={{ padding: "20px 22px 24px" }}>
              {/* ================================
            INTRO
        ================================= */}
              <div style={{ marginBottom: "18px" }}>
                

                <h4
                  style={{
                    margin: 0,
                    fontSize: "21px",
                    lineHeight: 1.25,
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Lleva tu taller al siguiente nivel
                </h4>

                <p
                  style={{
                    margin: "7px 0 0",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "#64748b",
                  }}
                >
                  Desbloquea todos los sistemas de cálculo y trabaja con
                  Desglose Pro sin limitaciones.
                </p>
              </div>

              {/* ================================
            PRICING CARD
        ================================= */}
              <div
                style={{
                  background:
                    "linear-gradient(145deg, #0d1e3d 0%, #132a52 55%, #1e3a8a 100%)",
                  borderRadius: "18px",
                  padding: "20px",
                  color: "#ffffff",
                  marginBottom: "18px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Decorative circle */}
                <div
                  style={{
                    position: "absolute",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: "rgba(96,165,250,0.08)",
                    top: "-80px",
                    right: "-50px",
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#93c5fd",
                      }}
                    >
                      <i
                        className="bi bi-stars"
                        style={{ marginRight: "6px" }}
                      ></i>
                      Plan Full Access
                    </div>

                    <span
                      style={{
                        background: "#f59e0b",
                        color: "#ffffff",
                        padding: "5px 9px",
                        borderRadius: "999px",
                        fontSize: "9px",
                        fontWeight: 800,
                      }}
                    >
                      MEJOR VALOR
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    {/* MONTHLY */}
                    <div
                      style={{
                        padding: "15px 10px",
                        borderRadius: "13px",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#bfdbfe",
                          fontWeight: 600,
                          marginBottom: "5px",
                        }}
                      >
                        MENSUAL
                      </div>

                      <div
                        style={{
                          fontSize: "25px",
                          fontWeight: 850,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        RD$ 499
                      </div>

                      <div
                        style={{
                          fontSize: "10px",
                          color: "#93c5fd",
                          marginTop: "2px",
                        }}
                      >
                        / mes
                      </div>
                    </div>

                    {/* YEARLY */}
                    <div
                      style={{
                        padding: "15px 10px",
                        borderRadius: "13px",
                        background: "rgba(255,255,255,0.15)",
                        border: "1px solid rgba(147,197,253,0.25)",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-9px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "#22c55e",
                          color: "#ffffff",
                          padding: "4px 8px",
                          borderRadius: "999px",
                          fontSize: "8px",
                          fontWeight: 800,
                          whiteSpace: "nowrap",
                        }}
                      >
                        AHORRA RD$ 1,998
                      </div>

                      <div
                        style={{
                          fontSize: "10px",
                          color: "#bfdbfe",
                          fontWeight: 600,
                          marginBottom: "5px",
                        }}
                      >
                        ANUAL
                      </div>

                      <div
                        style={{
                          fontSize: "25px",
                          fontWeight: 850,
                          letterSpacing: "-0.03em",
                        }}
                      >
                        RD$ 3,990
                      </div>

                      <div
                        style={{
                          fontSize: "10px",
                          color: "#93c5fd",
                          marginTop: "2px",
                        }}
                      >
                        / año
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "13px",
                      textAlign: "center",
                      fontSize: "10px",
                      color: "#bfdbfe",
                    }}
                  >
                    El plan anual equivale a solo{" "}
                    <strong style={{ color: "#ffffff" }}>
                      RD$ 332.50 al mes
                    </strong>
                  </div>
                </div>
              </div>

              {/* ================================
            BENEFITS
        ================================= */}
              <div style={{ marginBottom: "18px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: "11px",
                  }}
                >
                  ¿Qué incluye Full Access?
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  {[
                    {
                      icon: "bi-calculator",
                      text: "Todos los sistemas de cálculo",
                    },
                    {
                      icon: "bi-window",
                      text: "Ventanas P-92, P-65, E-70 y Tradicional",
                    },
                    {
                      icon: "bi-door-open",
                      text: "Puertas Comercial y P40",
                    },
                    {
                      icon: "bi-rulers",
                      text: " Optimización de Corte de Vidrio",
                    },
                    {
                      icon: "bi-clock-history",
                      text: "Historial de tus desgloses",
                    },
                    {
                      icon: "bi-headset",
                      text: "Soporte técnico por WhatsApp",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 10px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          flexShrink: 0,
                          borderRadius: "8px",
                          background: "#eff6ff",
                          color: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className={`bi ${item.icon}`}
                          style={{ fontSize: "14px" }}
                        ></i>
                      </div>

                      <span
                        style={{
                          fontSize: "12px",
                          color: "#334155",
                          fontWeight: 600,
                        }}
                      >
                        {item.text}
                      </span>

                      <i
                        className="bi bi-check-circle-fill"
                        style={{
                          marginLeft: "auto",
                          color: "#22c55e",
                          fontSize: "14px",
                        }}
                      ></i>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================================
            CTA
        ================================= */}
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
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "9px",
                      padding: "14px 16px",
                      background: "#0d1e3d",
                      color: "#ffffff",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 800,
                      boxShadow: "0 8px 20px rgba(13,30,61,0.18)",
                      marginBottom: "9px",
                    }}
                  >
                    <i
                      className="bi bi-whatsapp"
                      style={{ fontSize: "18px" }}
                    ></i>
                    Activar Full Access
                    <i
                      className="bi bi-arrow-up-right"
                      style={{
                        fontSize: "12px",
                        marginLeft: "2px",
                      }}
                    ></i>
                  </a>
                );
              })()}

              {/* ================================
            SECONDARY ACTIONS
        ================================= */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "9px",
                  marginBottom: "18px",
                }}
              >
                {/* HOW IT WORKS */}
                {(() => {
                  const msg = encodeURIComponent(
                    "Hola, me gustaría saber cómo funciona Desglose Pro y qué incluye el Full Access.",
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
                        justifyContent: "center",
                        gap: "7px",
                        padding: "11px 8px",
                        background: "#eff6ff",
                        color: "#1e40af",
                        border: "1px solid #bfdbfe",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      <i className="bi bi-question-circle"></i>
                      ¿Cómo funciona?
                    </a>
                  );
                })()}

                {/* SUPPORT */}
                {(() => {
                  const msg = encodeURIComponent(
                    "Hola, soy " +
                      (userData?.nombre || "un usuario") +
                      " y necesito soporte técnico con Desglose Pro.",
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
                        justifyContent: "center",
                        gap: "7px",
                        padding: "11px 8px",
                        background: "#f8fafc",
                        color: "#475569",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      <i
                        className="bi bi-headset"
                        style={{ color: "#16a34a" }}
                      ></i>
                      Soporte técnico
                    </a>
                  );
                })()}
              </div>

              {/* ================================
            TRUST / INFO
        ================================= */}
              <div
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  gap: "9px",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <i
                  className="bi bi-shield-check"
                  style={{
                    color: "#16a34a",
                    fontSize: "16px",
                    marginTop: "1px",
                  }}
                ></i>

                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#334155",
                      marginBottom: "2px",
                    }}
                  >
                    Activación rápida y soporte personalizado
                  </div>

                  <div
                    style={{
                      fontSize: "10px",
                      lineHeight: 1.5,
                      color: "#64748b",
                    }}
                  >
                    Escríbenos por WhatsApp para recibir las instrucciones de
                    activación de tu acceso.
                  </div>
                </div>
              </div>

              {/* ================================
            FOOTER
        ================================= */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: "10px",
                  color: "#94a3b8",
                  lineHeight: 1.5,
                }}
              >
                <div>
                  © 2026{" "}
                  <strong style={{ color: "#64748b" }}>Desglose Pro</strong>
                </div>

                <div style={{ marginTop: "3px" }}>
                  Software profesional para talleres de aluminio y vidrio
                </div>
              </div>
            </div>

            {/* ================================
          ANIMATION
      ================================= */}
            <style>
              {`
          @keyframes slideUpModal {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @media (min-width: 768px) {
            .desglose-price-modal {
              border-radius: 24px;
            }
          }
        `}
            </style>
          </div>
        </div>
      )}
    </div>
  );
}
