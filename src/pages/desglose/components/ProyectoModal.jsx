import React, { useState } from "react";

const COLORES = [
  "Aluminio natural",
  "Blanco",
  "Negro",
  "Bronce",
  "Champagne",
  "Gris",
  "Otro",
];

export default function ProyectoModal({ onConfirm, onCancel }) {
  const [form, setForm] = useState({
    cliente: "",
    obra: "",
    color: "Blanco",
    notas: "",
  });

  const [error, setError] = useState("");

  const handle = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (error) setError("");
  };

  const handleConfirm = () => {
    if (!form.cliente.trim()) {
      setError("El nombre del cliente es requerido");
      return;
    }

    onConfirm(form);
  };

  return (
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
      onClick={onCancel}
    >
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          width: "100%",
          maxWidth: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem 1.5rem 1.25rem",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  background: "#eff6ff",
                  border: "1px solid #dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <i
                  className="bi bi-folder-plus"
                  style={{
                    color: "#2563eb",
                    fontSize: "18px",
                  }}
                />
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                    color: "#0f172a",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Nuevo proyecto
                </h3>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#64748b",
                    fontSize: "12px",
                  }}
                >
                  Información del proyecto
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancel}
              aria-label="Cerrar"
              style={{
                width: "32px",
                height: "32px",
                border: "none",
                borderRadius: "8px",
                background: "#f8fafc",
                color: "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <i className="bi bi-x-lg" style={{ fontSize: "13px" }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem" }}>
          {/* Error */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                marginBottom: "1.25rem",
                borderRadius: "10px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: "12px",
                fontWeight: 500,
              }}
            >
              <i className="bi bi-exclamation-circle" />
              {error}
            </div>
          )}

          {/* Client */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#334155",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Cliente <span style={{ color: "#dc2626" }}>*</span>
            </label>

            <div style={{ position: "relative" }}>
              <i
                className="bi bi-person"
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontSize: "15px",
                }}
              />

              <input
                type="text"
                name="cliente"
                value={form.cliente}
                onChange={handle}
                placeholder="Nombre del cliente"
                autoFocus
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 13px 0 38px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "13px",
                  color: "#0f172a",
                  background: "#ffffff",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Obra */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#334155",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Obra
            </label>

            <div style={{ position: "relative" }}>
              <i
                className="bi bi-building"
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontSize: "15px",
                }}
              />

              <input
                type="text"
                name="obra"
                value={form.obra}
                onChange={handle}
                placeholder="Nombre de la obra"
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 13px 0 38px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "13px",
                  color: "#0f172a",
                  background: "#ffffff",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Color */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#334155",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Color del aluminio
            </label>

            <div style={{ position: "relative" }}>
              <i
                className="bi bi-palette"
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontSize: "15px",
                  pointerEvents: "none",
                }}
              />

              <select
                name="color"
                value={form.color}
                onChange={handle}
                style={{
                  width: "100%",
                  height: "44px",
                  padding: "0 38px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "13px",
                  color: "#0f172a",
                  background: "#ffffff",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                {COLORES.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                color: "#334155",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Notas
            </label>

            <div style={{ position: "relative" }}>
              <i
                className="bi bi-pencil-square"
                style={{
                  position: "absolute",
                  left: "13px",
                  top: "13px",
                  color: "#94a3b8",
                  fontSize: "15px",
                }}
              />

              <textarea
                name="notas"
                value={form.notas}
                onChange={handle}
                placeholder="Detalles adicionales del proyecto..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "11px 13px 11px 38px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  outline: "none",
                  fontSize: "13px",
                  color: "#0f172a",
                  background: "#ffffff",
                  resize: "none",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem 1.5rem",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              height: "44px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              background: "#ffffff",
              color: "#475569",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            style={{
              flex: 1.5,
              height: "44px",
              border: "none",
              borderRadius: "10px",
              background: "#1e3a8a",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            Continuar
            <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
}