// utils/deviceDetector.js

const DeviceDetector = {
  // Detekte si se mobil
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  // Detekte si se iOS (iPhone, iPad, iPod)
  isIOS: () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  },

  // Detekte si se Android
  isAndroid: () => {
    return /Android/i.test(navigator.userAgent)
  },

  // Detekte si se Windows
  isWindows: () => {
    return /Windows/i.test(navigator.userAgent)
  },

  // Detekte si se macOS
  isMacOS: () => {
    return /Macintosh|Mac OS X/i.test(navigator.userAgent) && !this.isIOS()
  },

  // Detekte si se Linux
  isLinux: () => {
    return /Linux/i.test(navigator.userAgent) && !this.isAndroid()
  },

  // Detekte navigatè a
  getBrowser: () => {
    const ua = navigator.userAgent
    if (/Chrome/i.test(ua) && !/Edge|Edg/i.test(ua)) return 'Chrome'
    if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari'
    if (/Firefox/i.test(ua)) return 'Firefox'
    if (/Edge|Edg/i.test(ua)) return 'Edge'
    if (/Opera|OPR/i.test(ua)) return 'Opera'
    return 'Unknown'
  },

  // Detekte si PWA sipòte
  supportsPWA: () => {
    const browser = this.getBrowser()
    const isIOS = this.isIOS()
    
    // Chrome, Edge, Brave sou desktop ak Android
    if (browser === 'Chrome' || browser === 'Edge') return true
    // Safari sou iOS (instalasyon manyèl)
    if (isIOS && browser === 'Safari') return 'manual'
    // Firefox pa sipòte
    if (browser === 'Firefox') return false
    
    return false
  },

  // Detekte si beforeinstallprompt disponib
  supportsAutoInstall: () => {
    const browser = this.getBrowser()
    const isIOS = this.isIOS()
    
    // Chrome, Edge sou Windows, macOS, Linux, Android
    if ((browser === 'Chrome' || browser === 'Edge') && !isIOS) return true
    
    return false
  },

  // Jwenn non device a
  getDeviceName: () => {
    if (this.isIOS()) return 'iPhone/iPad'
    if (this.isAndroid()) return 'Android'
    if (this.isWindows()) return 'Windows'
    if (this.isMacOS()) return 'Mac'
    if (this.isLinux()) return 'Linux'
    return 'Desktop'
  },

  // Jwenn icon pou device a
  getDeviceIcon: () => {
    if (this.isIOS()) return '📱'
    if (this.isAndroid()) return '📱'
    if (this.isWindows()) return '💻'
    if (this.isMacOS()) return '🍎'
    if (this.isLinux()) return '🐧'
    return '💻'
  }
}

export default DeviceDetector