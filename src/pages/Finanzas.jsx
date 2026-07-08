import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useFinance, CATEGORIAS } from '../context/FinanceContext'
import GeneratePDF from '../components/GeneratePDF'  // 👈 Usaremos el nuevo componente

export default function Finanzas() {
  const {
    movimientos,
    cargando,
    agregarMovimiento,
    eliminarMovimiento,
    totalIngresos,
    totalGastos,
    balance,
    filtrarMovimientos
  } = useFinance()

  // Estado del formulario
  const [form, setForm] = useState({
    tipo: 'gasto',
    descripcion: '',
    monto: '',
    categoria: 'Otros',
    fecha: new Date().toISOString().split('T')[0]
  })

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [movimientosFiltrados, setMovimientosFiltrados] = useState([])
  const [guardando, setGuardando] = useState(false)

  // Actualizar lista filtrada
  useEffect(() => {
    const filtrados = filtrarMovimientos({
      tipo: filtroTipo,
      busqueda: busqueda
    })
    setMovimientosFiltrados(filtrados)
  }, [movimientos, filtroTipo, busqueda, filtrarMovimientos])

  // Manejar cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.descripcion.trim() || !form.monto || parseFloat(form.monto) <= 0) {
      alert('Por favor, completa todos los campos correctamente.')
      return
    }
    setGuardando(true)
    try {
      await agregarMovimiento({
        tipo: form.tipo,
        descripcion: form.descripcion.trim(),
        monto: parseFloat(form.monto),
        categoria: form.categoria,
        fecha: form.fecha
      })
      // Resetear formulario
      setForm(prev => ({
        ...prev,
        descripcion: '',
        monto: '',
        categoria: 'Otros'
      }))
    } catch (error) {
      alert('Error al guardar: ' + error.message)
    } finally {
      setGuardando(false)
    }
  }

  // Eliminar
  const handleEliminar = async (id, descripcion) => {
    if (!window.confirm(`¿Eliminar el movimiento "${descripcion}"?`)) return
    try {
      await eliminarMovimiento(id)
    } catch (error) {
      alert('Error al eliminar: ' + error.message)
    }
  }

  // Limpiar filtros
  const handleLimpiarFiltros = () => {
    setFiltroTipo('todos')
    setBusqueda('')
  }

  // Calcular totales filtrados
  const totalFiltradoIngresos = movimientosFiltrados
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + m.monto, 0)
  const totalFiltradoGastos = movimientosFiltrados
    .filter(m => m.tipo === 'gasto')
    .reduce((acc, m) => acc + m.monto, 0)
  const balanceFiltrado = totalFiltradoIngresos - totalFiltradoGastos

  if (cargando) {
    return (
      <Layout>
        <div className="page-content">
          <div className="loading-state">Cargando movimientos...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-content">

        <h1 className="page-title">💰 Control de Finanzas</h1>

        {/* Tarjetas de resumen */}
        <div className="dashboard-stats mb-4">
          <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div className="stat-card-title">Ingresos</div>
            <div className="stat-card-value" style={{ color: 'var(--success)' }}>
              ${totalIngresos.toLocaleString('es-CL')}
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
            <div className="stat-card-title">Gastos</div>
            <div className="stat-card-value" style={{ color: 'var(--danger)' }}>
              ${totalGastos.toLocaleString('es-CL')}
            </div>
          </div>
          <div className="stat-card" style={{
            borderLeft: `4px solid ${balance >= 0 ? 'var(--success)' : 'var(--danger)'}`
          }}>
            <div className="stat-card-title">Balance</div>
            <div className="stat-card-value" style={{
              color: balance >= 0 ? 'var(--success)' : 'var(--danger)'
            }}>
              ${balance.toLocaleString('es-CL')}
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="card-modern mb-4">
          <h3 className="section-title">Agregar movimiento</h3>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-grid-4">
              <div className="auth-field">
                <label className="auth-label">Tipo</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="auth-input"
                  required
                >
                  <option value="ingreso">💰 Ingreso</option>
                  <option value="gasto">💸 Gasto</option>
                </select>
              </div>
              <div className="auth-field">
                <label className="auth-label">Categoría</label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className="auth-input"
                  required
                >
                  {CATEGORIAS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="auth-field">
                <label className="auth-label">Monto ($)</label>
                <input
                  type="number"
                  name="monto"
                  value={form.monto}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="0"
                  min="0"
                  step="100"
                  required
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                className="auth-input"
                placeholder="Ej: Pago de sueldos"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary-sm" disabled={guardando}>
                {guardando ? 'Guardando...' : '+ Agregar movimiento'}
              </button>
            </div>
          </form>
        </div>

        {/* Filtros y tabla */}
        <div className="card-modern">
          <div className="admin-header">
            <h3 className="section-title" style={{ marginBottom: 0 }}>Historial</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* 👇 Usamos el nuevo componente GeneratePDF */}
              <GeneratePDF 
                movimientos={movimientosFiltrados}
                totalIngresos={totalFiltradoIngresos}
                totalGastos={totalFiltradoGastos}
                balance={balanceFiltrado}
              />
              <button
                onClick={handleLimpiarFiltros}
                className="btn-secondary-sm"
              >
                ↻ Limpiar
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="form-grid-3 mb-3">
            <div className="auth-field">
              <label className="auth-label">Filtrar por tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="auth-input"
              >
                <option value="todos">Todos</option>
                <option value="ingreso">💰 Ingresos</option>
                <option value="gasto">💸 Gastos</option>
              </select>
            </div>
            <div className="auth-field">
              <label className="auth-label">Buscar</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="auth-input"
                placeholder="Descripción o categoría..."
              />
            </div>
            <div className="auth-field" style={{ justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '13px', color: 'var(--gray-500)', marginTop: '8px' }}>
                {movimientosFiltrados.length} movimientos
                {movimientosFiltrados.length > 0 && (
                  <span style={{ marginLeft: '12px', fontWeight: 500 }}>
                    Balance: ${balanceFiltrado.toLocaleString('es-CL')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabla */}
          {movimientosFiltrados.length === 0 ? (
            <div className="empty-state">
              {movimientos.length === 0
                ? 'No hay movimientos registrados. ¡Agrega tu primero!'
                : 'No hay movimientos con estos filtros.'}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th style={{ textAlign: 'right' }}>Monto</th>
                    <th style={{ textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosFiltrados.map(m => (
                    <tr key={m.id}>
                      <td className="td-date">
                        {new Date(m.fecha + 'T00:00:00').toLocaleDateString('es-CL')}
                      </td>
                      <td>
                        <span className={`badge ${m.tipo === 'ingreso' ? 'badge-active' : 'badge-inactive'}`}>
                          {m.tipo === 'ingreso' ? '💰 Ingreso' : '💸 Gasto'}
                        </span>
                      </td>
                      <td>{m.categoria}</td>
                      <td>{m.descripcion}</td>
                      <td style={{
                        textAlign: 'right',
                        fontWeight: 600,
                        color: m.tipo === 'ingreso' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        ${m.monto.toLocaleString('es-CL')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleEliminar(m.id, m.descripcion)}
                          className="btn-danger-sm"
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}