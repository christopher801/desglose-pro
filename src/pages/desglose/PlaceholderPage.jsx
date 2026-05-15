import React from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'

export default function PlaceholderPage({ title }) {
  const navigate = useNavigate()
  return (
    <Layout>
      <div className="page-content">
        <div className="desglose-header">
          <button className="btn-back" onClick={() => navigate('/desglose')}>← Volver</button>
          <h1 className="page-title">{title}</h1>
        </div>
        <div className="card-modern text-center" style={{ padding: '3rem', color: 'var(--gray-500)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚧</div>
          <h3 style={{ marginBottom: '0.5rem' }}>En construcción</h3>
          <p>Este sistema estará disponible próximamente.</p>
        </div>
      </div>
    </Layout>
  )
}
