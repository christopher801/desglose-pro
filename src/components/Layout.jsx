import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import {
  getUserUnreadCount,
} from "../services/notificationService";
import InstallButton from "./InstallButton";
import ShowNotificacionModal from "./ShowNotificacionModal";

const navItems = [
  { path: "/dashboard", icon: "bi-grid", label: "Inicio" },
  { path: "/desglose", icon: "bi-layers", label: "Desglose" },
  { path: "/glass-optimizer", icon: "bi-square-half", label: "Croquis" },
  { path: "/croquis-barras", icon: "bi bi-scissors", label: "Barras" },
  { path: "/historial", icon: "bi-clock", label: "Historial" },
];

const NAV_CALCULO = [
  { path: "/desglose", icon: "bi-layers", label: "Desglose" },
  {
    path: "/glass-optimizer",
    icon: "bi-square-half",
    label: "Croquis",
  },
  { path: "/croquis-barras", icon: "bi bi-scissors", label: "Barras" },
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

  const WHATSAPP_MESSAGE = `Hola, soy ${
    userData?.nombre || "un usuario"
  } y me comunico desde Desglose Pro v5.1.0. Me gustaría recibir asistencia técnica.`;

  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showNotificacionModal, setShowNotificacionModal] =
    useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userUnreadCount, setUserUnreadCount] = useState(0);

  /*
   * ============================================================
   * USER NOTIFICATIONS
   * ============================================================
   */

  const loadUserUnreadCount = async () => {
    if (!user?.uid || isAdmin) {
      setUserUnreadCount(0);
      return;
    }

    try {
      const result = await getUserUnreadCount(user.uid);

      if (result?.success) {
        setUserUnreadCount(result.count || 0);
      } else {
        setUserUnreadCount(0);
      }
    } catch (error) {
      console.error(
        "Error cargando contador de notificaciones:",
        error
      );

      setUserUnreadCount(0);
    }
  };

  useEffect(() => {
    if (!user?.uid || isAdmin) {
      setUserUnreadCount(0);
      return;
    }

    loadUserUnreadCount();
  }, [user?.uid, isAdmin]);

  /*
   * Cuando se cierra el modal, volvemos a consultar
   * el contador para mantener el badge actualizado.
   */
  useEffect(() => {
    if (!showNotificacionModal && user?.uid && !isAdmin) {
      loadUserUnreadCount();
    }
  }, [showNotificacionModal]);

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  /*
   * ============================================================
   * ACTIVE ROUTE
   * ============================================================
   */

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  /*
   * ============================================================
   * NAVIGATION
   * ============================================================
   */

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

  /*
   * ============================================================
   * USER DROPDOWN
   * ============================================================
   */

  const toggleDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="layout-shell">
      {/* ======================================================
          SIDEBAR — DESKTOP
      ====================================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        {/* LOGO */}

        <div className="sidebar-logo">
          <div>
            <div className="sidebar-logo-name">
              DESGLOSE PRO
            </div>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">
          {/* Inicio */}

          <Link
            to="/dashboard"
            className={`sidebar-item ${
              isActive("/dashboard")
                ? "sidebar-item-active"
                : ""
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <i className="bi bi-grid"></i>

            <span className="sidebar-item-label">
              Inicio
            </span>
          </Link>

          {/* Herramientas */}

          <div className="sidebar-section">
            Herramientas
          </div>

          {NAV_CALCULO.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${
                isActive(item.path)
                  ? "sidebar-item-active"
                  : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon}`}></i>

              <span className="sidebar-item-label">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Gestión */}

          <div className="sidebar-section">
            GESTIÓN
          </div>

          {NAV_HISTORY.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${
                isActive(item.path)
                  ? "sidebar-item-active"
                  : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon}`}></i>

              <span className="sidebar-item-label">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Admin */}

          {isAdmin && (
            <>
              <div className="sidebar-section">
                Admin
              </div>

              <Link
                to="/admin"
                className={`sidebar-item ${
                  isActive("/admin")
                    ? "sidebar-item-active"
                    : ""
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className="bi bi-shield-lock"></i>

                <span className="sidebar-item-label">
                  Panel admin
                </span>

                {unreadCount > 0 && (
                  <span className="sidebar-badge">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </nav>

        {/* SIDEBAR FOOTER */}

        <div className="sidebar-footer">
          <Link
            to="/perfil"
            onClick={() => setSidebarOpen(false)}
            className="sidebar-user"
            style={{
              textDecoration: "none",
              flex: 1,
            }}
          >
            <div className="sidebar-avatar">
              <i className="bi bi-person"></i>
            </div>

            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {userData?.nombre || "Usuario"}
              </div>

              <div className="sidebar-user-role">
                {isAdmin
                  ? "Administrador"
                  : "Usuario"}
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

      {/* ======================================================
          MOBILE SIDEBAR OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ======================================================
          MAIN
      ====================================================== */}

      <div className="layout-main">
        {/* ====================================================
            TOPBAR
        ==================================================== */}

        <header className="topbar">
          {/* Desktop */}

          <div className="topbar-title topbar-title-desktop">
            {allNavItems.find((i) =>
              isActive(i.path)
            )?.label || "Desglose Pro"}
          </div>

          {/* Mobile */}

          <div className="topbar-title topbar-title-mobile">
            Desglose Pro
          </div>

          <div className="topbar-right">
            {/* ==================================================
                ADMIN NOTIFICATIONS
            ================================================== */}

            {isAdmin && (
              <Link
                to="/admin"
                className="topbar-notif-btn"
                title="Notificaciones"
              >
                <i className="bi bi-bell"></i>

                {unreadCount > 0 && (
                  <span className="topbar-notif-dot">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* ==================================================
                USER NOTIFICATIONS
            ================================================== */}

            {!isAdmin && (
              <button
                type="button"
                className="topbar-notif-btn"
                title="Notificaciones"
                onClick={() =>
                  setShowNotificacionModal(true)
                }
              >
                <i className="bi bi-bell"></i>

                {userUnreadCount > 0 && (
                  <span className="topbar-notif-dot">
                    {userUnreadCount}
                  </span>
                )}
              </button>
            )}

            {/* INSTALL */}

            <InstallButton className="topbar-install-slot" />

            {/* ==================================================
                PLANES
            ================================================== */}

            <Link
              to="/planes"
              className="topbar-notif-btn"
              title="Planes y precios"
            >
              <i className="bi bi-gem"></i>
            </Link>

            {/* ==================================================
                USER DROPDOWN
            ================================================== */}

            <div
              style={{
                position: "relative",
              }}
            >
              <button
                type="button"
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
                  style={{
                    fontSize: "1.4rem",
                  }}
                ></i>
              </button>

              {userDropdownOpen && (
                <>
                  {/* DROPDOWN OVERLAY */}

                  <div
                    className="dropdown-overlay"
                    onClick={() =>
                      setUserDropdownOpen(false)
                    }
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 999,
                    }}
                  />

                  {/* DROPDOWN */}

                  <div
                    className="user-dropdown"
                    id="userDropdown"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: "white",
                      borderRadius: "12px",
                      boxShadow:
                        "0 8px 24px rgba(0,0,0,0.15)",
                      minWidth: "240px",
                      padding: "0.5rem",
                      zIndex: 1000,
                      border:
                        "1px solid var(--gray-200)",
                    }}
                  >
                    {/* USER INFO */}

                    <div
                      className="user-dropdown-header"
                      style={{
                        padding:
                          "0.5rem 0.75rem",
                        borderBottom:
                          "1px solid var(--gray-100)",
                      }}
                    >
                      <div
                        className="dropdown-name"
                        style={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color:
                            "var(--gray-700)",
                        }}
                      >
                        {userData?.nombre ||
                          "Usuario"}
                      </div>

                      <div
                        className="dropdown-email"
                        style={{
                          fontSize: "0.8rem",
                          color:
                            "var(--gray-500)",
                        }}
                      >
                        {userData?.email ||
                          "usuario@email.com"}
                      </div>

                      <span
                        className="dropdown-role"
                        style={{
                          display:
                            "inline-block",
                          marginTop: "0.3rem",
                          background: isAdmin
                            ? "var(--primary, #0d6efd)"
                            : "var(--gray-400)",
                          color: "white",
                          fontSize: "0.65rem",
                          padding:
                            "0.15rem 0.6rem",
                          borderRadius: "20px",
                          fontWeight: 500,
                        }}
                      >
                        {isAdmin
                          ? "Administrador"
                          : "Usuario"}
                      </span>
                    </div>

                    {/* DROPDOWN LINKS */}

                    <div
                      className="dropdown-links"
                      style={{
                        padding: "0.3rem 0",
                      }}
                    >
                      <Link
                        to="/perfil"
                        className="dropdown-link"
                        onClick={() =>
                          setUserDropdownOpen(
                            false
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "0.75rem",
                          padding:
                            "0.5rem 0.75rem",
                          borderRadius: "8px",
                          textDecoration:
                            "none",
                          color:
                            "var(--gray-700)",
                          fontSize: "0.9rem",
                          transition:
                            "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--gray-50)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            "transparent")
                        }
                      >
                        <i
                          className="bi bi-person"
                          style={{
                            fontSize: "1rem",
                          }}
                        ></i>

                        Mi perfil
                      </Link>
                    </div>

                    {/* LOGOUT */}

                    <div
                      className="dropdown-logout"
                      style={{
                        borderTop:
                          "1px solid var(--gray-100)",
                        paddingTop: "0.3rem",
                      }}
                    >
                      <button
                        type="button"
                        className="dropdown-link"
                        onClick={() => {
                          setUserDropdownOpen(
                            false
                          );

                          handleLogout();
                        }}
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "0.75rem",
                          padding:
                            "0.5rem 0.75rem",
                          borderRadius: "8px",
                          border: "none",
                          background:
                            "transparent",
                          width: "100%",
                          textAlign: "left",
                          color:
                            "var(--danger, #dc3545)",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition:
                            "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(220, 53, 69, 0.08)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            "transparent")
                        }
                      >
                        <i
                          className="bi bi-box-arrow-right"
                          style={{
                            fontSize: "1rem",
                          }}
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

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <main className="layout-content">
          {children}
        </main>

        {/* ====================================================
            BOTTOM NAV — MOBILE
        ==================================================== */}

        <nav className="bottom-nav">
          {allNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${
                isActive(item.path)
                  ? "bottom-nav-item-active"
                  : ""
              }`}
            >
              <i
                className={`bi ${item.icon}`}
              ></i>

              <span className="bottom-nav-label">
                {item.label}
              </span>

              {item.badge > 0 && (
                <span className="bottom-nav-dot" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* ======================================================
          ABOUT MODAL
      ====================================================== */}

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
          onClick={() =>
            setShowAboutModal(false)
          }
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              maxWidth: "420px",
              width: "100%",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 700,
                }}
              >
                Desglose Pro v5.1.0
              </h3>

              <button
                type="button"
                onClick={() =>
                  setShowAboutModal(false)
                }
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color:
                    "var(--gray-500)",
                }}
                aria-label="Cerrar"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <p
              style={{
                fontSize: "0.85rem",
                color:
                  "var(--gray-500)",
                marginBottom: "1rem",
              }}
            >
              Software profesional para
              talleres de aluminio.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                gap: "1.5rem",
                flexWrap: "wrap",
                paddingTop: "1.5rem",
                borderTop:
                  "1px solid var(--gray-200)",
              }}
            >
              {legalLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    setShowAboutModal(false)
                  }
                  style={{
                    fontSize: "0.85rem",
                    color:
                      "var(--gray-500)",
                    textDecoration:
                      "none",
                  }}
                >
                  <i
                    className={`bi ${link.icon} me-1`}
                  ></i>

                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          USER NOTIFICATION MODAL
      ====================================================== */}

      {!isAdmin && (
        <ShowNotificacionModal
          show={showNotificacionModal}
          onClose={() =>
            setShowNotificacionModal(false)
          }
          onUnreadChange={loadUserUnreadCount}
        />
      )}
    </div>
  );
}