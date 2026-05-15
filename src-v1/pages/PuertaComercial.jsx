import React, { useState } from 'react'
import { Container, Row, Col, Alert, Button } from 'react-bootstrap'
import FractionUtils from '../utils/fraction'

const PuertaComercial = () => {
  const [formData, setFormData] = useState({
    hueco: 1,
    ancho: '',
    alto: '',
    hojas: 1
  })
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [projectInfo, setProjectInfo] = useState({
    cuenta: '',
    obra: '',
    color: ''
  })

  // Fòmil Puerta Comercial
  const calcular = (ancho, alto, hojas) => {
    if (hojas === 1) {
      return {
        cabAlf: ancho - 8,
        jambas: alto - (2 + 3/4),
        marco: ancho - (3 + 5/8),
        latMarco: alto - (1/8),
        vidrioAncho: ancho - (8 + 1/4),
        vidrioAlto: alto - 8
      }
    } else {
      return {
        cabAlf: (ancho - 12.1) / 2,
        jambas: alto - (2 + 3/4),
        marco: ancho - (3 + 5/8),
        latMarco: alto - (1/8),
        vidrioAncho: (ancho - 12.625) / 2,
        vidrioAlto: alto - 8
      }
    }
  }

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleProjectInfoChange = (e) => {
    setProjectInfo({
      ...projectInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleAdd = () => {
    setError('')
    
    if (!formData.ancho || !formData.alto) {
      setError('❌ Ingrese ANCHO y ALTO')
      return
    }
    
    const anchoDec = FractionUtils.parseFraction(formData.ancho)
    const altoDec = FractionUtils.parseFraction(formData.alto)
    
    if (anchoDec <= 0 || altoDec <= 0) {
      setError('❌ Las medidas deben ser mayores a 0')
      return
    }
    
    const hojas = parseInt(formData.hojas, 10)
    const calculated = calcular(anchoDec, altoDec, hojas)
    
    const newResult = {
      hueco: formData.hueco,
      ancho: formData.ancho,
      alto: formData.alto,
      hojas: hojas === 1 ? 'Simple' : 'Doble',
      cabAlf: FractionUtils.toSixteenths(calculated.cabAlf),
      jambas: FractionUtils.toSixteenths(calculated.jambas),
      marco: FractionUtils.toSixteenths(calculated.marco),
      latMarco: FractionUtils.toSixteenths(calculated.latMarco),
      vidrioAncho: FractionUtils.toSixteenths(calculated.vidrioAncho),
      vidrioAlto: FractionUtils.toSixteenths(calculated.vidrioAlto)
    }
    
    setResults([...results, newResult])
    
    setFormData({
      hueco: formData.hueco + 1,
      ancho: '',
      alto: '',
      hojas: 1
    })
  }

  const handleReset = () => {
    setResults([])
    setFormData({
      hueco: 1,
      ancho: '',
      alto: '',
      hojas: 1
    })
    setProjectInfo({
      cuenta: '',
      obra: '',
      color: ''
    })
    setError('')
  }

  const handlePrint = () => {
    if (results.length === 0) {
      alert('No hay datos para imprimir. Ingrese medidas primero.')
      return
    }
    
    const date = new Date().toLocaleDateString()
    const title = 'PUERTA COMERCIAL TRADICIONAL'
    const cuenta = projectInfo.cuenta || ''
    const obra = projectInfo.obra || ''
    const color = projectInfo.color || ''
    
    let tableHtml = `
      <table style="width:100%; border-collapse:collapse; margin:10px 0; border:1px solid #1e2b3c;">
        <thead>
          <tr>
            <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">hueco</th>
            <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">ancho</th>
            <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">alto</th>
            <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">tipo</th>
            <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">HOJA</th>
            <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">MARCO</th>
            <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">VIDRIO</th>
          </tr>
          <tr>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Cab-alf</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">jambas</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Cab-marco</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Lat-marco</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">ancho</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">alto</th>
          </tr>
        </thead>
        <tbody>
    `
    
    results.forEach(row => {
      tableHtml += `
        <tr>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.hueco}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.ancho}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.alto}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.hojas}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.cabAlf}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.jambas}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.marco}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.latMarco}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioAncho}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioAlto}</td>
        </tr>
      `
    })
    
    tableHtml += `</tbody></td>`
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DESGLOSE ${title}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Roboto, Arial, sans-serif;
            margin: 0.3in;
            background: white;
            line-height: 1.2;
          }
          .header { text-align: center; margin-bottom: 15px; }
          .header h1 { font-size: 18px; color: #1e2b3c; margin: 0 0 3px 0; }
          .header h2 { font-size: 12px; color: #2c3e50; margin: 0; font-weight: 400; }
          .info-section {
            background: #f8f9fa; border-radius: 6px; padding: 8px;
            margin-bottom: 15px; border: 1px solid #dee2e6;
            display: flex; flex-wrap: wrap; justify-content: space-between;
          }
          .info-item { font-size: 10px; color: #495057; }
          .info-item strong { color: #1e2b3c; margin-right: 5px; }
          .footer {
            margin-top: 15px; text-align: right; font-size: 9px;
            color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 8px;
          }
          .footer .date { font-weight: 600; color: #1e2b3c; }
          .footer .credit { float: left; font-weight: 400; color: #2c3e50; }
          @media print {
            body { margin: 0.1in; }
            th { background: #1e2b3c !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th[colspan] { background: #2c3e50 !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <h2>SISTEMA PROFESIONAL DE CÁLCULO</h2>
        </div>
        <div class="info-section">
          <div class="info-item"><strong>CUENTA:</strong> ${cuenta}</div>
          <div class="info-item"><strong>OBRA:</strong> ${obra}</div>
          <div class="info-item"><strong>COLOR:</strong> ${color}</div>
        </div>
        ${tableHtml}
        <div class="footer">
          <span class="credit">&copy; 2026 - Christopher</span>
          <span class="date">${date}</span>
        </div>
      </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  }

  const handleExportPDF = () => {
    if (results.length === 0) {
      alert('No hay datos para exportar. Ingrese medidas primero.')
      return
    }
    
    const date = new Date().toLocaleDateString()
    const title = 'PUERTA COMERCIAL TRADICIONAL'
    const cuenta = projectInfo.cuenta || ''
    const obra = projectInfo.obra || ''
    const color = projectInfo.color || ''
    
    let tableHtml = `
      <table style="width:100%; border-collapse:collapse; margin:10px 0; border:1px solid #1e2b3c;">
        <thead>
          <tr>
            <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">hueco</th>
            <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">ancho</th>
            <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">alto</th>
            <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">tipo</th>
            <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">HOJA</th>
            <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">MARCO</th>
            <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">VIDRIO</th>
          </tr>
          <tr>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Cab-alf</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">jambas</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Cab-marco</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Lat-marco</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">ancho</th>
            <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">alto</th>
          </tr>
        </thead>
        <tbody>
    `
    
    results.forEach(row => {
      tableHtml += `
        <tr>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.hueco}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.ancho}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.alto}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.hojas}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.cabAlf}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.jambas}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.marco}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.latMarco}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioAncho}</td>
          <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioAlto}</td>
        </tr>
      `
    })
    
    tableHtml += `</tbody><tr>`
    
    const container = document.createElement('div')
    container.innerHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DESGLOSE ${title}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Roboto, Arial, sans-serif;
            margin: 0.3in;
            background: white;
            line-height: 1.2;
          }
          .header { text-align: center; margin-bottom: 15px; }
          .header h1 { font-size: 18px; color: #1e2b3c; margin: 0 0 3px 0; }
          .header h2 { font-size: 12px; color: #2c3e50; margin: 0; font-weight: 400; }
          .info-section {
            background: #f8f9fa; border-radius: 6px; padding: 8px;
            margin-bottom: 15px; border: 1px solid #dee2e6;
            display: flex; flex-wrap: wrap; justify-content: space-between;
          }
          .info-item { font-size: 10px; color: #495057; }
          .info-item strong { color: #1e2b3c; margin-right: 5px; }
          .footer {
            margin-top: 15px; text-align: right; font-size: 9px;
            color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 8px;
          }
          .footer .date { font-weight: 600; color: #1e2b3c; }
          .footer .credit { float: left; font-weight: 400; color: #2c3e50; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
          <h2>SISTEMA PROFESIONAL DE CÁLCULO</h2>
        </div>
        <div class="info-section">
          <div class="info-item"><strong>CUENTA:</strong> ${cuenta}</div>
          <div class="info-item"><strong>OBRA:</strong> ${obra}</div>
          <div class="info-item"><strong>COLOR:</strong> ${color}</div>
        </div>
        ${tableHtml}
        <div class="footer">
          <span class="credit">&copy; 2026 - Christopher</span>
          <span class="date">${date}</span>
        </div>
      </body>
      </html>
    `
    
    const options = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: 'puerta-comercial-desglose.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    }
    
    if (typeof window.html2pdf === 'undefined') {
      alert('Error: html2pdf.js no cargó. Verifica tu conexión a internet.')
      return
    }
    
    window.html2pdf().set(options).from(container).save()
  }

  return (
    <Container fluid className="py-4" style={{ maxWidth: '1400px' }}>
      <Row>
        <Col lg={12}>
          {/* Project Info */}
          <div className="card-modern mb-4" style={{ padding: '1rem' }}>
            <h6 className="mb-3">📋 INFORMACIÓN DEL PROYECTO</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">CUENTA</label>
                <input type="text" name="cuenta" value={projectInfo.cuenta} onChange={handleProjectInfoChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">OBRA</label>
                <input type="text" name="obra" value={projectInfo.obra} onChange={handleProjectInfoChange} className="form-control" />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">COLOR</label>
                <input type="text" name="color" value={projectInfo.color} onChange={handleProjectInfoChange} className="form-control" />
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="card-modern mb-4" style={{ padding: '1rem' }}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-bold">HUECO #</label>
                <input type="number" name="hueco" value={formData.hueco} onChange={handleFormChange} className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">ANCHO</label>
                <input type="text" name="ancho" value={formData.ancho} onChange={handleFormChange} placeholder="ej: 56 7/8" className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">ALTO</label>
                <input type="text" name="alto" value={formData.alto} onChange={handleFormChange} placeholder="ej: 82 2/16" className="form-control" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">TIPO PUERTA</label>
                <select name="hojas" value={formData.hojas} onChange={handleFormChange} className="form-select">
                  <option value="1">1 HOJA (Simple)</option>
                  <option value="2">2 HOJAS (Doble)</option>
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 d-flex justify-content-end gap-2">
                <Button variant="primary" onClick={handleAdd}>➕ AGREGAR</Button>
                <Button variant="secondary" onClick={handleReset}>⟲ RESET TODO</Button>
                <Button variant="secondary" onClick={handlePrint}>🖨️ PRINT</Button>
              </div>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Results Table */}
          <div id="print-area">
            {results.length > 0 && (
              <div className="table-container">
                <div className="table-title">PUERTA COMERCIAL TRADICIONAL</div>
                <div className="table-responsive">
                  <table className="table-professional" style={{ minWidth: '950px' }}>
                    <thead>
                      <tr>
                        <th rowSpan="2">hueco</th>
                        <th rowSpan="2">ancho</th>
                        <th rowSpan="2">alto</th>
                        <th rowSpan="2">tipo</th>
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
                          <td style={{ padding: '0.25rem' }}>{row.hojas}</td>
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
            )}
          </div>

          {results.length === 0 && (
            <div className="card-modern p-5 text-center">
              <p className="text-muted mb-0">— Ingrese las medidas y haga clic en 'AGREGAR' —</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default PuertaComercial