
import QuoteStatusBadge from "./QuoteStatusBadge";
import QuoteActions from "./QuoteActions";

import {
  formatDate,
  formatMoney,
} from "../../utils/cotizaciones/quoteFormatters";

export default function QuoteTable({
  quotes = [],
  onEdit,
  onDelete,
  onDuplicate,
  onPdf,
}) {
  if (!quotes.length) {
    return (
      <div className="quote-empty">
        <div className="quote-empty-icon">
          <i className="bi bi-receipt" />
        </div>

        <strong>No hay cotizaciones</strong>

        <span>
          Prueba otro filtro o crea una cotización nueva.
        </span>
      </div>
    );
  }

  return (
    <div className="table-responsive quote-table-wrap">
      <table className="table align-middle quote-table">
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th>Proyecto</th>
            <th>Fecha</th>
            <th>Vencimiento</th>
            <th className="text-end">Total</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id}>
              <td>
                <span className="quote-number">
                  {quote.number || "—"}
                </span>
              </td>

              <td>
                <div className="quote-client">
                  <span className="quote-client-name">
                    {quote.client?.name || "Cliente sin nombre"}
                  </span>

                  {quote.client?.phone && (
                    <span className="quote-client-detail">
                      {quote.client.phone}
                    </span>
                  )}
                </div>
              </td>

              <td>
                <span className="quote-project">
                  {quote.title || "Sin título"}
                </span>
              </td>

              <td>
                <span className="quote-date">
                  {formatDate(quote.issueDate)}
                </span>
              </td>

              <td>
                <span className="quote-date">
                  {formatDate(quote.expirationDate)}
                </span>
              </td>

              <td className="text-end">
                <span className="quote-amount">
                  {formatMoney(quote.financial?.total || 0)}
                </span>
              </td>

              <td>
                <QuoteStatusBadge status={quote.status} />
              </td>

              <td className="text-end">
                <div className="quote-row-actions">
                  <QuoteActions
                    quote={quote}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onPdf={onPdf}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
