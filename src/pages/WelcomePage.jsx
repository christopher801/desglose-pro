import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================================
// DATA
// ============================================================

const WHATSAPP_URL = "https://wa.me/18494850059";

const systems = [
  {
    name: "Ventana P-92",
    type: "Corredera 2, 3 o 4 hojas",
    group: "ventanas",
    icon: "bi-window-sidebar",
    precision: '1/16"',
    status: "Disponible",
  },
  {
    name: "Ventana P-65",
    type: "Corredera 2, 3 o 4 hojas",
    group: "ventanas",
    icon: "bi-window-stack",
    precision: '1/16"',
    status: "Disponible",
  },
  {
    name: "Ventana Tradicional",
    type: "Corredera 2, 3 o 4 hojas",
    group: "ventanas",
    icon: "bi-window",
    precision: '1/16"',
    status: "Disponible",
  },
  {
    name: "Ventana C-70",
    type: "Corredera 2, 3 o 4 hojas",
    group: "ventanas",
    icon: "bi-window",
    precision: '1/16"',
    status: "Disponible",
  },
   {
    name: "Ventana M-100",
    type: "Corredera 2, 3 o 4 hojas",
    group: "ventanas",
    icon: "bi-window",
    precision: '1/16"',
    status: "Disponible",
  },
  {
    name: "P-40 Proyectada",
    type: "Sistema proyectado",
    group: "ventanas",
    icon: "bi-box-arrow-up-right",
    precision: '1/16"',
    status: "Disponible",
  },
  {
    name: "Puerta Comercial",
    type: "Puertas de aluminio",
    group: "puertas",
    icon: "bi-door-open",
    precision: '1/16"',
    status: "Disponible",
  },
  {
    name: "Puerta Abisagrada P40",
    type: "Puertas de aluminio",
    group: "puertas",
    icon: "bi-door-closed",
    precision: '1/16"',
    status: "Disponible",
  },
  {
    name: "Croquis de Vidrio",
    type: "Optimizador de corte",
    group: "herramientas",
    icon: "bi-aspect-ratio",
    precision: "mm / in",
    status: "Herramienta",
  },
  {
    name: "Croquis de Barras",
    type: "Optimizador de corte",
    group: "herramientas",
    icon: "bi-aspect-ratio",
    precision: "mm / in",
    status: "Herramienta",
  },
];

const filters = [
  { id: "all", label: "Todos" },
  { id: "ventanas", label: "Ventanas" },
  { id: "puertas", label: "Puertas" },
  { id: "herramientas", label: "Herramientas" },
];

const steps = [
  {
    icon: "bi-rulers",
    title: "Mide el hueco",
    text: "Escribe ancho y alto en pulgadas, fracciones o centímetros. Tú trabajas como siempre.",
  },
  {
    icon: "bi-cpu",
    title: "Calcula al instante",
    text: "Obtén el despiece completo de perfiles, vidrios y materiales, sin errores de mano.",
  },
  {
    icon: "bi-file-earmark-pdf",
    title: "Exporta y fabrica",
    text: "Un PDF claro y listo para el corte. Guárdalo en tu historial y vuelve a él cuando quieras.",
  },
];

const features = [
  {
    icon: "bi-rulers",
    title: "Cálculos precisos para fabricación",
    text: "Transforma tus medidas en despieces exactos y listos para producción, reduciendo errores y desperdicio de material.",
    variant: "dark",
    wide: true,
  },
  {
    icon: "bi-file-earmark-pdf-fill",
    title: "PDF profesional",
    text: "Documentos claros para corte y fabricación.",
  },
  {
    icon: "bi-phone-vibrate",
    title: "App móvil, también offline",
    text: "Instálala en tu iPhone o Android. Funciona en obra, incluso sin señal.",
  },
  {
    icon: "bi-shield-lock-fill",
    title: "Acceso y roles de usuario",
    text: "Controla qué puede hacer cada usuario y mantén tu cuenta organizada y segura.",
    variant: "accent",
    wide: true,
  },
];

const stats = [
  { value: "7+", label: "Sistemas de ventana y puerta" },
  { value: '1/16"', label: "Precisión en cada corte" },
  { value: "PDF", label: "Listo para fabricar" },
  { value: "Offline", label: "Funciona sin internet" },
];

const heroCuts = [
  { label: "Cabezal / alfeizar", value: '15 15/16"' },
  { label: "Jambas", value: '30 9/16"' },
  { label: "Cabezal / riel", value: '31 3/8"' },
  { label: "Lateral del marco", value: '32 7/8"' },
  { label: "Vidrio", value: '12 11/16" × 26 9/16"' },
];

// ============================================================
// PAGE
// ============================================================

export default function WelcomePage() {
  const { user, isActive } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  // Animación de entrada al hacer scroll
  useEffect(() => {
    const items = document.querySelectorAll(".wl-reveal");

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Si el usuario ya inició sesión, redirigir según su estado
  if (user) {
    return <Navigate to={isActive ? "/dashboard" : "/pending"} replace />;
  }

  const goTo = (event, id) => {
    event.preventDefault();
    setMenuOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visibleSystems =
    filter === "all" ? systems : systems.filter((s) => s.group === filter);

  const marquee = [...systems, ...systems];

  return (
    <div className="wl-page">
      <style>{`
        .wl-page {
          --wl-ink: #0b1730;
          --wl-night: #060d1c;
          --wl-blue: #3b82f6;
          --wl-cyan: #22d3ee;
          --wl-muted: #64748b;
          --wl-line: #e2e8f0;

          width: 100%;
          min-height: 100vh;
          overflow-x: clip;
          background: #ffffff;
          color: var(--wl-ink);
          font-family: inherit;
        }

        .wl-page *,
        .wl-page *::before,
        .wl-page *::after {
          box-sizing: border-box;
        }

        .wl-page a {
          text-decoration: none;
        }

        .wl-container {
          width: min(1160px, calc(100% - 40px));
          margin: 0 auto;
        }

        .wl-grad {
          background: linear-gradient(100deg, #60a5fa 0%, #22d3ee 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        /* ---------- Reveal ---------- */

        .wl-reveal {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .wl-reveal.is-in {
          opacity: 1;
          transform: none;
        }

        /* ---------- Buttons ---------- */

        .wl-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 50px;
          padding: 0 24px;
          border-radius: 14px;
          border: 1px solid transparent;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .wl-btn:hover {
          transform: translateY(-2px);
        }

        .wl-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #ffffff;
          box-shadow: 0 12px 30px -10px rgba(59, 130, 246, 0.7);
        }

        .wl-btn-primary:hover {
          color: #ffffff;
          box-shadow: 0 16px 36px -10px rgba(59, 130, 246, 0.85);
        }

        .wl-btn-ghost {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.16);
          color: #e2e8f0;
        }

        .wl-btn-ghost:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        /* ---------- Navbar ---------- */

        .wl-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(6, 13, 28, 0.78);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .wl-nav-inner {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .wl-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #ffffff;
        }

        .wl-brand img {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          object-fit: cover;
        }

        .wl-brand span {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .wl-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .wl-nav-link {
          padding: 9px 14px;
          border-radius: 10px;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease, background 0.2s ease;
        }

        .wl-nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.07);
        }

        .wl-nav-login {
          margin-left: 8px;
          padding: 9px 16px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s ease;
        }

        .wl-nav-login:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .wl-burger {
          display: none;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 10px;
          background: transparent;
          color: #ffffff;
          font-size: 20px;
          cursor: pointer;
        }

        /* ---------- Hero ---------- */

        .wl-hero {
          position: relative;
          overflow: hidden;
          padding: 88px 0 96px;
          background: var(--wl-night);
          color: #ffffff;
        }

        .wl-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(96, 165, 250, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96, 165, 250, 0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(
            ellipse 80% 70% at 50% 30%,
            #000 30%,
            transparent 100%
          );
          -webkit-mask-image: radial-gradient(
            ellipse 80% 70% at 50% 30%,
            #000 30%,
            transparent 100%
          );
        }

        .wl-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }

        .wl-glow-a {
          width: 520px;
          height: 520px;
          top: -220px;
          right: -120px;
          background: rgba(59, 130, 246, 0.35);
          animation: wl-drift 14s ease-in-out infinite alternate;
        }

        .wl-glow-b {
          width: 380px;
          height: 380px;
          bottom: -200px;
          left: -100px;
          background: rgba(34, 211, 238, 0.18);
          animation: wl-drift 18s ease-in-out infinite alternate-reverse;
        }

        .wl-hero-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 56px;
          align-items: center;
        }

        .wl-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          color: #bfdbfe;
          font-size: 13px;
          font-weight: 500;
        }

        .wl-pill-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2);
        }

        .wl-hero h1 {
          margin: 24px 0 20px;
          font-family: var(--font-heading, inherit);
          font-size: clamp(38px, 5.4vw, 66px);
          font-weight: 800;
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .wl-hero-sub {
          max-width: 520px;
          color: #94a3b8;
          font-size: 17px;
          line-height: 1.7;
        }

        .wl-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .wl-hero-note {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 22px;
          margin-top: 28px;
          color: #94a3b8;
          font-size: 13px;
        }

        .wl-hero-note span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .wl-hero-note i {
          color: #34d399;
        }

        /* Visual */

        .wl-visual {
          position: relative;
          padding: 28px 0 28px 20px;
        }

        .wl-visual::before {
          content: "";
          position: absolute;
          inset: 8% 4%;
          border-radius: 32px;
          background: radial-gradient(
            circle,
            rgba(59, 130, 246, 0.35),
            transparent 70%
          );
          filter: blur(30px);
        }

        .wl-card {
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background: linear-gradient(
            160deg,
            rgba(255, 255, 255, 0.09),
            rgba(255, 255, 255, 0.03)
          );
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 40px 80px -30px rgba(0, 0, 0, 0.7);
          overflow: hidden;
        }

        .wl-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 12px;
          color: #94a3b8;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .wl-dots {
          display: flex;
          gap: 6px;
        }

        .wl-dots i {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
        }

        .wl-blueprint {
          padding: 10px 18px 0;
        }

        .wl-blueprint svg {
          display: block;
          width: 100%;
          height: auto;
        }

        .wl-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: wl-draw 1.8s ease forwards;
        }

        .wl-draw-2 {
          animation-delay: 0.5s;
        }

        .wl-draw-3 {
          animation-delay: 1s;
        }

        .wl-svg-text {
          fill: #93c5fd;
          font-size: 11px;
          font-weight: 600;
          opacity: 0;
          animation: wl-fade 0.6s ease 1.6s forwards;
        }

        .wl-cuts {
          display: grid;
          gap: 2px;
          padding: 8px 18px 20px;
        }

        .wl-cut {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 9px 0;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
          font-size: 13px;
        }

        .wl-cut:last-child {
          border-bottom: 0;
        }

        .wl-cut span {
          color: #94a3b8;
        }

        .wl-cut b {
          color: #ffffff;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }

        .wl-chip {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 14px;
          background: rgba(11, 23, 48, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 20px 40px -16px rgba(0, 0, 0, 0.6);
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
        }

        .wl-chip i {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          font-size: 15px;
        }

        .wl-chip small {
          display: block;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 500;
        }

        .wl-chip-pdf {
          top: 0;
          right: -6px;
          animation: wl-float 6s ease-in-out infinite;
        }

        .wl-chip-pdf i {
          background: rgba(239, 68, 68, 0.18);
          color: #fca5a5;
        }

        .wl-chip-offline {
          bottom: 0;
          left: -4px;
          animation: wl-float 7s ease-in-out infinite reverse;
        }

        .wl-chip-offline i {
          background: rgba(52, 211, 153, 0.18);
          color: #6ee7b7;
        }

        /* ---------- Stats ---------- */

        .wl-stats {
          position: relative;
          z-index: 2;
          margin-top: -44px;
        }

        .wl-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--wl-line);
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 30px 60px -30px rgba(11, 23, 48, 0.25);
        }

        .wl-stat {
          padding: 26px 24px;
          border-right: 1px solid var(--wl-line);
        }

        .wl-stat:last-child {
          border-right: 0;
        }

        .wl-stat b {
          display: block;
          font-family: var(--font-heading, inherit);
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--wl-ink);
        }

        .wl-stat span {
          display: block;
          margin-top: 4px;
          color: var(--wl-muted);
          font-size: 13px;
          line-height: 1.4;
        }

        /* ---------- Marquee ---------- */

        .wl-marquee {
          margin-top: 56px;
          overflow: hidden;
          mask-image: linear-gradient(
            90deg,
            transparent,
            #000 12%,
            #000 88%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            #000 12%,
            #000 88%,
            transparent
          );
        }

        .wl-marquee-track {
          display: flex;
          gap: 12px;
          width: max-content;
          animation: wl-scroll 40s linear infinite;
        }

        .wl-marquee:hover .wl-marquee-track {
          animation-play-state: paused;
        }

        .wl-tag {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 10px 18px;
          border: 1px solid var(--wl-line);
          border-radius: 999px;
          background: #f8fafc;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }

        .wl-tag i {
          color: #2563eb;
        }

        /* ---------- Sections ---------- */

        .wl-section {
          padding: 104px 0;
        }

        .wl-heading {
          max-width: 640px;
          margin: 0 auto 56px;
          text-align: center;
        }

        .wl-eyebrow {
          display: inline-block;
          margin-bottom: 14px;
          color: #2563eb;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .wl-heading h2 {
          font-family: var(--font-heading, inherit);
          font-size: clamp(30px, 4vw, 44px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.035em;
        }

        .wl-heading p {
          margin-top: 16px;
          color: var(--wl-muted);
          font-size: 17px;
          line-height: 1.65;
        }

        /* ---------- Steps ---------- */

        .wl-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .wl-step {
          position: relative;
          padding: 32px 28px;
          border: 1px solid var(--wl-line);
          border-radius: 24px;
          background: #ffffff;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .wl-step:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 50px -28px rgba(11, 23, 48, 0.3);
        }

        .wl-step-num {
          position: absolute;
          top: 22px;
          right: 26px;
          font-family: var(--font-heading, inherit);
          font-size: 56px;
          font-weight: 800;
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1.5px #dbe4f0;
        }

        .wl-step-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #1d4ed8;
          font-size: 22px;
        }

        .wl-step h3 {
          margin: 28px 0 10px;
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .wl-step p {
          color: var(--wl-muted);
          font-size: 15px;
          line-height: 1.65;
        }

        /* ---------- Features ---------- */

        .wl-features {
          background: #f8fafc;
          border-top: 1px solid var(--wl-line);
          border-bottom: 1px solid var(--wl-line);
        }

        .wl-bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .wl-bento-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: 250px;
          padding: 32px;
          border: 1px solid var(--wl-line);
          border-radius: 26px;
          background: #ffffff;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .wl-bento-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 50px -28px rgba(11, 23, 48, 0.3);
        }

        .wl-bento-wide {
          grid-column: span 2;
        }

        .wl-bento-icon {
          position: absolute;
          top: 28px;
          left: 32px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 22px;
        }

        .wl-bento-card h3 {
          font-size: 21px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .wl-bento-card p {
          margin-top: 10px;
          max-width: 440px;
          color: var(--wl-muted);
          font-size: 15px;
          line-height: 1.65;
        }

        .wl-bento-dark {
          border-color: transparent;
          background:
            radial-gradient(
              90% 90% at 100% 0%,
              rgba(59, 130, 246, 0.45),
              transparent 60%
            ),
            linear-gradient(160deg, #10224a, #070f1f);
          color: #ffffff;
        }

        .wl-bento-dark p {
          color: #94a3b8;
        }

        .wl-bento-dark .wl-bento-icon {
          background: rgba(255, 255, 255, 0.1);
          color: #bfdbfe;
        }

        .wl-bento-accent {
          border-color: transparent;
          background: linear-gradient(135deg, #2563eb, #0891b2);
          color: #ffffff;
        }

        .wl-bento-accent p {
          color: rgba(255, 255, 255, 0.8);
        }

        .wl-bento-accent .wl-bento-icon {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }

        /* ---------- Systems ---------- */

        .wl-filters {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 36px;
        }

        .wl-filter {
          padding: 10px 20px;
          border: 1px solid var(--wl-line);
          border-radius: 999px;
          background: #ffffff;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .wl-filter:hover {
          border-color: #bfdbfe;
          color: #1d4ed8;
        }

        .wl-filter.is-active {
          border-color: var(--wl-ink);
          background: var(--wl-ink);
          color: #ffffff;
        }

        .wl-systems {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .wl-system {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 24px;
          padding: 24px;
          border: 1px solid var(--wl-line);
          border-radius: 20px;
          background: #ffffff;
          animation: wl-pop 0.45s ease both;
          transition: transform 0.25s ease, border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .wl-system:hover {
          transform: translateY(-4px);
          border-color: #bfdbfe;
          box-shadow: 0 24px 40px -24px rgba(37, 99, 235, 0.35);
        }

        .wl-system-icon {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 20px;
        }

        .wl-system h3 {
          margin: 18px 0 4px;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.015em;
        }

        .wl-system p {
          color: var(--wl-muted);
          font-size: 14px;
        }

        .wl-system-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px dashed var(--wl-line);
          color: var(--wl-muted);
          font-size: 12px;
        }

        .wl-system-foot b {
          color: var(--wl-ink);
          font-weight: 700;
        }

        .wl-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #059669;
          font-weight: 600;
        }

        .wl-status::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
        }

        /* ---------- CTA ---------- */

        .wl-cta {
          position: relative;
          overflow: hidden;
          padding: 112px 0;
          background: var(--wl-night);
          color: #ffffff;
          text-align: center;
        }

        .wl-cta::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(96, 165, 250, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96, 165, 250, 0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(
            ellipse 70% 80% at 50% 50%,
            #000 20%,
            transparent 100%
          );
          -webkit-mask-image: radial-gradient(
            ellipse 70% 80% at 50% 50%,
            #000 20%,
            transparent 100%
          );
        }

        .wl-cta-glow {
          position: absolute;
          width: 640px;
          height: 640px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.3);
          filter: blur(110px);
        }

        .wl-cta-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
        }

        .wl-cta h2 {
          font-family: var(--font-heading, inherit);
          font-size: clamp(32px, 4.6vw, 52px);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .wl-cta p {
          margin: 18px 0 36px;
          color: #94a3b8;
          font-size: 17px;
          line-height: 1.65;
        }

        .wl-cta .wl-btn {
          height: 56px;
          padding: 0 34px;
          font-size: 16px;
        }

        /* ---------- Footer ---------- */

        .wl-footer {
          padding: 56px 0 28px;
          background: #ffffff;
          border-top: 1px solid var(--wl-line);
        }

        .wl-footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 40px;
        }

        .wl-footer .wl-brand {
          color: var(--wl-ink);
        }

        .wl-footer-desc {
          max-width: 300px;
          margin-top: 14px;
          color: var(--wl-muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .wl-footer h4 {
          margin-bottom: 14px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--wl-ink);
        }

        .wl-footer ul {
          display: grid;
          gap: 10px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .wl-footer li a,
        .wl-footer li span {
          color: var(--wl-muted);
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .wl-footer li a:hover {
          color: #1d4ed8;
        }

        .wl-footer-bottom {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 44px;
          padding-top: 22px;
          border-top: 1px solid var(--wl-line);
          color: #94a3b8;
          font-size: 13px;
        }

        /* ---------- Keyframes ---------- */

        @keyframes wl-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes wl-fade {
          to {
            opacity: 1;
          }
        }

        @keyframes wl-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes wl-drift {
          to {
            transform: translate(-40px, 30px);
          }
        }

        @keyframes wl-scroll {
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes wl-pop {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wl-page *,
          .wl-page *::before,
          .wl-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .wl-reveal {
            opacity: 1;
            transform: none;
          }
        }

        /* ---------- Responsive ---------- */

        @media (max-width: 960px) {
          .wl-hero {
            padding: 64px 0 88px;
          }

          .wl-hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }

          .wl-visual {
            max-width: 520px;
            margin: 0 auto;
            padding-left: 0;
          }

          .wl-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .wl-stat:nth-child(2) {
            border-right: 0;
          }

          .wl-stat:nth-child(-n + 2) {
            border-bottom: 1px solid var(--wl-line);
          }

          .wl-steps {
            grid-template-columns: 1fr;
          }

          .wl-bento {
            grid-template-columns: 1fr 1fr;
          }

          .wl-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 720px) {
          .wl-burger {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .wl-nav-links {
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            display: none;
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
            padding: 14px 20px 20px;
            background: rgba(6, 13, 28, 0.97);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .wl-nav-links.is-open {
            display: flex;
          }

          .wl-nav-link,
          .wl-nav-login {
            margin: 0;
            padding: 13px 14px;
            text-align: center;
          }

          .wl-section {
            padding: 72px 0;
          }

          .wl-heading {
            margin-bottom: 40px;
          }

          .wl-bento {
            grid-template-columns: 1fr;
          }

          .wl-bento-wide {
            grid-column: auto;
          }

          .wl-bento-card {
            min-height: 230px;
            padding: 26px;
          }

          .wl-bento-icon {
            left: 26px;
          }

          .wl-hero-actions .wl-btn {
            width: 100%;
          }

          .wl-chip-pdf {
            right: 0;
          }

          .wl-chip-offline {
            left: 0;
          }

          .wl-footer-bottom {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .wl-stat {
            padding: 20px 16px;
          }

          .wl-stat b {
            font-size: 24px;
          }

          .wl-footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
      `}</style>

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <nav className="wl-nav">
        <div className="wl-container wl-nav-inner">
          <Link to="/" className="wl-brand">
            <img src="/og-image.png" alt="Desglose Pro" />
            <span>Desglose Pro</span>
          </Link>

          <button
            type="button"
            className="wl-burger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <i className={`bi bi-${menuOpen ? "x-lg" : "list"}`}></i>
          </button>

          <div className={`wl-nav-links ${menuOpen ? "is-open" : ""}`}>
            <a
              href="#como-funciona"
              className="wl-nav-link"
              onClick={(e) => goTo(e, "como-funciona")}
            >
              Cómo funciona
            </a>
            <a
              href="#caracteristicas"
              className="wl-nav-link"
              onClick={(e) => goTo(e, "caracteristicas")}
            >
              Características
            </a>
            <a
              href="#sistemas"
              className="wl-nav-link"
              onClick={(e) => goTo(e, "sistemas")}
            >
              Sistemas
            </a>
            <Link to="/login" className="wl-nav-login">
              Entrar
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ===================================================
            HERO
        ==================================================== */}
        <header className="wl-hero">
          <span className="wl-glow wl-glow-a"></span>
          <span className="wl-glow wl-glow-b"></span>

          <div className="wl-container wl-hero-grid">
            <div>
              <span className="wl-pill">
                <span className="wl-pill-dot"></span>
                Software para talleres de aluminio y vidrio
              </span>

              <h1>
                De la medida al corte,{" "}
                <span className="wl-grad">sin errores.</span>
              </h1>

              <p className="wl-hero-sub">
                Genera despieces exactos para ventanas, puertas y vidrio.
                Exporta en PDF y trabaja desde cualquier dispositivo, incluso
                sin internet.
              </p>

              <div className="wl-hero-actions">
                <Link to="/signup" className="wl-btn wl-btn-primary">
                  Comenzar gratis
                  <i className="bi bi-arrow-right"></i>
                </Link>

                <a
                  href="#sistemas"
                  className="wl-btn wl-btn-ghost"
                  onClick={(e) => goTo(e, "sistemas")}
                >
                  Ver sistemas
                  <i className="bi bi-layers"></i>
                </a>
              </div>

              <div className="wl-hero-note">
                <span>
                  <i className="bi bi-check-circle-fill"></i>
                  Sin tarjeta para empezar
                </span>
                <span>
                  <i className="bi bi-check-circle-fill"></i>
                  Soporte por WhatsApp
                </span>
              </div>
            </div>

            {/* Visual */}
            <div className="wl-visual">
              <div className="wl-card">
                <div className="wl-card-top">
                  <span className="wl-dots">
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>
                  <span>DESGLOSE_P92.PDF</span>
                </div>

                <div className="wl-blueprint">
                  <svg
                    viewBox="0 0 300 200"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label="Plano de ventana de 33 por 33 pulgadas"
                  >
                    {/* Marco */}
                    <rect
                      className="wl-draw"
                      pathLength="1"
                      x="44"
                      y="22"
                      width="212"
                      height="128"
                      rx="3"
                    />
                    {/* Hojas */}
                    <rect
                      className="wl-draw wl-draw-2"
                      pathLength="1"
                      x="52"
                      y="30"
                      width="100"
                      height="112"
                      rx="2"
                      stroke="#22d3ee"
                    />
                    <rect
                      className="wl-draw wl-draw-2"
                      pathLength="1"
                      x="148"
                      y="30"
                      width="100"
                      height="112"
                      rx="2"
                      stroke="#22d3ee"
                    />
                    {/* Vidrios */}
                    <rect
                      className="wl-draw wl-draw-3"
                      pathLength="1"
                      x="62"
                      y="40"
                      width="80"
                      height="92"
                      strokeOpacity="0.55"
                    />
                    <rect
                      className="wl-draw wl-draw-3"
                      pathLength="1"
                      x="158"
                      y="40"
                      width="80"
                      height="92"
                      strokeOpacity="0.55"
                    />

                    {/* Cota inferior */}
                    <path
                      className="wl-draw wl-draw-3"
                      pathLength="1"
                      d="M44 172 H256 M44 166 V178 M256 166 V178"
                      stroke="#93c5fd"
                    />
                    <text
                      className="wl-svg-text"
                      x="150"
                      y="193"
                      textAnchor="middle"
                      stroke="none"
                    >
                      33"
                    </text>

                    {/* Cota lateral */}
                    <path
                      className="wl-draw wl-draw-3"
                      pathLength="1"
                      d="M22 22 V150 M16 22 H28 M16 150 H28"
                      stroke="#93c5fd"
                    />
                    <text
                      className="wl-svg-text"
                      x="14"
                      y="90"
                      textAnchor="middle"
                      transform="rotate(-90 14 90)"
                      stroke="none"
                    >
                      33"
                    </text>
                  </svg>
                </div>

                <div className="wl-cuts">
                  {heroCuts.map((cut) => (
                    <div className="wl-cut" key={cut.label}>
                      <span>{cut.label}</span>
                      <b>{cut.value}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div className="wl-chip wl-chip-pdf">
                <i className="bi bi-file-earmark-pdf-fill"></i>
                <div>
                  PDF listo
                  <small>Para corte y fabricación</small>
                </div>
              </div>

              <div className="wl-chip wl-chip-offline">
                <i className="bi bi-wifi-off"></i>
                <div>
                  Funciona offline
                  <small>Ideal para obra</small>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            STATS
        ==================================================== */}
        <section className="wl-stats">
          <div className="wl-container">
            <div className="wl-stats-grid wl-reveal">
              {stats.map((item) => (
                <div className="wl-stat" key={item.label}>
                  <b>{item.value}</b>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="wl-marquee" aria-hidden="true">
              <div className="wl-marquee-track">
                {marquee.map((sys, index) => (
                  <span className="wl-tag" key={`${sys.name}-${index}`}>
                    <i className={`bi ${sys.icon}`}></i>
                    {sys.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            CÓMO FUNCIONA
        ==================================================== */}
        <section id="como-funciona" className="wl-section">
          <div className="wl-container">
            <div className="wl-heading wl-reveal">
              <span className="wl-eyebrow">Cómo funciona</span>
              <h2>Tres pasos. Cero cálculos a mano.</h2>
              <p>
                Olvídate de las libretas, las calculadoras y los errores de
                medida. Desglose Pro hace el trabajo pesado.
              </p>
            </div>

            <div className="wl-steps">
              {steps.map((step, index) => (
                <div
                  className="wl-step wl-reveal"
                  key={step.title}
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <span className="wl-step-num">0{index + 1}</span>
                  <div className="wl-step-icon">
                    <i className={`bi ${step.icon}`}></i>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            CARACTERÍSTICAS
        ==================================================== */}
        <section id="caracteristicas" className="wl-section wl-features">
          <div className="wl-container">
            <div className="wl-heading wl-reveal">
              <span className="wl-eyebrow">Características</span>
              <h2>Todo lo que tu taller necesita.</h2>
              <p>
                Herramientas de alta precisión para automatizar tus operaciones
                diarias y reducir el desperdicio de perfiles.
              </p>
            </div>

            <div className="wl-bento">
              {features.map((item, index) => (
                <div
                  key={item.title}
                  className={[
                    "wl-bento-card",
                    "wl-reveal",
                    item.wide ? "wl-bento-wide" : "",
                    item.variant ? `wl-bento-${item.variant}` : "",
                  ].join(" ")}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="wl-bento-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            SISTEMAS
        ==================================================== */}
        <section id="sistemas" className="wl-section">
          <div className="wl-container">
            <div className="wl-heading wl-reveal">
              <span className="wl-eyebrow">Sistemas y perfiles</span>
              <h2>Compatibles e incluidos.</h2>
              <p>
                Soporte nativo para las líneas de carpintería de aluminio más
                utilizadas en la República Dominicana.
              </p>
            </div>

            <div className="wl-filters">
              {filters.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`wl-filter ${
                    filter === item.id ? "is-active" : ""
                  }`}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="wl-systems">
              {visibleSystems.map((sys, index) => (
                <div
                  className="wl-system"
                  key={`${filter}-${sys.name}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div>
                    <div className="wl-system-icon">
                      <i className={`bi ${sys.icon}`}></i>
                    </div>
                    <h3>{sys.name}</h3>
                    <p>{sys.type}</p>
                  </div>

                  <div className="wl-system-foot">
                    <span>
                      Precisión <b>{sys.precision}</b>
                    </span>
                    <span className="wl-status">{sys.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================
            CTA FINAL
        ==================================================== */}
        <section className="wl-cta">
          <span className="wl-cta-glow"></span>

          <div className="wl-container wl-cta-inner wl-reveal">
            <h2>
              Moderniza el cálculo{" "}
              <span className="wl-grad">en tu taller.</span>
            </h2>
            <p>
              Crea tu cuenta y empieza a trabajar con despieces precisos hoy
              mismo.
            </p>

            <Link to="/signup" className="wl-btn wl-btn-primary">
              Crear cuenta gratis
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="wl-footer">
        <div className="wl-container">
          <div className="wl-footer-grid">
            <div>
              <Link to="/" className="wl-brand">
                <img src="/og-image.png" alt="Desglose Pro" />
                <span>Desglose Pro</span>
              </Link>
              <p className="wl-footer-desc">
                La plataforma profesional para talleres de aluminio y vidrio.
              </p>
            </div>

            <div>
              <h4>Navegación</h4>
              <ul>
                <li>
                  <a
                    href="#caracteristicas"
                    onClick={(e) => goTo(e, "caracteristicas")}
                  >
                    Características
                  </a>
                </li>
                <li>
                  <a href="#sistemas" onClick={(e) => goTo(e, "sistemas")}>
                    Sistemas
                  </a>
                </li>
                <li>
                  <Link to="/signup">Registro</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4>Legal</h4>
              <ul>
                <li>
                  <a
                    href="/legal/PrivacyPolicy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Política de privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="/legal/TermsOfService.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Términos de servicio
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4>Soporte</h4>
              <ul>
                <li>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <span>Versión 6.0.0</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="wl-footer-bottom">
            <div>© 2026 Desglose Pro. Todos los derechos reservados.</div>
            <div>Calcula. Organiza. Fabrica.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}