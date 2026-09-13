import React, { useEffect, useState } from "react";

import BarraControls from "../components/barras/BarraControls";
import BarraForm from "../components/barras/BarraForm";
import BarraTable from "../components/barras/BarraTable";
import BarraVisualizer from "../components/barras/BarraVisualizer";
import OptimizationSummary from "../components/barras/OptimizationSummary";

import { optimizeBars } from "../utils/barras/barraOptimizer";
import { exportBarsToPdf } from "../utils/barras/barraPdf";
import Layout from "../components/Layout";

import "../styles/barras.css";

const STORAGE_KEY = "desglose-pro-croquis-barras";

const DEFAULT_BAR_LENGTH = 252;
const DEFAULT_SAW = 1 / 16;
const DEFAULT_UNIT = "in";

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export default function CroquisBarrasPage() {
  const [barLength, setBarLength] = useState(
    DEFAULT_BAR_LENGTH
  );

  const [saw, setSaw] = useState(DEFAULT_SAW);

  const [unit, setUnit] = useState(DEFAULT_UNIT);

  const [cuts, setCuts] = useState([]);

  const [result, setResult] = useState(null);

  const [editingCut, setEditingCut] =
    useState(null);

  const [error, setError] = useState("");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        STORAGE_KEY
      );

      if (!stored) {
        return;
      }

      const data = JSON.parse(stored);

      if (data.barLength) {
        setBarLength(data.barLength);
      }

      if (typeof data.saw === "number") {
        setSaw(data.saw);
      }

      if (data.unit) {
        setUnit(data.unit);
      }

      if (Array.isArray(data.cuts)) {
        setCuts(data.cuts);
      }

      if (data.result) {
        setResult(data.result);
      }
    } catch (storageError) {
      console.error(
        "No se pudo cargar Croquis de barras:",
        storageError
      );
    }
  }, []);

  const handleAddCut = (cut) => {
    setError("");
    setSaved(false);

    if (editingCut) {
      setCuts((currentCuts) =>
        currentCuts.map((item) =>
          item.id === editingCut.id
            ? {
                ...cut,
                id: editingCut.id,
              }
            : item
        )
      );

      setEditingCut(null);
    } else {
      setCuts((currentCuts) => [
        ...currentCuts,
        {
          ...cut,
          id: createId(),
        },
      ]);
    }

    setResult(null);
  };

  const handleRemoveCut = (id) => {
    setCuts((currentCuts) =>
      currentCuts.filter((cut) => cut.id !== id)
    );

    setResult(null);
    setSaved(false);
  };

  const handleEditCut = (cut) => {
    setEditingCut(cut);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleOptimize = () => {
    setError("");
    setSaved(false);

    try {
      const optimized = optimizeBars({
        cuts,
        barLength,
        saw,
      });

      setResult(optimized);
    } catch (optimizationError) {
      setError(
        optimizationError.message ||
          "No fue posible optimizar los cortes."
      );
    }
  };

  const handleSave = () => {
    if (!result) {
      setError(
        "Primero debes optimizar los cortes."
      );
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          barLength,
          saw,
          unit,
          cuts,
          result,
          savedAt: new Date().toISOString(),
        })
      );

      setSaved(true);
      setError("");
    } catch (storageError) {
      console.error(storageError);

      setError(
        "No fue posible guardar la optimización."
      );
    }
  };

  const handleClear = () => {
  setCuts([]);
  setResult(null);
  setEditingCut(null);
  setError("");
  setSaved(false);

  localStorage.removeItem(STORAGE_KEY);
};

  return (
    <Layout>
    <div className="page-content barras-page">
      <div className="barras-header no-print">
        <div className="barras-header-main">
          <div className="barras-title-icon">
            <i className="bi bi-scissors" />
          </div>

          <div>
            <h1 className="page-title">
              Croquis de barras
            </h1>

            <p className="barras-subtitle">
              Optimiza el corte de perfiles y reduce
              el desperdicio de material.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary-sm"
          onClick={handleClear}
          disabled={!cuts.length}
        >
          <i className="bi bi-arrow-counterclockwise me-1" />
          Reiniciar
        </button>
      </div>

      {error && (
        <div className="auth-error no-print">
          <i className="bi bi-exclamation-circle me-2" />
          {error}
        </div>
      )}

      {saved && (
        <div className="alert-info no-print">
          <i className="bi bi-check-circle me-2" />
          Optimización guardada correctamente.
        </div>
      )}

      <div className="barras-section no-print">
        <BarraControls
          barLength={barLength}
          setBarLength={setBarLength}
          saw={saw}
          setSaw={setSaw}
          unit={unit}
          setUnit={setUnit}
        />
      </div>

      <div className="barras-section no-print">
        <div className="barras-panel">
          <div className="barras-panel-header">
            <div>
              <div className="barras-panel-title">
                <i className="bi bi-scissors me-2" />
                CORTES DE PERFIL
              </div>

              <div className="barras-panel-subtitle">
                Agrega cada pieza que debe ser cortada.
              </div>
            </div>

            <div className="barras-cut-counter">
              {cuts.length} referencia
              {cuts.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="barras-panel-body">
            <BarraForm
              unit={unit}
              onAdd={handleAddCut}
              onCancel={() => setEditingCut(null)}
              editingCut={editingCut}
            />

            <div className="barras-table-wrapper">
              <BarraTable
                cuts={cuts}
                unit={unit}
                onRemove={handleRemoveCut}
                onEdit={handleEditCut}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="barras-optimize-area no-print">
        <button
          type="button"
          className="barras-optimize-btn"
          onClick={handleOptimize}
          disabled={!cuts.length}
        >
          <i className="bi bi-magic me-2" />
          Optimizar Corte
        </button>

        <p>
          El cálculo considera una pérdida de sierra de{" "}
          <strong>1/16"</strong> por corte.
        </p>
      </div>

      {result && (
        <div className="barras-results">
          <div className="barras-results-header no-print">
            <div>
              <h2>
                Resultado de optimización
              </h2>

              <p>
                Distribución calculada para minimizar
                el desperdicio.
              </p>
            </div>

            <span className="barras-result-status">
              <i className="bi bi-check-circle-fill me-1" />
              Optimizado
            </span>
          </div>

          <OptimizationSummary
            result={result}
          />

          <BarraVisualizer
            result={result}
          />

          <div className="barras-actions no-print">
            <button
              type="button"
              className="btn-primary-sm barras-action-save"
              onClick={handleSave}
            >
              <i className="bi bi-floppy2 me-2" />
              Guardar
            </button>

            <button
              type="button"
              className="btn-secondary-sm barras-action-pdf"
              onClick={exportBarsToPdf}
            >
              <i className="bi bi-file-earmark-pdf me-2" />
              Exportar PDF
            </button>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}