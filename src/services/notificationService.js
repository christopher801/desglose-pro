// src/services/notificationService.js
import { db } from './firebase'
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, limit, where, deleteDoc } from 'firebase/firestore'

// Koleksyon notifikasyon yo
const NOTIFICATIONS_COLLECTION = 'notifications'

// Kreye yon notifikasyon lè yon nouvo user enskri
export const createNewUserNotification = async (userId, userEmail, userName) => {
  try {
    const notification = {
      type: 'NEW_USER',
      title: '👤 Nouveau utilisateur',
      message: `${userName || userEmail} vient de créer un compte`,
      userId: userId,
      userEmail: userEmail,
      userName: userName,
      read: false,
      createdAt: new Date().toISOString(),
      timestamp: Date.now()
    }
    
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notification)
    return { success: true }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error: error.message }
  }
}

// Jwenn tout notifikasyon yo
export const getNotifications = async () => {
  try {
    const notificationsQuery = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(50)
    )
    const snapshot = await getDocs(notificationsQuery)
    const notifications = []
    snapshot.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() })
    })
    return { success: true, notifications }
  } catch (error) {
    console.error('Error getting notifications:', error)
    return { success: false, error: error.message, notifications: [] }
  }
}

// Make yon notifikasyon li (read)
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notifRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId)
    await updateDoc(notifRef, { read: true })
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error: error.message }
  }
}

// Make tout notifikasyon li
export const markAllNotificationsAsRead = async () => {
  try {
    const snapshot = await getDocs(collection(db, NOTIFICATIONS_COLLECTION))
    const promises = []
    snapshot.forEach(doc => {
      if (!doc.data().read) {
        promises.push(updateDoc(doc.ref, { read: true }))
      }
    })
    await Promise.all(promises)
    return { success: true }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return { success: false, error: error.message }
  }
}

// Efase yon notifikasyon
export const deleteNotification = async (notificationId) => {
  try {
    await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return { success: false, error: error.message }
  }
}

// Efase tout notifikasyon
export const deleteAllNotifications = async () => {
  try {
    const snapshot = await getDocs(collection(db, NOTIFICATIONS_COLLECTION))
    const promises = []
    snapshot.forEach(doc => {
      promises.push(deleteDoc(doc.ref))
    })
    await Promise.all(promises)
    return { success: true }
  } catch (error) {
    console.error('Error deleting all notifications:', error)
    return { success: false, error: error.message }
  }
}

// Konte notifikasyon ki poko li
export const getUnreadCount = async () => {
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('read', '==', false)
    )
    const snapshot = await getDocs(q)
    return { success: true, count: snapshot.size }
  } catch (error) {
    console.error('Error getting unread count:', error)
    return { success: false, error: error.message, count: 0 }
  }
}