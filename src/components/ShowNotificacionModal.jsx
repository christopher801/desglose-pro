import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getUserNotifications,
  markUserNotificationAsRead,
  markAllUserNotificationsAsRead,
  deleteUserNotification,
} from "../services/notificationService";

export default function ShowNotificacionModal({
  show,
  onClose,
  onUnreadChange,
}) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadNotifications = async () => {
    if (!user?.uid) return;

    setLoading(true);

    try {
      const result = await getUserNotifications(user.uid);

      if (result.success) {
        setNotifications(result.notifications || []);
      } else {
        console.error("Error cargando notificaciones:", result.error);
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!show || !user?.uid) return;

    loadNotifications();
  }, [show, user?.uid]);

  const handleNotificationClick = async (notification) => {
    if (!user?.uid || !notification?.id) return;

    try {
      if (!notification.read) {
        const result = await markUserNotificationAsRead(
          user.uid,
          notification.id,
        );

        if (result.success) {
          setNotifications((prev) =>
            prev.map((item) =>
              item.id === notification.id
                ? {
                    ...item,
                    read: true,
                  }
                : item,
            ),
          );

          if (onUnreadChange) {
            onUnreadChange();
          }
        }
      }
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.uid || markingAll) return;

    setMarkingAll(true);

    try {
      const result = await markAllUserNotificationsAsRead(user.uid);

      if (result.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            read: true,
          })),
        );

        if (onUnreadChange) {
          onUnreadChange();
        }
      } else {
        console.error("Error marcando todas como leídas:", result.error);
      }
    } catch (error) {
      console.error("Error marcando todas como leídas:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  // ============================================
  // ELIMINAR NOTIFICACIÓN
  // ============================================

  const handleDelete = async (notificationId) => {
    if (!user?.uid || !notificationId || deletingId) return;

    setDeletingId(notificationId);

    try {
      const result = await deleteUserNotification(
        user.uid,
        notificationId,
      );

      if (result.success) {
        setNotifications((prev) =>
          prev.filter(
            (notification) => notification.id !== notificationId,
          ),
        );

        if (onUnreadChange) {
          onUnreadChange();
        }
      } else {
        console.error("Error eliminando notificación:", result.error);
      }
    } catch (error) {
      console.error("Error eliminando notificación:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    try {
      let date;

      if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (typeof timestamp === "number") {
        date = new Date(timestamp);
      } else {
        date = new Date(timestamp);
      }

      if (Number.isNaN(date.getTime())) {
        return "";
      }

      return date.toLocaleString("es-DO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getNotificationIcon = (notification) => {
    switch (notification?.type) {
      case "ANNOUNCEMENT":
        return "bi-megaphone";

      case "UPDATE":
        return "bi-arrow-up-circle";

      case "WARNING":
        return "bi-exclamation-triangle";

      case "SUCCESS":
        return "bi-check-circle";

      default:
        return "bi-bell";
    }
  };

  const getNotificationLabel = (notification) => {
    switch (notification?.type) {
      case "ANNOUNCEMENT":
        return "Anuncio";

      case "UPDATE":
        return "Actualización";

      case "WARNING":
        return "Aviso";

      case "SUCCESS":
        return "Completado";

      default:
        return "Notificación";
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  if (!show) {
    return null;
  }

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div
        className="notification-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="notification-modal-header">
          <div className="notification-modal-title-wrapper">
            <div className="notification-modal-icon">
              <i className="bi bi-bell"></i>
            </div>

            <div>
              <h5 className="notification-modal-title">
                Notificaciones
              </h5>

              <span className="notification-modal-subtitle">
                {unreadCount > 0
                  ? `${unreadCount} ${
                      unreadCount === 1
                        ? "notificación pendiente"
                        : "notificaciones pendientes"
                    }`
                  : "Todo está al día"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="notification-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* CONTENT */}
        <div className="notification-modal-body">
          {loading ? (
            <div className="notification-empty-state">
              <div className="notification-loading">
                <div
                  className="spinner-border"
                  role="status"
                  aria-hidden="true"
                ></div>
              </div>

              <p>Cargando notificaciones...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty-state">
              <div className="notification-empty-icon">
                <i className="bi bi-bell-slash"></i>
              </div>

              <h6>No tienes notificaciones</h6>

              <p>
                Aquí aparecerán los avisos y novedades de Desglose Pro.
              </p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => {
                const isDeleting = deletingId === notification.id;

                return (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      !notification.read
                        ? "notification-item-unread"
                        : ""
                    }`}
                  >
                    {/* ICON */}
                    <div
                      className={`notification-item-icon ${
                        notification.read
                          ? "notification-item-icon-read"
                          : "notification-item-icon-unread"
                      }`}
                    >
                      <i
                        className={`bi ${getNotificationIcon(
                          notification,
                        )}`}
                      ></i>
                    </div>

                    {/* CONTENT */}
                    <div
                      className="notification-item-content"
                      onClick={() =>
                        handleNotificationClick(notification)
                      }
                    >
                      <div className="notification-item-top">
                        <span className="notification-item-type">
                          {getNotificationLabel(notification)}
                        </span>

                        {!notification.read && (
                          <span className="notification-unread-dot"></span>
                        )}
                      </div>

                      <h6 className="notification-item-title">
                        {notification.title || "Nueva notificación"}
                      </h6>

                      <p className="notification-item-message">
                        {notification.message || ""}
                      </p>

                      <span className="notification-item-date">
                        <i className="bi bi-clock me-1"></i>
                        {formatDate(
                          notification.timestamp ||
                            notification.createdAt,
                        )}
                      </span>
                    </div>

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      className="notification-delete-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      disabled={isDeleting}
                      aria-label="Eliminar notificación"
                      title="Eliminar notificación"
                    >
                      {isDeleting ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <i className="bi bi-trash3"></i>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {notifications.length > 0 && (
          <div className="notification-modal-footer">
            <button
              type="button"
              className="notification-mark-all"
              onClick={handleMarkAllAsRead}
              disabled={markingAll || unreadCount === 0}
            >
              {markingAll ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Procesando...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-all me-2"></i>
                  Marcar todas como leídas
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        /* =========================================
           NOTIFICATION MODAL
        ========================================= */

        .notification-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .notification-modal {
          width: 100%;
          max-width: 520px;
          max-height: min(680px, calc(100vh - 40px));
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.2);
          animation: notificationModalIn 0.2s ease-out;
        }

        @keyframes notificationModalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* HEADER */

        .notification-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .notification-modal-title-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .notification-modal-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 18px;
        }

        .notification-modal-title {
          margin: 0;
          color: #0f172a;
          font-size: 16px;
          font-weight: 700;
        }

        .notification-modal-subtitle {
          display: block;
          margin-top: 2px;
          color: #64748b;
          font-size: 12px;
        }

        .notification-modal-close {
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: #64748b;
          font-size: 15px;
          cursor: pointer;
          transition:
            background 0.15s ease,
            color 0.15s ease;
        }

        .notification-modal-close:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        /* BODY */

        .notification-modal-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          width: 100%;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          border: 0;
          border-bottom: 1px solid #f1f5f9;
          background: #ffffff;
          text-align: left;
          transition: background 0.15s ease;
        }

        .notification-item:hover {
          background: #f8fafc;
        }

        .notification-item-unread {
          background: #f8fbff;
        }

        .notification-item-unread:hover {
          background: #f1f7ff;
        }

        .notification-item-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          font-size: 16px;
        }

        .notification-item-icon-unread {
          background: #dbeafe;
          color: #2563eb;
        }

        .notification-item-icon-read {
          background: #f1f5f9;
          color: #64748b;
        }

        .notification-item-content {
          flex: 1;
          min-width: 0;
          cursor: pointer;
        }

        .notification-item-top {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 3px;
        }

        .notification-item-type {
          color: #64748b;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .notification-unread-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #2563eb;
        }

        .notification-item-title {
          margin: 0 0 4px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.35;
        }

        .notification-item-message {
          margin: 0 0 7px;
          color: #475569;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .notification-item-date {
          display: inline-flex;
          align-items: center;
          color: #94a3b8;
          font-size: 11px;
        }

        /* DELETE */

        .notification-delete-btn {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          padding: 0;
          border: 1px solid #fee2e2;
          border-radius: 9px;
          background: #ffffff;
          color: #ef4444;
          font-size: 14px;
          cursor: pointer;
          transition:
            background 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease,
            transform 0.15s ease;
        }

        .notification-delete-btn:hover:not(:disabled) {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
          transform: translateY(-1px);
        }

        .notification-delete-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .notification-delete-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* EMPTY */

        .notification-empty-state {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          text-align: center;
        }

        .notification-empty-icon {
          width: 58px;
          height: 58px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: #f1f5f9;
          color: #94a3b8;
          font-size: 24px;
        }

        .notification-empty-state h6 {
          margin: 0 0 6px;
          color: #0f172a;
          font-size: 14px;
          font-weight: 700;
        }

        .notification-empty-state p {
          max-width: 300px;
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .notification-loading {
          margin-bottom: 14px;
          color: #2563eb;
        }

        /* FOOTER */

        .notification-modal-footer {
          padding: 12px 20px;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .notification-mark-all {
          width: 100%;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dbe3ee;
          border-radius: 10px;
          background: #ffffff;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background 0.15s ease,
            border-color 0.15s ease,
            color 0.15s ease;
        }

        .notification-mark-all:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e3a8a;
        }

        .notification-mark-all:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* MOBILE */

        @media (max-width: 576px) {
          .notification-modal-overlay {
            align-items: flex-end;
            padding: 0;
          }

          .notification-modal {
            width: 100%;
            max-width: none;
            max-height: 82vh;
            border-radius: 18px 18px 0 0;
            border-bottom: 0;
            animation: notificationModalMobileIn 0.2s ease-out;
          }

          @keyframes notificationModalMobileIn {
            from {
              opacity: 0;
              transform: translateY(100%);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .notification-modal-header {
            padding: 16px;
          }

          .notification-item {
            padding: 15px 16px;
          }

          .notification-item-icon {
            width: 38px;
            height: 38px;
          }

          .notification-delete-btn {
            width: 32px;
            height: 32px;
          }

          .notification-modal-footer {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
}