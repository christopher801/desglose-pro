const statuses = {
  draft: "Borrador",
  sent: "Enviada",
  approved: "Aprobada",
  rejected: "Rechazada",
  expired: "Vencida",
};

export default function QuoteStatusBadge({ status = "draft" }) {
  const normalizedStatus = statuses[status] ? status : "draft";

  return (
    <span className={`quote-status quote-status-${normalizedStatus}`}>
      {statuses[normalizedStatus]}
    </span>
  );
}