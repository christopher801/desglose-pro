// ============================================================
// FILE 1: usageService.js
// ============================================================

import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

const DAILY_LIMIT = 5

/**
 * Retounen dat lokal República Dominicana nan fòma:
 * YYYY-MM-DD
 */
const today = () => {
  const now = new Date()

  const rdDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santo_Domingo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)

  return rdDate
}

/**
 * Retounen lè pwochen reset la.
 *
 * Reset la fèt chak jou a 00:00
 * nan timezone República Dominicana.
 */
export const getNextResetTime = () => {
  const now = new Date()

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santo_Domingo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)

  const year = Number(parts.find(p => p.type === 'year')?.value)
  const month = Number(parts.find(p => p.type === 'month')?.value)
  const day = Number(parts.find(p => p.type === 'day')?.value)

  // Kreye pwochen jou a a 00:00 RD
  const nextDay = new Date(
    Date.UTC(year, month - 1, day + 1, 4, 0, 0)
  )

  return nextDay
}

/**
 * Retounen kantite tan ki rete anvan reset.
 *
 * Egzanp:
 * "10h 32m"
 * "45m"
 * "1h"
 */
export const getTimeUntilReset = () => {
  const now = new Date()
  const nextReset = getNextResetTime()

  const difference = Math.max(
    0,
    nextReset.getTime() - now.getTime()
  )

  const totalMinutes = Math.floor(
    difference / 1000 / 60
  )

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`
  }

  return `${minutes}m`
}

/**
 * Retounen lè pwochen reset la nan fòma:
 *
 * "00:00"
 */
export const getResetTimeFormatted = () => {
  return '00:00'
}

/**
 * Verifye si user ka itilize yon despiece.
 *
 * Si fullAccess:
 * - toujou true
 * - pa modifye dailyUsage
 *
 * Si user la poko rive nan limit:
 * - ajoute +1
 *
 * Si li rive nan DAILY_LIMIT:
 * - retounen false
 */
export const checkAndIncrementUsage = async (
  uid,
  fullAccess
) => {
  if (!uid) return true

  // Full Access = ilimitado
  if (fullAccess) return true

  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)

    const data = snap.data() || {}

    const usage = data.dailyUsage || {
      date: '',
      count: 0,
    }

    const todayStr = today()

    // Nouvo jounen
    if (usage.date !== todayStr) {
      await updateDoc(ref, {
        dailyUsage: {
          date: todayStr,
          count: 1,
        },
      })

      return true
    }

    // Limit la rive
    if (usage.count >= DAILY_LIMIT) {
      return false
    }

    // Ajoute yon itilizasyon
    await updateDoc(ref, {
      'dailyUsage.count': usage.count + 1,
    })

    return true
  } catch (err) {
    console.error('usageService error:', err)

    // Si Firestore gen pwoblèm,
    // pa bloke itilizatè a.
    return true
  }
}

/**
 * Retounen kantite itilizasyon ki rete jodi a.
 *
 * Egzanp:
 * 5 → 5 ki rete
 * 2 → 2 ki rete
 * 0 → limit rive
 */
export const getRemainingUsage = async (
  uid,
  fullAccess
) => {
  if (!uid || fullAccess) {
    return Infinity
  }

  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)

    const usage = snap.data()?.dailyUsage || {
      date: '',
      count: 0,
    }

    const todayStr = today()

    // Nouvo jounen
    if (usage.date !== todayStr) {
      return DAILY_LIMIT
    }

    return Math.max(
      0,
      DAILY_LIMIT - usage.count
    )
  } catch (err) {
    console.error(
      'getRemainingUsage error:',
      err
    )

    return DAILY_LIMIT
  }
}

/**
 * Retounen limit total chak jou.
 */
export const getDailyLimit = () => {
  return DAILY_LIMIT
}
