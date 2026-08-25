import React, { useState } from 'react'

const COLORES = [
  'Aluminio natural',
  'Blanco',
  'Negro',
  'Bronce',
  'Champagne',
  'Gris',
  'Otro',
]

export default function ProyectoModal({ onConfirm, onCancel }) {
  const [form, setForm] = useState({
    cliente: '',
    obra: '',
    color: 'Aluminio natural',
    notas: '',
  })
  const [error, setError] = useState('')

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleConfirm = () => {
    if (!form.cliente.trim()) {
      setError('❌ El nombre del cliente es requerido')
      return
    }
    onConfirm(form)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'white', borderRadius: '16px',
          padding: '1.5rem', maxWidth: '440px', width: '100%',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-clipboard-data" style={{ color: 'var(--primary)', fontSize: '16px' }}></i>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Información del proyecto</h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--gray-500)' }}>Completa los datos antes de calcular</p>
          </div>
        </div>

        {error && (
          <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="auth-field">
            <label className="auth-label">
              Cliente <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="text" name="cliente" value={form.cliente}
              onChange={handle} className="auth-input"
              placeholder="Ej: Don Juan"
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Obra</label>
            <input
              type="text" name="obra" value={form.obra}
              onChange={handle} className="auth-input"
              placeholder="Ej: Edificio XYZ"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Color</label>
            <select name="color" value={form.color} onChange={handle} className="auth-input">
              {COLORES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="auth-field">
            <label className="auth-label">Notas</label>
            <textarea
              name="notas" value={form.notas}
              onChange={handle} className="auth-input"
              placeholder="Ej: Cierre del centro, vidrios bc. 1/4"
              rows={2}
              style={{ resize: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            onClick={onCancel}
            className="btn-outline-lg"
            style={{ flex: 1, padding: '11px' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="auth-btn"
            style={{ flex: 2 }}
          >
            <i className="bi bi-arrow-right" style={{ marginRight: '6px' }}></i>
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}