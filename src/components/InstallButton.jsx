import React, { useState, useEffect } from 'react'

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showButton, setShowButton] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detekte si se iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(iOS)

    // Sèlman pou navigatè ki sipòte beforeinstallprompt (Chrome, Edge, Android)
    if (!iOS) {
      const handler = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowButton(true)
      }

      window.addEventListener('beforeinstallprompt', handler)

      window.addEventListener('appinstalled', () => {
        setShowButton(false)
        setDeferredPrompt(null)
      })

      return () => {
        window.removeEventListener('beforeinstallprompt', handler)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowButton(false)
    }
    setDeferredPrompt(null)
  }

  // Pou iOS - montre mesaj esplikasyon
  if (isIOS) {
    return (
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <button
          onClick={() => alert('📱 Para instalar en iPhone:\n\n1. Toca el botón "Compartir"\n2. Selecciona "Agregar a pantalla de inicio"')}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 20px',
            fontWeight: '600',
            fontSize: '13px',
            color: '#fef3c7',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)'
            e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
            e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)'
          }}
        >
          <span>📱</span>
          INSTALAR
        </button>
      </div>
    )
  }

  if (!showButton) return null

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      <button
        onClick={handleInstallClick}
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
          border: 'none',
          borderRadius: '50px',
          padding: '10px 20px',
          fontWeight: '600',
          fontSize: '13px',
          color: '#fef3c7',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)'
          e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)'
          e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)'
        }}
      >
        <span>📲</span>
        INSTALAR
      </button>
    </div>
  )
}

export default InstallButton