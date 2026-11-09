import { formatMoney } from "../../utils/cotizaciones/quoteFormatters";

export default function QuoteSummary({ financial = {} }) {
  const subtotal = Number(financial.subtotal || 0);
  const discount = Number(financial.discountAmount || 0);
  const tax = Number(financial.taxAmount || 0);
  const total = Number(financial.total || 0);

  return (
    <section className="quote-summary">
      <div className="quote-summary-row">
        <span>Subtotal</span>
        <strong>{formatMoney(subtotal)}</strong>
      </div>

      {discount > 0 && (
        <div className="quote-summary-row quote-summary-discount">
          <span>Descuento</span>
          <strong>− {formatMoney(discount)}</strong>
        </div>
      )}

      {financial.taxEnabled && (
        <div className="quote-summary-row">
          <span>ITBIS ({financial.taxRate || 0}%)</span>
          <strong>{formatMoney(tax)}</strong>
        </div>
      )}

      <div className="quote-summary-total">
        <span>Total</span>
        <strong>{formatMoney(total)}</strong>
      </div>
    </section>
  );
}