import { db } from './firebase'
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore'

const MILESTONES = [
  {
    days: 30,
    type: 'TRIAL_30',
    title: '⏰ Plan de 30 días vencido',
    message: (nombre, email) => `El plan de ${nombre || email} ha vencido (30 días). Puedes renovarlo o suspender su acceso.`
  },
  {
    days: 60,
    type: 'TRIAL_60',
    title: '📅 Usuario lleva 60 días',
    message: (nombre, email) => `${nombre || email} lleva 60 días usando Desglose Pro.`
  },
  {
    days: 90,
    type: 'TRIAL_90',
    title: '📅 Usuario lleva 90 días',
    message: (nombre, email) => `${nombre || email} lleva 90 días usando Desglose Pro.`
  }
]

export const checkTrialExpired = async (uid) => {
  try {
    const userSnap = await getDoc(doc(db, 'users', uid))
    if (!userSnap.exists()) return

    const userData = userSnap.data()
    if (!userData.createdAt || userData.role === 'admin') return

    const createdAt = new Date(userData.createdAt)
    const now = new Date()
    const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24))

    // Verifye chak milestone
    for (const milestone of MILESTONES) {
      if (diffDays !== milestone.days) continue

      // Verifye si notifikasyon sa a deja voye
      const existing = await getDocs(query(
        collection(db, 'notifications'),
        where('type', '==', milestone.type),
        where('userId', '==', uid)
      ))
      if (!existing.empty) continue

      // Kreye notifikasyon
      await addDoc(collection(db, 'notifications'), {
        type: milestone.type,
        title: milestone.title,
        message: milestone.message(userData.nombre, userData.email),
        userId: uid,
        userEmail: userData.email,
        userName: userData.nombre,
        read: false,
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      })

      console.log(`[Trial] Notificación ${milestone.type} creada para ${userData.email}`)
    }

  } catch (error) {
    console.warn('[Trial] Error:', error.message)
  }
}