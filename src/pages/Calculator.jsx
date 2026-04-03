import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormInputs from '../components/FormInputs'
import TableResults from '../components/TableResults'
import FractionUtils from '../utils/fraction'

// Import systems
import { p92Calcular, p92FormatResult } from '../systems/p92'
import { p65Calcular, p65FormatResult } from '../systems/p65'
import { tradicionalCalcular, tradicionalFormatResult } from '../systems/tradicional'
import { puertaCalcular, puertaFormatResult } from '../systems/puerta-comercial'

const systemsList = [
  { value: 'p92', label: 'VENTANA P-92', calcular: p92Calcular, format: p92FormatResult },
  { value: 'p65', label: 'VENTANA P-65', calcular: p65Calcular, format: p65FormatResult },
  { value: 'tradicional', label: 'VENTANA TRADICIONAL', calcular: tradicionalCalcular, format: tradicionalFormatResult },
  { value: 'puerta', label: 'PUERTA COMERCIAL', calcular: puertaCalcular, format: puertaFormatResult }
]

const Calculator = () => {
  const { isActive } = useAuth()
  const [searchParams] = useSearchParams()
  const [selectedSystem, setSelectedSystem] = useState(searchParams.get('system') || 'p92')
  const [formData, setFormData] = useState({
    hueco: 1,
    ancho: '',
    alto: '',
    hojas: 2
  })
  const [projectInfo, setProjectInfo] = useState({
    cuenta: '',
    obra: '',
    color: ''
  })
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const systemParam = searchParams.get('system')
    if (systemParam && systemsList.some(s => s.value === systemParam)) {
      setSelectedSystem(systemParam)
      if (systemParam === 'puerta') {
        setFormData(prev => ({ ...prev, hojas: 1 }))
      }
    }
  }, [searchParams])

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

  const handleSystemChange = (system) => {
    setSelectedSystem(system)
    if (system === 'puerta') {
      setFormData({ ...formData, hojas: 1 })
    } else {
      setFormData({ ...formData, hojas: 2 })
    }
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
    
    const currentSystem = systemsList.find(s => s.value === selectedSystem)
    let hojas = parseInt(formData.hojas, 10)
    
    if (selectedSystem === 'puerta') {
      hojas = 1
    }
    
    const parts = currentSystem.calcular(anchoDec, altoDec, hojas)
    const formatted = currentSystem.format(parts, hojas)
    
    const newResult = {
      hueco: formData.hueco,
      sistema: currentSystem.label,
      ancho: formData.ancho,
      alto: formData.alto,
      hojas: selectedSystem === 'puerta' ? 'Simple' : `${hojas} hojas`,
      cabAlf: formatted.cabAlf,
      jambas: formatted.jambas,
      marco: formatted.marco,
      latMarco: formatted.latMarco,
      vidrioAncho: formatted.vidrioAncho,
      vidrioAlto: formatted.vidrioAlto,
      vidrioMedio: formatted.vidrioMedio
    }
    
    setResults([...results, newResult])
    
    setFormData({
      hueco: formData.hueco + 1,
      ancho: '',
      alto: '',
      hojas: selectedSystem === 'puerta' ? 1 : 2
    })
  }

  const handleReset = () => {
    setResults([])
    setFormData({
      hueco: 1,
      ancho: '',
      alto: '',
      hojas: selectedSystem === 'puerta' ? 1 : 2
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
    
    const currentSystem = systemsList.find(s => s.value === selectedSystem)
    const date = new Date().toLocaleDateString()
    const title = currentSystem.label
    const isPuerta = selectedSystem === 'puerta'
    
    const cuenta = projectInfo.cuenta || ''
    const obra = projectInfo.obra || ''
    const color = projectInfo.color || ''
    
    let tableHtml = ''
    
    if (isPuerta) {
      tableHtml = `
        <table style="width:100%; border-collapse:collapse; margin:10px 0; border:1px solid #1e2b3c;">
          <thead>
            <tr>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">hueco</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">ancho</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">alto</th>
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
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.cabAlf}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.jambas}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.marco}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.latMarco}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioAncho}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioAlto}</td>
          </tr>
        `
      })
      tableHtml += `</tbody></table>`
    } else {
      const hasVidrioMedio = results.some(r => r.vidrioMedio !== null && r.vidrioMedio !== '—')
      tableHtml = `
        <table style="width:100%; border-collapse:collapse; margin:10px 0; border:1px solid #1e2b3c;">
          <thead>
            <tr>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">hueco</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">ancho</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">alto</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">hojas</th>
              <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">DE LA HOJAS</th>
              <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">DEL MARCO</th>
              <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">VIDRIO</th>
              ${hasVidrioMedio ? '<th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">V. MEDIO</th>' : ''}
            </tr>
            <tr>
              <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Cab-alf</th>
              <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">jambas</th>
              <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Cab-riel</th>
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
            ${hasVidrioMedio ? `<td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioMedio || '—'}</td>` : ''}
          </tr>
        `
      })
      tableHtml += `</tbody></table>`
    }
    
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
    
    const currentSystem = systemsList.find(s => s.value === selectedSystem)
    const date = new Date().toLocaleDateString()
    const title = currentSystem.label
    const isPuerta = selectedSystem === 'puerta'
    
    const cuenta = projectInfo.cuenta || ''
    const obra = projectInfo.obra || ''
    const color = projectInfo.color || ''
    
    let tableHtml = ''
    
    if (isPuerta) {
      tableHtml = `
        <table style="width:100%; border-collapse:collapse; margin:10px 0; border:1px solid #1e2b3c;">
          <thead>
            <tr>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">hueco</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">ancho</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">alto</th>
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
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.cabAlf}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.jambas}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.marco}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.latMarco}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioAncho}</td>
            <td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioAlto}</td>
          </tr>
        `
      })
      tableHtml += `</tbody></table>`
    } else {
      const hasVidrioMedio = results.some(r => r.vidrioMedio !== null && r.vidrioMedio !== '—')
      tableHtml = `
        <table style="width:100%; border-collapse:collapse; margin:10px 0; border:1px solid #1e2b3c;">
          <thead>
            <tr>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">hueco</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">ancho</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">alto</th>
              <th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">hojas</th>
              <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">DE LA HOJAS</th>
              <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">DEL MARCO</th>
              <th colspan="2" style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">VIDRIO</th>
              ${hasVidrioMedio ? '<th rowspan="2" style="background:#1e2b3c; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">V. MEDIO</th>' : ''}
            </tr>
            <tr>
              <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Cab-alf</th>
              <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">jambas</th>
              <th style="background:#2c3e50; color:white; padding:4px 6px; border:1px solid #2c3e50; font-size:10px;">Cab-riel</th>
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
            ${hasVidrioMedio ? `<td style="border:1px solid #adb5bd; padding:4px 6px; text-align:center; font-size:10px;">${row.vidrioMedio || '—'}</td>` : ''}
          </tr>
        `
      })
      tableHtml += `</tbody></table>`
    }
    
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
      filename: `${selectedSystem}-desglose.pdf`,
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

  if (!isActive) {
    return (
      <Container className="mt-5">
        <Alert variant="warning" className="text-center">
          <div style={{ fontSize: '48px' }}>🔒</div>
          <h4 className="mt-3">Acceso Bloqueado</h4>
          <p>Tu cuenta no está activada. Contacta al administrador para activar tu acceso.</p>
        </Alert>
      </Container>
    )
  }

  const currentSystem = systemsList.find(s => s.value === selectedSystem)

  return (
    <Container fluid className="py-4" style={{ maxWidth: '1400px' }}>
      <Row>
        <Col lg={12}>
          <FormInputs
            formData={formData}
            onChange={handleFormChange}
            onAdd={handleAdd}
            onReset={handleReset}
            onPrint={handlePrint}
            projectInfo={projectInfo}
            onProjectInfoChange={handleProjectInfoChange}
            systems={systemsList}
            selectedSystem={selectedSystem}
            onSystemChange={handleSystemChange}
          />
          
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          
          <TableResults
            results={results}
            onPrint={handlePrint}
            onExportPDF={handleExportPDF}
            systemName={currentSystem.label}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Calculator