import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

export default function Notifications({ onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================
  // LOAD NOTIFICATIONS
  // =========================================
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not logged in. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/notifications`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      console.log(
        "NOTIFICATIONS RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load notifications"
        );
      }

      const data =
        result.notifications ||
        result.data?.notifications ||
        result.data ||
        [];

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "NOTIFICATIONS ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // MARK ONE AS READ
  // =========================================
  const markAsRead = async (id) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to mark notification as read"
        );
      }

      await loadNotifications();
    } catch (err) {
      console.error(
        "MARK READ ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to mark notification as read"
      );
    }
  };

  // =========================================
  // MARK ALL AS READ
  // =========================================
  const markAllAsRead = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to mark notifications as read"
        );
      }

      await loadNotifications();
    } catch (err) {
      console.error(
        "MARK ALL READ ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to mark notifications as read"
      );
    }
  };

  // =========================================
  // DELETE NOTIFICATION
  // =========================================
  const deleteNotification = async (id) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/notifications/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete notification"
        );
      }

      await loadNotifications();
    } catch (err) {
      console.error(
        "DELETE NOTIFICATION ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to delete notification"
      );
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // =========================================
  // COUNTS
  // =========================================
  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.is_read
  ).length;

  return (
    <main className="dashboard-content">

      {/* =========================================
          PAGE HEADER
      ========================================= */}
      <div className="glass-header">
        <div>
          <h2>Notifications</h2>

          <p>
            View and manage SAC Customs system
            notifications and alerts.
          </p>
        </div>

        <div className="status-badge">
          <span></span>
          System Online
        </div>
      </div>

      {/* =========================================
          NOTIFICATION ANALYTICS
      ========================================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "18px",
        }}
      >

        {/* TOTAL */}
        <div
          className="analytics-card"
          style={{
            marginBottom: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <small
              style={{
                color:
                  "rgba(255,255,255,0.5)",
                fontSize: "11px",
              }}
            >
              Total Notifications
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              <b style={{ fontSize: "22px" }}>
                {notifications.length}
              </b>

              <span
                style={{
                  background:
                    "rgba(168,85,247,0.15)",
                  color: "#a855f7",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "10px",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background:
                "rgba(168,85,247,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
            }}
          >
            🔔
          </div>
        </div>

        {/* UNREAD */}
        <div
          className="analytics-card"
          style={{
            marginBottom: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <small
              style={{
                color:
                  "rgba(255,255,255,0.5)",
                fontSize: "11px",
              }}
            >
              Unread
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              <b style={{ fontSize: "22px" }}>
                {unreadCount}
              </b>

              <span
                style={{
                  background:
                    "rgba(34,211,238,0.15)",
                  color: "#22d3ee",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "10px",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background:
                "rgba(34,211,238,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
            }}
          >
            🔵
          </div>
        </div>

        {/* READ */}
        <div
          className="analytics-card"
          style={{
            marginBottom: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <small
              style={{
                color:
                  "rgba(255,255,255,0.5)",
                fontSize: "11px",
              }}
            >
              Read
            </small>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "4px",
              }}
            >
              <b style={{ fontSize: "22px" }}>
                {readCount}
              </b>

              <span
                style={{
                  background:
                    "rgba(74,222,128,0.15)",
                  color: "#4ade80",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "10px",
                }}
              >
                ●
              </span>
            </div>
          </div>

          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background:
                "rgba(74,222,128,0.10)",
              display: "grid",
              placeItems: "center",
              fontSize: "20px",
            }}
          >
            ✅
          </div>
        </div>
      </div>

      {/* =========================================
          MAIN NOTIFICATIONS CARD
      ========================================= */}
      <div className="master-card">

        {/* HEADER */}
        <div className="master-head">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3>System Notifications</h3>

              <p
                style={{
                  fontSize: "11px",
                  color:
                    "rgba(255,255,255,0.5)",
                }}
              >
                Review alerts, updates and
                system messages.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                style={{
                  background:
                    unreadCount === 0
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(74,222,128,0.10)",
                  border:
                    unreadCount === 0
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(74,222,128,0.20)",
                  color:
                    unreadCount === 0
                      ? "rgba(255,255,255,0.30)"
                      : "#4ade80",
                  padding: "9px 14px",
                  borderRadius: "10px",
                  cursor:
                    unreadCount === 0
                      ? "not-allowed"
                      : "pointer",
                  fontSize: "11px",
                }}
              >
                ✓ Mark All as Read
              </button>

              <button
                type="button"
                onClick={loadNotifications}
                style={{
                  background:
                    "rgba(255,255,255,0.06)",
                  border:
                    "1px solid rgba(255,255,255,0.10)",
                  color: "white",
                  padding: "9px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                ↻ Refresh
              </button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    background:
                      "rgba(255,255,255,0.06)",
                    border:
                      "1px solid rgba(255,255,255,0.10)",
                    color: "white",
                    padding: "9px 14px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  ← Back
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px 14px",
              borderRadius: "10px",
              background:
                "rgba(239,68,68,0.10)",
              border:
                "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
              fontSize: "12px",
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div
            style={{
              marginTop: "16px",
              padding: "30px",
              textAlign: "center",
              color:
                "rgba(255,255,255,0.55)",
              background:
                "rgba(255,255,255,0.03)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                marginBottom: "8px",
              }}
            >
              🔔
            </div>

            Loading notifications...
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div
              style={{
                marginTop: "16px",
                padding: "40px",
                textAlign: "center",
                color:
                  "rgba(255,255,255,0.55)",
                background:
                  "rgba(255,255,255,0.03)",
                borderRadius: "12px",
                border:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "10px",
                }}
              >
                🔔
              </div>

              <h3
                style={{
                  margin: "0 0 6px",
                  color: "white",
                  fontSize: "15px",
                }}
              >
                No Notifications
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                }}
              >
                You currently have no notifications.
              </p>
            </div>
          )}

        {/* =========================================
            NOTIFICATION LIST
        ========================================= */}
        {!loading &&
          notifications.length > 0 && (
            <div
              style={{
                display: "grid",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              {notifications.map(
                (notification) => {
                  const unread =
                    !notification.is_read;

                  return (
                    <div
                      key={notification.id}
                      style={{
                        padding: "16px",
                        borderRadius: "14px",
                        background: unread
                          ? "rgba(34,211,238,0.055)"
                          : "rgba(255,255,255,0.035)",
                        border: unread
                          ? "1px solid rgba(34,211,238,0.18)"
                          : "1px solid rgba(255,255,255,0.07)",
                        boxShadow: unread
                          ? "0 0 20px rgba(34,211,238,0.04)"
                          : "none",
                      }}
                    >

                      {/* NOTIFICATION TOP */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems:
                              "flex-start",
                            flex: 1,
                          }}
                        >

                          {/* ICON */}
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              minWidth: "38px",
                              borderRadius: "11px",
                              display: "grid",
                              placeItems: "center",
                              background:
                                unread
                                  ? "rgba(34,211,238,0.12)"
                                  : "rgba(255,255,255,0.06)",
                              fontSize: "17px",
                            }}
                          >
                            🔔
                          </div>

                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems:
                                  "center",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <h3
                                style={{
                                  margin: 0,
                                  fontSize: "14px",
                                  color: "white",
                                }}
                              >
                                {notification.title ||
                                  "Notification"}
                              </h3>

                              {unread && (
                                <span
                                  style={{
                                    fontSize: "9px",
                                    fontWeight: "700",
                                    padding:
                                      "4px 7px",
                                    borderRadius:
                                      "8px",
                                    background:
                                      "rgba(34,211,238,0.14)",
                                    color:
                                      "#22d3ee",
                                  }}
                                >
                                  UNREAD
                                </span>
                              )}
                            </div>

                            <p
                              style={{
                                margin:
                                  "7px 0 0",
                                fontSize: "12px",
                                lineHeight: "1.5",
                                color:
                                  "rgba(255,255,255,0.65)",
                              }}
                            >
                              {notification.message ||
                                "No message available."}
                            </p>
                          </div>
                        </div>

                        {/* TYPE */}
                        <span
                          style={{
                            padding:
                              "4px 9px",
                            borderRadius: "9px",
                            background:
                              "rgba(168,85,247,0.11)",
                            color: "#c084fc",
                            fontSize: "9px",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {notification.notification_type ||
                            "INFO"}
                        </span>
                      </div>

                      {/* DETAILS + ACTIONS */}
                      <div
                        style={{
                          marginTop: "13px",
                          paddingTop: "12px",
                          borderTop:
                            "1px solid rgba(255,255,255,0.06)",
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            color:
                              "rgba(255,255,255,0.38)",
                          }}
                        >
                          {notification.created_at ||
                            ""}
                        </span>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          {unread && (
                            <button
                              type="button"
                              onClick={() =>
                                markAsRead(
                                  notification.id
                                )
                              }
                              style={{
                                background:
                                  "rgba(74,222,128,0.10)",
                                border:
                                  "1px solid rgba(74,222,128,0.18)",
                                color:
                                  "#4ade80",
                                padding:
                                  "7px 11px",
                                borderRadius:
                                  "8px",
                                cursor:
                                  "pointer",
                                fontSize:
                                  "10px",
                              }}
                            >
                              ✓ Mark as Read
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              deleteNotification(
                                notification.id
                              )
                            }
                            style={{
                              background:
                                "rgba(239,68,68,0.09)",
                              border:
                                "1px solid rgba(239,68,68,0.18)",
                              color:
                                "#f87171",
                              padding:
                                "7px 11px",
                              borderRadius:
                                "8px",
                              cursor:
                                "pointer",
                              fontSize:
                                "10px",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
      </div>
    </main>
  );
}