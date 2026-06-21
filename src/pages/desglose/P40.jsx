import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import FractionUtils from '../../utils/fraction'

// P-40 Proyectada — 1 oswa 2 hojas
const calcular = (ancho, alto, hojas) => {
  if (hojas === 1) {
    return {
      cabVen: ancho - 2,
      latVen: alto - 2,
      marco: ancho - (1/8),
      latMarco: alto - (1/8),
      vidrioAncho: ancho - (6 + 3/8),
      vidrioAlto: alto - (6 + 1/4),
      divisor: null
    }
  } else {
    // 2 hojas
    const divisor = (ancho - 10.875) // 22.9375 pou egzamp lan
    return {
      cabVen: (ancho - 2.875) / 2,
      latVen: alto - 2,
      marco: ancho - (1/8),
      latMarco: alto - (1/8),
      vidrioAncho: divisor / 2,
      vidrioAlto: alto - 6,
      divisor: divisor
    }
  }
}

const buildPrintHtml = (projectInfo, results) => {
  const date = new Date().toLocaleDateString('es-DO')
  const rows = results.map(row => `
    <tr>
      <td>${row.hueco}</td><td>${row.ancho}</td><td>${row.alto}</td><td>${row.hojas}</td>
      <td>${row.cabVen}</td><td>${row.latVen}</td>
      <td>${row.marco}</td><td>${row.latMarco}</td>
      <td>${row.vidrioAncho}</td><td>${row.vidrioAlto}</td>
      <td>${row.divisor || '—'}</td>
    </tr>`).join('')
  return `<!DOCTYPE html><html><head><title>VENTANA PROYECTADA P-40</title>
  <style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:.5in;background:white}
  h1{font-size:18px;text-align:center;color:#1e2b3c;margin-bottom:4px}
  h2{font-size:11px;text-align:center;color:#555;font-weight:400;margin-bottom:12px}
  .info{display:flex;gap:2rem;font-size:11px;margin-bottom:12px;background:#f8f9fa;padding:8px;border-radius:4px}
  table{width:100%;border-collapse:collapse;font-size:10px}
  th{background:#1e2b3c;color:white;padding:5px;border:1px solid #2c3e50;text-align:center}
  th[colspan]{background:#2c3e50}
  td{padding:4px 5px;border:1px solid #cbd5e1;text-align:center;font-family:monospace}
  tr:nth-child(even) td{background:#f8f9fa}
  .footer{margin-top:12px;font-size:9px;color:#888;display:flex;justify-content:space-between;border-top:1px solid #ddd;padding-top:6px}
  @media print{th{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head>
  <body><h1>VENTANA PROYECTADA P-40</h1><h2>SISTEMA PROFESIONAL DE CÁLCULO</h2>
  <div class="info">
    <span><strong>CUENTA:</strong> ${projectInfo.cuenta || '—'}</span>
    <span><strong>OBRA:</strong> ${projectInfo.obra || '—'}</span>
    <span><strong>COLOR:</strong> ${projectInfo.color || '—'}</span>
  </div>
  <table><thead>
    <tr>
      <th rowspan="2">Hueco</th><th rowspan="2">Ancho</th><th rowspan="2">Alto</th><th rowspan="2">Hojas</th>
      <th colspan="2">Hoja</th><th colspan="2">Marco</th><th colspan="2">Vidrio</th><th rowspan="2">Divisor</th>
    </tr>
    <tr><th>Cab-ven</th><th>Lat-ven</th><th>Cab-marco</th><th>Lat-marco</th><th>Ancho</th><th>Alto</th>
  </thead><tbody>${rows}</tbody></table>
  <div class="footer"><span>© 2026 - Christopher</span><span>${date}</span></div>
  </body></html>`
}

export default function P40() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ hueco: 1, ancho: '', alto: '', hojas: 1 })
  const [results, setResults] = useState([])
  const [projectInfo, setProjectInfo] = useState({ cuenta: '', obra: '', color: '' })
  const [error, setError] = useState('')

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleInfoChange = (e) => setProjectInfo({ ...projectInfo, [e.target.name]: e.target.value })

  const handleAdd = () => {
    setError('')
    if (!form.ancho || !form.alto) { setError('❌ Ingresa ANCHO y ALTO'); return }
    const anchoDec = FractionUtils.parseFraction(form.ancho)
    const altoDec = FractionUtils.parseFraction(form.alto)
    if (anchoDec <= 0 || altoDec <= 0) { setError('❌ Las medidas deben ser mayores a 0'); return }
    const hojas = parseInt(form.hojas, 10)
    const calc = calcular(anchoDec, altoDec, hojas)
    setResults([...results, {
      hueco: form.hueco,
      ancho: form.ancho,
      alto: form.alto,
      hojas: hojas === 1 ? '1 Hoja' : '2 Hojas',
      cabVen: FractionUtils.toSixteenths(calc.cabVen),
      latVen: FractionUtils.toSixteenths(calc.latVen),
      marco: FractionUtils.toSixteenths(calc.marco),
      latMarco: FractionUtils.toSixteenths(calc.latMarco),
      vidrioAncho: FractionUtils.toSixteenths(calc.vidrioAncho),
      vidrioAlto: FractionUtils.toSixteenths(calc.vidrioAlto),
      divisor: calc.divisor ? FractionUtils.toSixteenths(calc.divisor) : null
    }])
    setForm({ hueco: parseInt(form.hueco) + 1, ancho: '', alto: '', hojas: form.hojas })
  }

  const handleReset = () => {
    setResults([]); setError('')
    setForm({ hueco: 1, ancho: '', alto: '', hojas: 1 })
    setProjectInfo({ cuenta: '', obra: '', color: '' })
  }

  const handlePrint = () => {
    if (results.length === 0) { alert('No hay datos para imprimir'); return }
    const w = window.open('', '_blank')
    w.document.write(buildPrintHtml(projectInfo, results))
    w.document.close()
    setTimeout(() => w.print(), 500)
  }

  return (
    <Layout>
      <div className="page-content">
        <div className="desglose-header">
          <button className="btn-back" onClick={() => navigate('/desglose')}>← Volver</button>
          <h1 className="page-title">Ventana P-40 Proyectada</h1>
          <div className="desglose-header-actions">
            {results.length > 0 && <button className="btn-primary-sm" onClick={handlePrint}>🖨️ Imprimir</button>}
          </div>
        </div>

        <div className="card-modern mb-4">
          <h3 className="info-card-title">📋 Información del proyecto</h3>
          <div className="form-grid-3">
            {[['cuenta', 'Cuenta'], ['obra', 'Obra'], ['color', 'Color']].map(([name, label]) => (
              <div className="auth-field" key={name}>
                <label className="auth-label">{label}</label>
                <input type="text" name={name} value={projectInfo[name]} onChange={handleInfoChange} className="auth-input" />
              </div>
            ))}
          </div>
        </div>

        <div className="card-modern mb-4">
          <div className="form-grid-4">
            <div className="auth-field">
              <label className="auth-label">Hueco #</label>
              <input type="number" name="hueco" value={form.hueco} onChange={handleFormChange} className="auth-input" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Ancho</label>
              <input type="text" name="ancho" value={form.ancho} onChange={handleFormChange} placeholder='ej: 38 10/16"' className="auth-input" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Alto</label>
              <input type="text" name="alto" value={form.alto} onChange={handleFormChange} placeholder='ej: 27 15/16"' className="auth-input" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Hojas</label>
              <select name="hojas" value={form.hojas} onChange={handleFormChange} className="auth-input">
                <option value={1}>1 Hoja</option>
                <option value={2}>2 Hojas</option>
              </select>
            </div>
          </div>
          {error && <div className="auth-error" style={{ marginTop: '0.5rem' }}>{error}</div>}
          <div className="form-actions">
            <button className="auth-btn" onClick={handleAdd}>➕ Agregar</button>
            {results.length > 0 && <button className="btn-outline-lg" onClick={handleReset}>↺ Reset</button>}
          </div>
        </div>

        {results.length > 0 ? (
          <div className="table-container">
            <div className="table-title">VENTANA PROYECTADA P-40</div>
            <div className="table-responsive">
              <table className="table-professional" style={{ minWidth: '950px' }}>
                <thead>
                  <tr>
                    <th rowSpan="2">Hueco</th><th rowSpan="2">Ancho</th><th rowSpan="2">Alto</th><th rowSpan="2">Hojas</th>
                    <th colSpan="2">Hoja</th><th colSpan="2">Marco</th><th colSpan="2">Vidrio</th><th rowSpan="2">Divisor</th>
                  </tr>
                  <tr>
                    <th>Cab-ven</th><th>Lat-ven</th><th>Cab-marco</th><th>Lat-marco</th><th>Ancho</th><th>Alto</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.hueco}</td><td>{row.ancho}</td><td>{row.alto}</td><td>{row.hojas}</td>
                      <td>{row.cabVen}</td><td>{row.latVen}</td>
                      <td>{row.marco}</td><td>{row.latMarco}</td>
                      <td>{row.vidrioAncho}</td><td>{row.vidrioAlto}</td>
                      <td>{row.divisor || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card-modern text-center" style={{ padding: '2rem', color: 'var(--gray-500)' }}>
            Ingresa las medidas y haz clic en "Agregar"
          </div>
        )}
      </div>
    </Layout>
  )
}