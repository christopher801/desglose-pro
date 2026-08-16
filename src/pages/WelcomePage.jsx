import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function WelcomePage() {
  const { user, isActive } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is already authenticated, redirect based on active status
  if (user) {
    return <Navigate to={isActive ? "/dashboard" : "/pending"} replace />;
  }

  const systemsList = [
    {
      name: "Ventana P-92",
      type: "Corredera 2, 3 o 4 hojas",
      precision: '1/16"',
      status: "Disponible",
      icon: "bi-window-sidebar",
      tag: "Popular",
    },
    {
      name: "Ventana P-65",
      type: "Corredera 2, 3 o 4 hojas",
      precision: '1/16"',
      status: "Disponible",
      icon: "bi-window-stack",
      tag: "popular",
    },
    {
      name: "Ventana Tradicional",
      type: "Corredera 2, 3 o 4 hojas",
      precision: '1/16"',
      status: "Disponible",
      icon: "bi-window",
      tag: "popular",
    },
    {
      name: "P-40 Proyectada",
      type: "Sistema proyectado",
      precision: '1/16"',
      status: "Disponible",
      icon: "bi-box-arrow-up-right",
      tag: "popular",
    },
    {
      name: "Puerta Comercial",
      type: "Puertas de aluminio",
      precision: '1/16"',
      status: "Disponible",
      icon: "bi-door-open",
      tag: "popular",
    },
    {
      name: "Puerta Abisagrada P40",
      type: "Puertas de aluminio",
      precision: '1/16"',
      status: "Disponible",
      icon: "bi-door-closed",
      tag: "popular",
    },
    {
      name: "Croquis de Vidrio",
      type: "Optimizador",
      precision: "Millimetros / In",
      status: "Herramienta",
      icon: "bi-aspect-ratio",
      tag: "Corte Vidrio",
    },
  ];

  return (
    <div className="welcome-container">
      {/* Dynamic CSS Styles */}
      <style>{`
  :root {
    --primary-dark: #0d1e3d;
    --primary-navy: #132a52;
    --accent-blue: #1e3a8a;
    --highlight: #3b82f6;
    --highlight-light: #60a5fa;
    --cyan-accent: #06b6d4;
    --bg-light: #f8fafc;
    --text-dark: #0f172a;
    --text-muted: #64748b;
    --border-color: #e2e8f0;
    --card-shadow: 0 10px 30px -5px rgba(13, 30, 61, 0.08);
    --glow-shadow: 0 0 25px rgba(59, 130, 246, 0.25);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    width: 100%;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  body {
    width: 100%;
    overflow-x: hidden;
  }

  .welcome-container {
    width: 100%;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont,
      'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: var(--text-dark);
    background-color: var(--bg-light);
    overflow-x: hidden;
  }

  img,
  svg {
    max-width: 100%;
  }

  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }

  /* =====================================================
     BACKGROUND GRID
  ===================================================== */

  .bg-grid-pattern {
    background-size: 30px 30px;
    background-image:
      linear-gradient(
        to right,
        rgba(13, 30, 61, 0.04) 1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        rgba(13, 30, 61, 0.04) 1px,
        transparent 1px
      );
  }

  .bg-dark-grid {
    background-size: 30px 30px;
    background-image:
      linear-gradient(
        to right,
        rgba(255, 255, 255, 0.05) 1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.05) 1px,
        transparent 1px
      );
  }

  /* =====================================================
     NAVBAR
  ===================================================== */

  .navbar {
    position: sticky;
    top: 0;
    z-index: 1000;

    width: 100%;

    background: rgba(13, 30, 61, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    padding: 0.85rem clamp(1rem, 3vw, 1.5rem);

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    min-width: 0;
  }

  .brand-logo-box {
    flex: 0 0 auto;
    color: #ffffff;
    font-weight: 900;
    font-size: 1.1rem;

    width: 38px;
    height: 38px;

    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;


    letter-spacing: -0.5px;
  }

  .brand-name {
    color: #ffffff;
    font-weight: 800;
    font-size: clamp(1rem, 2vw, 1.25rem);
    letter-spacing: -0.5px;

    white-space: nowrap;
  }

  .brand-tag {
    background: rgba(59, 130, 246, 0.2);
    color: var(--highlight-light);

    font-size: 0.65rem;
    font-weight: 700;

    padding: 2px 6px;

    border-radius: 4px;

    text-transform: uppercase;
    letter-spacing: 0.5px;

    border: 1px solid rgba(59, 130, 246, 0.3);

    white-space: nowrap;
  }

  .nav-menu {
    display: flex;
    align-items: center;
    gap: clamp(1rem, 2.5vw, 2rem);

    list-style: none;
  }

  .nav-link {
    color: #cbd5e1;
    text-decoration: none;

    font-size: 0.925rem;
    font-weight: 500;

    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: #ffffff;
  }

  .btn-login {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff;

    border: 1px solid rgba(255, 255, 255, 0.2);

    padding: 0.5rem 1.25rem;

    border-radius: 8px;

    font-weight: 600;
    font-size: 0.9rem;

    text-decoration: none;

    transition: all 0.2s ease;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 0.5rem;

    white-space: nowrap;
  }

  .btn-login:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .mobile-toggle {
    display: none;

    background: transparent;
    border: none;

    color: #ffffff;

    font-size: 1.5rem;

    cursor: pointer;

    width: 42px;
    height: 42px;

    align-items: center;
    justify-content: center;

    border-radius: 8px;
  }

  .mobile-toggle:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  /* =====================================================
     BUTTONS
  ===================================================== */

  .btn-primary-action,
  .btn-secondary-action {
    min-height: 46px;

    padding: 0.75rem 1.5rem;

    border-radius: 10px;

    font-weight: 700;
    font-size: 0.95rem;

    text-decoration: none;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 0.6rem;

    cursor: pointer;

    transition: all 0.25s ease;

    text-align: center;
  }

  .btn-primary-action {
    background: linear-gradient(
      135deg,
      var(--highlight),
      var(--accent-blue)
    );

    color: #ffffff;

    border: none;

    box-shadow:
      0 4px 14px rgba(59, 130, 246, 0.35);
  }

  .btn-primary-action:hover {
    transform: translateY(-2px);

    box-shadow:
      0 6px 20px rgba(59, 130, 246, 0.5);
  }

  .btn-secondary-action {
    background: #ffffff;
    color: var(--primary-dark);

    border: 1px solid var(--border-color);

    box-shadow:
      0 2px 5px rgba(0, 0, 0, 0.04);
  }

  .btn-secondary-action:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  /* =====================================================
     HERO
  ===================================================== */

  .hero {
    width: 100%;

    background:
      linear-gradient(
        180deg,
        var(--primary-dark) 0%,
        var(--primary-navy) 100%
      );

    color: #ffffff;

    padding:
      clamp(3rem, 7vw, 5rem)
      clamp(1rem, 4vw, 1.5rem)
      clamp(4rem, 8vw, 6rem);

    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';

    position: absolute;

    top: -20%;
    right: -10%;

    width: min(600px, 80vw);
    height: min(600px, 80vw);

    background:
      radial-gradient(
        circle,
        rgba(59, 130, 246, 0.15) 0%,
        transparent 70%
      );

    pointer-events: none;
  }

  .hero-container {
    width: 100%;
    max-width: 1200px;

    margin: 0 auto;

    display: grid;

    grid-template-columns:
      minmax(0, 1.1fr)
      minmax(0, 0.9fr);

    gap: clamp(2rem, 5vw, 3.5rem);

    align-items: center;

    position: relative;
    z-index: 10;
  }

  .hero-content {
    min-width: 0;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;

    gap: 0.5rem;

    background: rgba(59, 130, 246, 0.15);

    border: 1px solid rgba(59, 130, 246, 0.3);

    color: var(--highlight-light);

    padding: 0.4rem 1rem;

    border-radius: 50px;

    font-size: 0.85rem;
    font-weight: 600;

    margin-bottom: 1.5rem;

    max-width: 100%;
  }

  .hero-title {
    font-size: clamp(2.2rem, 5vw, 3.25rem);

    font-weight: 900;

    line-height: 1.15;

    letter-spacing: -1px;

    margin-bottom: 1.25rem;

    overflow-wrap: break-word;
  }

  .hero-title span {
    background:
      linear-gradient(
        135deg,
        #60a5fa,
        #38bdf8
      );

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    background-clip: text;
  }

  .hero-subtitle {
    font-size: clamp(1rem, 2vw, 1.15rem);

    color: #94a3b8;

    line-height: 1.6;

    margin-bottom: 2.25rem;

    max-width: 580px;
  }

  .hero-actions {
    display: flex;

    gap: 1rem;

    flex-wrap: wrap;

    margin-bottom: 3rem;
  }

  .trust-badges {
    display: flex;
    align-items: center;

    gap: clamp(1rem, 3vw, 2rem);

    padding-top: 1.5rem;

    border-top:
      1px solid rgba(255, 255, 255, 0.1);

    flex-wrap: wrap;
  }

  .trust-item {
    display: flex;
    align-items: center;

    gap: 0.6rem;

    min-width: 0;
  }

  .trust-icon {
    color: var(--highlight-light);
    font-size: 1.2rem;
    flex: 0 0 auto;
  }

  .trust-text {
    font-size: 0.85rem;

    color: #cbd5e1;

    font-weight: 600;
  }

  /* =====================================================
     MOCKUP
  ===================================================== */

  .hero-mockup-wrapper {
    position: relative;
    width: 100%;
    min-width: 0;
  }

  .hero-mockup-card {
    width: 100%;

    background: #0f172a;

    border:
      1px solid rgba(255, 255, 255, 0.15);

    border-radius: 16px;

    padding: clamp(0.75rem, 2vw, 1.25rem);

    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.5);

    position: relative;

    overflow: hidden;
  }

  .mockup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-bottom: 0.75rem;
    margin-bottom: 0.75rem;

    border-bottom:
      1px solid rgba(255, 255, 255, 0.08);
  }

  .mockup-dots {
    display: flex;
    gap: 6px;
  }

  .dot {
    width: 10px;
    height: 10px;

    border-radius: 50%;

    flex: 0 0 auto;
  }

  .dot-red {
    background: #ef4444;
  }

  .dot-yellow {
    background: #f59e0b;
  }

  .dot-green {
    background: #10b981;
  }

  .mockup-preview-box {
    width: 100%;

    background: #1e293b;

    border-radius: 10px;

    padding: clamp(0.65rem, 2vw, 1rem);

    border:
      1px solid rgba(255, 255, 255, 0.05);

    max-height: 480px;

    overflow-x: auto;
    overflow-y: auto;

    -webkit-overflow-scrolling: touch;
  }

  .mockup-preview-box::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .mockup-preview-box::-webkit-scrollbar-track {
    background: #0f172a;
  }

  .mockup-preview-box::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 3px;
  }

  .seccion {
    margin-bottom: 1.25rem;
  }

  .seccion:last-child {
    margin-bottom: 0;
  }

  .seccion h3 {
    color: #38bdf8;

    font-size: 0.95rem;
    font-weight: 700;

    margin-bottom: 0.6rem;

    display: flex;
    align-items: center;

    gap: 0.4rem;

    white-space: nowrap;
  }

  .tabla-ventanas {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .mockup-preview-box table {
    width: 100%;

    min-width: 420px;

    border-collapse: collapse;

    font-size: 0.75rem;

    text-align: center;

    color: #cbd5e1;
  }

  .mockup-preview-box th,
  .mockup-preview-box td {
    padding: 0.4rem 0.5rem;

    border:
      1px solid rgba(255, 255, 255, 0.1);

    white-space: nowrap;
  }

  .mockup-preview-box th {
    background: #0f172a;
    color: #f8fafc;
    font-weight: 600;
  }

  .mockup-preview-box td {
    background: rgba(15, 23, 42, 0.5);
  }

  .mockup-preview-box tr:hover td {
    background:
      rgba(59, 130, 246, 0.1);
  }

  /* =====================================================
     GENERAL SECTIONS
  ===================================================== */

  .section-padding {
    width: 100%;
    max-width: 1200px;

    margin: 0 auto;

    padding:
      clamp(3.5rem, 7vw, 5rem)
      clamp(1rem, 4vw, 1.5rem);
  }

  .section-header {
    text-align: center;

    width: 100%;
    max-width: 700px;

    margin:
      0 auto
      clamp(2.5rem, 5vw, 3.5rem);
  }

  .section-tag {
    color: var(--highlight);

    font-weight: 800;

    font-size: 0.85rem;

    text-transform: uppercase;

    letter-spacing: 1.5px;

    margin-bottom: 0.5rem;

    display: block;
  }

  .section-title {
    font-size: clamp(1.8rem, 4vw, 2.25rem);

    font-weight: 800;

    color: var(--primary-dark);

    letter-spacing: -0.5px;

    margin-bottom: 1rem;
  }

  .section-desc {
    color: var(--text-muted);

    font-size: clamp(0.95rem, 2vw, 1.05rem);

    line-height: 1.6;
  }

  /* =====================================================
     BENTO
  ===================================================== */

  .bento-grid {
    display: grid;

    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: clamp(1rem, 2vw, 1.5rem);
  }

  .bento-card {
    min-width: 0;

    background: #ffffff;

    border:
      1px solid var(--border-color);

    border-radius: 16px;

    padding: clamp(1.25rem, 3vw, 2rem);

    box-shadow: var(--card-shadow);

    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;

    position: relative;

    overflow: hidden;
  }

  .bento-card:hover {
    transform: translateY(-4px);

    box-shadow:
      0 20px 35px -10px
      rgba(13, 30, 61, 0.12);
  }

  .bento-card.span-2 {
    grid-column: span 2;
  }

  .bento-icon-wrapper {
    width: 52px;
    height: 52px;

    border-radius: 12px;

    background:
      rgba(59, 130, 246, 0.08);

    color: var(--highlight);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 1.5rem;

    margin-bottom: 1.25rem;
  }

  .bento-title {
    font-size: 1.25rem;

    font-weight: 700;

    color: var(--primary-dark);

    margin-bottom: 0.75rem;
  }

  .bento-desc {
    color: var(--text-muted);

    font-size: 0.95rem;

    line-height: 1.6;
  }

  /* =====================================================
     SYSTEMS
  ===================================================== */

  .systems-grid {
    display: grid;

    grid-template-columns:
      repeat(
        auto-fit,
        minmax(
          min(100%, 280px),
          1fr
        )
      );

    gap: 1.25rem;
  }

  .system-card {
    min-width: 0;

    background: #ffffff;

    border:
      1px solid var(--border-color);

    border-radius: 14px;

    padding: 1.5rem;

    display: flex;
    flex-direction: column;

    justify-content: space-between;

    transition: all 0.2s ease;
  }

  .system-card:hover {
    border-color: var(--highlight);

    transform: translateY(-2px);

    box-shadow: var(--card-shadow);
  }

  .system-top {
    display: flex;

    align-items: flex-start;

    justify-content: space-between;

    gap: 1rem;

    margin-bottom: 1rem;
  }

  .system-icon {
    width: 44px;
    height: 44px;

    flex: 0 0 auto;

    border-radius: 10px;

    background: var(--primary-dark);

    color: #ffffff;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 1.25rem;
  }

  .system-badge {
    background: #f1f5f9;

    color: var(--primary-dark);

    font-size: 0.7rem;
    font-weight: 700;

    padding: 3px 8px;

    border-radius: 20px;

    text-transform: uppercase;

    white-space: nowrap;
  }

  .system-name {
    font-weight: 800;

    font-size: 1.1rem;

    color: var(--primary-dark);

    margin-bottom: 0.25rem;

    overflow-wrap: break-word;
  }

  .system-type {
    font-size: 0.85rem;

    color: var(--text-muted);

    margin-bottom: 1rem;
  }

  .system-footer {
    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 1rem;

    padding-top: 0.75rem;

    border-top:
      1px solid #f1f5f9;

    font-size: 0.8rem;

    font-weight: 600;

    color: var(--highlight);
  }

  /* =====================================================
     CTA
  ===================================================== */

  .cta-section {
    width: 100%;

    background:
      linear-gradient(
        135deg,
        var(--primary-dark),
        var(--accent-blue)
      );

    color: #ffffff;

    padding:
      clamp(3.5rem, 7vw, 5rem)
      clamp(1rem, 4vw, 1.5rem);

    text-align: center;

    position: relative;

    overflow: hidden;
  }

  .cta-content {
    width: 100%;
    max-width: 750px;

    margin: 0 auto;

    position: relative;
    z-index: 10;
  }

  .cta-title {
    font-size: clamp(1.8rem, 5vw, 2.5rem);

    font-weight: 900;

    margin-bottom: 1.25rem;

    letter-spacing: -0.5px;
  }

  .cta-desc {
    font-size: clamp(1rem, 2.5vw, 1.15rem);

    color: #cbd5e1;

    margin-bottom: 2.25rem;

    line-height: 1.6;
  }

  /* =====================================================
     FOOTER
  ===================================================== */

  .footer {
    width: 100%;

    background: #081226;

    color: #94a3b8;

    padding:
      clamp(3rem, 6vw, 4rem)
      clamp(1rem, 4vw, 1.5rem)
      2rem;

    border-top:
      1px solid rgba(255, 255, 255, 0.05);

    font-size: 0.9rem;
  }

  .footer-container {
    width: 100%;
    max-width: 1200px;

    margin: 0 auto 3rem;

    display: grid;

    grid-template-columns:
      2fr 1fr 1fr 1fr;

    gap: clamp(2rem, 4vw, 3rem);
  }

  .footer-brand-desc {
    margin-top: 1rem;

    color: #64748b;

    line-height: 1.6;

    max-width: 320px;
  }

  .footer-heading {
    color: #ffffff;

    font-weight: 700;

    margin-bottom: 1.25rem;

    font-size: 0.95rem;
  }

  .footer-links {
    list-style: none;

    display: flex;

    flex-direction: column;

    gap: 0.75rem;
  }

  .footer-links a {
    color: #94a3b8;

    text-decoration: none;

    transition: color 0.2s;
  }

  .footer-links a:hover {
    color: #ffffff;
  }

  .footer-bottom {
    width: 100%;
    max-width: 1200px;

    margin: 0 auto;

    padding-top: 2rem;

    border-top:
      1px solid rgba(255, 255, 255, 0.08);

    display: flex;

    justify-content: space-between;

    align-items: center;

    flex-wrap: wrap;

    gap: 1rem;

    font-size: 0.85rem;
  }

  /* =====================================================
     LARGE TABLET / SMALL LAPTOP
     993px - 1199px
  ===================================================== */

  @media (max-width: 1199px) {

    .hero-container {
      gap: 2.5rem;
    }

    .hero-title {
      font-size: 2.8rem;
    }

    .bento-grid {
      gap: 1rem;
    }

    .footer-container {
      grid-template-columns:
        1.5fr 1fr 1fr 1fr;

      gap: 2rem;
    }
  }

  /* =====================================================
     TABLET
     769px - 992px
  ===================================================== */

  @media (max-width: 992px) {

    .hero {
      padding-top: 4rem;
    }

    .hero-container {
      grid-template-columns: 1fr;

      text-align: center;

      max-width: 850px;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .hero-subtitle {
      margin-left: auto;
      margin-right: auto;
    }

    .hero-actions {
      justify-content: center;
    }

    .trust-badges {
      justify-content: center;
      width: 100%;
    }

    .hero-mockup-wrapper {
      width: min(100%, 720px);

      margin: 0 auto;
    }

    .bento-grid {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }

    .bento-card.span-2 {
      grid-column: span 2;
    }

    .footer-container {
      grid-template-columns:
        repeat(2, minmax(0, 1fr));
    }
  }

  /* =====================================================
     MOBILE NAV + MOBILE
     <= 768px
  ===================================================== */

  @media (max-width: 768px) {

    .navbar {
      padding: 0.7rem 1rem;
    }

    .brand-tag {
      display: none;
    }

    .mobile-toggle {
      display: flex;
    }

    .nav-menu {
      display: ${mobileMenuOpen ? "flex" : "none"};

      position: absolute;

      top: 100%;
      left: 0;
      right: 0;

      width: 100%;

      background: var(--primary-dark);

      flex-direction: column;

      align-items: stretch;

      padding: 1rem;

      gap: 0.5rem;

      border-bottom:
        1px solid rgba(255, 255, 255, 0.1);

      box-shadow:
        0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .nav-menu li {
      width: 100%;
    }

    .nav-link {
      display: block;

      width: 100%;

      padding: 0.75rem;

      border-radius: 8px;
    }

    .nav-link:hover {
      background:
        rgba(255, 255, 255, 0.06);
    }

    .btn-login {
      width: 100%;
      margin-top: 0.25rem;
    }

    .hero {
      padding:
        3rem
        1rem
        4rem;
    }

    .hero-title {
      font-size:
        clamp(
          2rem,
          9vw,
          2.5rem
        );

      letter-spacing: -0.7px;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .hero-actions {
      width: 100%;

      flex-direction: column;

      align-items: stretch;

      gap: 0.75rem;

      margin-bottom: 2.5rem;
    }

    .hero-actions a,
    .hero-actions button {
      width: 100%;
    }

    .trust-badges {
      flex-direction: column;

      align-items: center;

      gap: 0.9rem;
    }

    .hero-mockup-card {
      border-radius: 12px;
    }

    .mockup-preview-box {
      max-height: 420px;
    }

    .bento-grid {
      grid-template-columns: 1fr;
    }

    .bento-card.span-2 {
      grid-column: span 1;
    }

    .bento-card {
      padding: 1.5rem;
    }

    .systems-grid {
      grid-template-columns: 1fr;
    }

    .cta-title {
      font-size: 1.9rem;
    }

    .cta-desc {
      font-size: 1rem;
    }

    .cta-section .btn-primary-action,
    .cta-section .btn-secondary-action {
      width: 100%;
      max-width: 360px;
    }

    .footer-container {
      grid-template-columns: 1fr;

      text-align: center;
    }

    .footer-brand-desc {
      margin-left: auto;
      margin-right: auto;
    }

    .footer-links {
      align-items: center;
    }

    .footer-bottom {
      justify-content: center;

      text-align: center;

      flex-direction: column;
    }
  }

  /* =====================================================
     SMALL ANDROID PHONES
     <= 480px
  ===================================================== */

  @media (max-width: 480px) {

    .navbar {
      padding:
        0.65rem
        0.75rem;
    }

    .nav-brand {
      gap: 0.5rem;
    }

    .brand-logo-box {
      width: 34px;
      height: 34px;

      font-size: 1rem;
    }

    .brand-name {
      font-size: 1rem;
    }

    .mobile-toggle {
      width: 38px;
      height: 38px;
    }

    .hero {
      padding:
        2.5rem
        0.85rem
        3.5rem;
    }

    .hero-badge {
      font-size: 0.75rem;

      padding:
        0.35rem
        0.75rem;
    }

    .hero-title {
      font-size: 2rem;

      line-height: 1.12;
    }

    .hero-subtitle {
      font-size: 0.95rem;

      line-height: 1.55;
    }

    .hero-actions {
      margin-bottom: 2rem;
    }

    .btn-primary-action,
    .btn-secondary-action {
      width: 100%;

      min-height: 48px;

      padding:
        0.7rem
        1rem;

      font-size: 0.9rem;
    }

    .trust-text {
      font-size: 0.78rem;
    }

    .hero-mockup-card {
      padding: 0.65rem;

      border-radius: 10px;
    }

    .mockup-preview-box {
      padding: 0.6rem;

      max-height: 350px;
    }

    .mockup-preview-box table {
      min-width: 400px;

      font-size: 0.7rem;
    }

    .mockup-preview-box th,
    .mockup-preview-box td {
      padding:
        0.35rem
        0.4rem;
    }

    .section-padding {
      padding:
        3rem
        0.85rem;
    }

    .section-header {
      margin-bottom: 2.25rem;
    }

    .section-title {
      font-size: 1.75rem;
    }

    .section-desc {
      font-size: 0.95rem;
    }

    .bento-card {
      padding: 1.25rem;
    }

    .bento-title {
      font-size: 1.1rem;
    }

    .bento-desc {
      font-size: 0.9rem;
    }

    .system-card {
      padding: 1.25rem;
    }

    .cta-section {
      padding:
        3rem
        0.85rem;
    }

    .cta-title {
      font-size: 1.7rem;
    }

    .cta-desc {
      font-size: 0.95rem;
    }

    .footer {
      padding:
        3rem
        0.85rem
        1.5rem;
    }
  }

  /* =====================================================
     VERY SMALL PHONES
     <= 360px
  ===================================================== */

  @media (max-width: 360px) {

    .brand-name {
      font-size: 0.9rem;
    }

    .hero-title {
      font-size: 1.75rem;
    }

    .hero-subtitle {
      font-size: 0.9rem;
    }

    .hero-badge {
      font-size: 0.7rem;
    }

    .section-title {
      font-size: 1.6rem;
    }

    .mockup-preview-box {
      max-height: 300px;
    }
  }

  /* =====================================================
     LANDSCAPE AND SHORT SCREENS
  ===================================================== */

  @media (max-height: 600px) and (orientation: landscape) {

    .hero {
      padding-top: 2rem;
      padding-bottom: 3rem;
    }

    .hero-container {
      gap: 2rem;
    }

    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      margin-bottom: 1.5rem;
    }

    .hero-actions {
      margin-bottom: 1.5rem;
    }

    .mockup-preview-box {
      max-height: 300px;
    }
  }

  /* =====================================================
     TOUCH DEVICES
  ===================================================== */

  @media (hover: none) {

    .bento-card:hover,
    .system-card:hover,
    .btn-primary-action:hover {
      transform: none;
    }

    .nav-link,
    .btn-login,
    .btn-primary-action,
    .btn-secondary-action {
      touch-action: manipulation;
    }
  }
`}</style>

      {/* 1. STICKY NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <img
            className="brand-logo-box"
            src="/og-image.png"
            alt="Desglose Pro Logo"
          />
          <span className="brand-name">Desglose Pro</span>
        </Link>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <i className={`bi bi-${mobileMenuOpen ? "x-lg" : "list"}`}></i>
        </button>

        <ul className="nav-menu">
          <li>
            <a href="#caracteristicas" className="nav-link">
              Características
            </a>
          </li>
          <li>
            <a href="#sistemas" className="nav-link">
              Sistemas
            </a>
          </li>

          <li>
            <Link to="/login" className="btn-login">
              <i className="bi bi-box-arrow-in-right"></i> Entrar
            </Link>
          </li>
        </ul>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="hero bg-dark-grid">
        <div className="hero-container">
          <div>
            <div className="hero-badge">
              <i className="bi bi-patch-check-fill"></i> Software Profesional
              para talleres de aluminio.
            </div>
            <h1 className="hero-title">
              Calcula ventanas de aluminio con <span>precisión exacta</span>
            </h1>
            <p className="hero-subtitle">
              Genera despieces exactos para ventanas, puertas y optimización de
              cristal. Exporta en PDF y compatible con cualquier dispositivo.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="btn-primary-action">
                Comenzar gratis <i className="bi bi-arrow-right-short"></i>
              </Link>
              <a href="#sistemas" className="btn-secondary-action">
                Ver Sistemas <i className="bi bi-layers"></i>
              </a>
            </div>

            <div className="trust-badges">
              <div className="trust-item">
                <i className="bi bi-cpu trust-icon"></i>
                <span className="trust-text">
                  7+ Sistemas de ventana y puerta
                </span>
              </div>
              <div className="trust-item">
                <i className="bi bi-whatsapp trust-icon"></i>
                <span className="trust-text">Sorporte por WhatsAPP</span>
              </div>
              <div className="trust-item">
                <i className="bi bi-currency-dollar trust-icon"></i>
                <span className="trust-text">100% Gratis</span>
              </div>
            </div>
          </div>

          {/* Interactive Technical Mockup Visual */}
          <div className="hero-mockup-wrapper">
            <div className="hero-mockup-card">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    fontFamily: "monospace",
                  }}
                >
                  DESGLOSE_P92.PDF
                </span>
              </div>

              <div className="mockup-preview-box">
                {/* ============ DETALLE DE VENTANAS ============ */}
                <div className="seccion">
                  <h3>
                    <i className="bi bi-window-sidebar"></i> Ventanas P-92
                  </h3>
                  <div className="tabla-ventanas">
                    <table>
                      <thead>
                        <tr>
                          <th rowSpan="2">Hueco</th>
                          <th rowSpan="2">Ancho</th>
                          <th rowSpan="2">Alto</th>
                          <th rowSpan="2">Hojas</th>
                          <th colSpan="2">De la hoja</th>
                          <th colSpan="2">Del marco</th>
                          <th colSpan="2">Vidrio</th>
                        </tr>
                        <tr>
                          <th>Cab-alf</th>
                          <th>Jambas</th>
                          <th>Cab-riel</th>
                          <th>Lat-marco</th>
                          <th>Ancho</th>
                          <th>Alto</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>33"</td>
                          <td>33"</td>
                          <td>2</td>
                          <td>15 15/16"</td>
                          <td>30 9/16"</td>
                          <td>31 3/8"</td>
                          <td>32 7/8"</td>
                          <td>12 11/16"</td>
                          <td>26 9/16"</td>
                        </tr>
                        <tr>
                          <td>1</td>
                          <td>33"</td>
                          <td>33"</td>
                          <td>2</td>
                          <td>15 15/16"</td>
                          <td>30 9/16"</td>
                          <td>31 3/8"</td>
                          <td>32 7/8"</td>
                          <td>12 11/16"</td>
                          <td>26 9/16"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ============ MATERIALES ============ */}
                <div className="seccion">
                  <h3>
                    <i className="bi bi-box-seam"></i> Materiales
                  </h3>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left" }}>Material</th>
                        <th>Barras</th>
                        <th>Pies</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          Cabeza del Marco 2 Vías P-92
                        </td>
                        <td>6 pies</td>
                        <td>5.23</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          Riel del Marco 2 Vías P-92
                        </td>
                        <td>6 pies</td>
                        <td>5.23</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          Lateral 2 Vías P-92
                        </td>
                        <td>11 pies</td>
                        <td>10.96</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "left" }}>Jamba Llavín P-92</td>
                        <td>11 pies</td>
                        <td>10.38</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          Jamba Enganche P-92
                        </td>
                        <td>11 pies</td>
                        <td>10.38</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "left" }}>cab-alf P-92</td>
                        <td>11 pies</td>
                        <td>10.63</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. FEATURES BENTO GRID */}
      <section id="caracteristicas" className="section-padding bg-grid-pattern">
        <div className="section-header">
          <span className="section-tag">
            Todo lo que necesitas para tu taller
          </span>
          <h2 className="section-title">
            Herramientas de alta precisión para tu taller
          </h2>
          <p className="section-desc">
            Olvídate de los errores manuales y el desperdicio de perfiles.
            Desglose Pro automatiza tus operaciones diarias.
          </p>
        </div>

        <div className="bento-grid">
          {/* Bento Item 1 */}
          <div className="bento-card span-2">
            <div className="bento-icon-wrapper">
              <i className="bi bi-rulers"></i>
            </div>
            <h3 className="bento-title">Cálculos Precisos para Fabricación</h3>
            <p className="bento-desc">
              Transforma tus medidas en despieces exactos y listos para
              producción, reduciendo errores y optimizando el proceso de corte.
            </p>
          </div>

          {/* Bento Item 2 */}
          <div className="bento-card">
            <div className="bento-icon-wrapper">
              <i className="bi bi-file-earmark-pdf-fill"></i>
            </div>
            <h3 className="bento-title">Exporta tus Desgloses en PDF</h3>
            <p className="bento-desc">
              Genera PDFs claros y profesionales para corte, fabricación.
            </p>
          </div>

          {/* Bento Item 3 */}
          <div className="bento-card">
            <div className="bento-icon-wrapper">
              <i className="bi bi-phone-vibrate"></i>
            </div>
            <h3 className="bento-title">PWA Móvil 100% Offline</h3>
            <p className="bento-desc">
              Instálalo en tu iPhone o Android como una App nativa. Funciona
              perfectamente en obras o construcciones sin señal de internet.
            </p>
          </div>

          {/* Bento Item 4 */}
          <div className="bento-card span-2">
            <div className="bento-icon-wrapper">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <h3 className="bento-title">
              Gestión de Acceso y Roles de Usuario
            </h3>
            <p className="bento-desc">
              Controla de forma sencilla qué puede hacer cada usuario y mantén
              tu cuenta organizada y segura.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SYSTEMS CATALOG SECTION */}
      <section
        id="sistemas"
        className="section-padding"
        style={{
          background: "#ffffff",
          borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="section-header">
          <span className="section-tag">Sistemas y Perfiles de Aluminio</span>
          <h2 className="section-title">Compatibles e Incluidos</h2>
          <p className="section-desc">
            Soporte nativo para las líneas de carpintería de aluminio más
            utilizadas en la República Dominicana.
          </p>
        </div>

        <div className="systems-grid">
          {systemsList.map((sys, idx) => (
            <div className="system-card" key={idx}>
              <div>
                <div className="system-top">
                  <div className="system-icon">
                    <i className={`bi ${sys.icon}`}></i>
                  </div>
                  <span className="system-badge">{sys.tag}</span>
                </div>
                <h3 className="system-name">{sys.name}</h3>
                <p className="system-type">{sys.type}</p>
              </div>

              <div className="system-footer">
                <span>Precisión: {sys.precision}</span>
                <span
                  style={{
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <i className="bi bi-check-circle-fill"></i> {sys.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CTA SECTION */}
      <section className="cta-section bg-dark-grid">
        <div className="cta-content">
          <h2 className="cta-title">
            ¿Listo para modernizar el cálculo en tu taller?
          </h2>
          <p className="cta-desc">
            Comienza a usar Desglose Pro hoy mismo y mejora la precisión de tus
            cálculos.
          </p>
          <Link
            to="/signup"
            className="btn-primary-action"
            style={{ padding: "0.9rem 2.25rem", fontSize: "1.05rem" }}
          >
            Crear cuenta gratis ahora <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <div className="nav-brand" style={{ marginBottom: "0.5rem" }}>
              <img
                className="brand-logo-box"
                src="/og-image.png"
                alt="Desglose Pro Logo"
              />
              <span className="brand-name" style={{ fontSize: "1.1rem" }}>
                Desglose Pro
              </span>
            </div>
            <p className="footer-brand-desc">
              La Plataforma Profesional para Talleres de Aluminio y Vidrio
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Navegación</h4>
            <ul className="footer-links">
              <li>
                <a href="#caracteristicas">Características</a>
              </li>
              <li>
                <a href="#sistemas">Sistemas de Perfiles</a>
              </li>
              <li>
                <Link to="/signup">Registro</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Legal</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="/legal/PrivacyPolicy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a
                  href="/legal/TermsOfService.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Términos de Servicio
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Soporte Taller</h4>
            <ul className="footer-links">
              <li>
                <a href="#">
                  <i className="bi bi-envelope"></i> Contactar Soporte
                </a>
              </li>
              <li>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Versión: 5.1.0
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 <strong>Desglose Pro</strong>. Todos los derechos reservados.
          </div>
          <div style={{ color: "#64748b" }}>
            Calcula. Organiza. Fabrica. Todo en un solo lugar.
          </div>
        </div>
      </footer>
    </div>
  );
}
