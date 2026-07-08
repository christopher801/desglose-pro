import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './AuthContext'
import { 
  suscribirMovimientos,
  agregarMovimiento,
  eliminarMovimiento,
  editarMovimiento,
  cargarMovimientos
} from '../services/finanzas'

// Categorías predefinidas
export const CATEGORIAS = [
  'Aluminios',
  'Vidrios',
  'Tornillos',
  'Accesorios',
  'Masillas',
  'Gomas',
  'Puertas',
  'Transporte',
  'Pagos en efectivo',
  'Pagos por transferencias',
  'Pagos con Cheque',
  'Otros'
]

const FinanceContext = createContext()

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth() // Asumiendo que tu AuthContext tiene 'user' con uid
  const [movimientos, setMovimientos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const unsubscribeRef = useRef(null)

  // Suscribirse a cambios en tiempo real cuando el usuario cambia
  useEffect(() => {
    // Limpiar suscripción anterior
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    if (!user?.uid) {
      setMovimientos([])
      setCargando(false)
      return
    }

    setCargando(true)
    setError(null)

    // Crear suscripción en tiempo real
    const unsubscribe = suscribirMovimientos(user.uid, (result) => {
      if (result.success) {
        setMovimientos(result.data)
        setError(null)
      } else {
        setError(result.error)
        // Si falla la suscripción, intentar carga única
        cargarMovimientos(user.uid).then(res => {
          if (res.success) {
            setMovimientos(res.data)
          }
        })
      }
      setCargando(false)
    })

    unsubscribeRef.current = unsubscribe

    // Cleanup al desmontar o cambiar usuario
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user?.uid])

  // --- AGREGAR ---
  const agregarMovimientoHandler = useCallback(async (nuevo) => {
    if (!user?.uid) {
      throw new Error('Usuario no autenticado')
    }
    const resultado = await agregarMovimiento(user.uid, nuevo)
    if (!resultado.success) {
      throw new Error(resultado.error)
    }
    return resultado
  }, [user?.uid])

  // --- ELIMINAR ---
  const eliminarMovimientoHandler = useCallback(async (id) => {
    if (!user?.uid) {
      throw new Error('Usuario no autenticado')
    }
    const resultado = await eliminarMovimiento(user.uid, id)
    if (!resultado.success) {
      throw new Error(resultado.error)
    }
    return resultado
  }, [user?.uid])

  // --- EDITAR ---
  const editarMovimientoHandler = useCallback(async (id, datos) => {
    if (!user?.uid) {
      throw new Error('Usuario no autenticado')
    }
    const resultado = await editarMovimiento(user.uid, id, datos)
    if (!resultado.success) {
      throw new Error(resultado.error)
    }
    return resultado
  }, [user?.uid])

  // --- CÁLCULOS ---
  const totalIngresos = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((acc, m) => acc + m.monto, 0)

  const totalGastos = movimientos
    .filter(m => m.tipo === 'gasto')
    .reduce((acc, m) => acc + m.monto, 0)

  const balance = totalIngresos - totalGastos

  // --- FILTRAR ---
  const filtrarMovimientos = useCallback(({ tipo = 'todos', busqueda = '' }) => {
    let filtrados = movimientos
    if (tipo !== 'todos') {
      filtrados = filtrados.filter(m => m.tipo === tipo)
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim()
      filtrados = filtrados.filter(m =>
        m.descripcion?.toLowerCase().includes(q) ||
        m.categoria?.toLowerCase().includes(q)
      )
    }
    return filtrados
  }, [movimientos])

  const value = {
    movimientos,
    cargando,
    error,
    agregarMovimiento: agregarMovimientoHandler,
    eliminarMovimiento: eliminarMovimientoHandler,
    editarMovimiento: editarMovimientoHandler,
    totalIngresos,
    totalGastos,
    balance,
    filtrarMovimientos,
    // Extra: recargar manualmente (opcional)
    recargar: () => {
      if (unsubscribeRef.current) {
        // La suscripción ya está activa, pero podemos forzar carga
        setCargando(true)
        cargarMovimientos(user?.uid).then(res => {
          if (res.success) {
            setMovimientos(res.data)
          }
          setCargando(false)
        })
      }
    }
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance debe usarse dentro de FinanceProvider')
  }
  return context
}