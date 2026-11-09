export default function QuoteFilters({
  search = "",
  onSearch,
  status = "all",
  onStatus,
  sort = "date",
  onSort,
}) {
  return (
    <div className="quote-filters">
      <div className="quote-filter-search">

        <input
          type="search"
          className="form-control"
          value={search}
          onChange={(event) => onSearch?.(event.target.value)}
          placeholder="Buscar por número, cliente o proyecto..."
          aria-label="Buscar cotizaciones"
          
        />
      </div>

      <select
        className="form-select"
        value={status}
        onChange={(event) => onStatus?.(event.target.value)}
        aria-label="Filtrar por estado"
      >
        <option value="all">Todos los estados</option>
        <option value="draft">Borrador</option>
        <option value="sent">Enviada</option>
        <option value="approved">Aprobada</option>
        <option value="rejected">Rechazada</option>
        <option value="expired">Vencida</option>
      </select>

      <select
        className="form-select"
        value={sort}
        onChange={(event) => onSort?.(event.target.value)}
        aria-label="Ordenar cotizaciones"
      >
        <option value="date">Más recientes</option>
        <option value="amount">Mayor importe</option>
        <option value="oldest">Más antiguas</option>
      </select>
    </div>
  );
}