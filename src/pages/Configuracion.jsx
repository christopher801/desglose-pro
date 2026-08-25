import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

// ===== CONSTANTES =====
const UNIDADES = [
  { value: 'in', label: 'Pulgadas (in)' },
  { value: 'mm', label: 'Milímetros (mm)' },
  { value: 'cm', label: 'Centímetros (cm)' },
]

const DECIMALES = [
  { value: '2', label: '2 decimales (0.00)' },
  { value: '3', label: '3 decimales (0.000)' },
  { value: '4', label: '4 decimales (0.0000)' },
]

const FRACCIONES = [
  { value: '16', label: '1/16"' },
  { value: '8', label: '1/8"' },
  { value: '32', label: '1/32"' },
]

// ===== VALORES PREDETERMINADOS =====
const DEFAULTS = {
  unidad: 'in',
  decimales: '2',
  fraccion: '16',
}

const STORAGE_KEY = 'dp_configuracion'

// ===== CARGAR CONFIGURACIÓN =====
const loadConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    return raw
      ? { ...DEFAULTS, ...JSON.parse(raw) }
      : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

// ===== GUARDAR CONFIGURACIÓN =====
const saveConfig = (cfg) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
  } catch {}
}

// ===== COMPONENTES AUXILIARES =====
const SectionTitle = ({ icon, title }) => (
  <h3
    className="info-card-title"
    style={{ marginBottom: '0' }}
  >
    <i
      className={`bi ${icon}`}
      style={{
        marginRight: '7px',
        color: 'var(--primary)',
      }}
    ></i>

    {title}
  </h3>
)

const ConfigRow = ({ label, desc, children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid var(--gray-100)',
      gap: '1rem',
    }}
  >
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--gray-800)',
        }}
      >
        {label}
      </div>

      {desc && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--gray-500)',
            marginTop: '2px',
          }}
        >
          {desc}
        </div>
      )}
    </div>

    <div style={{ flexShrink: 0 }}>
      {children}
    </div>
  </div>
)

const SelectInput = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="auth-input"
    style={{
      width: 'auto',
      minWidth: '160px',
      padding: '7px 10px',
      fontSize: '13px',
    }}
  >
    {options.map((option) => (
      <option
        key={option.value}
        value={option.value}
      >
        {option.label}
      </option>
    ))}
  </select>
)

// ===== PÁGINA PRINCIPAL =====
export default function ConfiguracionPage() {
  const { userData } = useAuth()

  const [cfg, setCfg] = useState(loadConfig)

  const [saved, setSaved] = useState(false)

  const [showClearModal, setShowClearModal] = useState(false)

  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [newPassword, setNewPassword] = useState('')

  const [confirmPassword, setConfirmPassword] = useState('')

  const [passwordMsg, setPasswordMsg] = useState('')

  // ===== ACTUALIZAR CONFIGURACIÓN =====
  const set = (key) => (value) => {
    setCfg((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // ===== GUARDAR =====
  const handleSave = () => {
    saveConfig(cfg)

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  // ===== RESTABLECER CONFIGURACIÓN =====
  const handleClearCache = () => {
    localStorage.removeItem(STORAGE_KEY)

    setCfg({
      ...DEFAULTS,
    })

    setShowClearModal(false)
  }

  // ===== EXPORTAR DATOS =====
  const handleExportData = () => {
    const data = {
      usuario: {
        nombre: userData?.nombre,
        email: userData?.email,
      },

      configuracion: cfg,

      exportadoEn: new Date().toISOString(),
    }

    const blob = new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        ),
      ],
      {
        type: 'application/json',
      }
    )

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url

    a.download = `desglose-pro-datos-${userData?.email || 'usuario'}.json`

    document.body.appendChild(a)

    a.click()

    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  }

  // ===== CAMBIAR CONTRASEÑA =====
  const handleChangePassword = async () => {
    setPasswordMsg('')

    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg('❌ Mínimo 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg('❌ Las contraseñas no coinciden')
      return
    }

    try {
      const { updatePassword } = await import('firebase/auth')

      const { auth } = await import(
        '../services/firebase'
      )

      await updatePassword(
        auth.currentUser,
        newPassword
      )

      setPasswordMsg(
        '✅ Contraseña actualizada'
      )

      setNewPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordMsg('')
      }, 2000)
    } catch (err) {
      if (
        err.code ===
        'auth/requires-recent-login'
      ) {
        setPasswordMsg(
          '❌ Debes iniciar sesión de nuevo para cambiar la contraseña'
        )
      } else {
        setPasswordMsg(
          '❌ Error al actualizar contraseña'
        )
      }
    }
  }

  return (
    <Layout>
      <div className="page-content">

        {/* ===== HEADER ===== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}
        >
          <h1
            className="page-title"
            style={{ margin: 0 }}
          >
            Configuración
          </h1>

          <button
            className="btn-primary-sm"
            onClick={handleSave}
          >
            <i
              className="bi bi-check2"
              style={{
                marginRight: '6px',
              }}
            ></i>

            {saved
              ? 'Guardado ✓'
              : 'Guardar'}
          </button>
        </div>

        {/* ===== CÁLCULO ===== */}
        <div className="card-modern mb-4">

          <SectionTitle
            icon="bi-calculator"
            title="Preferencias de cálculo"
          />

          <ConfigRow
            label="Unidad de medida"
            desc="Unidad por defecto en todos los sistemas"
          >
            <SelectInput
              value={cfg.unidad}
              onChange={set('unidad')}
              options={UNIDADES}
            />
          </ConfigRow>

          <ConfigRow
            label="Decimales"
            desc="Precisión en resultados numéricos"
          >
            <SelectInput
              value={cfg.decimales}
              onChange={set('decimales')}
              options={DECIMALES}
            />
          </ConfigRow>

          <ConfigRow
            label="Fracción"
            desc="Denominador de fracciones imperiales"
          >
            <SelectInput
              value={cfg.fraccion}
              onChange={set('fraccion')}
              options={FRACCIONES}
            />
          </ConfigRow>

        </div>

        {/* ===== SEGURIDAD ===== */}
        <div className="card-modern mb-4">

          <SectionTitle
            icon="bi-shield-lock"
            title="Seguridad"
          />

          <ConfigRow
            label="Cambiar contraseña"
            desc="Actualiza tu contraseña de acceso"
          >
            <button
              className="btn-secondary-sm"
              onClick={() =>
                setShowPasswordModal(true)
              }
            >
              <i
                className="bi bi-key"
                style={{
                  marginRight: '5px',
                }}
              ></i>

              Cambiar
            </button>
          </ConfigRow>

          <ConfigRow
            label="Sesión activa"
            desc="Dispositivo y navegador actual"
          >
            <span
              style={{
                fontSize: '12px',
                color: 'var(--gray-500)',
                textAlign: 'right',
              }}
            >
              {navigator.userAgent.includes(
                'Mobile'
              )
                ? '📱 Móvil'
                : '💻 Escritorio'}
            </span>
          </ConfigRow>

        </div>

        {/* ===== DATOS ===== */}
        <div className="card-modern mb-4">

          <SectionTitle
            icon="bi-database"
            title="Datos"
          />

          <ConfigRow
            label="Exportar mis datos"
            desc="Descarga un archivo JSON con tu configuración"
          >
            <button
              className="btn-secondary-sm"
              onClick={handleExportData}
            >
              <i
                className="bi bi-download"
                style={{
                  marginRight: '5px',
                }}
              ></i>

              Exportar
            </button>
          </ConfigRow>

          <ConfigRow
            label="Limpiar configuración"
            desc="Restablecer todas las preferencias al valor predeterminado"
          >
            <button
              onClick={() =>
                setShowClearModal(true)
              }
              style={{
                padding: '7px 14px',
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              <i
                className="bi bi-arrow-counterclockwise"
                style={{
                  marginRight: '5px',
                }}
              ></i>

              Restablecer
            </button>
          </ConfigRow>

        </div>

      </div>

      {/* ===== MODAL CAMBIAR CONTRASEÑA ===== */}
      {showPasswordModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => {
            setShowPasswordModal(false)
            setPasswordMsg('')
            setNewPassword('')
            setConfirmPassword('')
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '360px',
              width: '100%',
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 700,
                }}
              >
                Cambiar contraseña
              </h3>

              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordMsg('')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  color: 'var(--gray-500)',
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {passwordMsg && (
              <div
                className={
                  passwordMsg.startsWith('✅')
                    ? 'alert-info'
                    : 'auth-error'
                }
                style={{
                  marginBottom: '1rem',
                }}
              >
                {passwordMsg}
              </div>
            )}

            <div
              className="auth-field"
              style={{
                marginBottom: '0.75rem',
              }}
            >
              <label className="auth-label">
                Nueva contraseña
              </label>

              <input
                type="password"
                className="auth-input"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
              />
            </div>

            <div
              className="auth-field"
              style={{
                marginBottom: '1.25rem',
              }}
            >
              <label className="auth-label">
                Confirmar contraseña
              </label>

              <input
                type="password"
                className="auth-input"
                placeholder="Repite la contraseña"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="auth-btn"
              onClick={handleChangePassword}
            >
              Actualizar contraseña
            </button>

          </div>
        </div>
      )}

      {/* ===== MODAL LIMPIAR CONFIGURACIÓN ===== */}
      {showClearModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() =>
            setShowClearModal(false)
          }
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              maxWidth: '340px',
              width: '100%',
              textAlign: 'center',
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <i
                className="bi bi-arrow-counterclockwise"
                style={{
                  fontSize: '1.4rem',
                  color: '#f59e0b',
                }}
              ></i>
            </div>

            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              ¿Restablecer configuración?
            </h3>

            <p
              style={{
                fontSize: '13px',
                color: 'var(--gray-500)',
                marginBottom: '1.5rem',
                lineHeight: 1.6,
              }}
            >
              Todas tus preferencias volverán
              a los valores predeterminados.
              Esta acción no se puede deshacer.
            </p>

            <button
              onClick={handleClearCache}
              style={{
                width: '100%',
                padding: '11px',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '0.75rem',
              }}
            >
              Sí, restablecer
            </button>

            <button
              onClick={() =>
                setShowClearModal(false)
              }
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border:
                  '1px solid var(--gray-300)',
                borderRadius: '10px',
                fontSize: '13px',
                color: 'var(--gray-600)',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>

          </div>
        </div>
      )}

    </Layout>
  )
}