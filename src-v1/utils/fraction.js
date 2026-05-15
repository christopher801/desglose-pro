const FractionUtils = {
  parseFraction(input) {
    if (typeof input === 'number') return input
    if (!input || input.trim() === '') return 0
    
    const str = input.trim()
    
    if (str.includes('/') && !str.includes(' ')) {
      const [num, den] = str.split('/').map(Number)
      return num / den
    }
    
    const parts = str.split(' ')
    let total = 0
    
    for (const part of parts) {
      if (part.includes('/')) {
        const [num, den] = part.split('/').map(Number)
        total += num / den
      } else {
        total += parseFloat(part) || 0
      }
    }
    
    return total
  },
  
  toSixteenths(decimal) {
    const rounded = Math.round(decimal * 16) / 16
    const whole = Math.floor(rounded)
    const fraction = rounded - whole
    
    if (Math.abs(fraction) < 0.001) return `${whole}`
    
    const numerator = Math.round(fraction * 16)
    
    if (numerator === 16) return `${whole + 1}`
    if (whole === 0) return `${numerator}/16`
    
    return `${whole} ${numerator}/16`
  }
}

export default FractionUtils