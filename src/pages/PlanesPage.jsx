import React from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

// ============================================================
// CONFIG
// ============================================================

const WHATSAPP_NUMBER = "18494850059";

const MONTHLY_PRICE = 599;
const YEARLY_PRICE = 4792;

const formatMoney = (value) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });

const features = [
  "Todos los sistemas de cálculo",
  "Ventanas P-92, P-65, C-70, M-100 y Tradicional",
  "Puertas Comercial y P40",
  "Optimización de corte de vidrio",
  "Optimización de corte de aluminio",
  "Exportación de desgloses a PDF",
  "Historial de desgloses",
  "Soporte técnico por WhatsApp",
];

const plans = [
  {
    id: "monthly",
    name: "Mensual",
    icon: "bi-calendar3",
    price: MONTHLY_PRICE,
    period: "/ mes",
    description: "Flexibilidad para trabajar mes a mes.",
    note: "Paga mes a mes, sin complicaciones.",
    featured: false,
  },
  {
    id: "yearly",
    name: "Anual",
    icon: "bi-gem",
    price: YEARLY_PRICE,
    period: "/ año",
    description: "La mejor opción para tu taller.",
    note: `Equivale a RD$${formatMoney(YEARLY_PRICE / 12)} al mes`,
    saving: `Ahorras RD$${formatMoney(MONTHLY_PRICE * 12 - YEARLY_PRICE)}`,
    featured: true,
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
      "El plan mensual cuesta RD$599 al mes. El plan anual cuesta RD$4,792 por todo el año y representa un ahorro de RD$2,396 frente a pagar 12 meses por separado.",
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
  const nombre = userData?.nombre || userData?.displayName || null;
  const email = userData?.email || null;

  let message = `Hola, quiero activar ${plan} en Desglose Pro.`;
  if (nombre) message += `\n\nNombre: ${nombre}`;
  if (email) message += `\nCorreo: ${email}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// ============================================================
// PAGE
// ============================================================

export default function PlanesPage() {
  const { userData } = useAuth();

  return (
    <Layout>
      <div className="pl-page">
        <main>
          {/* =================================================
              HERO
          ================================================== */}
          <section className="pl-hero">
            <div className="pl-container">
              <span className="pl-eyebrow">
                <i className="bi bi-stars"></i>
                FULL ACCESS
              </span>

              <h1>
                Lleva tu taller <span>al siguiente nivel.</span>
              </h1>

              <p>
                Todas las herramientas de Desglose Pro para trabajar tus
                proyectos de aluminio y vidrio de forma rápida, organizada y
                profesional.
              </p>
            </div>
          </section>

          {/* =================================================
              PLANES
          ================================================== */}
          <section className="pl-pricing">
            <div className="pl-container">
              <div className="pl-grid">
                {plans.map((plan) => (
                  <article
                    key={plan.id}
                    className={`pl-card ${
                      plan.featured ? "pl-card-featured" : ""
                    }`}
                  >
                    {plan.featured && (
                      <span className="pl-badge">
                        <i className="bi bi-star-fill"></i>
                        MEJOR VALOR
                      </span>
                    )}

                    <header className="pl-card-head">
                      <div className="pl-plan-icon">
                        <i className={`bi ${plan.icon}`}></i>
                      </div>

                      <div>
                        <h3 className="pl-plan-name">{plan.name}</h3>
                        <p className="pl-plan-desc">{plan.description}</p>
                      </div>
                    </header>

                    <div className="pl-price">
                      <span className="pl-currency">RD$</span>
                      <span className="pl-amount">
                        {formatMoney(plan.price)}
                      </span>
                      <span className="pl-period">{plan.period}</span>
                    </div>

                    <div className="pl-meta">
                      {plan.saving && (
                        <span className="pl-saving">
                          <i className="bi bi-arrow-down-short"></i>
                          {plan.saving}
                        </span>
                      )}
                      <span>{plan.note}</span>
                    </div>

                    <a
                      href={createWhatsAppUrl(
                        `Full Access ${plan.name}`,
                        userData
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pl-button"
                    >
                      <i className="bi bi-whatsapp"></i>
                      Activar {plan.name}
                      <i className="bi bi-arrow-right pl-button-arrow"></i>
                    </a>

                    <div className="pl-divider"></div>

                    <ul className="pl-features">
                      {features.map((item) => (
                        <li key={item}>
                          <span className="pl-check">
                            <i className="bi bi-check-lg"></i>
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <p className="pl-activation">
                <i className="bi bi-shield-check"></i>
                Activación rápida y personalizada por WhatsApp.
              </p>
            </div>
          </section>

          {/* =================================================
              FAQ
          ================================================== */}
          <section className="pl-faq">
            <div className="pl-container">
              <h2 className="pl-faq-title">Preguntas frecuentes</h2>

              <div className="pl-faq-list">
                {faqs.map((faq) => (
                  <details className="pl-faq-item" key={faq.question}>
                    <summary>
                      {faq.question}
                      <i className="bi bi-plus-lg"></i>
                    </summary>

                    <div className="pl-faq-answer">{faq.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </main>

        <style>{`
          .pl-page {
            min-height: 100vh;
            background: #ffffff;
            color: #0f172a;
          }

          .pl-container {
            width: min(1040px, calc(100% - 40px));
            margin: 0 auto;
          }

          /* ---------- Hero ---------- */

          .pl-hero {
            padding: 72px 0 56px;
            text-align: center;
            background:
              radial-gradient(
                60% 100% at 50% 0%,
                rgba(59, 130, 246, 0.09),
                transparent 70%
              ),
              #ffffff;
          }

          .pl-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.8);
            color: #475569;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.08em;
          }

          .pl-eyebrow i {
            color: #1a56db;
          }

          .pl-hero h1 {
            margin: 22px 0 14px;
            color: #0b1730;
            font-size: clamp(34px, 5vw, 52px);
            font-weight: 700;
            line-height: 1.1;
            letter-spacing: -0.035em;
          }

          .pl-hero h1 span {
            color: #1a56db;
          }

          .pl-hero p {
            max-width: 560px;
            margin: 0 auto;
            color: #64748b;
            font-size: 16px;
            line-height: 1.65;
          }

          /* ---------- Planes ---------- */

          .pl-pricing {
            padding: 24px 0 80px;
          }

          .pl-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
            align-items: stretch;
            max-width: 860px;
            margin: 0 auto;
          }

          .pl-card {
            position: relative;
            display: flex;
            flex-direction: column;
            padding: 34px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 24px;
            box-shadow:
              0 1px 2px rgba(15, 23, 42, 0.04),
              0 16px 40px -16px rgba(15, 23, 42, 0.14);
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }

          .pl-card:hover {
            transform: translateY(-4px);
            box-shadow:
              0 1px 2px rgba(15, 23, 42, 0.04),
              0 24px 48px -16px rgba(15, 23, 42, 0.2);
          }

          /* Featured (Anual) */

          .pl-card-featured {
            overflow: hidden;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background:
              radial-gradient(
                120% 70% at 100% 0%,
                rgba(59, 130, 246, 0.3),
                transparent 60%
              ),
              linear-gradient(165deg, #10224a 0%, #0a1328 100%);
            box-shadow:
              0 0 0 1px rgba(11, 23, 48, 0.9),
              0 32px 64px -20px rgba(11, 23, 48, 0.55);
          }

          .pl-card-featured::before {
            content: "";
            position: absolute;
            top: 0;
            left: 12%;
            right: 12%;
            height: 1px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(147, 197, 253, 0.8),
              transparent
            );
          }

          .pl-card-featured:hover {
            box-shadow:
              0 0 0 1px rgba(11, 23, 48, 0.9),
              0 40px 72px -20px rgba(11, 23, 48, 0.65);
          }

          .pl-badge {
            position: absolute;
            top: 18px;
            right: 18px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 11px;
            border-radius: 999px;
            background: linear-gradient(135deg, #f8dc9b, #d9a441);
            color: #3b2a05;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.06em;
          }

          .pl-badge i {
            font-size: 10px;
          }

          .pl-card-head {
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .pl-plan-icon {
            width: 44px;
            height: 44px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: #eff6ff;
            color: #1a56db;
            font-size: 18px;
          }

          .pl-card-featured .pl-plan-icon {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.14);
            color: #bfdbfe;
          }

          .pl-plan-name {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.01em;
          }

          .pl-plan-desc {
            margin: 3px 0 0;
            color: #64748b;
            font-size: 13px;
          }

          .pl-card-featured .pl-plan-desc {
            color: #94a3b8;
          }

          .pl-price {
            display: flex;
            align-items: flex-start;
            gap: 6px;
            margin-top: 30px;
          }

          .pl-currency {
            margin-top: 8px;
            color: #64748b;
            font-size: 16px;
            font-weight: 600;
          }

          .pl-card-featured .pl-currency {
            color: #94a3b8;
          }

          .pl-amount {
            font-size: 56px;
            font-weight: 700;
            line-height: 1;
            letter-spacing: -0.045em;
            font-variant-numeric: tabular-nums;
          }

          .pl-period {
            align-self: flex-end;
            padding-bottom: 6px;
            color: #64748b;
            font-size: 14px;
          }

          .pl-card-featured .pl-period {
            color: #94a3b8;
          }

          .pl-meta {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px 10px;
            min-height: 28px;
            margin: 14px 0 26px;
            color: #64748b;
            font-size: 13px;
          }

          .pl-card-featured .pl-meta {
            color: #94a3b8;
          }

          .pl-saving {
            display: inline-flex;
            align-items: center;
            padding: 3px 10px 3px 6px;
            border-radius: 999px;
            background: rgba(16, 185, 129, 0.16);
            color: #34d399;
            font-size: 12px;
            font-weight: 700;
          }

          .pl-saving i {
            font-size: 16px;
          }

          .pl-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            height: 50px;
            border: 1px solid #0b1730;
            border-radius: 14px;
            background: #0b1730;
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.2s ease, box-shadow 0.2s ease;
          }

          .pl-button:hover {
            background: #1e293b;
            color: #ffffff;
          }

          .pl-button-arrow {
            font-size: 13px;
            transition: transform 0.2s ease;
          }

          .pl-button:hover .pl-button-arrow {
            transform: translateX(3px);
          }

          .pl-card-featured .pl-button {
            border-color: #ffffff;
            background: #ffffff;
            color: #0b1730;
            box-shadow: 0 8px 24px -8px rgba(255, 255, 255, 0.35);
          }

          .pl-card-featured .pl-button:hover {
            background: #eff6ff;
            color: #0b1730;
          }

          .pl-divider {
            height: 1px;
            margin: 28px 0 24px;
            background: #e2e8f0;
          }

          .pl-card-featured .pl-divider {
            background: rgba(255, 255, 255, 0.1);
          }

          .pl-features {
            display: grid;
            gap: 13px;
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .pl-features li {
            display: flex;
            align-items: center;
            gap: 11px;
            color: #334155;
            font-size: 14px;
            line-height: 1.4;
          }

          .pl-card-featured .pl-features li {
            color: #e2e8f0;
          }

          .pl-check {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #eff6ff;
            color: #1a56db;
            font-size: 12px;
          }

          .pl-card-featured .pl-check {
            background: rgba(59, 130, 246, 0.22);
            color: #93c5fd;
          }

          .pl-activation {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin: 28px 0 0;
            color: #64748b;
            font-size: 13px;
          }

          /* ---------- FAQ ---------- */

          .pl-faq {
            padding: 72px 0 96px;
            border-top: 1px solid #e2e8f0;
            background: #f8fafc;
          }

          .pl-faq-title {
            margin: 0 0 28px;
            text-align: center;
            color: #0b1730;
            font-size: 26px;
            font-weight: 700;
            letter-spacing: -0.02em;
          }

          .pl-faq-list {
            display: grid;
            gap: 10px;
            max-width: 720px;
            margin: 0 auto;
          }

          .pl-faq-item {
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            background: #ffffff;
            overflow: hidden;
          }

          .pl-faq-item summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 18px 20px;
            color: #0f172a;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            list-style: none;
          }

          .pl-faq-item summary::-webkit-details-marker {
            display: none;
          }

          .pl-faq-item summary i {
            flex-shrink: 0;
            color: #94a3b8;
            font-size: 14px;
            transition: transform 0.2s ease;
          }

          .pl-faq-item[open] summary i {
            transform: rotate(45deg);
          }

          .pl-faq-answer {
            padding: 0 20px 20px;
            color: #64748b;
            font-size: 14px;
            line-height: 1.7;
          }

          /* ---------- Responsive ---------- */

          @media (min-width: 721px) {
            /* Anual un ti kras pi wo pou li parèt pi enpòtan */
            .pl-card-featured {
              margin-top: -10px;
              margin-bottom: -10px;
              padding-top: 44px;
              padding-bottom: 44px;
            }
          }

          @media (max-width: 720px) {
            .pl-hero {
              padding: 48px 0 36px;
            }

            .pl-hero p {
              font-size: 15px;
            }

            .pl-pricing {
              padding-bottom: 56px;
            }

            .pl-grid {
              grid-template-columns: 1fr;
              max-width: 460px;
              gap: 20px;
            }

            .pl-card {
              padding: 26px;
            }

            .pl-card:hover {
              transform: none;
            }

            .pl-amount {
              font-size: 48px;
            }

            .pl-faq {
              padding: 56px 0 72px;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}