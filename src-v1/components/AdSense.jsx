// src/components/AdSense.jsx
import React, { useEffect } from 'react'

const AdSense = () => {
  useEffect(() => {
    // Ajoute script AdSense nan head
    const script = document.createElement('script')
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5681377933979422'
    script.async = true
    script.crossOrigin = 'anonymous'
    document.head.appendChild(script)

    return () => {
      // Opsyonèl: retire script lè konpozan an demonte
      // document.head.removeChild(script)
    }
  }, [])

  return null
}

export default AdSense