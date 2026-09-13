// ============================================================
// FILE 2: DailyLimitModal.jsx
// ============================================================
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  getTimeUntilReset,
  getResetTimeFormatted,
} from "../services/usageService";

export default function DailyLimitModal({ onClose, onVerPlanes }) {
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilReset());

  useEffect(() => {
    const updateTimer = () => {
      setTimeUntilReset(getTimeUntilReset());
    };

    updateTimer();

    const interval = setInterval(updateTimer, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.68)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "390px",
          background: "#ffffff",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 70px rgba(15, 23, 42, 0.28)",
          animation: "dailyLimitModalIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================================
            HEADER
        ================================================== */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "14px 14px 0",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f1f5f9";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* ==================================================
            CONTENT
        ================================================== */}
        <div
          style={{
            padding: "4px 28px 28px",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "68px",
              height: "68px",
              margin: "0 auto 16px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="bi bi-bar-chart-line-fill"
              style={{
                fontSize: "28px",
                color: "#2563eb",
              }}
            />
          </div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 10px",
              marginBottom: "10px",
              borderRadius: "999px",
              background: "#eff6ff",
              color: "#2563eb",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            <i className="bi bi-info-circle-fill" />
            LÍMITE DIARIO
          </div>

          {/* Title */}
          <h3
            style={{
              margin: "0 0 9px",
              color: "#0f172a",
              fontSize: "20px",
              lineHeight: 1.3,
              fontWeight: 750,
              letterSpacing: "-0.025em",
            }}
          >
            Has alcanzado tu límite diario
          </h3>

          {/* Description */}
          <p
            style={{
              margin: "0 auto 18px",
              maxWidth: "315px",
              color: "#64748b",
              fontSize: "13px",
              lineHeight: 1.65,
            }}
          >
            Has utilizado tus{" "}
            <strong
              style={{
                color: "#334155",
              }}
            >
              5 desgloses gratuitos
            </strong>{" "}
            de hoy.
            <br />
            Activa Full Access para continuar trabajando sin límites.
          </p>

          {/* ==================================================
              FULL ACCESS CARD
          ================================================== */}

          {/* ==================================================
              RESET TIMER
          ================================================== */}
          <div
            style={{
              padding: "12px",
              marginBottom: "16px",
              borderRadius: "12px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                marginBottom: "5px",
              }}
            >
              <i
                className="bi bi-arrow-clockwise"
                style={{
                  color: "#2563eb",
                  fontSize: "13px",
                }}
              />

              <span
                style={{
                  color: "#64748b",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.45px",
                }}
              >
                Próximo restablecimiento
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
              }}
            >
              <span
                style={{
                  color: "#0f172a",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                En {timeUntilReset}
              </span>

              <span
                style={{
                  color: "#94a3b8",
                  fontSize: "11px",
                }}
              >
                ·
              </span>
            </div>
          </div>

          {/* ==================================================
              VER PLANES
          ================================================== */}
          <Link
            to="/planes"
            style={{
              width: "100%",
              minHeight: "46px",
              padding: "12px 16px",
              border: "none",
              borderRadius: "11px",
              background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
              color: "#ffffff",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.22)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 10px 24px rgba(37, 99, 235, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(37, 99, 235, 0.22)";
            }}
          >
            <i className="bi bi-grid-3x3-gap-fill" />
            Ver planes
            <i
              className="bi bi-arrow-right"
              style={{
                fontSize: "14px",
              }}
            />
          </Link>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              marginTop: "9px",
              padding: "9px",
              border: "none",
              background: "transparent",
              color: "#64748b",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes dailyLimitModalIn {
            from {
              opacity: 0;
              transform: translateY(8px) scale(0.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}
