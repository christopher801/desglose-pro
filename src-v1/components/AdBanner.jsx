// src/components/AdBanner.jsx
import React, { useEffect } from 'react'

const AdBanner = ({ adSlot, adFormat = 'auto', adLayout = '', fullWidth = true }) => {
  useEffect(() => {
    try {
      // Re-enstalè adsbygoogle lè konpozan an monte
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  return (
    <div className="ad-container" style={{ 
      minHeight: '90px',
      margin: '1rem 0',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5681377933979422" // Mete ID ou la
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-full-width-responsive={fullWidth}
      ></ins>
    </div>
  )
}

export default AdBanner