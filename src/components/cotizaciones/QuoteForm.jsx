import { useEffect, useMemo, useState } from "react";

import QuoteItemsEditor from "./QuoteItemsEditor";
import QuoteSummary from "./QuoteSummary";
import QuotePreview from "./QuotePreview";

import { calculateQuote } from "../../utils/cotizaciones/quoteCalculations";
import { todayISO } from "../../utils/cotizaciones/quoteFormatters";
import { validateQuote } from "../../utils/cotizaciones/quoteValidators";
import { generateQuotePdf } from "../../utils/cotizaciones/quotePdf";

const blank = () => ({
  title: "",
  description: "",
  client: {
    name: "",
    document: "",
    phone: "",
    email: "",
    address: "",
  },
  items: [],
  financial: {
    discountType: "percentage",
    discountValue: 0,
    taxEnabled: false,
    taxRate: 18,
    currency: "DOP",
  },
  status: "draft",
  issueDate: todayISO(),
  expirationDate: "",
  notes: "",
  terms: "",
});

export default function QuoteForm({ initialQuote, onSave, onCancel }) {
  const [form, setForm] = useState(() =>
    initialQuote ? JSON.parse(JSON.stringify(initialQuote)) : blank(),
  );

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);

  const calculated = useMemo(
    () => ({
      ...form,
      ...calculateQuote(form.items, form.financial),
    }),
    [form],
  );

  useEffect(() => {
    setForm(initialQuote ? JSON.parse(JSON.stringify(initialQuote)) : blank());
    setErrors({});
    setPreview(false);
  }, [initialQuote]);

  const patch = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const patchClient = (key, value) => {
    setForm((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        [key]: value,
      },
    }));
  };

  const patchFinancial = (key, value) => {
    setForm((prev) => ({
      ...prev,
      financial: {
        ...prev.financial,
        [key]: value,
      },
    }));
  };

  const save = () => {
    const next = { ...calculated };
    const validation = validateQuote(next);

    setErrors(validation);

    if (Object.keys(validation).length) {
      return;
    }

    onSave(next);
  };

  const firstError = Object.values(errors)[0];

  return (
    <div className="quote-editor">
      {/* HEADER */}

      <div className="quote-editor-heading no-print">
        <div className="quote-editor-title">
          <button type="button" className="btn-back" onClick={onCancel}>
            <i className="bi bi-arrow-left" />
            Volver
          </button>
        </div>
      </div>

      {/* VALIDATION */}

      {firstError && (
        <div className="alert alert-danger py-2 no-print" role="alert">
          <i className="bi bi-exclamation-circle me-2" />
          {firstError}
        </div>
      )}

      {/* FORM CONTENT */}

      <div className="row g-3 quote-form-layout">
        <div className="col-lg-8">
          {/* GENERAL INFORMATION */}

          <section className="quote-panel quote-form-section">
            <div className="quote-section-heading">
              <div className="quote-section-icon">
                <i className="bi bi-file-earmark-text" />
              </div>

              <div>
                <h1>
                  {initialQuote ? "Editar cotización" : "Nueva cotización"}
                </h1>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">
                  Título del proyecto <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  placeholder="Ej. Instalación de puertas y ventanas"
                  value={form.title}
                  onChange={(e) => patch("title", e.target.value)}
                />

                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">Estado</label>

                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => patch("status", e.target.value)}
                >
                  <option value="draft">Borrador</option>
                  <option value="sent">Enviada</option>
                  <option value="approved">Aprobada</option>
                  <option value="rejected">Rechazada</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Descripción</label>

                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Describe brevemente el proyecto..."
                  value={form.description}
                  onChange={(e) => patch("description", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de emisión</label>

                <input
                  type="date"
                  className="form-control"
                  value={form.issueDate}
                  onChange={(e) => patch("issueDate", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Fecha de vencimiento</label>

                <input
                  type="date"
                  className="form-control"
                  value={form.expirationDate}
                  onChange={(e) => patch("expirationDate", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* CLIENT INFORMATION */}

          <section className="quote-panel quote-form-section">
            <div className="quote-section-heading">
              <div className="quote-section-icon">
                <i className="bi bi-person" />
              </div>

              <div>
                <h3>Información del cliente</h3>
              </div>
            </div>

            <div className="row g-3">
              {[
                ["name", "Nombre o razón social", true],
                ["document", "Cédula / RNC"],
                ["phone", "Teléfono"],
                ["email", "Correo electrónico"],
                ["address", "Dirección"],
              ].map(([key, label, required]) => (
                <div
                  className={key === "address" ? "col-12" : "col-md-6"}
                  key={key}
                >
                  <label className="form-label">
                    {label}
                    {required && <span className="text-danger"> *</span>}
                  </label>

                  <input
                    type={key === "email" ? "email" : "text"}
                    className={`form-control ${
                      key === "name" && errors.client ? "is-invalid" : ""
                    }`}
                    placeholder={
                      key === "name"
                        ? "Nombre del cliente"
                        : key === "phone"
                          ? "809-000-0000"
                          : ""
                    }
                    value={form.client[key] || ""}
                    onChange={(e) => patchClient(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ITEMS */}

          <section className="quote-panel quote-form-section">
            <div className="quote-section-heading">
              <div className="quote-section-icon">
                <i className="bi bi-box-seam" />
              </div>

              <div>
                <h3>Agrega los conceptos de esta cotización</h3>
              </div>
            </div>

            <QuoteItemsEditor
              items={form.items}
              onChange={(value) => patch("items", value)}
            />

            {errors.items && (
              <div className="text-danger small mt-2">
                <i className="bi bi-exclamation-circle me-1" />
                {errors.items}
              </div>
            )}
          </section>
        </div>

        {/* SUMMARY SIDEBAR */}

        <div className="col-lg-4">
          <div className="quote-sticky">
            {/* FINANCIAL CONDITIONS */}

            <section className="quote-panel quote-form-section">
              <div className="quote-section-heading">
                <div className="quote-section-icon">
                  <i className="bi bi-calculator" />
                </div>

                <div>
                  <h3>Configura descuentos e impuestos</h3>
                </div>
              </div>

              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Tipo de descuento</label>

                  <select
                    className="form-select"
                    value={form.financial.discountType}
                    onChange={(e) =>
                      patchFinancial("discountType", e.target.value)
                    }
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed">Importe fijo</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Valor del descuento</label>

                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.financial.discountValue}
                    onChange={(e) =>
                      patchFinancial("discountValue", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-4">
                  <div className="quote-tax-control">
                    <div className="form-check">
                      <input
                        id="quote-tax-enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={form.financial.taxEnabled}
                        onChange={(e) =>
                          patchFinancial("taxEnabled", e.target.checked)
                        }
                      />

                      <label
                        className="form-check-label"
                        htmlFor="quote-tax-enabled"
                      >
                        Aplicar ITBIS
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">ITBIS (%)</label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    value={form.financial.taxRate}
                    disabled={!form.financial.taxEnabled}
                    onChange={(e) => patchFinancial("taxRate", e.target.value)}
                  />
                </div>
              </div>

              <div className="quote-form-summary">
                <QuoteSummary financial={calculated.financial} />
              </div>
            </section>
          </div>

          {/* NOTES AND TERMS */}
          <div className="quote-sticky">
            <section className="quote-panel quote-form-section">
              <div className="quote-section-heading">
                <div className="quote-section-icon">
                  <i className="bi bi-card-text" />
                </div>

                <div>
                  <h3>Información adicional para el cliente</h3>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Observaciones</label>

                <textarea
                  className="form-control"
                  rows="3"
                  value={form.notes}
                  onChange={(e) => patch("notes", e.target.value)}
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div>
                <label className="form-label">Condiciones comerciales</label>

                <textarea
                  className="form-control"
                  rows="3"
                  value={form.terms}
                  onChange={(e) => patch("terms", e.target.value)}
                  placeholder="Validez de la oferta, tiempo estimado de entrega, forma de pago, instalación y garantía..."
                />
              </div>
            </section>
          </div>

          <div className="quote-sticky">
            <section className="quote-panel quote-sidebar-summary">
              <div className="quote-section-heading">
                <div className="quote-section-icon">
                  <i className="bi bi-receipt" />
                </div>

                <div>
                  <h3>Resumen de cotización</h3>
                  <p>Totales actualizados.</p>
                </div>
              </div>

              <QuoteSummary financial={calculated.financial} />

              <div className="quote-editor-actions">
                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={() => setPreview((prev) => !prev)}
                >
                  <i className="bi bi-eye me-1" />
                  Vista previa
                </button>

                <button
                  type="button"
                  className="btn-primary-sm"
                  onClick={() => generateQuotePdf(calculated)}
                >
                  <i className="bi bi-file-earmark-pdf me-1" />
                  PDF
                </button>

                <button
                  type="button"
                  className="btn-secondary-sm"
                  onClick={save}
                >
                  <i className="bi bi-check2 me-1" />
                  Guardar
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* PDF PREVIEW */}

      {preview && (
        <div
          className="quote-preview-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setPreview(false);
            }
          }}
        >
          <div className="quote-preview-dialog">
            <div className="quote-preview-actions no-print">
              <button
                type="button"
                className="btn-primary-sm"
                onClick={() => setPreview(false)}
              >
                <i className="bi bi-x-lg me-1" />
                Cerrar
              </button>

              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => generateQuotePdf(calculated)}
              >
                <i className="bi bi-file-earmark-pdf me-1" />
                Descargar PDF
              </button>
            </div>

            <QuotePreview quote={calculated} />
          </div>
        </div>
      )}
    </div>
  );
}
