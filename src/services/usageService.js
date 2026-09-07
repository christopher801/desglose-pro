import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

const DAILY_LIMIT = 5

const today = () => new Date().toISOString().slice(0, 10)

/**
 * Verifye si user ka itilize — si wi, inkremante kont lan.
 * Si fullAccess → toujou true, pa inkremante.
 * Retounen true si okè, false si limit rive.
 */
export const checkAndIncrementUsage = async (uid, fullAccess) => {
  if (!uid) return true
  if (fullAccess) return true

  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    const data = snap.data() || {}
    const usage = data.dailyUsage || { date: '', count: 0 }
    const todayStr = today()

    if (usage.date !== todayStr) {
      // Nouvo jounen — reset ak count 1
      await updateDoc(ref, {
        dailyUsage: { date: todayStr, count: 1 }
      })
      return true
    }

    if (usage.count >= DAILY_LIMIT) {
      return false
    }

    await updateDoc(ref, {
      'dailyUsage.count': usage.count + 1
    })
    return true

  } catch (err) {
    console.error('usageService error:', err)
    return true // si erè Firestore, pa bloke user a
  }
}

/**
 * Retounen konbyen itilizasyon ki rete jodi a.
 */
export const getRemainingUsage = async (uid, fullAccess) => {
  if (!uid || fullAccess) return Infinity

  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    const usage = snap.data()?.dailyUsage || { date: '', count: 0 }

    if (usage.date !== today()) return DAILY_LIMIT
    return Math.max(0, DAILY_LIMIT - usage.count)
  } catch {
    return DAILY_LIMIT
  }
}
