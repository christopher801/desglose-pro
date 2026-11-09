import { useEffect, useMemo, useRef, useState } from "react";

import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

import QuoteForm from "../../components/cotizaciones/QuoteForm";
import QuoteTable from "../../components/cotizaciones/QuoteTable";
import QuoteFilters from "../../components/cotizaciones/QuoteFilters";
import QuotePreview from "../../components/cotizaciones/QuotePreview";

import {
  getAllQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
  duplicateQuote,
  getQuoteStatistics,
  exportQuotesJSON,
  importQuotesJSON,
} from "../../services/cotizaciones/quoteService";

import { generateQuotePdf } from "../../utils/cotizaciones/quotePdf";

import {
  formatMoney,
  todayISO,
} from "../../utils/cotizaciones/quoteFormatters";

import "../../styles/cotizaciones.css";

export default function CotizacionesPage() {
  const { user } = useAuth();
  const owner = user?.uid || "local";

  const fileInputRef = useRef(null);

  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState({});

  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const [view, setView] = useState("list");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("date");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // REFRESH DATA
  // ==========================================

  const refresh = () => {
    try {
      setQuotes(getAllQuotes(owner));
      setStats(getQuoteStatistics(owner));
      setError("");
    } catch (e) {
      console.error("Error cargando cotizaciones:", e);
      setError(e.message || "Error al cargar las cotizaciones.");
    }
  };

  useEffect(() => {
    refresh();
  }, [owner]);

  // ==========================================
  // FILTER AND SORT
  // ==========================================

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return quotes
      .filter((quote) => {
        const matchesStatus =
          status === "all" ||
          quote.status === status ||
          (status === "expired" &&
            quote.status !== "approved" &&
            quote.status !== "rejected" &&
            quote.expirationDate &&
            quote.expirationDate < todayISO());

        const matchesSearch = [
          quote.number,
          quote.title,
          quote.client?.name,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(normalizedSearch),
        );

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "amount") {
          return (
            Number(b.financial?.total || 0) - Number(a.financial?.total || 0)
          );
        }

        if (sort === "oldest") {
          return String(a.issueDate || "").localeCompare(
            String(b.issueDate || ""),
          );
        }

        return String(b.issueDate || "").localeCompare(
          String(a.issueDate || ""),
        );
      });
  }, [quotes, status, search, sort]);

  // ==========================================
  // OPEN NEW QUOTE
  // ==========================================

  const handleNewQuote = () => {
    setEditing(null);
    setError("");
    setMessage("");
    setView("form");
  };

  // ==========================================
  // EDIT QUOTE
  // ==========================================

  const handleEditQuote = (quote) => {
    setEditing(quote);
    setError("");
    setMessage("");
    setView("form");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCEL FORM
  // ==========================================

  const handleCancelForm = () => {
    setEditing(null);
    setError("");
    setView("list");
  };

  // ==========================================
  // SAVE QUOTE
  // ==========================================

  const handleSaveQuote = (data) => {
    try {
      setError("");

      if (editing) {
        if (
          editing.status === "approved" &&
          !window.confirm(
            "Esta cotización está aprobada. ¿Confirmas que deseas modificarla?",
          )
        ) {
          return;
        }

        updateQuote(editing.id, data, owner);
      } else {
        createQuote(data, owner);
      }

      setEditing(null);
      setView("list");

      setMessage("Cotización guardada correctamente.");

      refresh();
    } catch (e) {
      console.error("Error guardando cotización:", e);
      setError(e.message || "No se pudo guardar la cotización.");
    }
  };

  // ==========================================
  // DELETE QUOTE
  // ==========================================

  const handleDeleteQuote = (quote) => {
    if (
      quote.status === "approved" &&
      !window.confirm(
        "Esta cotización está aprobada. ¿Confirmas que deseas eliminarla?",
      )
    ) {
      return;
    }

    if (
      !window.confirm(
        `¿Eliminar ${quote.number}? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    try {
      deleteQuote(quote.id, owner);

      setMessage("Cotización eliminada correctamente.");
      setError("");

      refresh();
    } catch (e) {
      console.error("Error eliminando cotización:", e);
      setError(e.message || "No se pudo eliminar la cotización.");
    }
  };

  // ==========================================
  // DUPLICATE QUOTE
  // ==========================================

  const handleDuplicateQuote = (quote) => {
    try {
      duplicateQuote(quote.id, owner);

      setMessage("Cotización duplicada correctamente.");
      setError("");

      refresh();
    } catch (e) {
      console.error("Error duplicando cotización:", e);
      setError(e.message || "No se pudo duplicar la cotización.");
    }
  };

  // ==========================================
  // EXPORT JSON BACKUP
  // ==========================================

  const handleBackup = () => {
    try {
      const blob = new Blob([exportQuotesJSON(owner)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "desglose-pro-cotizaciones-backup.json";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setMessage("Backup exportado correctamente.");
      setError("");
    } catch (e) {
      console.error("Error exportando backup:", e);
      setError(e.message || "No se pudo exportar el backup.");
    }
  };

  // ==========================================
  // IMPORT JSON BACKUP
  // ==========================================

  const handleRestore = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const json = await file.text();

      if (
        !window.confirm(
          "Se combinarán las cotizaciones válidas. Los registros existentes no se borrarán. ¿Continuar?",
        )
      ) {
        return;
      }

      const result = importQuotesJSON(json, owner);

      setMessage(
        `Importadas: ${result.imported}. Omitidas: ${result.skipped}.`,
      );

      setError("");
      refresh();
    } catch (e) {
      console.error("Error importando backup:", e);
      setError(e.message || "No se pudo importar el archivo.");
    } finally {
      event.target.value = "";
    }
  };

  // ==========================================
  // CLOSE PREVIEW
  // ==========================================

  const handleClosePreview = () => {
    setPreview(null);
  };

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <Layout>
      <div className="page-content cotizaciones-page">
        {/* ================================== */}
        {/* FORM VIEW */}
        {/* ================================== */}

        {view === "form" ? (
          <>
            <div className="no-print">
              <QuoteForm
                initialQuote={editing}
                onSave={handleSaveQuote}
                onCancel={handleCancelForm}
              />
            </div>

            {error && (
              <div className="alert alert-danger mt-3 no-print" role="alert">
                <i className="bi bi-exclamation-circle me-2" />
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            {/* ================================== */}
            {/* HEADER */}
            {/* ================================== */}

            <div className="quote-page-header no-print">
              <div className="quote-page-header-main">
                <div className="quote-title-icon">
                  <i className="bi bi-file-earmark-text" />
                </div>

                <div>
                  <h1 className="page-title">Cotizaciones</h1>

                  <p>
                    Prepara propuestas comerciales y da seguimiento a tus
                    clientes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary-sm"
                onClick={handleNewQuote}
              >
                <i className="bi bi-plus-lg me-1" />
                Nueva cotización
              </button>
            </div>

            {/* ================================== */}
            {/* ERROR MESSAGE */}
            {/* ================================== */}

            {error && (
              <div className="alert alert-danger py-2 no-print" role="alert">
                <i className="bi bi-exclamation-circle me-2" />
                {error}

                <button
                  type="button"
                  className="btn-close float-end"
                  aria-label="Cerrar"
                  onClick={() => setError("")}
                />
              </div>
            )}

            {/* ================================== */}
            {/* SUCCESS MESSAGE */}
            {/* ================================== */}

            {message && (
              <div className="alert alert-success py-2 no-print" role="status">
                <i className="bi bi-check-circle me-2" />
                {message}

                <button
                  type="button"
                  className="btn-close float-end"
                  aria-label="Cerrar"
                  onClick={() => setMessage("")}
                />
              </div>
            )}

            {/* ================================== */}
            {/* STATISTICS */}
            {/* ================================== */}

            <section className="quote-stats no-print">
              {[
                ["Total", stats.total],
                ["Borradores", stats.drafts],
                ["Enviadas", stats.sent],
                ["Aprobadas", stats.approved],
                ["Rechazadas", stats.rejected],
                ["Vencidas", stats.expired],
              ].map(([label, value]) => (
                <div className="quote-stat" key={label}>
                  <span>{label}</span>
                  <strong>{value || 0}</strong>
                </div>
              ))}

              <div className="quote-stat">
                <span>Monto cotizado</span>
                <strong>{formatMoney(stats.quotedAmount || 0)}</strong>
              </div>

              <div className="quote-stat ">
                <span>Monto aprobado</span>
                <strong>{formatMoney(stats.approvedAmount || 0)}</strong>
              </div>
            </section>

            {/* ================================== */}
            {/* QUOTE HISTORY */}
            {/* ================================== */}

            <section className="quote-panel">
              <div className="quote-list-heading">
                <h2>Historial de cotizaciones</h2>

                <div className="d-flex gap-2 flex-wrap no-print">
                  <button
                    type="button"
                    className="btn-primary-sm"
                    onClick={handleBackup}
                  >
                    <i className="bi bi-download me-1" />
                    Exportar JSON
                  </button>

                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="bi bi-upload me-1" />
                    Importar JSON
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json,.json"
                    hidden
                    onChange={handleRestore}
                  />
                </div>
              </div>

              {/* FILTERS */}

              <div className="no-print">
                <QuoteFilters
                  search={search}
                  onSearch={setSearch}
                  status={status}
                  onStatus={setStatus}
                  sort={sort}
                  onSort={setSort}
                />
              </div>

              {/* TABLE */}

              <QuoteTable
                quotes={filtered}
                onEdit={handleEditQuote}
                onDelete={handleDeleteQuote}
                onDuplicate={handleDuplicateQuote}
                onPdf={(quote) => setPreview(quote)}
              />
            </section>
          </>
        )}

        {/* ================================== */}
        {/* PDF PREVIEW */}
        {/* ================================== */}

        {preview && (
          <div
            className="quote-preview-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                handleClosePreview();
              }
            }}
          >
            <div className="quote-preview-dialog">
              <div className="quote-preview-actions no-print">
                <div className="quote-preview-action">
                  <button
                    type="button"
                    className="btn-primary-sm"
                    onClick={handleClosePreview}
                  >
                    <i className="bi bi-x-lg me-1" />
                    Cerrar
                  </button>
                </div>

                <div className="quote-preview-action">
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => generateQuotePdf(preview)}
                  >
                    <i className="bi bi-file-earmark-pdf me-1" />
                    Descargar PDF
                  </button>
                </div>
              </div>

              <QuotePreview quote={preview} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
