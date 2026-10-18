import React, { useEffect, useState } from "react";

import BarraControls from "../components/barras/BarraControls";
import BarraForm from "../components/barras/BarraForm";
import BarraTable from "../components/barras/BarraTable";
import BarraVisualizer from "../components/barras/BarraVisualizer";
import OptimizationSummary from "../components/barras/OptimizationSummary";

import { optimizeBars } from "../utils/barras/barraOptimizer";
import { exportBarsToPdf } from "../utils/barras/barraPdf";
import { saveCroquisToHistorial } from "../services/croquisHistorialService"; // CAMBIO: nouvo
import Layout from "../components/Layout";

import "../styles/barras.css";

const STORAGE_KEY = "desglose-pro-croquis-barras";

const DEFAULT_BAR_LENGTH = 252;
const DEFAULT_SAW = 1 / 16;
const DEFAULT_UNIT = "in";

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CroquisBarrasPage() {
  const [barLength, setBarLength] = useState(DEFAULT_BAR_LENGTH);

  const [saw, setSaw] = useState(DEFAULT_SAW);

  const [unit, setUnit] = useState(DEFAULT_UNIT);

  const [cuts, setCuts] = useState([]);

  const [result, setResult] = useState(null);

  const [editingCut, setEditingCut] = useState(null);

  const [error, setError] = useState("");

  const [saved, setSaved] = useState(false);

  // CAMBIO: id antre a nan istwa. Si w sove 2 fwa menm rezilta a, li mete l ajou
  // olye de kreye doub. Li reset lè w optimize ankò oswa lè w efase tout.
  const [historyId, setHistoryId] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

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

      // CAMBIO: restore id istwa a
      if (data.historyId) {
        setHistoryId(data.historyId);
      }
    } catch (storageError) {
      console.error("No se pudo cargar Croquis de barras:", storageError);
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
            : item,
        ),
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
    setHistoryId(null); // CAMBIO
  };

  const handleRemoveCut = (id) => {
    setCuts((currentCuts) => currentCuts.filter((cut) => cut.id !== id));

    setResult(null);
    setSaved(false);
    setHistoryId(null); // CAMBIO
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
      setHistoryId(null); // CAMBIO: nouvo rezilta = nouvo antre nan istwa
    } catch (optimizationError) {
      setError(
        optimizationError.message || "No fue posible optimizar los cortes.",
      );
    }
  };

  const handleSave = () => {
    if (!result) {
      setError("Primero debes optimizar los cortes.");
      return;
    }

    try {
      // CAMBIO: itilize id ki deja egziste, sinon kreye yon nouvo
      const entryId = historyId || createId();
      const savedAt = new Date().toISOString();

      // Travay kounye a (restore lè w louvri paj la ankò)
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          barLength,
          saw,
          unit,
          cuts,
          result,
          historyId: entryId, // CAMBIO
          savedAt,
        }),
      );

      // CAMBIO: ajoute nan istwa (sa k parèt nan HistorialPage)
      saveCroquisToHistorial({
        id: entryId,
        fecha: savedAt,
        barLength,
        saw,
        unit,
        cuts,
        result,
      });

      setHistoryId(entryId);
      setSaved(true);
      setError("");
    } catch (storageError) {
      console.error(storageError);

      setError("No fue posible guardar la optimización.");
    }
  };

  const handleClear = () => {
    setCuts([]);
    setResult(null);
    setEditingCut(null);
    setError("");
    setSaved(false);
    setHistoryId(null); // CAMBIO

    // Sa efase sèlman travay kounye a, PA istwa a
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <Layout>
      <div className="page-content barras-page">
        <div className="barras-header no-print">
          <div className="barras-header-main">
            

            <div>
              <h1 className="page-title">Croquis de barras</h1>

              <p className="barras-subtitle">
                Optimiza el corte de perfiles y reduce el desperdicio de
                material.
              </p>
            </div>
          </div>
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
            Optimización guardada correctamente. Puedes verla en el Historial.
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
          <BarraForm
            unit={unit}
            onAdd={handleAddCut}
            onCancel={() => setEditingCut(null)}
            editingCut={editingCut}
          />
        </div>

        <div className="barras-table-wrapper">
          <BarraTable
            cuts={cuts}
            unit={unit}
            onRemove={handleRemoveCut}
            onEdit={handleEditCut}
          />
        </div>

        <div className="barras-actions no-print">
          <button
            type="button"
            className="barras-optimize-btn"
            onClick={handleOptimize}
            disabled={!cuts.length}
          >
            <i className="bi bi-magic me-2" />
            Optimizar Corte
          </button>
          <button onClick={handleClear} className="btn-secondary-sm">
            <i className="bi bi-trash me-2" />
            Limpiar
          </button>

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
            onClick={() =>
              exportBarsToPdf({
                result,
                barLength,
                saw,
                unit,
              })
            }
          >
            <i className="bi bi-file-earmark-pdf me-2" />
            Exportar PDF
          </button>
        </div>

        {result && (
          <div className="barras-results">
            <BarraVisualizer result={result} />
          </div>
        )}
      </div>
    </Layout>
  );
}
