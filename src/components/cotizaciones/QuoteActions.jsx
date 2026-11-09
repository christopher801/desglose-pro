export default function QuoteActions({
  quote,
  onEdit,
  onDelete,
  onDuplicate,
  onPdf,
}) {
  return (
    <div className="quote-row-actions">
      <button
        type="button"
        title="Ver / PDF"
        aria-label="Ver cotización o generar PDF"
        onClick={() => onPdf?.(quote)}
      >
        <i className="bi bi-file-earmark-pdf" />
      </button>

      <button
        type="button"
        title="Duplicar"
        aria-label="Duplicar cotización"
        onClick={() => onDuplicate?.(quote)}
      >
        <i className="bi bi-copy" />
      </button>

      <button
        type="button"
        title="Editar"
        aria-label="Editar cotización"
        onClick={() => onEdit?.(quote)}
      >
        <i className="bi bi-pencil" />
      </button>

      <button
        type="button"
        title="Eliminar"
        aria-label="Eliminar cotización"
        onClick={() => onDelete?.(quote)}
      >
        <i className="bi bi-trash" />
      </button>
    </div>
  );
}