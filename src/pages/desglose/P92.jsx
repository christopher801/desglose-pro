import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import FractionUtils from '../../utils/fraction'

const calcular = (ancho, alto, hojas) => {
    if (hojas === 2) {
      return {
        cabAlf: (ancho / 2) - (9/16),
        jambas: alto - (2 + 7/16),
        marco: ancho - (1 + 5/8),
        latMarco: alto - (1/8),
        vidrioAncho: (ancho / 2) - (3 + 13/16),
        vidrioAlto: alto - (6 + 7/16),
        vidrioMedio: null
      }
    } else if (hojas === 3) {
      return {
        cabAlf: (ancho / 3) + (3/8),
        jambas: alto - (2 + 7/16),
        marco: ancho - (1 + 5/8),
        latMarco: alto - (1/8),
        vidrioAncho: (ancho / 3) - (2 + 14/16),
        vidrioAlto: alto - (6 + 7/16),
        vidrioMedio: (ancho / 3) - (3 + 3/8)
      }
    } else {
      return {
        cabAlf: (ancho / 4) - (3/16),
        jambas: alto - (2 + 7/16),
        marco: ancho - (1 + 5/8),
        latMarco: alto - (1/8),
        vidrioAncho: (ancho / 4) - (3 + 3/8),
        vidrioAlto: alto - (6 + 7/16),
        vidrioMedio: null
      }
    }
  }


export default function P92() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ hueco: '', ancho: '', alto: '', hojas: 2 })
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
      hojas: `${hojas} hojas`,
      cabAlf: FractionUtils.toSixteenths(calc.cabAlf),
      jambas: FractionUtils.toSixteenths(calc.jambas),
      marco: FractionUtils.toSixteenths(calc.marco),
      latMarco: FractionUtils.toSixteenths(calc.latMarco),
      vidrioAncho: FractionUtils.toSixteenths(calc.vidrioAncho),
      vidrioAlto: FractionUtils.toSixteenths(calc.vidrioAlto),
      vidrioMedio: calc.vidrioMedio ? FractionUtils.toSixteenths(calc.vidrioMedio) : null
    }])
    setForm({ hueco: '', ancho: '', alto: '', hojas: form.hojas })
  }

  const handleReset = () => {
    setResults([])
    setForm({ hueco: 1, ancho: '', alto: '', hojas: 2 })
    setProjectInfo({ cuenta: '', obra: '', color: '' })
    setError('')
  }

  const handlePrint = () => {
    if (results.length === 0) { alert('No hay datos para imprimir'); return }
    const hasVidrioMedio = results.some(r => r.vidrioMedio)
    const date = new Date().toLocaleDateString('es-DO')
    const tableRows = results.map(row => `
      <tr>
        <td>${row.hueco}</td><td>${row.ancho}</td><td>${row.alto}</td><td>${row.hojas}</td>
        <td>${row.cabAlf}</td><td>${row.jambas}</td><td>${row.marco}</td><td>${row.latMarco}</td>
        <td>${row.vidrioAncho}</td><td>${row.vidrioAlto}</td>
        ${hasVidrioMedio ? `<td>${row.vidrioMedio || '—'}</td>` : ''}
      </tr>`).join('')
    const html = `<!DOCTYPE html><html><head><title>VENTANA P-92</title>
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
    <body><h1>VENTANA P-92</h1><h2>SISTEMA PROFESIONAL DE CÁLCULO</h2>
    <div class="info">
      <span><strong>CUENTA:</strong> ${projectInfo.cuenta || '—'}</span>
      <span><strong>OBRA:</strong> ${projectInfo.obra || '—'}</span>
      <span><strong>COLOR:</strong> ${projectInfo.color || '—'}</span>
    </div>
    <table><thead>
      <tr>
        <th rowspan="2">Hueco</th><th rowspan="2">Ancho</th><th rowspan="2">Alto</th><th rowspan="2">Hojas</th>
        <th colspan="2">De la hoja</th><th colspan="2">Del marco</th><th colspan="2">Vidrio</th>
        ${hasVidrioMedio ? '<th rowspan="2">V. Medio</th>' : ''}
      </tr>
      <tr><th>Cab-alf</th><th>Jambas</th><th>Cab-riel</th><th>Lat-marco</th><th>Ancho</th><th>Alto</th></tr>
    </thead><tbody>${tableRows}</tbody></table>
    <div class="footer"><span>© 2026 - Desglose Pro</span><span>${date}</span></div>
    </body></html>`
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 500)
  }

  const hasVidrioMedio = results.some(r => r.vidrioMedio)

  return (
    <Layout>
      <div className="page-content">

        {/* Header */}
        <div className="desglose-header">
          <button className="btn-back" onClick={() => navigate('/desglose')}><i className="bi bi-arrow-left" style={{ marginRight: '6px' }}></i>Volver</button>
          <h1 className="page-title">Ventana P-92</h1>
          <div className="desglose-header-actions">
            {results.length > 0 && <button className="btn-primary-sm" onClick={handlePrint}><i className="bi bi-printer" style={{ marginRight: '6px' }}></i>Imprimir</button>}
          </div>
        </div>

        {/* Info proyecto */}
        <div className="card-modern mb-4">
          <h3 className="info-card-title"><i className="bi bi-clipboard" style={{ marginRight: '6px' }}></i>Información del proyecto</h3>
          <div className="form-grid-3">
            {[['cuenta', 'Cuenta'], ['obra', 'Obra'], ['color', 'Color']].map(([name, label]) => (
              <div className="auth-field" key={name}>
                <label className="auth-label">{label}</label>
                <input type="text" name={name} value={projectInfo[name]} onChange={handleInfoChange} className="auth-input" />
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="card-modern mb-4">
          <div className="form-grid-4">
            <div className="auth-field">
              <label className="auth-label">Hueco #</label>
              <input type="text" name="hueco" value={form.hueco} onChange={handleFormChange} placeholder='ej: A-1' className="auth-input" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Ancho</label>
              <input type="text" name="ancho" value={form.ancho} onChange={handleFormChange} placeholder='ej: 91 1/2"' className="auth-input" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Alto</label>
              <input type="text" name="alto" value={form.alto} onChange={handleFormChange} placeholder='ej: 74 7/8"' className="auth-input" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Hojas</label>
              <select name="hojas" value={form.hojas} onChange={handleFormChange} className="auth-input">
                <option value={2}>2 hojas</option>
                <option value={3}>3 hojas</option>
                <option value={4}>4 hojas</option>
              </select>
            </div>
          </div>
          {error && <div className="auth-error" style={{ marginTop: '0.5rem' }}>{error}</div>}
          <div className="form-actions">
            <button className="auth-btn" onClick={handleAdd}><i className="bi bi-plus-circle" style={{ marginRight: '6px' }}></i>Agregar</button>
            {results.length > 0 && <button className="btn-outline-lg" onClick={handleReset}><i className="bi bi-arrow-counterclockwise" style={{ marginRight: '6px' }}></i>Reset</button>}
          </div>
        </div>

        {/* Tabla resultados */}
        {results.length > 0 && (
          <div className="table-container">
            <div className="table-title">VENTANA P-92</div>
            <div className="table-responsive">
              <table className="table-professional" style={{ minWidth: '900px' }}>
                <thead>
                  <tr>
                    <th rowSpan="2">Hueco</th>
                    <th rowSpan="2">Ancho</th>
                    <th rowSpan="2">Alto</th>
                    <th rowSpan="2">Hojas</th>
                    <th colSpan="2">De la hoja</th>
                    <th colSpan="2">Del marco</th>
                    <th colSpan="2">Vidrio</th>
                    {hasVidrioMedio && <th rowSpan="2">V. Medio</th>}
                  </tr>
                  <tr>
                    <th>Cab-alf</th><th>Jambas</th>
                    <th>Cab-riel</th><th>Lat-marco</th>
                    <th>Ancho</th><th>Alto</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.hueco}</td>
                      <td>{row.ancho}</td>
                      <td>{row.alto}</td>
                      <td>{row.hojas}</td>
                      <td>{row.cabAlf}</td>
                      <td>{row.jambas}</td>
                      <td>{row.marco}</td>
                      <td>{row.latMarco}</td>
                      <td>{row.vidrioAncho}</td>
                      <td>{row.vidrioAlto}</td>
                      {hasVidrioMedio && <td>{row.vidrioMedio || '—'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {results.length === 0 && (
          <div className="card-modern text-center" style={{ padding: '2rem', color: 'var(--gray-500)' }}>
            Ingresa las medidas y haz clic en "Agregar"
          </div>
        )}
      </div>
    </Layout>
  )
}
