import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function WelcomePage() {
  const { isAuthenticated, isActive } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={isActive ? '/dashboard' : '/pending'} replace />
  }

  return (
    <div className="welcome-page">
      <style>{`
        .welcome-card-enter { animation: welcomeCardIn 0.5s ease both; }
        @keyframes welcomeCardIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .welcome-page .welcome-card {
          position: relative;
          overflow: hidden;
        }

        .welcome-content { position: relative; z-index: 1; }

        .welcome-brand {
          font-size: 2.1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--primary);
          line-height: 1.1;
          margin-bottom: 8px;
        }

        /* Sobrescribe el h1 heredado de main.css para que sea el subtítulo funcional */
        .welcome-content .welcome-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--gray-900);
          margin-bottom: 10px;
        }

        .welcome-content .welcome-subtitle {
          margin-bottom: 1.5rem;
        }

        /* ===== Features: sin fondo, para que el diagrama respire detrás ===== */
        .welcome-content .welcome-features {
          background: transparent;
          padding: 0;
          border-radius: 0;
          gap: 0;
        }

        .welcome-feature {
          padding: 10px 0;
          border-bottom: 1px solid var(--gray-100);
        }
        .welcome-feature:last-child { border-bottom: none; }

        .welcome-feature-icon-wrap {
          width: 26px; height: 26px;
          border-radius: 8px;
          background: #eff6ff;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .welcome-feature-text { display: flex; flex-direction: column; }
        .welcome-feature-text strong { font-size: 13px; font-weight: 600; color: var(--gray-800); }
        .welcome-feature-text span { font-size: 11.5px; color: var(--gray-500); }

        /* ===== Escenario del diagrama (compartido) ===== */
        .diagram-stage {
          position: absolute;
          inset: -10%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.09;
          pointer-events: none;
          z-index: 0;
          transform: scale(1.55);
        }
        .diagram-stage svg { width: 100%; max-width: 420px; }
        .diagram-stage-breathe {
          animation: breathe 6s ease-in-out infinite 3.2s;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1.55); }
          50% { transform: scale(1.6); }
        }

        .line-outer, .line-inner, .mullion-v, .mullion-h, .dim-line, .dim-tick, .leader {
          fill: none; stroke: var(--gray-400);
        }
        .line-outer { stroke-width: 2.5; stroke-dasharray: 840; stroke-dashoffset: 840; animation: draw 1.1s ease forwards 0.1s; }
        .line-inner { stroke-width: 1.2; opacity: 0.6; stroke-dasharray: 776; stroke-dashoffset: 776; animation: draw 1s ease forwards 0.5s; }
        .mullion-v, .mullion-h { stroke: var(--primary); }
        .mullion-v { stroke-width: 2.2; stroke-dasharray: 224; stroke-dashoffset: 224; animation: draw 0.5s ease forwards 1s; }
        .mullion-h { stroke-width: 2.2; stroke-dasharray: 164; stroke-dashoffset: 164; animation: draw 0.45s ease forwards 1.25s; }
        .glass { fill: var(--primary-light); opacity: 0; animation: fadeIn 0.6s ease forwards 1.5s; }
        .dim-line { stroke: var(--warning); stroke-width: 1.1; opacity: 0; }
        .dim-h { stroke-dasharray: 180; stroke-dashoffset: 180; animation: draw 0.6s ease forwards 1.9s, fadeIn 0.1s linear forwards 1.9s; }
        .dim-v { stroke-dasharray: 240; stroke-dashoffset: 240; animation: draw 0.6s ease forwards 2.1s, fadeIn 0.1s linear forwards 2.1s; }
        .dim-tick { stroke: var(--warning); stroke-width: 1.1; opacity: 0; animation: fadeIn 0.3s ease forwards 2.4s; }
        .dim-label { font-size: 12px; font-weight: 700; fill: var(--warning); opacity: 0; animation: fadeIn 0.4s ease forwards 2.5s; }
        .leader { stroke: var(--gray-400); stroke-width: 1; stroke-dasharray: 3 3; opacity: 0; animation: fadeIn 0.4s ease forwards 2.7s; }
        .chip-bg { fill: var(--gray-100); stroke: var(--gray-200); opacity: 0; animation: fadeIn 0.4s ease forwards 2.8s; }
        .chip-label { font-size: 11px; font-weight: 700; fill: var(--gray-600); opacity: 0; animation: fadeIn 0.4s ease forwards 2.9s; }

        @keyframes draw { to { stroke-dashoffset: 0; } }
        @keyframes fadeIn { to { opacity: 1; } }

        /* ===== Escritorio: diagrama visible a la izquierda ===== */
        @media (min-width: 900px) {
          .welcome-page .welcome-card {
            max-width: 1080px;
            width: 100%;
            display: grid;
            grid-template-columns: 0.95fr 1.05fr;
            align-items: center;
            gap: 3.5rem;
            padding: 3.25rem 3.75rem;
            text-align: left;
            overflow: visible;
          }

          .diagram-stage {
            position: relative;
            inset: auto;
            opacity: 1;
            transform: none;
            z-index: auto;
          }
          .diagram-stage-breathe { animation: none; }
          .diagram-stage::before {
            content: '';
            position: absolute;
            inset: -20%;
            background: radial-gradient(circle, var(--primary-light) 0%, transparent 65%);
            opacity: 0.16;
            z-index: -1;
          }
          .diagram-stage svg { max-width: 300px; }

          .welcome-content { text-align: left; }
          .welcome-brand { font-size: 2.6rem; }
          .welcome-content .welcome-title { font-size: 1.25rem; }
          .welcome-content .welcome-subtitle { max-width: 440px; }
          .welcome-content .welcome-features { margin-bottom: 2rem; }
          .welcome-content .welcome-actions { flex-direction: row; margin-bottom: 1.25rem; }
          .welcome-content .btn-primary-lg,
          .welcome-content .btn-outline-lg { flex: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .line-outer, .line-inner, .mullion-v, .mullion-h,
          .glass, .dim-line, .dim-tick, .dim-label, .leader, .chip-bg, .chip-label,
          .welcome-card-enter, .diagram-stage-breathe {
            animation: none !important;
            opacity: 1 !important;
            stroke-dashoffset: 0 !important;
          }
          .diagram-stage { opacity: 0.09; }
          @media (min-width: 900px) {
            .diagram-stage { opacity: 1; }
          }
        }
      `}</style>

      <div className="welcome-card welcome-card-enter">
        <div className="diagram-stage diagram-stage-breathe" aria-hidden="true">
          <svg viewBox="0 0 300 340">
            <rect x="50" y="30" width="180" height="230" rx="2" className="line-outer" />
            <rect x="58" y="38" width="164" height="214" rx="1" className="line-inner" />

            <rect x="61" y="41" width="76" height="101" className="glass" />
            <rect x="143" y="41" width="76" height="101" className="glass" />
            <rect x="61" y="148" width="76" height="101" className="glass" />
            <rect x="143" y="148" width="76" height="101" className="glass" />

            <line x1="140" y1="38" x2="140" y2="252" className="mullion-v" />
            <line x1="58" y1="145" x2="222" y2="145" className="mullion-h" />

            <line x1="50" y1="278" x2="230" y2="278" className="dim-line dim-h" />
            <line x1="50" y1="272" x2="50" y2="284" className="dim-tick" />
            <line x1="230" y1="272" x2="230" y2="284" className="dim-tick" />
            <text x="140" y="300" textAnchor="middle" className="dim-label">
              35 3/16&quot;
            </text>

            <line x1="28" y1="30" x2="28" y2="260" className="dim-line dim-v" />
            <line x1="22" y1="30" x2="34" y2="30" className="dim-tick" />
            <line x1="22" y1="260" x2="34" y2="260" className="dim-tick" />
            <text x="-148" y="17" transform="rotate(-90)" textAnchor="middle" className="dim-label">
              51 1/2&quot;
            </text>

            <line x1="230" y1="30" x2="248" y2="14" className="leader" />
            <rect x="196" y="-2" width="64" height="20" rx="4" className="chip-bg" />
            <text x="228" y="12" textAnchor="middle" className="chip-label">
              P-92
            </text>
          </svg>
        </div>

        <div className="welcome-content">
          <h1 className="welcome-brand">DESGLOSE PRO</h1>
          <p className="welcome-title">
            Software profesional para talleres de aluminio
          </p>
          <p className="welcome-subtitle">
            Calcula cortes de ventanas y puertas con precisión de fracciones
            de 1/16" — sin errores, sin reprocesos.
          </p>

          <div className="welcome-features">
            <div className="welcome-feature">
              <span className="welcome-feature-icon-wrap">🪟</span>
              <div className="welcome-feature-text">
                <strong>Ventanas corredizas</strong>
                <span>P-92, P-65, Tradicional y P-40</span>
              </div>
            </div>
            <div className="welcome-feature">
              <span className="welcome-feature-icon-wrap">🚪</span>
              <div className="welcome-feature-text">
                <strong>Puertas comerciales</strong>
                <span>Desgloses a medida para cada proyecto</span>
              </div>
            </div>
            <div className="welcome-feature">
              <span className="welcome-feature-icon-wrap">🔢</span>
              <div className="welcome-feature-text">
                <strong>Precisión real</strong>
                <span>Resultados exactos en fracciones de 1/16"</span>
              </div>
            </div>
            <div className="welcome-feature">
              <span className="welcome-feature-icon-wrap">📄</span>
              <div className="welcome-feature-text">
                <strong>Reportes en PDF</strong>
                <span>Listos para imprimir o enviar al cliente</span>
              </div>
            </div>
          </div>

          <div className="welcome-actions">
            <Link to="/login" className="btn-primary-lg">Iniciar sesión</Link>
            <Link to="/signup" className="btn-outline-lg">Crear cuenta</Link>
          </div>

          <p className="welcome-note">
            Cada cuenta nueva requiere aprobación del administrador antes de activarse
          </p>
        </div>
      </div>
    </div>
  )
}