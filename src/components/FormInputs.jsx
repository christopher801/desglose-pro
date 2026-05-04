import React from 'react'

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
    <div className="card-modern" style={{ padding: '1.5rem', border: '1px solid #a855f7', background: 'white' }}>
      {/* Project Information Section */}
      <div style={{ 
        background: '#e9d5ff', 
        borderRadius: '16px', 
        padding: '1rem', 
        marginBottom: '1.5rem',
        border: '1px solid #a855f7'
      }}>
        <h6 style={{ marginBottom: '1rem', color: '#4a0e78', fontWeight: '600', fontSize: '0.9rem' }}>📋 INFORMACIÓN DEL PROYECTO</h6>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="input-group-custom">
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4a0e78' }}>CUENTA</label>
            <input
              type="text"
              name="cuenta"
              value={projectInfo.cuenta}
              onChange={onProjectInfoChange}
              placeholder=""
              style={{ 
                padding: '0.75rem 1rem', 
                fontSize: '0.9rem', 
                border: '1px solid #a855f7',
                background: 'white',
                borderRadius: '12px',
                width: '100%',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)'
              }}
            />
          </div>
          <div className="input-group-custom">
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4a0e78' }}>OBRA</label>
            <input
              type="text"
              name="obra"
              value={projectInfo.obra}
              onChange={onProjectInfoChange}
              placeholder=""
              style={{ 
                padding: '0.75rem 1rem', 
                fontSize: '0.9rem', 
                border: '1px solid #a855f7',
                background: 'white',
                borderRadius: '12px',
                width: '100%',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)'
              }}
            />
          </div>
          <div className="input-group-custom">
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4a0e78' }}>COLOR</label>
            <input
              type="text"
              name="color"
              value={projectInfo.color}
              onChange={onProjectInfoChange}
              placeholder=""
              style={{ 
                padding: '0.75rem 1rem', 
                fontSize: '0.9rem', 
                border: '1px solid #a855f7',
                background: 'white',
                borderRadius: '12px',
                width: '100%',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Input Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="input-group-custom">
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4a0e78' }}>HUECO #</label>
          <input
            type="number"
            name="hueco"
            value={formData.hueco}
            onChange={onChange}
            placeholder="1"
            style={{ 
              padding: '0.75rem 1rem', 
              fontSize: '0.9rem', 
              border: '1px solid #a855f7',
              background: 'white',
              borderRadius: '12px',
              width: '100%',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
        </div>
        
        <div className="input-group-custom">
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4a0e78' }}>SISTEMA</label>
          <select 
            value={selectedSystem} 
            onChange={(e) => onSystemChange(e.target.value)}
            style={{ 
              padding: '0.75rem 1rem', 
              fontSize: '0.9rem', 
              border: '1px solid #a855f7',
              background: 'white',
              borderRadius: '12px',
              width: '100%',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)',
              color: '#4a0e78'
            }}
          >
            {systems.map(sys => (
              <option key={sys.value} value={sys.value}>
                {sys.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="input-group-custom">
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4a0e78' }}>ANCHO</label>
          <input
            type="text"
            name="ancho"
            value={formData.ancho}
            onChange={onChange}
            placeholder="ej: 91 1/2"
            style={{ 
              padding: '0.75rem 1rem', 
              fontSize: '0.9rem', 
              border: '1px solid #a855f7',
              background: 'white',
              borderRadius: '12px',
              width: '100%',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
        </div>
        
        <div className="input-group-custom">
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4a0e78' }}>ALTO</label>
          <input
            type="text"
            name="alto"
            value={formData.alto}
            onChange={onChange}
            placeholder="ej: 74 7/8"
            style={{ 
              padding: '0.75rem 1rem', 
              fontSize: '0.9rem', 
              border: '1px solid #a855f7',
              background: 'white',
              borderRadius: '12px',
              width: '100%',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
        </div>
        
        <div className="input-group-custom">
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#4a0e78' }}>
            {selectedSystem === 'puerta' ? 'TIPO PUERTA' : 'HOJAS'}
          </label>
          <select
            name="hojas"
            value={formData.hojas}
            onChange={onChange}
            style={{ 
              padding: '0.75rem 1rem', 
              fontSize: '0.9rem', 
              border: '1px solid #a855f7',
              background: 'white',
              borderRadius: '12px',
              width: '100%',
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)',
              color: '#4a0e78'
            }}
          >
            {selectedSystem === 'puerta' ? (
              <>
                <option value="1">1 HOJA (Simple)</option>
                <option value="2">2 HOJAS (Doble)</option>
              </>
            ) : (
              <>
                <option value="2">2 HOJAS</option>
                <option value="3">3 HOJAS</option>
                <option value="4">4 HOJAS</option>
              </>
            )}
          </select>
        </div>
      </div>
      
      <div className="button-bar" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end', borderTop: '1px solid #a855f7', paddingTop: '1.5rem' }}>
        <button 
          onClick={onAdd} 
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            color: '#fef3c7',
            border: 'none',
            padding: '0.75rem 1.8rem',
            borderRadius: '40px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 15px rgba(139, 92, 246, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 10px rgba(139, 92, 246, 0.3)'
          }}
        >
          ➕ AGREGAR
        </button>
        
        <button 
          onClick={onReset} 
          style={{
            background: '#fef3c7',
            border: '1px solid #a855f7',
            padding: '0.75rem 1.8rem',
            borderRadius: '40px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            color: '#4a0e78',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#e9d5ff'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#fef3c7'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          ⟲ RESET TODO
        </button>
        
        <button 
          onClick={onPrint} 
          style={{
            background: '#4a0e78',
            color: '#fef3c7',
            border: 'none',
            padding: '0.75rem 1.8rem',
            borderRadius: '40px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(74, 14, 120, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#5b21b6'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#4a0e78'
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