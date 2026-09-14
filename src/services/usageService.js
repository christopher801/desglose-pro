// ============================================================
// FILE: usageService.js
// ============================================================

import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

const DAILY_LIMIT = 5

/**
 * Retounen dat lokal República Dominicana nan fòma:
 *
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

  const year = Number(
    parts.find((p) => p.type === 'year')?.value
  )

  const month = Number(
    parts.find((p) => p.type === 'month')?.value
  )

  const day = Number(
    parts.find((p) => p.type === 'day')?.value
  )

  // Pwochen jou a 00:00 RD
  const nextDay = new Date(
    Date.UTC(
      year,
      month - 1,
      day + 1,
      4,
      0,
      0
    )
  )

  return nextDay
}

/**
 * Retounen kantite tan ki rete anvan reset.
 *
 * Egzanp:
 *
 * "10h 32m"
 * "45m"
 * "1h 00m"
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

  const hours = Math.floor(
    totalMinutes / 60
  )

  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(
      2,
      '0'
    )}m`
  }

  return `${minutes}m`
}

/**
 * Retounen lè pwochen reset la.
 *
 * Fòma:
 *
 * "00:00"
 */
export const getResetTimeFormatted = () => {
  return '00:00'
}

/**
 * Verifye si user ka itilize yon despiece.
 *
 * ADMIN:
 * - Pa gen Daily Limit
 * - Pa modifye dailyUsage
 *
 * FULL ACCESS:
 * - Pa gen Daily Limit
 * - Pa modifye dailyUsage
 *
 * USER NORMAL:
 * - Maksimòm 5 itilizasyon pa jou
 * - Chak itilizasyon ajoute +1
 *
 * Retounen:
 *
 * true  → itilizasyon otorize
 * false → limit la rive
 */
export const checkAndIncrementUsage = async (
  uid,
  fullAccess
) => {
  if (!uid) {
    return true
  }

  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)

    /**
     * Si user document lan pa egziste,
     * nou pa bloke itilizatè a.
     */
    if (!snap.exists()) {
      return true
    }

    const data = snap.data() || {}

    /**
     * ADMIN + FULL ACCESS = ILIMITADO
     *
     * Nou verifye tou:
     *
     * data.role
     * fullAccess
     * data.fullAccess
     */
    if (
      data.role === 'admin' ||
      fullAccess === true ||
      data.fullAccess === true
    ) {
      return true
    }

    const usage = data.dailyUsage || {
      date: '',
      count: 0,
    }

    const todayStr = today()

    /**
     * NOUVO JOUNEN
     *
     * Reset count la epi konte itilizasyon aktyèl la
     * kòm premye itilizasyon jounen an.
     */
    if (usage.date !== todayStr) {
      await updateDoc(ref, {
        dailyUsage: {
          date: todayStr,
          count: 1,
        },
      })

      return true
    }

    /**
     * LIMIT LA RIVE
     */
    if (usage.count >= DAILY_LIMIT) {
      return false
    }

    /**
     * AJOUTE YON ITILIZASYON
     */
    await updateDoc(ref, {
      'dailyUsage.count': usage.count + 1,
    })

    return true

  } catch (err) {
    console.error(
      'usageService error:',
      err
    )

    /**
     * Si Firestore gen yon erè,
     * pa bloke itilizatè a.
     */
    return true
  }
}

/**
 * Retounen kantite itilizasyon ki rete jodi a.
 *
 * ADMIN:
 * Infinity
 *
 * FULL ACCESS:
 * Infinity
 *
 * USER NORMAL:
 * 0 - 5
 */
export const getRemainingUsage = async (
  uid,
  fullAccess
) => {
  if (!uid) {
    return Infinity
  }

  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)

    if (!snap.exists()) {
      return DAILY_LIMIT
    }

    const data = snap.data() || {}

    /**
     * ADMIN + FULL ACCESS = ILIMITADO
     */
    if (
      data.role === 'admin' ||
      fullAccess === true ||
      data.fullAccess === true
    ) {
      return Infinity
    }

    const usage = data.dailyUsage || {
      date: '',
      count: 0,
    }

    const todayStr = today()

    /**
     * NOUVO JOUNEN
     *
     * User la gen tout 5 itilizasyon li yo.
     */
    if (usage.date !== todayStr) {
      return DAILY_LIMIT
    }

    /**
     * RETOUNEN SA KI RETE
     */
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