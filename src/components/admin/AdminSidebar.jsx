import React from "react";
import { useNavigate } from "react-router-dom";

import { Avatar } from "./adminShared";

export const ADMIN_SECTIONS = [
  { id: "overview", label: "Resumen", icon: "bi-grid-1x2" },
  { id: "users", label: "Usuarios", icon: "bi-people" },
  { id: "usage", label: "Uso", icon: "bi-graph-up" },
  { id: "notifications", label: "Notificaciones", icon: "bi-bell" },
  { id: "activity", label: "Actividad", icon: "bi-clock-history" },
];

// badges: { users: { count, tone }, notifications: { count, tone } }
export default function AdminSidebar({
  section,
  onChange,
  badges = {},
  adminName,
  adminEmail,
}) {
  const navigate = useNavigate();
  return (
    <aside className="adm-sidebar">
      <div className="adm-brand">
        <button
          type="button"
          className="adm-brand__mark"
          onClick={() => navigate("/dashboard")}
          title="Volver al inicio"
          aria-label="Volver al inicio"
        >
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
        </button>

        <span className="adm-brand__text">
          <span className="adm-brand__name">Administración</span>
          <span className="adm-brand__sub">Panel de control</span>
        </span>
      </div>

      <nav className="adm-nav" aria-label="Secciones de administración">
        {ADMIN_SECTIONS.map((item) => {
          const badge = badges[item.id];
          const active = section === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`adm-nav__item${active ? " is-active" : ""}`}
              onClick={() => onChange(item.id)}
              aria-current={active ? "page" : undefined}
            >
              <i className={`bi ${item.icon}`} aria-hidden="true"></i>

              <span className="adm-nav__label">{item.label}</span>

              {badge && badge.count > 0 && (
                <span
                  className={`adm-nav__badge adm-nav__badge--${badge.tone}`}
                >
                  {badge.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="adm-sidebar__footer">
        <Avatar name={adminName} email={adminEmail} size={34} />

        <span className="adm-me">
          <span className="adm-me__name">{adminName || "Administrador"}</span>

          {adminEmail && <span className="adm-me__email">{adminEmail}</span>}
        </span>
      </div>
    </aside>
  );
}
