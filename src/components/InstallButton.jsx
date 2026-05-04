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
            background: '#1e3b5c',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 20px',
            fontWeight: '600',
            fontSize: '13px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
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
          background: '#1e3b5c',
          border: 'none',
          borderRadius: '50px',
          padding: '10px 20px',
          fontWeight: '600',
          fontSize: '13px',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>📲</span>
        INSTALAR
      </button>
    </div>
  )
}

export default InstallButton