import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import GlassProjectForm from "../components/glass/GlassProjectForm";
import GlassPiecesForm from "../components/glass/GlassPiecesForm";
import GlassPiecesTable from "../components/glass/GlassPiecesTable";
import GlassSvgViewer from "../components/glass/GlassSvgViewer";
import GlassSummary from "../components/glass/GlassSummary";
import GeneratePDF from "../components/glass/GeneratePDF";
import { optimizarCorte } from "../utils/glassPacking";
import {
  guardarProyecto,
  actualizarProyecto,
  eliminarProyecto,
  obtenerProyectos,
} from "../services/glassOptimizer";

const PROYECTO_VACIO = {
  id: null,
  cliente: "",
  proyecto: "",
  tipoVidrio: "Claro",
  espesor: "",
  color: "",
  unidad: "mm",
  anchoPlancha: "",
  altoPlancha: "",
  observaciones: "",
};

function generarIdPieza() {
  return `pieza_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

export default function GlassOptimizer() {
  const [proyecto, setProyecto] = useState(PROYECTO_VACIO);
  const [piezas, setPiezas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [proyectosGuardados, setProyectosGuardados] = useState([]);
  const [mensajeGuardado, setMensajeGuardado] = useState("");

  useEffect(() => {
    setProyectosGuardados(obtenerProyectos());
  }, []);

  const handleAgregarPieza = (pieza) => {
    setPiezas([...piezas, { ...pieza, id: generarIdPieza() }]);
    setResultado(null);
  };

  const handleEditarPieza = (id, cambios) => {
    setPiezas(piezas.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
    setResultado(null);
  };

  const handleEliminarPieza = (id) => {
    setPiezas(piezas.filter((p) => p.id !== id));
    setResultado(null);
  };

  const validarAntesDeOptimizar = () => {
    const anchoP = Number(proyecto.anchoPlancha);
    const altoP = Number(proyecto.altoPlancha);

    if (!proyecto.anchoPlancha || !proyecto.altoPlancha || anchoP <= 0 || altoP <= 0) {
      return "Define un ancho y alto de plancha válidos antes de optimizar.";
    }
    if (piezas.length === 0) {
      return "Agrega al menos una pieza antes de optimizar.";
    }

    const piezaInvalida = piezas.find((p) => {
      const cabeNormal = p.ancho <= anchoP && p.alto <= altoP;
      const cabeRotada = p.ancho <= altoP && p.alto <= anchoP;
      return !cabeNormal && !cabeRotada;
    });
    if (piezaInvalida) {
      return `La pieza ${piezaInvalida.ancho} x ${piezaInvalida.alto} es más grande que la plancha.`;
    }

    return "";
  };

  const handleOptimizar = () => {
    const mensaje = validarAntesDeOptimizar();
    if (mensaje) {
      setError(mensaje);
      setResultado(null);
      return;
    }
    setError("");

    const resultadoCalculado = optimizarCorte(
      {
        anchoPlancha: proyecto.anchoPlancha,
        altoPlancha: proyecto.altoPlancha,
      },
      piezas
    );

    setResultado(resultadoCalculado);
  };

  const handleGuardarProyecto = () => {
    const datos = { ...proyecto, piezas, resultado };

    let guardado;
    if (proyecto.id) {
      guardado = actualizarProyecto(proyecto.id, datos);
    } else {
      guardado = guardarProyecto(datos);
      setProyecto({ ...proyecto, id: guardado.id });
    }

    setProyectosGuardados(obtenerProyectos());
    setMensajeGuardado("Proyecto guardado correctamente.");
    setTimeout(() => setMensajeGuardado(""), 2500);
  };

  const handleCargarProyecto = (id) => {
    const encontrado = proyectosGuardados.find((p) => p.id === id);
    if (!encontrado) return;

    setProyecto({
      id: encontrado.id,
      cliente: encontrado.cliente || "",
      proyecto: encontrado.proyecto || "",
      tipoVidrio: encontrado.tipoVidrio || "Claro",
      espesor: encontrado.espesor || "",
      color: encontrado.color || "",
      unidad: encontrado.unidad || "mm",
      anchoPlancha: encontrado.anchoPlancha || "",
      altoPlancha: encontrado.altoPlancha || "",
      observaciones: encontrado.observaciones || "",
    });
    setPiezas(encontrado.piezas || []);
    setResultado(encontrado.resultado || null);
    setError("");
  };

  const handleEliminarProyectoGuardado = (id) => {
    eliminarProyecto(id);
    setProyectosGuardados(obtenerProyectos());
    if (proyecto.id === id) {
      handleNuevoProyecto();
    }
  };

  const handleNuevoProyecto = () => {
    setProyecto(PROYECTO_VACIO);
    setPiezas([]);
    setResultado(null);
    setError("");
  };

  return (
    <Layout>
      <div className="page-content">
        <h1 className="page-title">
          <i className="bi bi-square-half me-2"></i>
          Optimización de Corte de Vidrio
        </h1>

        <div className="admin-header mb-3">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {proyectosGuardados.length > 0 && (
              <select
                className="auth-input"
                style={{ width: "auto" }}
                value={proyecto.id || ""}
                onChange={(e) => handleCargarProyecto(e.target.value)}
              >
                <option value="">Cargar proyecto guardado...</option>
                {proyectosGuardados.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.cliente || "Sin cliente"} — {p.proyecto || "Sin nombre"}
                  </option>
                ))}
              </select>
            )}

            {proyecto.id && (
              <button
                className="btn-danger-sm"
                onClick={() => handleEliminarProyectoGuardado(proyecto.id)}
              >
                <i className="bi bi-trash me-1"></i>
                Eliminar
              </button>
            )}

            <button className="btn-secondary-sm" onClick={handleNuevoProyecto}>
              <i className="bi bi-file-earmark-plus me-1"></i>
              Nuevo
            </button>

            <button className="btn-primary-sm" onClick={handleGuardarProyecto}>
              <i className="bi bi-save me-1"></i>
              Guardar
            </button>

            <GeneratePDF proyecto={proyecto} piezas={piezas} resultado={resultado} />
          </div>
        </div>

        {mensajeGuardado && (
          <div
            className="empty-state"
            style={{
              color: "var(--success, #10b981)",
              textAlign: "left",
              padding: "10px 14px",
            }}
          >
            <i className="bi bi-check-circle me-2"></i>
            {mensajeGuardado}
          </div>
        )}

        <GlassProjectForm proyecto={proyecto} onChange={setProyecto} />

        <GlassPiecesForm
          anchoPlancha={proyecto.anchoPlancha}
          altoPlancha={proyecto.altoPlancha}
          onAdd={handleAgregarPieza}
        />

        <GlassPiecesTable
          piezas={piezas}
          onEdit={handleEditarPieza}
          onDelete={handleEliminarPieza}
        />

        {error && (
          <div
            className="empty-state"
            style={{
              color: "var(--danger, #ef4444)",
              textAlign: "left",
              padding: "10px 14px",
            }}
          >
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <div className="form-actions mb-3">
          <button
            className="btn-primary-sm"
            onClick={handleOptimizar}
            disabled={piezas.length === 0}
            style={{ padding: "10px 22px", fontSize: "15px" }}
          >
            <i className="bi bi-magic me-2"></i>
            Optimizar Corte
          </button>
        </div>

        {resultado && resultado.piezasNoUbicadas.length > 0 && (
          <div
            className="empty-state"
            style={{
              color: "var(--warning, #f59e0b)",
              textAlign: "left",
              padding: "10px 14px",
            }}
          >
            <i className="bi bi-exclamation-triangle me-2"></i>
            {resultado.piezasNoUbicadas.length} pieza(s) no pudieron ubicarse
            en ninguna plancha.
          </div>
        )}

        <GlassSummary resultado={resultado} />

        <GlassSvgViewer sheets={resultado ? resultado.sheets : null} />
      </div>
    </Layout>
  );
}