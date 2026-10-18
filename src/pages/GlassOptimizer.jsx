import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";

import GlassProjectForm from "../components/glass/GlassProjectForm";
import GlassPiecesForm from "../components/glass/GlassPiecesForm";
import GlassPiecesTable from "../components/glass/GlassPiecesTable";
import GlassSvgViewer from "../components/glass/GlassSvgViewer";
import GlassSummary from "../components/glass/GlassSummary";
import GeneratePDF from "../components/glass/GeneratePDF";

import { optimizarCorte } from "../utils/glass/glassPacking";

import {
  guardarProyecto,
  actualizarProyecto,
  eliminarProyecto,
  obtenerProyectos,
} from "../services/glassOptimizer";

import { saveDesglose } from "../services/historialService";

const PROYECTO_VACIO = {
  id: null,
  cliente: "",
  proyecto: "",
  tipoVidrio: "Vidrio Monolítico",
  espesor: "",
  color: "",
  unidad: "in",
  anchoPlancha: "",
  altoPlancha: "",
  observaciones: "",
};

function generarIdPieza() {
  return `pieza_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function CroquisVidriosPage() {
  const [proyecto, setProyecto] = useState(PROYECTO_VACIO);
  const [piezas, setPiezas] = useState([]);
  const [resultado, setResultado] = useState(null);

  const [error, setError] = useState("");
  const [mensajeGuardado, setMensajeGuardado] = useState("");

  const [proyectosGuardados, setProyectosGuardados] = useState([]);

  useEffect(() => {
    setProyectosGuardados(obtenerProyectos());
  }, []);

  const handleAgregarPieza = (pieza) => {
    setPiezas((prev) => [
      ...prev,
      {
        ...pieza,
        id: generarIdPieza(),
      },
    ]);

    setResultado(null);
    setError("");
  };

  const handleEditarPieza = (id, cambios) => {
    setPiezas((prev) =>
      prev.map((pieza) =>
        pieza.id === id
          ? {
              ...pieza,
              ...cambios,
            }
          : pieza,
      ),
    );

    setResultado(null);
  };

  const handleEliminarPieza = (id) => {
    setPiezas((prev) => prev.filter((pieza) => pieza.id !== id));
    setResultado(null);
  };

  const validarAntesDeOptimizar = () => {
    const anchoPlancha = Number(proyecto.anchoPlancha);
    const altoPlancha = Number(proyecto.altoPlancha);

    if (
      !proyecto.anchoPlancha ||
      !proyecto.altoPlancha ||
      anchoPlancha <= 0 ||
      altoPlancha <= 0
    ) {
      return "Define un ancho y alto de plancha válidos antes de optimizar.";
    }

    if (piezas.length === 0) {
      return "Agrega al menos una pieza antes de optimizar.";
    }

    const piezaInvalida = piezas.find((pieza) => {
      const ancho = Number(pieza.ancho);
      const alto = Number(pieza.alto);

      const cabeNormal = ancho <= anchoPlancha && alto <= altoPlancha;

      const cabeRotada = ancho <= altoPlancha && alto <= anchoPlancha;

      return !cabeNormal && !cabeRotada;
    });

    if (piezaInvalida) {
      return `La pieza ${piezaInvalida.ancho} × ${piezaInvalida.alto} es más grande que la plancha.`;
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
      piezas,
    );

    setResultado(resultadoCalculado);
  };

  const handleGuardarProyecto = () => {
    if (piezas.length === 0) {
      setError("Agrega al menos una pieza antes de guardar el proyecto.");
      return;
    }

    const datos = {
      ...proyecto,
      piezas,
      resultado,
    };

    let guardado;

    if (proyecto.id) {
      guardado = actualizarProyecto(proyecto.id, datos);
    } else {
      guardado = guardarProyecto(datos);

      if (guardado) {
        setProyecto((prev) => ({
          ...prev,
          id: guardado.id,
        }));
      }
    }

    setProyectosGuardados(obtenerProyectos());

    /*
     * Historial general de Desglose Pro
     *
     * El proyecto sigue existiendo en:
     * desglosepro_glass_projects
     *
     * Y además queda registrado en:
     * dp_historial_desgloses
     */
    saveDesglose({
      tipo: "croquis-vidrios",

      proyecto: {
        cliente: proyecto.cliente || "Sin cliente",
        obra: proyecto.proyecto || "Sin nombre",
        color: proyecto.color || "",
      },

      sistema: "Croquis de vidrios",

      configuracion: {
        tipoVidrio: proyecto.tipoVidrio,
        espesor: proyecto.espesor,
        unidad: proyecto.unidad,
        anchoPlancha: proyecto.anchoPlancha,
        altoPlancha: proyecto.altoPlancha,
      },

      piezas,
      result: resultado,
      resultado,

      materiales: [],

      notas: proyecto.observaciones || "Optimización de corte de vidrio.",
    });

    setMensajeGuardado("Proyecto guardado correctamente.");
    setError("");

    setTimeout(() => {
      setMensajeGuardado("");
    }, 2500);
  };

  const handleCargarProyecto = (id) => {
    const encontrado = proyectosGuardados.find(
      (proyectoGuardado) => proyectoGuardado.id === id,
    );

    if (!encontrado) return;

    setProyecto({
      id: encontrado.id,
      cliente: encontrado.cliente || "",
      proyecto: encontrado.proyecto || "",
      tipoVidrio: encontrado.tipoVidrio || "Vidrio Monolítico",
      espesor: encontrado.espesor || "",
      color: encontrado.color || "",
      unidad: encontrado.unidad || "in",
      anchoPlancha: encontrado.anchoPlancha || "",
      altoPlancha: encontrado.altoPlancha || "",
      observaciones: encontrado.observaciones || "",
    });

    setPiezas(encontrado.piezas || []);
    setResultado(encontrado.resultado || null);

    setError("");
    setMensajeGuardado("");
  };

  const handleEliminarProyectoGuardado = (id) => {
    eliminarProyecto(id);

    setProyectosGuardados(obtenerProyectos());

    if (proyecto.id === id) {
      handleNuevoProyecto();
    }
  };

  const handleNuevoProyecto = () => {
    setProyecto({
      ...PROYECTO_VACIO,
    });

    setPiezas([]);
    setResultado(null);
    setError("");
    setMensajeGuardado("");
  };

   return (
    <Layout>
      <div className="page-content barras-page">
        <div className="barras-header no-print">
          <div className="barras-header-main">
            <div>
              <h1 className="page-title">Croquis de vidrios</h1>

              <p className="barras-subtitle">
                Optimiza el corte de vidrios y reduce el desperdicio.
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

        {mensajeGuardado && (
          <div className="alert-info no-print">
            <i className="bi bi-check-circle me-2" />
            {mensajeGuardado}
          </div>
        )}

        {resultado && resultado.piezasNoUbicadas?.length > 0 && (
          <div className="auth-error no-print">
            <i className="bi bi-exclamation-triangle me-2" />
            {resultado.piezasNoUbicadas.length} pieza(s) no pudieron ubicarse
            en ninguna plancha.
          </div>
        )}

        <div className="barras-section no-print">
          <GlassProjectForm proyecto={proyecto} onChange={setProyecto} />
        </div>

        <div className="barras-section no-print">
          <GlassPiecesForm
            anchoPlancha={proyecto.anchoPlancha}
            altoPlancha={proyecto.altoPlancha}
            onAdd={handleAgregarPieza}
          />
        </div>

        <div className="barras-table-wrapper">
          <GlassPiecesTable
            piezas={piezas}
            onEdit={handleEditarPieza}
            onDelete={handleEliminarPieza}
          />
        </div>

        <div className="barras-actions no-print">
          <button
            type="button"
            className="barras-optimize-btn"
            onClick={handleOptimizar}
            disabled={piezas.length === 0}
          >
            <i className="bi bi-magic me-2" />
            Optimizar Corte
          </button>

          <button
            type="button"
            className="btn-secondary-sm"
            onClick={handleNuevoProyecto}
          >
            <i className="bi bi-trash me-2" />
            Limpiar
          </button>

          <button
            type="button"
            className="btn-primary-sm barras-action-save"
            onClick={handleGuardarProyecto}
          >
            <i className="bi bi-floppy2 me-2" />
            Guardar
          </button>

          <GeneratePDF
            proyecto={proyecto}
            piezas={piezas}
            resultado={resultado}
          />
        </div>

        {resultado && (
          <div className="barras-results">
            <GlassSvgViewer sheets={resultado.sheets} />
          </div>
        )}
      </div>
    </Layout>
  );
}