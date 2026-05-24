import React, { useState, useEffect } from 'react'

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showButton, setShowButton] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSHint, setShowIOSHint] = useState(false)

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(iOS)

    // Sèlman montre sou mobil
    const isMobile = window.innerWidth <= 768
    if (!isMobile) return

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
      return () => window.removeEventListener('beforeinstallprompt', handler)
    } else {
      // iOS: montre bouton sèlman si pa deja enstale
      const isStandalone = window.navigator.standalone
      if (!isStandalone) setShowButton(true)
    }
  }, [])

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSHint(true)
      return
    }
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowButton(false)
    setDeferredPrompt(null)
  }

  if (!showButton) return null

  return (
    <>
      {/* Bouton enstale — posizyone anlè bottom-nav sou mobil */}
      <button className="install-btn" onClick={handleInstallClick}>
        <span>{isIOS ? '📱' : '📲'}</span>
        Instalar app
      </button>

      {/* Hint pou iOS */}
      {showIOSHint && (
        <div className="ios-hint-overlay" onClick={() => setShowIOSHint(false)}>
          <div className="ios-hint-card" onClick={e => e.stopPropagation()}>
            <div className="ios-hint-title">Instalar en iPhone / iPad</div>
            <div className="ios-hint-steps">
              <div className="ios-hint-step">
                <span className="ios-hint-num">1</span>
                <span>Toca el botón <strong>Compartir</strong> en Safari</span>
              </div>
              <div className="ios-hint-step">
                <span className="ios-hint-num">2</span>
                <span>Selecciona <strong>"Agregar a pantalla de inicio"</strong></span>
              </div>
              <div className="ios-hint-step">
                <span className="ios-hint-num">3</span>
                <span>Toca <strong>Agregar</strong> para confirmar</span>
              </div>
            </div>
            <button
              className="ios-hint-close"
              onClick={() => setShowIOSHint(false)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default InstallButton