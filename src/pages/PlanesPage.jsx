import React from "react";
import { Link } from "react-router-dom";
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

// ============================================================
// CONFIG
// ============================================================

const WHATSAPP_NUMBER = "18494850059";

const plans = [
  {
    id: "monthly",
    name: "Mensual",
    price: "499",
    period: "/ mes",
    description: "Flexibilidad para trabajar mes a mes.",
    popular: false,
  },
  {
    id: "yearly",
    name: "Anual",
    price: "3,990",
    period: "/ año",
    description: "La mejor opción para tu taller.",
    popular: true,
    saving: "Ahorras RD$1,998",
  },
];

const benefits = [
  {
    icon: "bi-calculator",
    title: "Todos los sistemas de cálculo",
    description:
      "Accede a las herramientas disponibles para realizar tus desgloses.",
  },
  {
    icon: "bi-window",
    title: "Sistemas para ventanas",
    description:
      "P-92, P-65, E-70 y Tradicional para diferentes tipos de trabajos.",
  },
  {
    icon: "bi-door-open",
    title: "Sistemas para puertas",
    description:
      "Trabaja con Puerta Comercial y Puerta P40.",
  },
  {
    icon: "bi-rulers",
    title: "Optimización de corte de vidrio",
    description:
      "Organiza y optimiza el corte de tus planchas de vidrio.",
  },
  {
    icon: "bi-clock-history",
    title: "Historial de desgloses",
    description:
      "Consulta y recupera tus trabajos anteriores desde un mismo lugar.",
  },
  {
    icon: "bi-headset",
    title: "Soporte técnico",
    description:
      "Recibe asistencia personalizada por WhatsApp.",
  },
];

const advantages = [
  {
    icon: "bi-lightning-charge",
    title: "Trabaja más rápido",
    description:
      "Reduce el tiempo necesario para realizar cálculos y preparar tus trabajos.",
  },
  {
    icon: "bi-grid-1x2",
    title: "Todo en un solo lugar",
    description:
      "Centraliza tus herramientas de despiece, corte e historial.",
  },
  {
    icon: "bi-graph-up-arrow",
    title: "Más control para tu taller",
    description:
      "Trabaja de forma más organizada y profesional en cada proyecto.",
  },
];

const faqs = [
  {
    question: "¿Qué incluye Full Access?",
    answer:
      "Full Access te permite utilizar los sistemas y herramientas disponibles en Desglose Pro, incluyendo desgloses, optimización de corte de vidrio, historial y soporte técnico.",
  },
  {
    question: "¿Cuál es la diferencia entre el plan mensual y anual?",
    answer:
      "El plan mensual cuesta RD$499 al mes. El plan anual cuesta RD$3,990 por todo el año y representa un ahorro de RD$1,998 frente a pagar 12 meses por separado.",
  },
  {
    question: "¿Cómo se activa el acceso?",
    answer:
      "La activación se coordina directamente por WhatsApp. Escríbenos y te indicaremos los pasos para completar la activación.",
  },
  {
    question: "¿Puedo cancelar el plan mensual?",
    answer:
      "Sí. El plan mensual está pensado para darte flexibilidad y trabajar mes a mes.",
  },
];

// ============================================================
// HELPERS
// ============================================================

const createWhatsAppUrl = (plan = "Full Access", userData = null) => {
  const nombre = userData?.nombre || userData?.displayName || null
  const email = userData?.email || null

  let message = `Hola, quiero activar ${plan} en Desglose Pro.`
  if (nombre) message += `\n\nNombre: ${nombre}`
  if (email) message += `\nCorreo: ${email}`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
};

// ============================================================
// PAGE
// ============================================================

export default function PlanesPage() {
  const { userData } = useAuth()

  return (
    <Layout>
    <div className="planes-page">

      {/* =====================================================
          HERO
      ====================================================== */}
      <main>
        <section className="pricing-hero">
          <div className="planes-container">
            <div className="hero-content">
              <div className="eyebrow">
                <span className="eyebrow-icon">
                  <i className="bi bi-stars"></i>
                </span>

                FULL ACCESS
              </div>

              <h1>
                Lleva tu taller
                <br />
                <span>al siguiente nivel.</span>
              </h1>

              <p>
                Desbloquea todas las herramientas de Desglose Pro
                y trabaja tus proyectos de aluminio y vidrio de forma
                más rápida, organizada y profesional.
              </p>

              <div className="hero-trust">
                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  Todos los sistemas disponibles
                </div>

                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  Soporte técnico
                </div>

                <div>
                  <i className="bi bi-check-circle-fill"></i>
                  Acceso completo
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            PRICING
        ==================================================== */}
        <section className="pricing-section">
          <div className="planes-container">
            <div className="section-heading">
              <span>PLANES Y PRECIOS</span>

              <h2>
                Elige el acceso que mejor
                <br />
                se adapta a tu taller.
              </h2>

              <p>
                Empieza con el plan que prefieras y disfruta
                de las herramientas de Desglose Pro.
              </p>
            </div>

            <div className="pricing-grid">
              {plans.map((plan) => (
                <div
                  className={`pricing-card ${
                    plan.popular ? "pricing-card-featured" : ""
                  }`}
                  key={plan.id}
                >
                  {plan.popular && (
                    <div className="popular-badge">
                      <i className="bi bi-star-fill"></i>
                      MEJOR VALOR
                    </div>
                  )}

                  <div className="plan-top">
                    <div className="plan-icon">
                      <i
                        className={
                          plan.id === "yearly"
                            ? "bi bi-gem"
                            : "bi bi-calendar3"
                        }
                      ></i>
                    </div>

                    <div>
                      <h3>{plan.name}</h3>
                      <p>{plan.description}</p>
                    </div>
                  </div>

                  <div className="price-wrapper">
                    <span className="currency">RD$</span>

                    <span className="price">{plan.price}</span>

                    <span className="period">
                      {plan.period}
                    </span>
                  </div>

                  {plan.saving && (
                    <div className="saving">
                      <i className="bi bi-arrow-down-circle-fill"></i>
                      {plan.saving}
                    </div>
                  )}

                  {plan.id === "yearly" && (
                    <div className="monthly-equivalent">
                      <i className="bi bi-calculator"></i>

                      Equivale a solo{" "}
                      <strong>RD$332.50/mes</strong>
                    </div>
                  )}

                  <div className="plan-divider"></div>

                  <div className="plan-features">
                    <div>
                      <i className="bi bi-check-circle-fill"></i>
                      Acceso completo a Desglose Pro
                    </div>

                    <div>
                      <i className="bi bi-check-circle-fill"></i>
                      Sistemas de ventanas y puertas
                    </div>

                    <div>
                      <i className="bi bi-check-circle-fill"></i>
                      Optimización de corte de vidrio
                    </div>

                    <div>
                      <i className="bi bi-check-circle-fill"></i>
                      Historial de desgloses
                    </div>

                    <div>
                      <i className="bi bi-check-circle-fill"></i>
                      Soporte técnico
                    </div>
                  </div>

                  <a
                    href={createWhatsAppUrl(
                      `Full Access ${plan.name}`, userData
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      plan.popular
                        ? "plan-button plan-button-primary"
                        : "plan-button plan-button-secondary"
                    }
                  >
                    <i className="bi bi-whatsapp"></i>

                    Activar {plan.name}

                    <i className="bi bi-arrow-up-right"></i>
                  </a>

                  <div className="activation-note">
                    <i className="bi bi-shield-check"></i>

                    Activación rápida y personalizada
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                PRICE NOTE
            ================================================== */}
          </div>
        </section>

        {/* ===================================================
            BENEFITS
        ==================================================== */}
     

        {/* ===================================================
            ADVANTAGES
        ==================================================== */}
       

        {/* ===================================================
            CTA BANNER
        ==================================================== */}
        
        {/* ===================================================
            FAQ
        ==================================================== */}
        <section className="faq-section">
          <div className="planes-container">
            <div className="section-heading">
              <span>PREGUNTAS FRECUENTES</span>

              <h2>
                Antes de activar tu plan.
              </h2>

              <p>
                Algunas respuestas que pueden ayudarte.
              </p>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details className="faq-item" key={faq.question}>
                  <summary>
                    <span>
                      <b>0{index + 1}</b>
                      {faq.question}
                    </span>

                    <i className="bi bi-plus-lg"></i>
                  </summary>

                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      

      {/* =====================================================
          STYLES
      ====================================================== */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .planes-page {
          min-height: 100vh;
          background: #f8fafc;
          color: #0f172a;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .planes-container {
          width: min(1160px, calc(100% - 40px));
          margin: 0 auto;
        }

        /* ================================================
           NAVBAR
        ================================================= */

        .planes-navbar {
          height: 76px;
          background: rgba(255,255,255,0.94);
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(14px);
        }

        .navbar-inner {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          color: inherit;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #0d1e3d;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          box-shadow:
            0 6px 16px rgba(13,30,61,0.15);
        }

        .brand-name {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0f172a;
        }

        .brand-subtitle {
          margin-top: 1px;
          font-size: 10px;
          color: #64748b;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border: 1px solid #e2e8f0;
          border-radius: 9px;
          background: #ffffff;
          color: #475569;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          border-color: #bfdbfe;
          background: #eff6ff;
          color: #1e40af;
        }

        /* ================================================
           HERO
        ================================================= */

        .pricing-hero {
          background:
            linear-gradient(
              135deg,
              #f8fafc 0%,
              #eff6ff 52%,
              #ffffff 100%
            );
          border-bottom: 1px solid #e2e8f0;
          padding: 82px 0 72px;
          position: relative;
          overflow: hidden;
        }

        .pricing-hero::before {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: rgba(59,130,246,0.06);
          top: -230px;
          right: -120px;
        }

        .pricing-hero::after {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: rgba(6,182,212,0.04);
          bottom: -220px;
          left: -100px;
        }

        .hero-content {
          max-width: 780px;
          position: relative;
          z-index: 1;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 999px;
          color: #1d4ed8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .eyebrow-icon {
          display: flex;
          font-size: 12px;
        }

        .hero-content h1 {
          margin: 20px 0 16px;
          font-size: clamp(40px, 6vw, 68px);
          line-height: 1.04;
          letter-spacing: -0.055em;
          font-weight: 850;
          color: #0d1e3d;
        }

        .hero-content h1 span {
          color: #2563eb;
        }

        .hero-content > p {
          max-width: 680px;
          margin: 0;
          color: #64748b;
          font-size: 17px;
          line-height: 1.7;
        }

        .hero-trust {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 27px;
        }

        .hero-trust div {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .hero-trust i {
          color: #16a34a;
          font-size: 14px;
        }

        /* ================================================
           SECTION HEADING
        ================================================= */

        .section-heading {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 42px;
        }

        .section-heading.left {
          text-align: left;
          margin-left: 0;
        }

        .section-heading > span {
          color: #2563eb;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .section-heading h2 {
          margin: 10px 0 10px;
          color: #0d1e3d;
          font-size: clamp(29px, 4vw, 42px);
          line-height: 1.12;
          letter-spacing: -0.04em;
          font-weight: 850;
        }

        .section-heading p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.65;
        }

        /* ================================================
           PRICING
        ================================================= */

        .pricing-section {
          padding: 86px 0 90px;
          background: #ffffff;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          max-width: 880px;
          margin: 0 auto;
        }

        .pricing-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 28px;
          position: relative;
          box-shadow:
            0 10px 30px rgba(15,23,42,0.04);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 18px 45px rgba(15,23,42,0.09);
        }

        .pricing-card-featured {
          border: 2px solid #2563eb;
          box-shadow:
            0 16px 45px rgba(37,99,235,0.12);
        }

        .popular-badge {
          position: absolute;
          top: -13px;
          right: 22px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          background: #2563eb;
          color: #ffffff;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .plan-top {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .plan-icon {
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 18px;
        }

        .plan-top h3 {
          margin: 0;
          color: #0f172a;
          font-size: 17px;
          font-weight: 800;
        }

        .plan-top p {
          margin: 3px 0 0;
          color: #64748b;
          font-size: 11px;
        }

        .price-wrapper {
          display: flex;
          align-items: baseline;
          margin-top: 26px;
        }

        .currency {
          color: #64748b;
          font-size: 15px;
          font-weight: 700;
          margin-right: 5px;
        }

        .price {
          color: #0d1e3d;
          font-size: 47px;
          line-height: 1;
          font-weight: 850;
          letter-spacing: -0.05em;
        }

        .period {
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
          margin-left: 6px;
        }

        .saving {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-top: 10px;
          padding: 5px 8px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 6px;
          color: #15803d;
          font-size: 10px;
          font-weight: 800;
        }

        .monthly-equivalent {
          margin-top: 11px;
          padding: 9px 10px;
          border-radius: 8px;
          background: #eff6ff;
          color: #1e40af;
          font-size: 10px;
          line-height: 1.5;
        }

        .monthly-equivalent i {
          margin-right: 5px;
        }

        .plan-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 23px 0 18px;
        }

        .plan-features {
          display: grid;
          gap: 11px;
          min-height: 145px;
        }

        .plan-features div {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #334155;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.45;
        }

        .plan-features i {
          flex-shrink: 0;
          color: #22c55e;
          font-size: 13px;
          margin-top: 1px;
        }

        .plan-button {
          width: 100%;
          min-height: 48px;
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .plan-button-primary {
          background: #0d1e3d;
          color: #ffffff;
          box-shadow:
            0 8px 20px rgba(13,30,61,0.16);
        }

        .plan-button-primary:hover {
          background: #132a52;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .plan-button-secondary {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
        }

        .plan-button-secondary:hover {
          background: #dbeafe;
          color: #1e3a8a;
        }

        .activation-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 11px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 600;
        }

        .activation-note i {
          color: #16a34a;
          font-size: 11px;
        }

        .price-bottom-note {
          max-width: 880px;
          margin: 25px auto 0;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .note-icon {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          border-radius: 8px;
          background: #eff6ff;
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .price-bottom-note > div:nth-child(2) {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .price-bottom-note strong {
          color: #334155;
          font-size: 11px;
        }

        .price-bottom-note span {
          color: #64748b;
          font-size: 10px;
        }

        .price-bottom-note > a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #2563eb;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* ================================================
           BENEFITS
        ================================================= */

        .benefits-section {
          padding: 88px 0;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .benefit-card {
          min-height: 155px;
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 19px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          position: relative;
          transition: all 0.2s ease;
        }

        .benefit-card:hover {
          border-color: #bfdbfe;
          box-shadow:
            0 10px 25px rgba(15,23,42,0.05);
        }

        .benefit-icon {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 16px;
        }

        .benefit-card h3 {
          margin: 1px 0 5px;
          color: #0f172a;
          font-size: 13px;
          font-weight: 800;
        }

        .benefit-card p {
          margin: 0;
          padding-right: 5px;
          color: #64748b;
          font-size: 10px;
          line-height: 1.55;
        }

        .benefit-check {
          position: absolute;
          right: 14px;
          top: 14px;
          color: #22c55e;
          font-size: 12px;
        }

        /* ================================================
           ADVANTAGES
        ================================================= */

        .advantages-section {
          padding: 100px 0;
          background: #ffffff;
        }

        .advantages-layout {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 90px;
          align-items: center;
        }

        .advantages-copy .section-heading h2 span {
          color: #2563eb;
        }

        .advantages-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 25px;
          padding: 13px 17px;
          border-radius: 10px;
          background: #0d1e3d;
          color: #ffffff;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          box-shadow:
            0 8px 20px rgba(13,30,61,0.14);
          transition: all 0.2s ease;
        }

        .advantages-button:hover {
          background: #132a52;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .advantages-list {
          display: grid;
          gap: 14px;
        }

        .advantage-item {
          display: grid;
          grid-template-columns: 35px 48px 1fr;
          align-items: center;
          gap: 15px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
        }

        .advantage-number {
          color: #cbd5e1;
          font-size: 11px;
          font-weight: 800;
        }

        .advantage-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
          font-size: 18px;
        }

        .advantage-item h3 {
          margin: 0 0 4px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
        }

        .advantage-item p {
          margin: 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.55;
        }

        /* ================================================
           CTA
        ================================================= */

        .cta-section {
          padding: 0 0 90px;
          background: #ffffff;
        }

        .cta-card {
          position: relative;
          overflow: hidden;
          border-radius: 22px;
          padding: 45px;
          background:
            linear-gradient(
              135deg,
              #0d1e3d 0%,
              #132a52 55%,
              #1e3a8a 100%
            );
          color: #ffffff;
          box-shadow:
            0 20px 50px rgba(13,30,61,0.15);
        }

        .cta-decoration {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .cta-decoration-one {
          width: 300px;
          height: 300px;
          right: -100px;
          top: -160px;
          border: 55px solid rgba(96,165,250,0.08);
        }

        .cta-decoration-two {
          width: 180px;
          height: 180px;
          left: -80px;
          bottom: -120px;
          background: rgba(6,182,212,0.06);
        }

        .cta-content {
          display: grid;
          grid-template-columns: 58px 1fr auto;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .cta-icon {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.12);
          color: #93c5fd;
          font-size: 24px;
        }

        .cta-label {
          color: #93c5fd;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .cta-content h2 {
          margin: 6px 0 8px;
          color: #ffffff;
          font-size: 29px;
          line-height: 1.12;
          letter-spacing: -0.035em;
          font-weight: 850;
        }

        .cta-content p {
          max-width: 570px;
          margin: 0;
          color: #bfdbfe;
          font-size: 11px;
          line-height: 1.6;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 17px;
          border-radius: 10px;
          background: #ffffff;
          color: #0d1e3d;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .cta-button:hover {
          background: #eff6ff;
          color: #0d1e3d;
          transform: translateY(-2px);
        }

        /* ================================================
           FAQ
        ================================================= */

        .faq-section {
          padding: 90px 0;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          display: grid;
          gap: 9px;
        }

        .faq-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          overflow: hidden;
        }

        .faq-item summary {
          min-height: 61px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          list-style: none;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .faq-item summary::-webkit-details-marker {
          display: none;
        }

        .faq-item summary span {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .faq-item summary b {
          color: #94a3b8;
          font-size: 9px;
        }

        .faq-item summary > i {
          color: #64748b;
          font-size: 12px;
          transition: transform 0.2s ease;
        }

        .faq-item[open] summary > i {
          transform: rotate(45deg);
        }

        .faq-answer {
          padding: 0 45px 18px;
          color: #64748b;
          font-size: 11px;
          line-height: 1.7;
        }

        /* ================================================
           FOOTER
        ================================================= */

        .planes-footer {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 35px 0 22px;
        }

        .footer-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 27px;
        }

        .footer-description {
          color: #64748b;
          font-size: 10px;
        }

        .footer-support {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #2563eb;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
        }

        .footer-bottom {
          padding-top: 18px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #94a3b8;
          font-size: 9px;
        }

        /* ================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 900px) {
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .advantages-layout {
            grid-template-columns: 1fr;
            gap: 45px;
          }

          .advantages-copy .section-heading {
            max-width: 700px;
          }

          .cta-content {
            grid-template-columns: 58px 1fr;
          }

          .cta-button {
            grid-column: 2;
            justify-self: start;
          }
        }

        @media (max-width: 700px) {
          .planes-container {
            width: min(100% - 28px, 560px);
          }

          .planes-navbar {
            height: 68px;
          }

          .brand-subtitle {
            display: none;
          }

          .back-button span {
            display: none;
          }

          .back-button {
            width: 36px;
            height: 36px;
            padding: 0;
            justify-content: center;
          }

          .pricing-hero {
            padding: 58px 0 55px;
          }

          .hero-content h1 {
            font-size: 42px;
          }

          .hero-content > p {
            font-size: 14px;
          }

          .hero-trust {
            display: grid;
            gap: 10px;
          }

          .pricing-section,
          .benefits-section,
          .advantages-section,
          .faq-section {
            padding: 65px 0;
          }

          .section-heading {
            margin-bottom: 30px;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
          }

          .pricing-card {
            padding: 24px;
          }

          .price-bottom-note {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .price-bottom-note > a {
            width: 100%;
            padding-left: 44px;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .benefit-card {
            min-height: auto;
          }

          .advantage-item {
            grid-template-columns: 28px 42px 1fr;
            gap: 10px;
            padding: 15px;
          }

          .advantage-icon {
            width: 42px;
            height: 42px;
          }

          .cta-card {
            padding: 28px 22px;
            border-radius: 17px;
          }

          .cta-content {
            grid-template-columns: 45px 1fr;
            gap: 14px;
          }

          .cta-icon {
            width: 45px;
            height: 45px;
            font-size: 18px;
          }

          .cta-content h2 {
            font-size: 24px;
          }

          .cta-content p {
            margin-top: 5px;
          }

          .cta-button {
            grid-column: 1 / -1;
            width: 100%;
            margin-top: 7px;
          }

          .footer-main {
            align-items: flex-start;
            flex-direction: column;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 7px;
          }
        }

        @media (max-width: 400px) {
          .hero-content h1 {
            font-size: 37px;
          }

          .price {
            font-size: 42px;
          }

          .pricing-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
    </Layout>
  );
}