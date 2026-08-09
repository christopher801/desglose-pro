// src/services/trialService.js

import { db } from './firebase'
import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore'

export const checkTrialExpired = async (uid) => {
  try {
    const userSnap = await getDoc(doc(db, 'users', uid))
    if (!userSnap.exists()) return

    const userData = userSnap.data()
    if (!userData.createdAt || userData.role === 'admin') return

    // Kalkile jou depi enskripsyon
    const createdAt = new Date(userData.createdAt)
    const now = new Date()
    const diffDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24))

    if (diffDays !== 30) return

    // Verifye si notifikasyon sa a deja voye
    const existing = await getDocs(query(
      collection(db, 'notifications'),
      where('type', '==', 'TRIAL_EXPIRED'),
      where('userId', '==', uid)
    ))
    if (!existing.empty) return

    // Kreye notifikasyon pou admin
    await addDoc(collection(db, 'notifications'), {
      type: 'TRIAL_EXPIRED',
      title: '⏰ Plan de 30 días vencido',
      message: `El plan de ${userData.nombre || userData.email} ha vencido (30 días). Puedes renovarlo o suspender su acceso.`,
      userId: uid,
      userEmail: userData.email,
      userName: userData.nombre,
      read: false,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    })

    console.log(`[Trial] Notificación creada para ${userData.email}`)

  } catch (error) {
    console.warn('[Trial] Error:', error.message)
  }
}