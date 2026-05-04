import React from 'react'
import { Table } from 'react-bootstrap'

const TableResults = ({ results, onPrint, onExportPDF, systemName }) => {
  if (results.length === 0) {
    return (
      <div className="card-modern p-5 text-center" style={{ border: '1px solid #a855f7', background: 'white' }}>
        <p className="mb-0" style={{ fontStyle: 'italic', color: '#8b5cf6' }}>
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
      <div className="table-container" style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', border: '1px solid #a855f7' }}>
        <div className="table-title" style={{ color: '#4a0e78', fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '1rem' }}>{systemName}</div>
        <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="table-professional" style={{ minWidth: '950px', width: '100%', borderCollapse: 'collapse', border: '1px solid #a855f7' }}>
            <thead>
              <tr>
                <th rowSpan="2" style={{ background: '#4a0e78', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>hueco</th>
                <th rowSpan="2" style={{ background: '#4a0e78', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>ancho</th>
                <th rowSpan="2" style={{ background: '#4a0e78', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>alto</th>
                <th rowSpan="2" style={{ background: '#4a0e78', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>hojas</th>
                <th colSpan="2" style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>HOJA</th>
                <th colSpan="2" style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>MARCO</th>
                <th colSpan="2" style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>VIDRIO</th>
              </tr>
              <tr>
                <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>Cab-alf</th>
                <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>jambas</th>
                <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>Cab-marco</th>
                <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>Lat-marco</th>
                <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>ancho</th>
                <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>alto</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.hueco}</td>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.ancho}</td>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.alto}</td>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.hojas === 1 ? 'Simple' : row.hojas === 2 ? 'Doble' : row.hojas}</td>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.cabAlf}</td>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.jambas}</td>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.marco}</td>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.latMarco}</td>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.vidrioAncho}</td>
                  <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.vidrioAlto}</td>
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
    <div className="table-container" style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', border: '1px solid #a855f7' }}>
      <div className="table-title" style={{ color: '#4a0e78', fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '1rem' }}>{systemName}</div>
      <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="table-professional" style={{ minWidth: '1100px', width: '100%', borderCollapse: 'collapse', border: '1px solid #a855f7' }}>
          <thead>
            <tr>
              <th rowSpan="2" style={{ background: '#4a0e78', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>hueco</th>
              <th rowSpan="2" style={{ background: '#4a0e78', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>ancho</th>
              <th rowSpan="2" style={{ background: '#4a0e78', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>alto</th>
              <th rowSpan="2" style={{ background: '#4a0e78', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>hojas</th>
              <th colSpan="2" style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>DE LA HOJAS</th>
              <th colSpan="2" style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>DEL MARCO</th>
              <th colSpan="2" style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>VIDRIO</th>
              <th rowSpan="2" style={{ background: '#4a0e78', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>V. MEDIO</th>
            </tr>
            <tr>
              <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>Cab-alf</th>
              <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>jambas</th>
              <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>Cab-riel</th>
              <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>Lat-marco</th>
              <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>ancho</th>
              <th style={{ background: '#5b21b6', color: '#fef3c7', padding: '8px', border: '1px solid #a855f7' }}>alto</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <tr key={idx}>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.hueco}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.ancho}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.alto}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.hojas}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.cabAlf}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.jambas}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.marco}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.latMarco}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.vidrioAncho}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.vidrioAlto}</td>
                <td style={{ padding: '0.25rem', border: '1px solid #a855f7', color: '#4a0e78' }}>{row.vidrioMedio || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TableResults