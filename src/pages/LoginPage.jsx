import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);
    const result = await loginUser(form.email, form.password);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      if (result.error.includes("invalid-credential") || result.error.includes("wrong-password")) {
        setError("Email o contraseña incorrectos");
      } else if (result.error.includes("too-many-requests")) {
        setError("Demasiados intentos. Espera un momento");
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo");
      }
    }
  };

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          --ease-draw: cubic-bezier(0.65, 0, 0.35, 1);
          --ease-pop: cubic-bezier(0.16, 1, 0.3, 1);

          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          overflow-x: hidden;
          position: relative;
          background-color: var(--gray-50);
        }

        @media (prefers-reduced-motion: reduce) {
          .login-page *,
          .login-page *::before,
          .login-page *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }

        /* ========== LADO IZQUIERDO: Formulario ========== */
        .login-page .left-side {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background-color: #ffffff;
          z-index: 2;
        }

        .login-page .right-side {
          width: 50%;
          background-color: var(--gray-900);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          z-index: 2;
        }

        .login-page .login-container {
          width: 100%;
          max-width: 400px;
          opacity: 0;
          transform: translateY(12px);
          animation: enterUp 0.7s var(--ease-pop) 0.1s forwards;
        }

        @keyframes enterUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .login-page .mobile-logo { display: none; }

        .login-page .login-header { margin-bottom: 32px; }
        .login-page .login-header h1 {
          color: var(--gray-900);
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .login-page .login-header p {
          color: var(--gray-500);
          font-size: 15px;
        }

        .login-page .form-group { margin-bottom: 20px; }
        .login-page .form-label {
          display: block;
          color: var(--gray-700);
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
        }
        .login-page .form-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius);
          background: #ffffff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .login-page .form-input:focus,
        .login-page .form-input:focus-visible {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(26, 86, 219, 0.15);
        }

        .login-page .form-error {
          color: var(--danger);
          font-size: 14px;
          margin-bottom: 16px;
        }

        .login-page .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-size: 14px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .login-page .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gray-600);
          cursor: pointer;
        }
        .login-page .forgot-pass {
          color: var(--primary);
          text-decoration: none;
          font-weight: 500;
        }

        .login-page .btn-submit {
          width: 100%;
          padding: 12px;
          background-color: var(--primary);
          color: #ffffff;
          border: none;
          border-radius: var(--radius);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        }
        .login-page .btn-submit:hover {
          background-color: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .login-page .btn-submit:active { transform: translateY(0); }
        .login-page .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .login-page .signup-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: var(--gray-600);
        }
        .login-page .signup-link a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }

        .login-page a:focus-visible,
        .login-page button:focus-visible,
        .login-page input[type="checkbox"]:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* ========== LOGO ANIMADO (SVG cuadrado) ========== */
        .login-page .logo-stage { width: 100%; max-width: 420px; }
        .login-page .logo-stage svg { width: 100%; height: auto; display: block; }

        .login-page .logo-draw {
          fill: none;
          animation: drawIn 1s var(--ease-draw) forwards;
        }
        .login-page .logo-draw.-door {
          stroke-dasharray: 420;
          stroke-dashoffset: 420;
          animation-delay: 0.1s;
        }
        .login-page .logo-draw.-window {
          stroke-dasharray: 480;
          stroke-dashoffset: 480;
          animation-delay: 0.4s;
        }
        .login-page .logo-draw.-mullion-1 {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation-delay: 0.75s;
        }
        .login-page .logo-draw.-mullion-2 {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation-delay: 0.85s;
        }
        .login-page .logo-draw.-handle {
          stroke-dasharray: 5;
          stroke-dashoffset: 5;
          animation-delay: 1s;
        }

        @keyframes drawIn { to { stroke-dashoffset: 0; } }

        .login-page .logo-dim {
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
          animation-delay: 1.1s;
        }
        @keyframes fadeIn { to { opacity: 1; } }

        .login-page .logo-text-line {
          opacity: 0;
          transform: translateY(8px);
          animation: textUp 0.6s var(--ease-pop) forwards;
        }
        .login-page .logo-text-line.-l1 { animation-delay: 1.25s; }
        .login-page .logo-text-line.-l2 { animation-delay: 1.4s; }
        .login-page .logo-text-line.-l3 { animation-delay: 1.55s; }
        .login-page .logo-text-line.-l4 { animation-delay: 1.65s; }

        @keyframes textUp { to { opacity: 1; transform: translateY(0); } }

        .login-page .logo-glow {
          opacity: 0;
          animation: glowIn 1s ease forwards 1.8s, glowPulse 4s ease-in-out infinite 2.8s;
        }
        @keyframes glowIn { to { opacity: 1; } }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.08); }
        }

        /* El posicionamiento (translate 145,48) vive en un <g> padre aparte en el JSX;
           este grupo SOLO controla la animación de flotado. */
        .login-page .logo-icon-group {
          animation: iconFloat 6s ease-in-out infinite 2.2s;
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* ================= RESPONSIVE: TABLET/LAPTOP PEQUEÑO ================= */
        @media (max-width: 1100px) and (min-width: 769px) {
          .login-page .left-side,
          .login-page .right-side { padding: 28px; }
          .login-page .logo-stage { max-width: 340px; }
        }

        /* ================= RESPONSIVE: MÓVIL ================= */
        @media (max-width: 768px) {
          .login-page { justify-content: center; align-items: center; }

          .login-page .left-side {
            width: 100%;
            min-height: 100vh;
            min-height: 100dvh;
            background-color: #ffffff;
            position: relative;
            z-index: 2;
            padding: 24px;
            padding-top: max(24px, env(safe-area-inset-top));
            padding-bottom: max(24px, env(safe-area-inset-bottom));
          }

          .login-page .right-side { display: none; }

          .login-page .mobile-logo {
            display: block;
            width: 96px;
            margin: 0 auto 24px;
          }
          .login-page .mobile-logo svg { width: 100%; height: auto; display: block; }

          .login-page .login-header { text-align: center; }
        }

        @media (max-width: 380px) {
          .login-page .login-header h1 { font-size: 24px; }
        }
      `}</style>

      {/* LADO IZQUIERDO: FORMULARIO */}
      <section className="left-side">
        <div className="login-container">
          {/* Versión pequeña del logo, solo visible en móvil */}
          <div className="mobile-logo" aria-hidden="true">
            <svg viewBox="60 0 380 260">
              <g transform="translate(145, 48)">
                <g className="logo-icon-group">
                  <rect
                    className="logo-draw -door"
                    x="0"
                    y="20"
                    width="70"
                    height="140"
                    stroke="#1a56db"
                    strokeWidth="6"
                    strokeLinejoin="round"
                  />
                  <line
                    className="logo-draw -handle"
                    x1="50"
                    y1="90"
                    x2="55"
                    y2="90"
                    stroke="#1a56db"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <rect
                    className="logo-draw -window"
                    x="90"
                    y="20"
                    width="120"
                    height="120"
                    stroke="#1a56db"
                    strokeWidth="6"
                    strokeLinejoin="round"
                  />
                  <line
                    className="logo-draw -mullion-1"
                    x1="150"
                    y1="20"
                    x2="150"
                    y2="140"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                  />
                  <line
                    className="logo-draw -mullion-2"
                    x1="90"
                    y1="80"
                    x2="210"
                    y2="80"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                  />
                </g>
              </g>
            </svg>
          </div>

          <div className="login-header">
            <h1>¡Bienvenido de nuevo!</h1>
            <p>Por favor, ingresa tus datos para iniciar sesión.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <input
                className="form-input"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>

          <p className="signup-link">
            ¿No tienes cuenta? <Link to="/signup">Registrarse</Link>
          </p>
        </div>
      </section>

      {/* LADO DERECHO: LOGO ANIMADO */}
      <section className="right-side">
        <div className="logo-stage" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            preserveAspectRatio="xMidYMid meet"
          >
            <radialGradient id="logoGlow" cx="50%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#1a56db" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#1a56db" stopOpacity="0" />
            </radialGradient>
            <circle className="logo-glow" cx="250" cy="150" r="180" fill="url(#logoGlow)" />

            <g transform="translate(145, 48)">
              <g className="logo-icon-group">
                <rect
                  className="logo-draw -door"
                  x="0"
                  y="20"
                  width="70"
                  height="140"
                  stroke="#1a56db"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                <line
                  className="logo-draw -handle"
                  x1="50"
                  y1="90"
                  x2="55"
                  y2="90"
                  stroke="#1a56db"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <rect
                  className="logo-draw -window"
                  x="90"
                  y="20"
                  width="120"
                  height="120"
                  stroke="#1a56db"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                <line
                  className="logo-draw -mullion-1"
                  x1="150"
                  y1="20"
                  x2="150"
                  y2="140"
                  stroke="#94a3b8"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
                <line
                  className="logo-draw -mullion-2"
                  x1="90"
                  y1="80"
                  x2="210"
                  y2="80"
                  stroke="#94a3b8"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />

                <line
                  className="logo-dim"
                  x1="-15"
                  y1="180"
                  x2="225"
                  y2="180"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  className="logo-dim"
                  x1="0"
                  y1="175"
                  x2="0"
                  y2="185"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <line
                  className="logo-dim"
                  x1="70"
                  y1="175"
                  x2="70"
                  y2="185"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <line
                  className="logo-dim"
                  x1="90"
                  y1="175"
                  x2="90"
                  y2="185"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <line
                  className="logo-dim"
                  x1="210"
                  y1="175"
                  x2="210"
                  y2="185"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.8"
                />
              </g>
            </g>

            <g fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle">
              <text
                className="logo-text-line -l1"
                x="250"
                y="305"
                fontWeight="800"
                fontSize="48"
                fill="#FFFFFF"
                letterSpacing="2"
              >
                DESGLOSE
              </text>
              <text
                className="logo-text-line -l2"
                x="250"
                y="356"
                fontWeight="300"
                fontSize="48"
                fill="#3b82f6"
                letterSpacing="4"
              >
                PRO
              </text>
              <text
                className="logo-text-line -l3"
                x="250"
                y="398"
                fontWeight="400"
                fontSize="13"
                fill="#FFFFFF"
                opacity="0.5"
                letterSpacing="1.5"
              >
                Software profesional para
              </text>
              <text
                className="logo-text-line -l4"
                x="250"
                y="416"
                fontWeight="400"
                fontSize="13"
                fill="#FFFFFF"
                opacity="0.5"
                letterSpacing="1.5"
              >
                talleres de aluminio
              </text>
            </g>
          </svg>
        </div>
      </section>
    </div>
  );
}