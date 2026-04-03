import React from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'

const FormInputs = ({ 
  formData, 
  onChange, 
  onAdd, 
  onReset,
  onPrint,
  projectInfo,
  onProjectInfoChange,
  systems,
  selectedSystem,
  onSystemChange
}) => {
  return (
    <div className="card-modern">
      {/* Project Information Section */}
      <div style={{ 
        background: '#f8f9fa', 
        borderRadius: '16px', 
        padding: '1rem', 
        marginBottom: '1.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h6 style={{ marginBottom: '1rem', color: '#1e2b3c', fontWeight: '600' }}>📋 INFORMACIÓN DEL PROYECTO</h6>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="input-group-custom">
            <label>CUENTA</label>
            <input
              type="text"
              name="cuenta"
              value={projectInfo.cuenta}
              onChange={onProjectInfoChange}
              placeholder=""
            />
          </div>
          <div className="input-group-custom">
            <label>OBRA</label>
            <input
              type="text"
              name="obra"
              value={projectInfo.obra}
              onChange={onProjectInfoChange}
              placeholder=""
            />
          </div>
          <div className="input-group-custom">
            <label>COLOR</label>
            <input
              type="text"
              name="color"
              value={projectInfo.color}
              onChange={onProjectInfoChange}
              placeholder=""
            />
          </div>
        </div>
      </div>
      
      {/* Input Section */}
      <div className="input-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="input-group-custom">
          <label>HUECO #</label>
          <input
            type="number"
            name="hueco"
            value={formData.hueco}
            onChange={onChange}
            placeholder="1"
          />
        </div>
        
        <div className="input-group-custom">
          <label>SISTEMA</label>
          <select value={selectedSystem} onChange={(e) => onSystemChange(e.target.value)}>
            {systems.map(sys => (
              <option key={sys.value} value={sys.value}>
                {sys.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="input-group-custom">
          <label>ANCHO</label>
          <input
            type="text"
            name="ancho"
            value={formData.ancho}
            onChange={onChange}
            placeholder="ej: 91 1/2"
          />
        </div>
        
        <div className="input-group-custom">
          <label>ALTO</label>
          <input
            type="text"
            name="alto"
            value={formData.alto}
            onChange={onChange}
            placeholder="ej: 74 7/8"
          />
        </div>
        
        <div className="input-group-custom">
          <label>HOJAS</label>
          <select
            name="hojas"
            value={formData.hojas}
            onChange={onChange}
            disabled={selectedSystem === 'puerta'}
          >
            <option value="2">2 HOJAS</option>
            <option value="3">3 HOJAS</option>
            <option value="4">4 HOJAS</option>
          </select>
          {selectedSystem === 'puerta' && (
            <small style={{ fontSize: '0.7rem', color: '#6c757d' }}>
              Puerta Comercial: Simple (1 hoja)
            </small>
          )}
        </div>
      </div>
      
      <div className="button-bar" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
        <button 
          onClick={onAdd} 
          style={{
            background: '#1e3b5c',
            color: 'white',
            border: 'none',
            padding: '0.7rem 1.5rem',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '4px 4px 8px #d9dde2, -4px -4px 8px #ffffff',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#264d73'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#1e3b5c'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          ➕ AGREGAR
        </button>
        
        <button 
          onClick={onReset} 
          style={{
            background: '#ecf0f3',
            border: 'none',
            padding: '0.6rem 1.5rem',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '4px 4px 8px #d9dde2, -4px -4px 8px #ffffff',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#e1e8f0'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#ecf0f3'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          ⟲ RESET TODO
        </button>
        
        <button 
          onClick={onPrint} 
          style={{
            background: '#2c3e50',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.5rem',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '4px 4px 8px #d9dde2, -4px -4px 8px #ffffff',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#3a5068'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#2c3e50'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          🖨️ PRINT
        </button>
      </div>
    </div>
  )
}

export default FormInputs