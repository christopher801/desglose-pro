import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  limit,
  where,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  getDoc,
  setDoc,
} from "firebase/firestore";

const NOTIFICATIONS_COLLECTION = "notifications";
const USER_NOTIFICATIONS_COLLECTION = "userNotifications";

/* =========================================================
   ADMIN — NUEVO USUARIO
   ========================================================= */

/**
 * Crea una notificación para el administrador cuando
 * un nuevo usuario crea una cuenta.
 */
export const createNewUserNotification = async (
  userId,
  userEmail,
  userName
) => {
  try {
    const notification = {
      type: "NEW_USER",
      title: "Nuevo usuario registrado",
      message: `${userName || userEmail} acaba de crear una cuenta`,
      userId,
      userEmail,
      userName: userName || "",
      read: false,
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    };

    await addDoc(
      collection(db, NOTIFICATIONS_COLLECTION),
      notification
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("createNewUserNotification:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   ADMIN — OBTENER NOTIFICACIONES
   ========================================================= */

/**
 * Obtiene las notificaciones del administrador.
 *
 * Incluye principalmente:
 * NEW_USER
 */
export const getAdminNotifications = async () => {
  try {
    const notificationsQuery = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where("type", "==", "NEW_USER"),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const snapshot = await getDocs(notificationsQuery);

    const notifications = [];

    snapshot.forEach((item) => {
      notifications.push({
        id: item.id,
        ...item.data(),
      });
    });

    return {
      success: true,
      notifications,
    };
  } catch (error) {
    console.error("getAdminNotifications:", error);

    return {
      success: false,
      error: error.message,
      notifications: [],
    };
  }
};

/* =========================================================
   ADMIN — UNREAD COUNT
   ========================================================= */

/**
 * Cantidad de notificaciones NEW_USER no leídas por el admin.
 */
export const getAdminUnreadCount = async () => {
  try {
    const notificationsQuery = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where("type", "==", "NEW_USER"),
      where("read", "==", false)
    );

    const snapshot = await getDocs(notificationsQuery);

    return {
      success: true,
      count: snapshot.size,
    };
  } catch (error) {
    console.error("getAdminUnreadCount:", error);

    return {
      success: false,
      error: error.message,
      count: 0,
    };
  }
};

/* =========================================================
   ADMIN — MARCAR UNA NOTIFICACIÓN COMO LEÍDA
   ========================================================= */

/**
 * Marca una notificación NEW_USER como leída.
 */
export const markAdminNotificationAsRead = async (
  notificationId
) => {
  try {
    if (!notificationId) {
      return {
        success: false,
        error: "notificationId es obligatorio.",
      };
    }

    await updateDoc(
      doc(db, NOTIFICATIONS_COLLECTION, notificationId),
      {
        read: true,
        readAt: new Date().toISOString(),
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("markAdminNotificationAsRead:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   ADMIN — MARCAR TODAS COMO LEÍDAS
   ========================================================= */

/**
 * Marca todas las notificaciones NEW_USER como leídas.
 */
export const markAllAdminNotificationsAsRead = async () => {
  try {
    const notificationsQuery = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where("type", "==", "NEW_USER"),
      where("read", "==", false)
    );

    const snapshot = await getDocs(notificationsQuery);

    if (snapshot.empty) {
      return {
        success: true,
      };
    }

    const batch = writeBatch(db);

    snapshot.forEach((item) => {
      batch.update(item.ref, {
        read: true,
        readAt: new Date().toISOString(),
      });
    });

    await batch.commit();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "markAllAdminNotificationsAsRead:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   ADMIN → TODOS LOS USUARIOS
   ========================================================= */

/**
 * Crea un anuncio que será enviado a todos los usuarios.
 *
 * IMPORTANTE:
 * El campo read NO se guarda aquí porque cada usuario
 * tiene su propio estado en userNotifications.
 */
export const createAnnouncement = async ({
  title,
  message,
  type = "ANNOUNCEMENT",
  createdBy,
}) => {
  try {
    if (!title?.trim()) {
      return {
        success: false,
        error: "El título es obligatorio.",
      };
    }

    if (!message?.trim()) {
      return {
        success: false,
        error: "El mensaje es obligatorio.",
      };
    }

    const notification = {
      type,
      title: title.trim(),
      message: message.trim(),
      target: "ALL_USERS",
      createdBy: createdBy || null,
      createdAt: serverTimestamp(),
      timestamp: Date.now(),
    };

    const notificationRef = await addDoc(
      collection(db, NOTIFICATIONS_COLLECTION),
      notification
    );

    return {
      success: true,
      notificationId: notificationRef.id,
    };
  } catch (error) {
    console.error("createAnnouncement:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   USER — OBTENER ANNOUNCEMENTS
   ========================================================= */

/**
 * Obtiene los anuncios destinados a todos los usuarios.
 */
export const getUserAnnouncements = async () => {
  try {
    const notificationsQuery = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where("target", "==", "ALL_USERS"),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const snapshot = await getDocs(notificationsQuery);

    const notifications = [];

    snapshot.forEach((item) => {
      notifications.push({
        id: item.id,
        ...item.data(),
      });
    });

    return {
      success: true,
      notifications,
    };
  } catch (error) {
    console.error("getUserAnnouncements:", error);

    return {
      success: false,
      error: error.message,
      notifications: [],
    };
  }
};

/* =========================================================
   USER — CREAR ESTADO DE NOTIFICACIÓN
   ========================================================= */

/**
 * Crea el registro individual de estado para un usuario.
 *
 * El ID es determinístico:
 *
 * userId_notificationId
 *
 * Esto evita crear documentos duplicados para el mismo
 * usuario y la misma notificación.
 */
export const createUserNotificationState = async (
  userId,
  notificationId
) => {
  try {
    if (!userId || !notificationId) {
      return {
        success: false,
        error: "userId y notificationId son obligatorios.",
      };
    }

    const stateId = `${userId}_${notificationId}`;

    const stateRef = doc(
      db,
      USER_NOTIFICATIONS_COLLECTION,
      stateId
    );

    const existing = await getDoc(stateRef);

    if (existing.exists()) {
      return {
        success: true,
        alreadyExists: true,
      };
    }

    await setDoc(stateRef, {
      userId,
      notificationId,
      read: false,
      deleted: false,
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "createUserNotificationState:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   USER — OBTENER NOTIFICACIONES CON ESTADO
   ========================================================= */

/**
 * Obtiene todos los anuncios y determina:
 *
 * - read
 * - deleted
 *
 * para el usuario actual.
 *
 * IMPORTANTE:
 * Si deleted === true, la notificación NO se muestra.
 */
export const getUserNotifications = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        error: "userId es obligatorio.",
        notifications: [],
      };
    }

    const announcementsResult =
      await getUserAnnouncements();

    if (!announcementsResult.success) {
      return announcementsResult;
    }

    const statesQuery = query(
      collection(db, USER_NOTIFICATIONS_COLLECTION),
      where("userId", "==", userId)
    );

    const statesSnapshot = await getDocs(statesQuery);

    const notificationStates = {};

    statesSnapshot.forEach((item) => {
      const data = item.data();

      if (data.notificationId) {
        notificationStates[data.notificationId] = {
          read: data.read === true,
          deleted: data.deleted === true,
        };
      }
    });

    const notifications =
      announcementsResult.notifications
        .map((notification) => {
          const state =
            notificationStates[notification.id];

          return {
            ...notification,
            read: state?.read === true,
            deleted: state?.deleted === true,
          };
        })
        .filter(
          (notification) => notification.deleted !== true
        );

    return {
      success: true,
      notifications,
    };
  } catch (error) {
    console.error("getUserNotifications:", error);

    return {
      success: false,
      error: error.message,
      notifications: [],
    };
  }
};

/* =========================================================
   USER — UNREAD COUNT
   ========================================================= */

/**
 * Cuenta cuántos anuncios:
 *
 * - no han sido leídos
 * - no han sido eliminados
 *
 * por un usuario específico.
 */
export const getUserUnreadCount = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        count: 0,
        error: "userId es obligatorio.",
      };
    }

    const announcementsResult =
      await getUserAnnouncements();

    if (!announcementsResult.success) {
      return {
        success: false,
        count: 0,
        error: announcementsResult.error,
      };
    }

    const statesQuery = query(
      collection(db, USER_NOTIFICATIONS_COLLECTION),
      where("userId", "==", userId)
    );

    const statesSnapshot = await getDocs(statesQuery);

    const states = {};

    statesSnapshot.forEach((item) => {
      const data = item.data();

      if (data.notificationId) {
        states[data.notificationId] = {
          read: data.read === true,
          deleted: data.deleted === true,
        };
      }
    });

    const unreadCount =
      announcementsResult.notifications.filter(
        (notification) => {
          const state = states[notification.id];

          // Si el usuario eliminó la notificación,
          // no debe contar como pendiente.
          if (state?.deleted === true) {
            return false;
          }

          // Si no existe estado o no está leída,
          // cuenta como no leída.
          return state?.read !== true;
        }
      ).length;

    return {
      success: true,
      count: unreadCount,
    };
  } catch (error) {
    console.error("getUserUnreadCount:", error);

    return {
      success: false,
      error: error.message,
      count: 0,
    };
  }
};

/* =========================================================
   USER — MARCAR UNA COMO LEÍDA
   ========================================================= */

/**
 * Marca un anuncio como leído solamente para ese usuario.
 */
export const markUserNotificationAsRead = async (
  userId,
  notificationId
) => {
  try {
    if (!userId || !notificationId) {
      return {
        success: false,
        error: "userId y notificationId son obligatorios.",
      };
    }

    const stateId = `${userId}_${notificationId}`;

    const stateRef = doc(
      db,
      USER_NOTIFICATIONS_COLLECTION,
      stateId
    );

    const existing = await getDoc(stateRef);

    if (existing.exists()) {
      const currentData = existing.data();

      // Si ya fue eliminada, no la restauramos.
      if (currentData.deleted === true) {
        return {
          success: true,
          deleted: true,
        };
      }

      await updateDoc(stateRef, {
        read: true,
        readAt: new Date().toISOString(),
      });

      return {
        success: true,
      };
    }

    await setDoc(stateRef, {
      userId,
      notificationId,
      read: true,
      deleted: false,
      createdAt: new Date().toISOString(),
      readAt: new Date().toISOString(),
      timestamp: Date.now(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "markUserNotificationAsRead:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   USER — MARCAR TODAS COMO LEÍDAS
   ========================================================= */

/**
 * Marca todos los anuncios actuales como leídos
 * solamente para el usuario indicado.
 *
 * Las notificaciones eliminadas permanecen eliminadas.
 */
export const markAllUserNotificationsAsRead = async (
  userId
) => {
  try {
    if (!userId) {
      return {
        success: false,
        error: "userId es obligatorio.",
      };
    }

    const announcementsResult =
      await getUserAnnouncements();

    if (!announcementsResult.success) {
      return announcementsResult;
    }

    const statesQuery = query(
      collection(db, USER_NOTIFICATIONS_COLLECTION),
      where("userId", "==", userId)
    );

    const statesSnapshot = await getDocs(statesQuery);

    const existingStates = {};

    statesSnapshot.forEach((item) => {
      const data = item.data();

      if (data.notificationId) {
        existingStates[data.notificationId] = {
          ref: item.ref,
          data,
        };
      }
    });

    const batch = writeBatch(db);
    const now = new Date().toISOString();

    announcementsResult.notifications.forEach(
      (notification) => {
        const existing =
          existingStates[notification.id];

        // Si existe y está eliminado, NO se modifica.
        if (existing?.data?.deleted === true) {
          return;
        }

        if (existing) {
          batch.update(existing.ref, {
            read: true,
            readAt: now,
          });
        } else {
          const stateId = `${userId}_${notification.id}`;

          const newRef = doc(
            db,
            USER_NOTIFICATIONS_COLLECTION,
            stateId
          );

          batch.set(newRef, {
            userId,
            notificationId: notification.id,
            read: true,
            deleted: false,
            createdAt: now,
            readAt: now,
            timestamp: Date.now(),
          });
        }
      }
    );

    await batch.commit();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "markAllUserNotificationsAsRead:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   USER — ELIMINAR UNA NOTIFICACIÓN
   ========================================================= */

/**
 * Elimina una notificación SOLAMENTE para el usuario actual.
 *
 * IMPORTANTE:
 *
 * NO elimina:
 * notifications/{notificationId}
 *
 * En su lugar:
 *
 * userNotifications/{userId}_{notificationId}
 *
 * se marca como:
 *
 * deleted: true
 */
export const deleteUserNotification = async (
  userId,
  notificationId
) => {
  try {
    if (!userId || !notificationId) {
      return {
        success: false,
        error: "userId y notificationId son obligatorios.",
      };
    }

    const stateId = `${userId}_${notificationId}`;

    const stateRef = doc(
      db,
      USER_NOTIFICATIONS_COLLECTION,
      stateId
    );

    const now = new Date().toISOString();

    // Si existe → actualiza.
    // Si no existe → crea.
    //
    // No usamos getDoc() aquí porque un documento
    // que todavía no existe puede provocar un error
    // de permisos con las Firestore Rules.
    await setDoc(
      stateRef,
      {
        userId,
        notificationId,
        read: true,
        deleted: true,
        readAt: now,
        deletedAt: now,
      },
      {
        merge: true,
      }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteUserNotification:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   GENERAL — MARCAR NOTIFICACIÓN COMO LEÍDA
   ========================================================= */

/**
 * Función compatible con el antiguo service.
 *
 * Si es NEW_USER:
 *   → admin notification
 *
 * Si es ANNOUNCEMENT:
 *   → requiere userId
 */
export const markNotificationAsRead = async (
  notificationId,
  userId = null,
  notificationType = null
) => {
  try {
    if (!notificationId) {
      return {
        success: false,
        error: "notificationId es obligatorio.",
      };
    }

    if (
      notificationType === "ANNOUNCEMENT" ||
      userId
    ) {
      if (!userId) {
        return {
          success: false,
          error:
            "userId es obligatorio para marcar un anuncio como leído.",
        };
      }

      return await markUserNotificationAsRead(
        userId,
        notificationId
      );
    }

    return await markAdminNotificationAsRead(
      notificationId
    );
  } catch (error) {
    console.error("markNotificationAsRead:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   GENERAL — OBTENER UNREAD COUNT
   ========================================================= */

/**
 * Compatibilidad con el antiguo getUnreadCount().
 *
 * Si se pasa userId:
 *   → cuenta announcements del usuario.
 *
 * Sin userId:
 *   → cuenta NEW_USER del admin.
 */
export const getUnreadCount = async (
  userId = null
) => {
  if (userId) {
    return await getUserUnreadCount(userId);
  }

  return await getAdminUnreadCount();
};

/* =========================================================
   ADMIN — ELIMINAR UNA NOTIFICACIÓN
   ========================================================= */

/**
 * Elimina físicamente una notificación.
 *
 * Esta función es para ADMIN.
 *
 * NO utilizar para el botón de eliminar del usuario.
 */
export const deleteNotification = async (
  notificationId
) => {
  try {
    if (!notificationId) {
      return {
        success: false,
        error: "notificationId es obligatorio.",
      };
    }

    await deleteDoc(
      doc(db, NOTIFICATIONS_COLLECTION, notificationId)
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("deleteNotification:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

/* =========================================================
   ADMIN — ELIMINAR TODAS LAS NOTIFICACIONES NEW_USER
   ========================================================= */

/**
 * Elimina todas las notificaciones NEW_USER.
 *
 * Esta función es exclusivamente para ADMIN.
 */
export const deleteAllNotifications = async () => {
  try {
    const notificationsQuery = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where("type", "==", "NEW_USER")
    );

    const snapshot = await getDocs(notificationsQuery);

    if (snapshot.empty) {
      return {
        success: true,
      };
    }

    const batch = writeBatch(db);

    snapshot.forEach((item) => {
      batch.delete(item.ref);
    });

    await batch.commit();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "deleteAllNotifications:",
      error
    );

    return {
      success: false,
      error: error.message,
    };
  }
};