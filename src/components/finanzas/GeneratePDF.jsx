import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ============================================================
//  FONKSYON ÈD - FÒMA LAJAN
// ============================================================
const formatMoney = (amount) => {
  const sign = amount >= 0 ? '+' : ''
  return `${sign}$${Math.abs(amount).toLocaleString('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`
}

// ============================================================
//  FONKSYON ÈD - FÒMA DAT
// ============================================================
const formatDate = (fecha) => {
  const d = new Date(fecha + 'T00:00:00')
  return d.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toLowerCase()
}

// ============================================================
//  FONKSYON ÈD - FÒMA DAT LONG
// ============================================================
const formatDateLong = (fecha) => {
  const d = new Date(fecha + 'T00:00:00')
  return d.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// ============================================================
//  FONKSYON ÈD - GRUP PA KATEGORI
// ============================================================
const groupByCategory = (movimientos) => {
  const groups = {}
  movimientos.forEach(m => {
    const cat = m.categoria || 'Otros'
    if (!groups[cat]) {
      groups[cat] = { transactions: [], total: 0 }
    }
    groups[cat].transactions.push(m)
    groups[cat].total += m.tipo === 'ingreso' ? m.monto : -m.monto
  })
  return groups
}

// ============================================================
//  FONKSYON PRENSIPAL - JENERE PDF
// ============================================================
const generarPDF = (movimientos, totalIngresos, totalGastos, balance) => {
  if (!movimientos || movimientos.length === 0) return

  const doc = new jsPDF('portrait', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 16
  let y = 22

  // ======== HEADER =========
  // Bande ble anwo
  doc.setFillColor(26, 86, 219)
  doc.rect(0, 0, pageWidth, 5, 'F')
  
  doc.setFontSize(10)
  doc.setTextColor(26, 86, 219)
  doc.setFont('helvetica', 'bold')
  doc.text('DESGLOSE PRO', margin, 20)
  
  doc.setFontSize(22)
  doc.setTextColor(30, 41, 59)
  doc.setFont('helvetica', 'bold')
  doc.text('Reporte Financiero', margin, 34)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')
  const periodText = `Período: ${formatDateLong(new Date().toISOString().split('T')[0])}`
  doc.text(periodText, margin, 41)
  
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.5)
  doc.line(margin, 45, pageWidth - margin, 45)
  
  y = 52

  // ======== TWA KAT RESIME =========
  const cardWidth = (pageWidth - margin * 2 - 12) / 3
  const cardHeight = 30

  // 1. Total Ingresos
  doc.setFillColor(240, 253, 244)
  doc.rect(margin, y, cardWidth, cardHeight, 'F')
  doc.setDrawColor(34, 197, 94)
  doc.setLineWidth(0.5)
  doc.rect(margin, y, cardWidth, cardHeight, 'S')
  
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL INGRESOS', margin + 6, y + 8)
  
  doc.setFontSize(14)
  doc.setTextColor(22, 163, 74)
  doc.setFont('helvetica', 'bold')
  doc.text(formatMoney(totalIngresos), margin + 6, y + 23)

  // 2. Total Gastos
  doc.setFillColor(254, 242, 242)
  doc.rect(margin + cardWidth + 6, y, cardWidth, cardHeight, 'F')
  doc.setDrawColor(239, 68, 68)
  doc.setLineWidth(0.5)
  doc.rect(margin + cardWidth + 6, y, cardWidth, cardHeight, 'S')
  
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'bold')
  doc.text('TOTAL GASTOS', margin + cardWidth + 12, y + 8)
  
  doc.setFontSize(14)
  doc.setTextColor(220, 38, 38)
  doc.setFont('helvetica', 'bold')
  doc.text(formatMoney(-totalGastos), margin + cardWidth + 12, y + 23)

  // 3. Balance
  const balancePos = balance >= 0
  if (balancePos) {
    doc.setFillColor(240, 253, 244)
    doc.setDrawColor(34, 197, 94)
  } else {
    doc.setFillColor(254, 242, 242)
    doc.setDrawColor(239, 68, 68)
  }
  doc.rect(margin + (cardWidth + 6) * 2, y, cardWidth, cardHeight, 'F')
  doc.setLineWidth(0.5)
  doc.rect(margin + (cardWidth + 6) * 2, y, cardWidth, cardHeight, 'S')
  
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'bold')
  doc.text('GANANCIA NETA', margin + (cardWidth + 6) * 2 + 6, y + 8)
  
  doc.setFontSize(14)
  if (balancePos) {
    doc.setTextColor(22, 163, 74)
  } else {
    doc.setTextColor(220, 38, 38)
  }
  doc.setFont('helvetica', 'bold')
  doc.text(formatMoney(balance), margin + (cardWidth + 6) * 2 + 6, y + 23)

  y += cardHeight + 14

  // ======== SEKSYON KATEGORI =========
  doc.setFontSize(11)
  doc.setTextColor(30, 41, 59)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumen por Categoría', margin, y)
  doc.setDrawColor(26, 86, 219)
  doc.setLineWidth(1)
  doc.line(margin, y + 3, margin + 55, y + 3)
  
  y += 12

  // ======== TABLO KATEGORI AK AUTOTABLE =========
  const groups = groupByCategory(movimientos)
  const sortedCategories = Object.keys(groups).sort((a, b) => {
    return Math.abs(groups[b].total) - Math.abs(groups[a].total)
  })

  // Prepare data for autoTable
  const tableData = sortedCategories.map(category => {
    const { transactions, total } = groups[category]
    const isPositive = total >= 0
    const totalSign = total >= 0 ? '+' : ''
    const percent = Math.round((Math.abs(total) / (Math.abs(totalIngresos) + Math.abs(totalGastos))) * 100)
    return [
      category,
      transactions.length,
      `${totalSign}${formatMoney(Math.abs(total))}`,
      `${percent}%`
    ]
  })

  autoTable(doc, {
    startY: y,
    head: [['Categoría', 'Trans.', 'Monto', '%']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [71, 85, 105],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 15, halign: 'right' }
    },
    didDrawPage: function(data) {
      // Pye paj
      const footerY = doc.internal.pageSize.getHeight() - 12
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.3)
      doc.line(margin, footerY, pageWidth - margin, footerY)
      
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.setFont('helvetica', 'normal')
      doc.text('© 2026 - Desglose Pro', margin, footerY + 6)
      
      const today = new Date().toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber
      const totalPages = doc.internal.getNumberOfPages()
      doc.text(`${today}  |  Página ${currentPage} de ${totalPages}`, pageWidth - margin, footerY + 6, { align: 'right' })
    }
  })

  // ======== DETAY TRANZAKSYON =========
  // Jwenn kote tablo a fini
  const finalY = doc.lastAutoTable.finalY + 14
  y = finalY

  doc.setFontSize(11)
  doc.setTextColor(30, 41, 59)
  doc.setFont('helvetica', 'bold')
  doc.text('Detalle de Transacciones', margin, y)
  doc.setDrawColor(26, 86, 219)
  doc.setLineWidth(1)
  doc.line(margin, y + 3, margin + 60, y + 3)
  
  y += 12

  // ======== LIST KATEGORI AK TRANZAKSYON =========
  doc.setFont('helvetica', 'normal')

  sortedCategories.forEach((category) => {
    const { transactions, total } = groups[category]
    const isPositive = total >= 0

    // Vérifye si gen plas
    const neededSpace = 14 + (transactions.length * 7) + 8
    if (y + neededSpace > pageHeight - 18) {
      doc.addPage()
      y = 20
    }

    // ==== KAT KATEGORI ====
    const catCardHeight = 11
    if (isPositive) {
      doc.setFillColor(240, 253, 244)
    } else {
      doc.setFillColor(254, 242, 242)
    }
    doc.rect(margin, y, pageWidth - margin * 2, catCardHeight, 'F')
    if (isPositive) {
      doc.setDrawColor(187, 247, 208)
    } else {
      doc.setDrawColor(254, 202, 202)
    }
    doc.setLineWidth(1.5)
    doc.line(margin, y + 2, margin, y + catCardHeight - 2)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 41, 59)
    doc.text(category, margin + 6, y + 7.5)
    
    const totalSign = total >= 0 ? '+' : ''
    if (isPositive) {
      doc.setTextColor(22, 163, 74)
    } else {
      doc.setTextColor(220, 38, 38)
    }
    doc.text(`${totalSign}${formatMoney(Math.abs(total))}`, pageWidth - margin - 4, y + 7.5, { align: 'right' })
    
    y += catCardHeight + 3

    // ==== ANTÈT TRANZAKSYON ====
    doc.setFillColor(248, 250, 252)
    doc.rect(margin + 3, y, pageWidth - margin * 2 - 6, 7, 'F')
    
    doc.setFontSize(7)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'bold')
    doc.text('Fecha', margin + 8, y + 5)
    doc.text('Descripción', margin + 40, y + 5)
    doc.text('Monto', pageWidth - margin - 6, y + 5, { align: 'right' })
    
    y += 8

    // ==== TRANZAKSYON YO ====
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)

    const sortedTxs = [...transactions].sort((a, b) => 
      new Date(b.fecha) - new Date(a.fecha)
    )

    sortedTxs.forEach((tx, index) => {
      const isIncome = tx.tipo === 'ingreso'
      const amount = isIncome ? tx.monto : -tx.monto
      const sign = amount >= 0 ? '+' : ''

      const dateStr = formatDate(tx.fecha)
      const desc = tx.descripcion || 'Sin descripción'
      const amountStr = `${sign}${formatMoney(Math.abs(amount))}`

      if (index % 2 === 1) {
        doc.setFillColor(250, 250, 250)
        doc.rect(margin + 3, y - 3, pageWidth - margin * 2 - 6, 7, 'F')
      }

      doc.setTextColor(100, 116, 139)
      doc.text(dateStr, margin + 8, y + 2)

      doc.setTextColor(51, 65, 85)
      let displayDesc = desc
      if (displayDesc.length > 30) {
        displayDesc = displayDesc.slice(0, 30) + '...'
      }
      doc.text(displayDesc, margin + 40, y + 2)

      if (isIncome) {
        doc.setTextColor(22, 163, 74)
      } else {
        doc.setTextColor(220, 38, 38)
      }
      doc.setFont('helvetica', 'bold')
      doc.text(amountStr, pageWidth - margin - 6, y + 2, { align: 'right' })
      doc.setFont('helvetica', 'normal')

      y += 6.5
    })

    y += 6
  })

  // ======== SOVE PDF =========
  doc.save(`reporte-gastos-${new Date().toISOString().split('T')[0]}.pdf`)
}

// ============================================================
//  KOMPONAN REACT
// ============================================================
const GeneratePDF = ({ movimientos, totalIngresos, totalGastos, balance }) => {
  const handleExport = () => {
    if (!movimientos || movimientos.length === 0) {
      alert('No hay movimientos para exportar.')
      return
    }
    try {
      generarPDF(movimientos, totalIngresos, totalGastos, balance)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF: ' + error.message)
    }
  }

  return (
    <button
      onClick={handleExport}
      className="btn-primary-sm"
      style={{ 
        background: 'linear-gradient(135deg, #1a56db 0%, #1e429f 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 6px -1px rgba(26, 86, 219, 0.2), 0 2px 4px -1px rgba(26, 86, 219, 0.1)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-1px)'
        e.target.style.boxShadow = '0 6px 8px -1px rgba(26, 86, 219, 0.3), 0 3px 5px -1px rgba(26, 86, 219, 0.15)'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)'
        e.target.style.boxShadow = '0 4px 6px -1px rgba(26, 86, 219, 0.2), 0 2px 4px -1px rgba(26, 86, 219, 0.1)'
      }}
    >
      <span style={{ fontSize: '16px' }}>📄</span>
      Exportar PDF
    </button>
  )
}

export default GeneratePDF