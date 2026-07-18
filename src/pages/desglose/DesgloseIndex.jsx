import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'

const systems = [
  { name: 'Ventana P-92', path: '/desglose/p92', desc: 'Corredera 2, 3 o 4 hojas', icon: 'bi-window', nuevo: false },
  { name: 'Ventana P-65', path: '/desglose/p65', desc: 'Corredera 2, 3 o 4 hojas', icon: 'bi-window', nuevo: false },
  { name: 'Ventana Tradicional', path: '/desglose/tradicional', desc: 'Corredera 2, 3 o 4 hojas', icon: 'bi-window', nuevo: false },
  { name: 'Ventana P-40 Proyectada', path: '/desglose/p40', desc: 'Sistema proyectado', icon: 'bi-window-dock', nuevo: false },
  { name: 'Puerta Comercial', path: '/desglose/puerta', desc: 'Puertas de aluminio', icon: 'bi-door-open', nuevo: false },
  { name: 'Puerta P40', path: '/desglose/puertap40', desc: 'Puertas de aluminio', icon: 'bi-door-open', nuevo: true },
]

export default function DesgloseIndex() {
  return (
    <Layout>
      <div className="page-content">
        <h1 className="page-title">Sistemas de cálculo</h1>
        <div className="product-grid">
          {systems.map((sys, idx) => (
            <Link to={sys.path} key={idx} className="product-card">
              {sys.nuevo && <span className="product-badge">Nuevo</span>}
              <i className={`bi ${sys.icon} product-icon`}></i>
              <div className="product-title">{sys.name}</div>
              <div className="product-desc">{sys.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
