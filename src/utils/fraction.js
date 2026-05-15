const FractionUtils = {
  parseFraction(str) {
    if (!str) return 0
    str = String(str).trim()
    const mixed = str.match(/^(\d+)\s+(\d+)\/(\d+)$/)
    if (mixed) return parseInt(mixed[1]) + parseInt(mixed[2]) / parseInt(mixed[3])
    const frac = str.match(/^(\d+)\/(\d+)$/)
    if (frac) return parseInt(frac[1]) / parseInt(frac[2])
    const num = parseFloat(str)
    return isNaN(num) ? 0 : num
  },

  toSixteenths(dec) {
    if (dec < 0) return 'ERROR'
    const totalSixteenths = Math.round(dec * 16)
    const wholeInches = Math.floor(totalSixteenths / 16)
    const rem = totalSixteenths % 16
    if (rem === 0) return `${wholeInches}"`
    let num = rem, den = 16
    const g = this.gcd(num, den)
    num /= g; den /= g
    return `${wholeInches} ${num}/${den}"`
  },

  gcd(a, b) {
    return b === 0 ? a : this.gcd(b, a % b)
  }
}

export default FractionUtils
