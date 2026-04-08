import React from 'react'
import { Table } from 'react-bootstrap'

const TableResults = ({ results, onPrint, onExportPDF, systemName }) => {
  if (results.length === 0) {
    return (
      <div className="card-modern p-5 text-center">
        <p className="text-muted mb-0" style={{ fontStyle: 'italic', color: '#94a3b8' }}>
          — Ingrese las medidas y haga clic en 'AGREGAR' —
        </p>
      </div>
    )
  }

  // Determine column count based on first item and system
  const isPuerta = systemName === 'PUERTA COMERCIAL'
  const hasVidrioMedio = results[0]?.vidrioMedio !== undefined && results[0]?.vidrioMedio !== null && !isPuerta

  // For puerta - 10 columns (ajoute hojas)
  if (isPuerta) {
    return (
      <div className="table-container">
        <div className="table-title">{systemName}</div>
        <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="table-professional" style={{ minWidth: '950px' }}>
            <thead>
              <tr>
                <th rowSpan="2">hueco</th>
                <th rowSpan="2">ancho</th>
                <th rowSpan="2">alto</th>
                <th rowSpan="2">hojas</th>
                <th colSpan="2">HOJA</th>
                <th colSpan="2">MARCO</th>
                <th colSpan="2">VIDRIO</th>
              </tr>
              <tr>
                <th>Cab-alf</th>
                <th>jambas</th>
                <th>Cab-marco</th>
                <th>Lat-marco</th>
                <th>ancho</th>
                <th>alto</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '0.25rem' }}>{row.hueco}</td>
                  <td style={{ padding: '0.25rem' }}>{row.ancho}</td>
                  <td style={{ padding: '0.25rem' }}>{row.alto}</td>
                  <td style={{ padding: '0.25rem' }}>{row.hojas === 1 ? 'Simple' : row.hojas === 2 ? 'Doble' : row.hojas}</td>
                  <td style={{ padding: '0.25rem' }}>{row.cabAlf}</td>
                  <td style={{ padding: '0.25rem' }}>{row.jambas}</td>
                  <td style={{ padding: '0.25rem' }}>{row.marco}</td>
                  <td style={{ padding: '0.25rem' }}>{row.latMarco}</td>
                  <td style={{ padding: '0.25rem' }}>{row.vidrioAncho}</td>
                  <td style={{ padding: '0.25rem' }}>{row.vidrioAlto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // For windows (11 columns)
  return (
    <div className="table-container">
      <div className="table-title">{systemName}</div>
      <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="table-professional" style={{ minWidth: '1100px' }}>
          <thead>
            <tr>
              <th rowSpan="2">hueco</th>
              <th rowSpan="2">ancho</th>
              <th rowSpan="2">alto</th>
              <th rowSpan="2">hojas</th>
              <th colSpan="2">DE LA HOJAS</th>
              <th colSpan="2">DEL MARCO</th>
              <th colSpan="2">VIDRIO</th>
              <th rowSpan="2">V. MEDIO</th>
            </tr>
            <tr>
              <th>Cab-alf</th>
              <th>jambas</th>
              <th>Cab-riel</th>
              <th>Lat-marco</th>
              <th>ancho</th>
              <th>alto</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx}>
                <td style={{ padding: '0.25rem' }}>{row.hueco}</td>
                <td style={{ padding: '0.25rem' }}>{row.ancho}</td>
                <td style={{ padding: '0.25rem' }}>{row.alto}</td>
                <td style={{ padding: '0.25rem' }}>{row.hojas}</td>
                <td style={{ padding: '0.25rem' }}>{row.cabAlf}</td>
                <td style={{ padding: '0.25rem' }}>{row.jambas}</td>
                <td style={{ padding: '0.25rem' }}>{row.marco}</td>
                <td style={{ padding: '0.25rem' }}>{row.latMarco}</td>
                <td style={{ padding: '0.25rem' }}>{row.vidrioAncho}</td>
                <td style={{ padding: '0.25rem' }}>{row.vidrioAlto}</td>
                <td style={{ padding: '0.25rem' }}>{row.vidrioMedio || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableResults