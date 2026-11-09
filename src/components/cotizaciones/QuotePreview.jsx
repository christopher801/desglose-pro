
import QuoteSummary from "./QuoteSummary";
import {
  formatDate,
  formatMoney,
} from "../../utils/cotizaciones/quoteFormatters";

export default function QuotePreview({ quote }) {
  if (!quote) return null;

  const client = quote.client || {};
  const items = Array.isArray(quote.items) ? quote.items : [];
  const financial = quote.financial || {};

  const clientDetails = [
    { label: "Documento", value: client.document },
    { label: "Teléfono", value: client.phone },
    { label: "Correo electrónico", value: client.email },
    { label: "Dirección", value: client.address },
  ].filter((item) => item.value);

  return (
    <article className="quote-document" id="quote-document">

      {/* DOCUMENT HEADER */}
      <header className="quote-doc-header">
        <div className="quote-doc-brand">
          <div className="quote-doc-brand-mark">
            <i className="bi bi-file-earmark-text" />
          </div>

          <div className="quote-doc-brand-info">
            <span className="quote-doc-overline">
              DOCUMENTO COMERCIAL
            </span>
            <h1>COTIZACIÓN</h1>
            <p>Propuesta económica de productos y servicios</p>
          </div>
        </div>

        <div className="quote-doc-number">
          <span>NÚMERO DE COTIZACIÓN</span>
          <strong>{quote.number || "PENDIENTE"}</strong>
          <small>
            <i className="bi bi-circle-fill" />
            {quote.status === "approved"
              ? "Aprobada"
              : quote.status === "sent"
                ? "Enviada"
                : quote.status === "rejected"
                  ? "Rechazada"
                  : quote.status === "expired"
                    ? "Vencida"
                    : "Borrador"}
          </small>
        </div>
      </header>

      {/* DATES */}
      <section className="quote-doc-meta">
        <div className="quote-doc-meta-item">
          <span>
            <i className="bi bi-calendar3" />
            Fecha de emisión
          </span>
          <strong>{formatDate(quote.issueDate)}</strong>
        </div>

        <div className="quote-doc-meta-item">
          <span>
            <i className="bi bi-calendar-check" />
            Fecha de vencimiento
          </span>
          <strong>{formatDate(quote.expirationDate)}</strong>
        </div>
      </section>

      {/* PROPOSAL */}
      <section className="quote-doc-title">
        <span className="quote-doc-section-label">
          DETALLES DE LA PROPUESTA
        </span>

        <h2>{quote.title || "Cotización sin título"}</h2>

        {quote.description && (
          <p>{quote.description}</p>
        )}
      </section>

      {/* CLIENT */}
      <section className="quote-doc-client">
        <div className="quote-doc-section-heading">
          <div className="quote-doc-section-icon">
            <i className="bi bi-person" />
          </div>

          <div>
            <span className="quote-doc-section-label">
              INFORMACIÓN DEL CLIENTE
            </span>
            <h3>Datos del cliente</h3>
          </div>
        </div>

        <div className="quote-doc-client-content">
          <div className="quote-doc-client-main">
            <span>CLIENTE</span>
            <strong>
              {client.name || "Cliente no especificado"}
            </strong>
          </div>

          {clientDetails.length > 0 && (
            <div className="quote-doc-client-grid">
              {clientDetails.map((detail) => (
                <div key={detail.label}>
                  <span>{detail.label}</span>
                  <strong>{detail.value}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ITEMS */}
      <section className="quote-doc-items">
        <div className="quote-doc-section-heading">
          <div className="quote-doc-section-icon">
            <i className="bi bi-list-ul" />
          </div>

          <div>
            <span className="quote-doc-section-label">
              DESGLOSE ECONÓMICO
            </span>
            <h3>Productos y servicios</h3>
          </div>
        </div>

        <div className="quote-doc-table-wrapper">
          <table className="quote-doc-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th className="text-center">Cant.</th>
                <th className="text-end">Precio unitario</th>
                <th className="text-end">Importe</th>
              </tr>
            </thead>

            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="quote-doc-description">
                      <strong>
                        {item.description || "Concepto sin nombre"}
                      </strong>

                      {item.details && (
                        <small>{item.details}</small>
                      )}
                    </td>

                    <td className="text-center">
                      {item.quantity ?? 0} {item.unit || ""}
                    </td>

                    <td className="text-end">
                      {formatMoney(item.unitPrice)}
                    </td>

                    <td className="text-end quote-doc-item-total">
                      {formatMoney(item.total)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="quote-doc-empty">
                    No hay conceptos agregados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="quote-doc-item-count">
          <span>
            {items.length} {items.length === 1 ? "concepto incluido" : "conceptos incluidos"}
          </span>
        </div>
      </section>

      {/* FINANCIAL SUMMARY */}
      <section className="quote-doc-financial">
        <QuoteSummary financial={financial} />
      </section>

      {/* NOTES AND TERMS */}
      {(quote.notes || quote.terms) && (
        <section className="quote-doc-extra">
          {quote.notes && (
            <div className="quote-doc-extra-block">
              <div className="quote-doc-extra-title">
                <i className="bi bi-chat-left-text" />
                <strong>Observaciones</strong>
              </div>
              <p>{quote.notes}</p>
            </div>
          )}

          {quote.terms && (
            <div className="quote-doc-extra-block">
              <div className="quote-doc-extra-title">
                <i className="bi bi-file-earmark-check" />
                <strong>Condiciones comerciales</strong>
              </div>
              <p>{quote.terms}</p>
            </div>
          )}
        </section>
      )}

      {/* SIGNATURES */}
      <footer className="quote-doc-footer">
        <div className="quote-doc-signatures">
          <div className="quote-doc-signature">
            <span>Firma del cliente</span>
            <small>Nombre y firma</small>
          </div>

          <div className="quote-doc-signature">
            <span>Fecha de aceptación</span>
            <small>DD / MM / AAAA</small>
          </div>
        </div>

        <div className="quote-doc-footer-note">
          <i className="bi bi-shield-check" />
          Documento generado profesionalmente.
        </div>
      </footer>

    </article>
  );
}
