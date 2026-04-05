import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Koute evenman beforeinstallprompt
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowButton(true)
      console.log('Install prompt available')
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Tcheke si aplikasyon an deja enstale
    window.addEventListener('appinstalled', () => {
      setShowButton(false)
      setDeferredPrompt(null)
      console.log('App was installed')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response: ${outcome}`)

    if (outcome === 'accepted') {
      setShowButton(false)
    }
    setDeferredPrompt(null)
  }

  if (!showButton) return null

  return (
    <Button
      variant="success"
      size="sm"
      onClick={handleInstallClick}
      className="ms-2"
      style={{
        background: '#28a745',
        border: 'none',
        borderRadius: '50px',
        padding: '0.5rem 1rem',
        fontWeight: '600',
        fontSize: '0.8rem',
        boxShadow: '4px 4px 8px #d9dde2, -4px -4px 8px #ffffff'
      }}
    >
      📲 INSTALL APP
    </Button>
  )
}

export default InstallButton